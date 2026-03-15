"use client"
import {Add01Icon, ArrowRight01Icon} from "@hugeicons/core-free-icons"
import {HugeiconsIcon} from "@hugeicons/react"
import Button from "./button"
import {useEditorStore, generateId} from "@/lib/store"
import type {MediaItem} from "@/lib/store/types"

export default function Media() {
  const mediaItems = useEditorStore((s) => s.mediaItems)
  const addMediaItem = useEditorStore((s) => s.addMediaItem)
  const addMediaToTimeline = useEditorStore((s) => s.addMediaToTimeline)
  const setDraggedMediaItem = useEditorStore((s) => s.setDraggedMediaItem)

  function importMedia() {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*, video/*, audio/*"
    input.multiple = true
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files
      if (!files || files.length === 0) return

      for (const file of Array.from(files)) {
        const url = URL.createObjectURL(file)
        const type = file.type.startsWith("video")
          ? "video"
          : file.type.startsWith("audio")
            ? "audio"
            : "image"

        let durationInSeconds: number | undefined

        if (type === "video" || type === "audio") {
          durationInSeconds = await getMediaDuration(url, type)
        }

        const item: MediaItem = {
          id: generateId(),
          name: file.name,
          type,
          src: url,
          durationInSeconds,
        }
        addMediaItem(item)
      }
    }
    input.click()
  }

  return (
    <div className="rounded-3xl w-xl h-full shadow-hard bg-[#ddd] border-2 border-black p-4 relative overflow-hidden flex flex-col">
      <span className="text-2xl">Media</span>
      <Button className="size-10 absolute bottom-5 right-5 bg-[#2a9] z-10" buttonProps={{onClick: importMedia}}>
        <HugeiconsIcon icon={Add01Icon} size={16} color="white" strokeWidth={3} />
      </Button>
      {mediaItems.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3 overflow-y-auto flex-1 pb-14">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => {
                setDraggedMediaItem(item)
                e.dataTransfer.effectAllowed = "copy"
                // Set a small drag image
                const ghost = e.currentTarget.cloneNode(true) as HTMLElement
                ghost.style.width = "80px"
                ghost.style.height = "80px"
                ghost.style.opacity = "0.8"
                ghost.style.position = "absolute"
                ghost.style.top = "-9999px"
                document.body.appendChild(ghost)
                e.dataTransfer.setDragImage(ghost, 40, 40)
                requestAnimationFrame(() => document.body.removeChild(ghost))
              }}
              onDragEnd={() => setDraggedMediaItem(null)}
              className="w-28 h-28 bg-white border-2 border-black shadow-hard rounded-xl overflow-hidden relative group cursor-grab active:cursor-grabbing">
              {item.type === "image" ? (
                <img src={item.src} alt={item.name} className="w-full h-full object-cover" />
              ) : item.type === "video" ? (
                <video src={item.src} className="w-full h-full object-cover" muted />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-amber-100 text-xs p-2 text-center">
                  {item.name}
                </div>
              )}
              <button
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                onClick={() => addMediaToTimeline(item)}>
                <div className="bg-[#2a9] rounded-full p-2">
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="white" strokeWidth={3} />
                </div>
              </button>
              <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 py-0.5 truncate">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      )}
      {mediaItems.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-sm text-[#999]">
          Click + to import media
        </div>
      )}
    </div>
  )
}

function getMediaDuration(src: string, type: "video" | "audio"): Promise<number> {
  return new Promise((resolve) => {
    const el = document.createElement(type)
    el.src = src
    el.onloadedmetadata = () => {
      resolve(el.duration)
    }
    el.onerror = () => resolve(10) // fallback
  })
}
