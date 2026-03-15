"use client"
import Canvas from "@/components/canvas"
import Effects from "@/components/effects"
import Media from "@/components/media"
import Timeline from "@/components/timeline"
import Image from "next/image"

export default function Editor() {
  return (
    <main className="h-screen bg-dotted-pattern" style={{background: "white", backgroundSize: "10px 10px", backgroundImage: "radial-gradient(circle, #ddd 1.5px, transparent 1.5px)"}}>
      <div className="2xl:max-w-500 px-10 h-full w-full mx-auto pt-20">
        <div className="grid grid-cols-4 grid-rows-10 w-full h-[95%] relative">
          <div className="flex w-full row-span-6 gap-5 col-span-3 relative pr-5">
            <Media />
            <Canvas />
          </div>
          <div className="row-span-10 w-full h-full relative">
            <Effects />
          </div>
          <div className="col-span-3 w-full row-span-4 h-full relative pt-5 pr-5">
            <Timeline />
          </div>
        </div>
      </div>
    </main>
  )
}
