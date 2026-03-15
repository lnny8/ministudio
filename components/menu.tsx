import React from "react"
import Image from "next/image"
import Button from "./button"

export default function Menu() {
  const links = [
    {name: "Home", href: "/"},
    {name: "Editor", href: "/editor"},
  ]
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/"

  return (
    <nav className="fixed w-full h-16 2xl:max-w-500 px-10 right-1/2 translate-x-1/2 flex items-center justify-between">
      <Image src="/ministudio.png" alt="Logo" width={200} height={40} className="" />
      <div className="flex gap-10 items-center justify-center h-full">
        {links.map((link) => (
          <a key={link.name} href={link.href} className={currentPath === link.href ? "text-black" : "text-[#aaa]"}>
            {link.name}
          </a>
        ))}
      </div>
      <div className="flex gap-5">
        <Button className="bg-[#2a9] px-4"><span className="text-sm">Export</span></Button>
        <Button className="size-12 bg-[#ddd]"><span className="text-sm">LM</span></Button>
      </div>
    </nav>
  )
}
