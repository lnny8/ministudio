"use client"
import {useState} from "react"
import Button from "./button"
import {HugeiconsIcon} from "@hugeicons/react"
import {PlayIcon} from "@hugeicons/core-free-icons"
import {useEditorStore, generateId} from "@/lib/store"

export default function Effects() {
  const addLabel = useEditorStore((s) => s.addLabel)
  const fps = useEditorStore((s) => s.fps)
  const currentFrame = useEditorStore((s) => s.currentFrame)
  const [labelOptions, setLabelOptions] = useState({
    text: "Configure me",
    color: "#22aa99",
    paddingX: 20,
    paddingY: 10,
    borderRadius: 12,
  })

  function handleAddLabel() {
    addLabel({
      id: generateId(),
      text: labelOptions.text,
      color: labelOptions.color,
      from: currentFrame,
      durationInFrames: 3 * fps, // 3 seconds default
      x: 100,
      y: 100,
      paddingX: labelOptions.paddingX,
      paddingY: labelOptions.paddingY,
      borderRadius: labelOptions.borderRadius,
    })
  }

  return (
    <div className="rounded-3xl w-full h-full shadow-hard bg-[#ddd] border-2 border-black p-4 overflow-y-auto">
      <span className="text-2xl">Effects</span>

      <div className="pt-5 flex flex-col gap-3">
        {/* Add Label */}
        <div className="flex flex-col gap-5 shadow-hard border-2 border-black rounded-3xl p-4 bg-white">
          <span className="flex w-full items-center justify-between">
            <span className="text-2xl">Add Label</span>
            <Button className="px-4 py-1 bg-[#2a9] text-white text-sm" buttonProps={{onClick: handleAddLabel}}>
              Add to Video
            </Button>
          </span>

          {/* Options */}
          <div className="grid grid-cols-3 grid-rows-2 gap-2">
            <div className="col-span-2">
              <span className="text-sm">Text</span>
              <input
                type="text"
                value={labelOptions.text}
                onChange={(e) => setLabelOptions({...labelOptions, text: e.target.value})}
                className="w-full focus:outline-0 focus:shadow-small transition-all focus:translate-x-0.5 focus:translate-y-0.5 border-black border-2 text-sm shadow-hard bg-[#ddd] rounded-2xl px-3 py-1"
              />
            </div>
            <div className="col-span-1">
              <span className="text-sm">Padding X</span>
              <input
                type="number"
                value={labelOptions.paddingX}
                onChange={(e) => setLabelOptions({...labelOptions, paddingX: Number(e.target.value)})}
                className="w-full focus:outline-0 focus:shadow-small transition-all focus:translate-x-0.5 focus:translate-y-0.5 border-black border-2 text-sm shadow-hard bg-[#ddd] rounded-2xl px-3 py-1"
              />
            </div>
            <div className="col-span-1">
              <span className="text-sm">Border Radius</span>
              <input
                type="number"
                value={labelOptions.borderRadius}
                onChange={(e) => setLabelOptions({...labelOptions, borderRadius: Number(e.target.value)})}
                className="w-full focus:outline-0 focus:shadow-small transition-all focus:translate-x-0.5 focus:translate-y-0.5 border-black border-2 text-sm shadow-hard bg-[#ddd] rounded-2xl px-3 py-1"
              />
            </div>
            <div className="col-span-1">
              <span className="text-sm">Color</span>
              <input
                type="color"
                value={labelOptions.color}
                onChange={(e) => setLabelOptions({...labelOptions, color: e.target.value})}
                className="size-10 focus:outline-0 focus:shadow-small transition-all focus:translate-x-0.5 focus:translate-y-0.5 border-black border-2 text-sm shadow-hard bg-[#ddd] rounded-2xl p-1"
              />
            </div>
            <div className="col-span-1">
              <span className="text-sm">Padding Y</span>
              <input
                type="number"
                value={labelOptions.paddingY}
                onChange={(e) => setLabelOptions({...labelOptions, paddingY: Number(e.target.value)})}
                className="w-full focus:outline-0 focus:shadow-small transition-all focus:translate-x-0.5 focus:translate-y-0.5 border-black border-2 text-sm shadow-hard bg-[#ddd] rounded-2xl px-3 py-1"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center justify-center p-4 rounded-2xl border border-dashed">
            <div
              className="border-2 border-black shadow-hard text-white cursor-pointer"
              style={{
                backgroundColor: labelOptions.color,
                paddingLeft: labelOptions.paddingX,
                paddingRight: labelOptions.paddingX,
                paddingTop: labelOptions.paddingY,
                paddingBottom: labelOptions.paddingY,
                borderRadius: labelOptions.borderRadius,
              }}>
              {labelOptions.text}
            </div>
          </div>
        </div>

        {/* Sound Effects */}
        <div className="flex flex-col gap-5 shadow-hard border-2 border-black rounded-3xl p-4 bg-white">
          <span className="text-2xl">Sound Effects</span>
          <div className="grid grid-cols-2 gap-2">
            {[
              {name: "Swoosh", length: 3},
              {name: "Boing", length: 1},
              {name: "Clap", length: 2},
              {name: "Whoosh", length: 4},
              {name: "Thunder", length: 5},
              {name: "Plop", length: 2},
              {name: "Splash", length: 3},
              {name: "Bounce", length: 2},
            ].map((effect) => (
              <div key={effect.name} className="flex items-center justify-between bg-[#ddd] rounded-xl border-2 border-black shadow-hard cursor-pointer px-2 py-1 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-small transition-all">
                <HugeiconsIcon icon={PlayIcon} size={16} color="black" strokeWidth={3} />
                <span>{effect.name}</span>
                <span className="text-sm text-[#aaa]">00:0{effect.length}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transitions */}
        <div className="flex flex-col gap-5 shadow-hard border-2 border-black rounded-3xl p-4 bg-white">
          <span className="text-2xl">Transitions</span>
          <div className="grid grid-cols-2 gap-2">
            {[{name: "Fade In"}, {name: "Fade Out"}, {name: "Slide Left"}, {name: "Slide Right"}, {name: "Zoom In"}, {name: "Zoom Out"}, {name: "Spin"}, {name: "Flip"}].map((effect) => (
              <div key={effect.name} className="flex items-center justify-center bg-[#ddd] rounded-xl border-2 border-black shadow-hard cursor-pointer px-2 py-1 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-small transition-all">
                <span>{effect.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
