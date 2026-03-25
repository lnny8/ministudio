import React from "react"

export default function DemoBadge({className, label = "Interactive demo"}: {className?: string; label?: string}) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#fff3bf] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-small ${className || ""}`}>
      <span className="size-2 rounded-full bg-[#2a9]" aria-hidden="true" />
      {label}
    </span>
  )
}
