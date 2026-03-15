"use client"
import {useEffect} from "react"
import {Player, CallbackListener} from "@remotion/player"
import Button from "./button"
import {HugeiconsIcon} from "@hugeicons/react"
import {PauseIcon, PlayIcon} from "@hugeicons/core-free-icons"
import {useEditorStore} from "@/lib/store"
import {EditorComposition} from "./remotion-composition"

export default function Canvas() {
  const fps = useEditorStore((s) => s.fps)
  const width = useEditorStore((s) => s.width)
  const height = useEditorStore((s) => s.height)
  const durationInFrames = useEditorStore((s) => s.durationInFrames)
  const tracks = useEditorStore((s) => s.tracks)
  const labels = useEditorStore((s) => s.labels)
  const playerRef = useEditorStore((s) => s.playerRef)
  const isPlaying = useEditorStore((s) => s.isPlaying)
  const currentFrame = useEditorStore((s) => s.currentFrame)
  const togglePlayback = useEditorStore((s) => s.togglePlayback)
  const setCurrentFrame = useEditorStore((s) => s.setCurrentFrame)
  const setIsPlaying = useEditorStore((s) => s.setIsPlaying)

  const formatTime = (frame: number) => {
    const totalSeconds = Math.floor(frame / fps)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }

  // Sync frame position from Player via event listener
  useEffect(() => {
    const player = playerRef.current
    if (!player) return

    const onFrameUpdate: CallbackListener<"frameupdate"> = ({detail}) => {
      setCurrentFrame(detail.frame)
    }
    const onPlay: CallbackListener<"play"> = () => setIsPlaying(true)
    const onPause: CallbackListener<"pause"> = () => setIsPlaying(false)

    player.addEventListener("frameupdate", onFrameUpdate)
    player.addEventListener("play", onPlay)
    player.addEventListener("pause", onPause)

    return () => {
      player.removeEventListener("frameupdate", onFrameUpdate)
      player.removeEventListener("play", onPlay)
      player.removeEventListener("pause", onPause)
    }
  }, [playerRef, setCurrentFrame, setIsPlaying])

  return (
    <div className="rounded-3xl w-full h-full shadow-hard bg-[#ddd] border-2 border-black p-4 relative flex flex-col">
      <div className="flex-1 relative overflow-hidden rounded-2xl bg-black">
        <Player
          ref={playerRef}
          component={EditorComposition}
          inputProps={{tracks, labels}}
          durationInFrames={Math.max(1, durationInFrames)}
          compositionWidth={width}
          compositionHeight={height}
          fps={fps}
          style={{width: "100%", height: "100%"}}
          acknowledgeRemotionLicense
        />
      </div>
      <ControlsLeft
        isPlaying={isPlaying}
        togglePlayback={togglePlayback}
        currentTime={formatTime(currentFrame)}
        length={formatTime(durationInFrames)}
      />
    </div>
  )
}

function ControlsLeft({
  isPlaying,
  togglePlayback,
  currentTime,
  length,
}: {
  isPlaying: boolean
  togglePlayback: () => void
  currentTime: string
  length: string
}) {
  return (
    <div className="flex gap-4 items-center justify-start mt-3">
      <Button className="bg-[#2a9] size-10" buttonProps={{onClick: togglePlayback}}>
        <HugeiconsIcon icon={isPlaying ? PauseIcon : PlayIcon} size={20} color="white" strokeWidth={2} />
      </Button>
      <span className="text-sm translate-y-1">
        {currentTime} / {length}
      </span>
    </div>
  )
}
