"use client"
import React from "react"
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, Img} from "remotion"
import {Video} from "@remotion/media"
import {Audio} from "@remotion/media"
import type {Track, LabelOverlay} from "@/lib/store/types"

type CompositionProps = {
  tracks: Track[]
  labels: LabelOverlay[]
}

export const EditorComposition: React.FC<CompositionProps> = ({tracks, labels}) => {
  const frame = useCurrentFrame()
  const {width, height} = useVideoConfig()

  return (
    <AbsoluteFill style={{backgroundColor: "#000"}}>
      {/* Render video/image tracks */}
      {tracks
        .filter((t) => t.type === "video" && !t.muted)
        .map((track) =>
          track.clips.map((clip) => (
            <Sequence key={clip.id} from={clip.from} durationInFrames={clip.durationInFrames} premountFor={30}>
              {clip.type === "video" ? (
                <Video
                  src={clip.src}
                  style={{width: "100%", height: "100%", objectFit: "contain"}}
                  trimBefore={clip.trimStart || 0}
                />
              ) : clip.type === "image" ? (
                <AbsoluteFill>
                  <Img src={clip.src} style={{width: "100%", height: "100%", objectFit: "contain"}} />
                </AbsoluteFill>
              ) : null}
            </Sequence>
          ))
        )}

      {/* Render audio tracks */}
      {tracks
        .filter((t) => t.type === "audio" && !t.muted)
        .map((track) =>
          track.clips.map((clip) => (
            <Sequence key={clip.id} from={clip.from} durationInFrames={clip.durationInFrames} premountFor={30}>
              <Audio src={clip.src} />
            </Sequence>
          ))
        )}

      {/* Render label overlays */}
      {labels.map((label) => (
        <Sequence key={label.id} from={label.from} durationInFrames={label.durationInFrames} premountFor={30}>
          <AbsoluteFill>
            <div
              style={{
                position: "absolute",
                left: label.x,
                top: label.y,
                backgroundColor: label.color,
                color: "white",
                paddingLeft: label.paddingX,
                paddingRight: label.paddingX,
                paddingTop: label.paddingY,
                paddingBottom: label.paddingY,
                borderRadius: label.borderRadius,
                fontSize: 48,
                fontWeight: "bold",
                border: "3px solid black",
                boxShadow: "4px 4px 0px black",
              }}>
              {label.text}
            </div>
          </AbsoluteFill>
        </Sequence>
      ))}

      {/* Empty state */}
      {tracks.every((t) => t.clips.length === 0) && labels.length === 0 && (
        <AbsoluteFill style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
          <div style={{color: "#666", fontSize: 24, textAlign: "center"}}>
            <p>Import media and add it to the timeline</p>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  )
}
