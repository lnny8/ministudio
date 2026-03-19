"use client"
import React, {useState} from "react"
import Button from "@/components/button"
import {ArrowRight01Icon, Mail01Icon} from "@hugeicons/core-free-icons"
import {HugeiconsIcon} from "@hugeicons/react"

export default function SignIn() {
  const [mode, setMode] = useState<"password" | "magic">("password")

  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "white",
        backgroundSize: "10px 10px",
        backgroundImage: "radial-gradient(circle, #ddd 1.5px, transparent 1.5px)",
      }}>
      <div className="w-full max-w-sm">
        <div className="border-2 border-black rounded-xl bg-white shadow-hard p-8">
          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm text-[#888] mb-6">Sign in to your account</p>

          {/* Mode toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("password")}
              className={`text-xs px-3 py-1 rounded-full border-2 border-black transition-all cursor-pointer ${mode === "password" ? "bg-black text-white" : "bg-white text-black"}`}>
              Password
            </button>
            <button
              onClick={() => setMode("magic")}
              className={`text-xs px-3 py-1 rounded-full border-2 border-black transition-all cursor-pointer ${mode === "magic" ? "bg-black text-white" : "bg-white text-black"}`}>
              Magic link
            </button>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email"
              className="w-full border-2 border-black rounded-xl px-3 py-2 text-sm shadow-hard focus:outline-none focus:shadow-small focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
            />
            {mode === "password" && (
              <input
                type="password"
                placeholder="Password"
                className="w-full border-2 border-black rounded-xl px-3 py-2 text-sm shadow-hard focus:outline-none focus:shadow-small focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
              />
            )}

            <Button className="bg-[#2a9] w-full py-2.5 gap-2 mt-1">
              <span className="text-sm font-medium">{mode === "password" ? "Sign in" : "Send magic link"}</span>
              <HugeiconsIcon icon={mode === "password" ? ArrowRight01Icon : Mail01Icon} size={16} />
            </Button>
          </form>

          <p className="text-xs text-[#888] mt-5 text-center">
            Don&apos;t have an account?{" "}
            <a href="/sign-up" className="text-black hover:text-[#2a9] transition-colors">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
