"use client"
import React, {createContext, useContext, useState, useCallback, useRef} from "react"
import {PlayerRef} from "@remotion/player"

export type MediaItem = {
  id: string
  name: string
  type: "video" | "image" | "audio"
  src: string
  durationInSeconds?: number
}

export type Clip = {
  id: string
  mediaId: string
  src: string
  type: "video" | "image" | "audio"
  from: number // start frame on timeline
  durationInFrames: number
  trimStart?: number // trim from beginning in frames
  name: string
}

export type Track = {
  id: string
  type: "video" | "audio"
  clips: Clip[]
}

export type LabelOverlay = {
  id: string
  text: string
  color: string
  from: number
  durationInFrames: number
  x: number
  y: number
  paddingX: number
  paddingY: number
  borderRadius: number
}

type EditorState = {
  fps: number
  width: number
  height: number
  durationInFrames: number
  tracks: Track[]
  mediaItems: MediaItem[]
  labels: LabelOverlay[]
  playerRef: React.RefObject<PlayerRef | null>
  isPlaying: boolean
  currentFrame: number
}

type EditorActions = {
  addMediaItem: (item: MediaItem) => void
  removeMediaItem: (id: string) => void
  addClipToTrack: (trackId: string, clip: Clip) => void
  removeClip: (trackId: string, clipId: string) => void
  addTrack: (type: "video" | "audio") => Track
  removeTrack: (id: string) => void
  setDurationInFrames: (frames: number) => void
  togglePlayback: () => void
  seekTo: (frame: number) => void
  setCurrentFrame: (frame: number) => void
  setIsPlaying: (playing: boolean) => void
  addLabel: (label: LabelOverlay) => void
  removeLabel: (id: string) => void
  addMediaToTimeline: (mediaItem: MediaItem) => void
}

const EditorContext = createContext<(EditorState & EditorActions) | null>(null)

let idCounter = 0
export function generateId() {
  return `id_${Date.now()}_${idCounter++}`
}

export function EditorProvider({children}: {children: React.ReactNode}) {
  const playerRef = useRef<PlayerRef | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [durationInFrames, setDurationInFrames] = useState(30 * 30) // 30 seconds default
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [labels, setLabels] = useState<LabelOverlay[]>([])
  const [tracks, setTracks] = useState<Track[]>([
    {id: "track-video-0", type: "video", clips: []},
    {id: "track-video-1", type: "video", clips: []},
    {id: "track-audio-0", type: "audio", clips: []},
  ])

  const fps = 30
  const width = 1920
  const height = 1080

  const addMediaItem = useCallback((item: MediaItem) => {
    setMediaItems((prev) => [...prev, item])
  }, [])

  const removeMediaItem = useCallback((id: string) => {
    setMediaItems((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const addClipToTrack = useCallback((trackId: string, clip: Clip) => {
    setTracks((prev) =>
      prev.map((track) => (track.id === trackId ? {...track, clips: [...track.clips, clip]} : track))
    )
  }, [])

  const removeClip = useCallback((trackId: string, clipId: string) => {
    setTracks((prev) =>
      prev.map((track) =>
        track.id === trackId ? {...track, clips: track.clips.filter((c) => c.id !== clipId)} : track
      )
    )
  }, [])

  const addTrack = useCallback((type: "video" | "audio") => {
    const track: Track = {id: generateId(), type, clips: []}
    setTracks((prev) => [...prev, track])
    return track
  }, [])

  const removeTrack = useCallback((id: string) => {
    setTracks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const togglePlayback = useCallback(() => {
    const player = playerRef.current
    if (!player) return
    if (isPlaying) {
      player.pause()
    } else {
      player.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const seekTo = useCallback((frame: number) => {
    const player = playerRef.current
    if (!player) return
    player.seekTo(frame)
    setCurrentFrame(frame)
  }, [])

  const addLabel = useCallback((label: LabelOverlay) => {
    setLabels((prev) => [...prev, label])
  }, [])

  const removeLabel = useCallback((id: string) => {
    setLabels((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const addMediaToTimeline = useCallback((mediaItem: MediaItem) => {
    const defaultDuration = mediaItem.type === "image" ? 5 * fps : (mediaItem.durationInSeconds || 10) * fps

    // Find matching track type
    const trackType = mediaItem.type === "audio" ? "audio" : "video"

    setTracks((prev) => {
      const targetTrack = prev.find((t) => t.type === trackType)
      if (!targetTrack) return prev

      // Calculate the start frame (after last clip on this track)
      const lastClipEnd = targetTrack.clips.reduce((max, clip) => Math.max(max, clip.from + clip.durationInFrames), 0)

      const clip: Clip = {
        id: generateId(),
        mediaId: mediaItem.id,
        src: mediaItem.src,
        type: mediaItem.type,
        from: lastClipEnd,
        durationInFrames: Math.round(defaultDuration),
        name: mediaItem.name,
      }

      return prev.map((track) =>
        track.id === targetTrack.id ? {...track, clips: [...track.clips, clip]} : track
      )
    })

    // Extend duration if needed
    setDurationInFrames((prev) => {
      const newEnd = tracks.reduce((max, track) => {
        const trackEnd = track.clips.reduce((m, c) => Math.max(m, c.from + c.durationInFrames), 0)
        return Math.max(max, trackEnd)
      }, 0)
      return Math.max(prev, newEnd + 5 * fps)
    })
  }, [tracks, fps])

  return (
    <EditorContext.Provider
      value={{
        fps,
        width,
        height,
        durationInFrames,
        tracks,
        mediaItems,
        labels,
        playerRef,
        isPlaying,
        currentFrame,
        addMediaItem,
        removeMediaItem,
        addClipToTrack,
        removeClip,
        addTrack,
        removeTrack,
        setDurationInFrames,
        togglePlayback,
        seekTo,
        setCurrentFrame,
        setIsPlaying,
        addLabel,
        removeLabel,
        addMediaToTimeline,
      }}>
      {children}
    </EditorContext.Provider>
  )
}

export function useEditor() {
  const ctx = useContext(EditorContext)
  if (!ctx) throw new Error("useEditor must be used within EditorProvider")
  return ctx
}
