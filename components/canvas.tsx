import React, {useState} from "react"
import Button from "./button"
import {HugeiconsIcon} from "@hugeicons/react"
import {PauseIcon, PlayIcon} from "@hugeicons/core-free-icons"

const length = "01:05"
const currentTime = "00:13"

export default function Canvas() {
  return (
    <div className="rounded-3xl w-full h-full shadow-hard bg-[#ddd] border-2 border-black p-4 relative">
      <ControlsLeft />
      <div className="absolute inset-x-60 inset-y-20 bg-black" />
    </div>
  )
}

function ControlsLeft() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="absolute bottom-5 left-5 flex gap-4 items-center justify-center">
      <Button className="bg-[#2a9] size-10" buttonProps={{onClick: () => setIsPlaying(!isPlaying)}}>
        <HugeiconsIcon icon={isPlaying ? PlayIcon : PauseIcon} size={20} color="white" strokeWidth={2} />
      </Button>
      <span className="text-sm translate-y-1">
        {currentTime} / {length}
      </span>
    </div>
  )
}
