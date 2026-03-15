import {Add01Icon} from "@hugeicons/core-free-icons"
import {HugeiconsIcon} from "@hugeicons/react"
import React from "react"
import Button from "./button"

export default function Media() {
  const [mediaItems, setMediaItems] = React.useState<string[]>([])

  function importMedia() {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*, video/*"
    input.multiple = true
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files && files.length > 0) {
        const urls = Array.from(files).map((file) => URL.createObjectURL(file))
        setMediaItems([...mediaItems, ...urls])
      }
    }
    input.click()
  }

  return (
    <div className="rounded-3xl w-xl h-full shadow-hard bg-[#ddd] border-2 border-black p-4 relative overflow-hidden">
      <span className="text-2xl">Media</span>
      <Button className="size-10 absolute bottom-5 right-5 bg-[#2a9]" buttonProps={{onClick: () => importMedia()}}>
        <HugeiconsIcon icon={Add01Icon} size={16} color="white" strokeWidth={3} />
      </Button>
      {mediaItems.length > 0 && (
        <div className="mt-4 flex h-full flex-wrap gap-4 overflow-y-auto flex-1 pb-14">
          {mediaItems.map((item, index) => (
            <div key={index} className="w-32 h-32 bg-white border-2 border-black shadow-hard rounded-xl overflow-hidden">
              <img src={item} alt={`Media ${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
