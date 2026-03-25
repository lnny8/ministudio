"use client"
import React from "react"
import Link from "next/link"
import {ArrowRight01Icon} from "@hugeicons/core-free-icons"
import {HugeiconsIcon} from "@hugeicons/react"
import Button from "./button"

export default function DemoCallout({
  title,
  description,
  ctaHref,
  ctaLabel,
  className,
}: {
  title: string
  description: string
  ctaHref?: string
  ctaLabel?: string
  className?: string
}) {
  return (
    <div role="status" aria-live="polite" className={`rounded-xl border-2 border-black bg-[#effff7] p-4 shadow-hard ${className || ""}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#187a61]">Demo only</p>
      <h2 className="mt-2 text-sm font-bold">{title}</h2>
      <p className="mt-1 text-sm leading-relaxed text-[#555]">{description}</p>

      {ctaHref && ctaLabel && (
        <Link href={ctaHref} className="mt-4 block">
          <Button className="w-full bg-[#2a9] py-2.5 gap-2">
            <span className="text-sm font-medium">{ctaLabel}</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </Button>
        </Link>
      )}
    </div>
  )
}
