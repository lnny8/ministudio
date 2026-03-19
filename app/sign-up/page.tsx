"use client"
import React from "react"
import Button from "@/components/button"
import {ArrowRight01Icon} from "@hugeicons/core-free-icons"
import {HugeiconsIcon} from "@hugeicons/react"

export default function SignUp() {
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
          <h1 className="text-2xl font-bold mb-1">Create account</h1>
          <p className="text-sm text-[#888] mb-6">Start editing videos today</p>

          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Name"
              className="w-full border-2 border-black rounded-xl px-3 py-2 text-sm shadow-hard focus:outline-none focus:shadow-small focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border-2 border-black rounded-xl px-3 py-2 text-sm shadow-hard focus:outline-none focus:shadow-small focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border-2 border-black rounded-xl px-3 py-2 text-sm shadow-hard focus:outline-none focus:shadow-small focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
            />

            <Button className="bg-[#2a9] w-full py-2.5 gap-2 mt-1">
              <span className="text-sm font-medium">Create account</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Button>
          </form>

          <p className="text-xs text-[#888] mt-5 text-center">
            Already have an account?{" "}
            <a href="/sign-in" className="text-black hover:text-[#2a9] transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
