import {AudioWave01Icon, HelpSquareIcon, VideotapeIcon} from "@hugeicons/core-free-icons"
import {HugeiconsIcon} from "@hugeicons/react"
import React, {useEffect, useRef, useState} from "react"

export default function Timeline() {
  const tracks = [{type: "video"}, {type: "video"}, {type: "audio"}]
  return (
    <div className="rounded-3xl w-full h-full shadow-hard bg-[#ddd] border-2 border-black p-4 mr-10 flex flex-col gap-4 relative">
      <Slider />
      <TrackTime />
      {tracks.map((track, index) => (
        <Track key={index} type={track.type} />
      ))}
    </div>
  )
}

function Track({type}: {type: string}) {
  return (
    <div className="flex w-full gap-3 items-center justify-center">
      {getTrackIcon(type)}
      <div className="h-16 bg-white border-2 border-black shadow-hard w-full rounded-xl flex items-center justify-center">

      </div>
    </div>
  )
}

function TrackTime() {
  return (
    <div className="h-10 ml-9 overflow-hidden">
      <div className="flex gap-4 px-2 h-full">
        {["00:00", "00:05", "00:10", "00:15", "00:20", "00:25", "00:30", "00:35", "00:40", "00:45", "00:50", "00:55", "01:00", "01:05", "01:10", "01:15", "01:20", "01:25", "01:30", "01:35"].map((timestamp, index) => (
          <span key={index} className="text-sm flex items-center justify-center gap-2" style={{marginLeft: index === 0 ? 0 : 20}}>
            <div className="bg-black h-full w-0.5" /><span className="text-xs">{timestamp}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function getTrackIcon(type: string) {
  switch (type) {
    case "video":
      return <HugeiconsIcon icon={VideotapeIcon} size={25} color="black" strokeWidth={1.5} />
    case "audio":
      return <HugeiconsIcon icon={AudioWave01Icon} size={25} color="black" strokeWidth={1.5} />
    default:
      return <HugeiconsIcon icon={HelpSquareIcon} size={25} color="black" strokeWidth={1.5} />
  }
}

function Slider() {
  const [position, setPosition] = useState(35)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  function updatePosition(e: React.MouseEvent | MouseEvent) {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(35, Math.min(e.clientX - rect.left, rect.width))
    setPosition((x / rect.width) * 100)
  }

  useEffect(() => {
    if (!isDragging) return
    const onMove = (e: MouseEvent) => updatePosition(e)
    const onUp = () => setIsDragging(false)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
  }, [isDragging])

  return (
    <div
      ref={containerRef}
      className="absolute left-4 right-4 -top-1 bottom-0 z-10"
      onMouseDown={(e) => {
        setIsDragging(true)
        updatePosition(e)
      }}>
      <div className={`absolute top-4 bottom-4 cursor-pointer`} style={{left: `${position}%`}}>
        <div className="w-4 h-10 border-black border-2 bg-[#2a9] rounded-md shadow-hard -translate-x-1/2" />
        <div className="w-1 bg-black h-[90%] mx-auto rounded-full -translate-x-1.5" />
      </div>
    </div>
  )
}
