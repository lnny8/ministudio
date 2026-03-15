"use client"
import React from "react"
import Button from "./button"
import {HugeiconsIcon} from "@hugeicons/react"
import {PlayIcon, Logout03Icon} from "@hugeicons/core-free-icons"
import Link from "next/link"
import {useSession, signOut} from "@/lib/auth-client"

export default function Menu() {
  const {data: session} = useSession()
  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?"

  return (
    <nav className="fixed w-full h-16 2xl:max-w-500 px-10 right-1/2 translate-x-1/2 flex items-center justify-between z-50">
      <div className="flex items-center justify-center">
        <Button className="bg-[#2a9] size-10">
          <HugeiconsIcon color="white" strokeWidth={2} icon={PlayIcon} />
        </Button>
        <Link href="/" className="ml-2 text-3xl translate-y-1">
          MiniStudio
        </Link>
      </div>
      <div className="flex gap-3 items-center">
        <Button className="bg-[#2a9] px-4">
          <span className="text-sm">Export</span>
        </Button>
        <Button className="size-12 bg-[#ddd]">
          <span className="text-sm">{initials}</span>
        </Button>
        <button
          onClick={() => signOut({fetchOptions: {onSuccess: () => { window.location.href = "/" }}})}
          className="text-[#aaa] hover:text-black transition-colors cursor-pointer p-2"
          title="Sign out">
          <HugeiconsIcon icon={Logout03Icon} size={18} />
        </button>
      </div>
    </nav>
  )
}
