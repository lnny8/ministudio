import React from "react"

export default function Button({children, buttonProps, className}: {children: React.ReactNode; buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>; className?: string}) {
  return (
    <button className={`shadow-hard cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-small transition-all border-black border-2 rounded-xl flex items-center justify-center ${className || ""}`} {...buttonProps}>
      {children}
    </button>
  )
}
