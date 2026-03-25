"use client"
import React, {useState} from "react"
import Button from "./button"
import DemoBadge from "./demo-badge"
import DemoCallout from "./demo-callout"
import {HugeiconsIcon} from "@hugeicons/react"
import {PlayIcon} from "@hugeicons/core-free-icons"
import Link from "next/link"

export default function Menu() {
  const [showExportNotice, setShowExportNotice] = useState(false)

  return (
    <nav className="fixed w-full h-16 2xl:max-w-500 px-10 right-1/2 translate-x-1/2 z-50">
      <div className="relative flex h-full items-center justify-between">
        <div className="flex items-center justify-center">
          <Button className="bg-[#2a9] size-10">
            <HugeiconsIcon color="white" strokeWidth={2} icon={PlayIcon} />
          </Button>
          <Link href="/" className="ml-2 text-3xl translate-y-1">
            MiniStudio
          </Link>
          <DemoBadge label="Editor demo" className="ml-4 hidden md:inline-flex" />
        </div>
        <div className="flex gap-3 items-center">
          <Button className="bg-[#2a9] px-4" buttonProps={{type: "button", onClick: () => setShowExportNotice((current) => !current)}}>
            <span className="text-sm">Export</span>
          </Button>
        </div>

        {showExportNotice && (
          <DemoCallout
            className="absolute top-full right-0 mt-3 w-full max-w-sm"
            title="Export is simulated in this demo."
            description="This preview shows the editing experience only, so clicking export will not render a real file here."
          />
        )}
      </div>
    </nav>
  )
}
