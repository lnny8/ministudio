"use client"
import React, {useState} from "react"
import Button from "@/components/button"
import {signIn, authClient} from "@/lib/auth-client"
import {ArrowRight01Icon, Mail01Icon} from "@hugeicons/core-free-icons"
import {HugeiconsIcon} from "@hugeicons/react"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [mode, setMode] = useState<"password" | "magic">("password")
  const [loading, setLoading] = useState(false)

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await signIn.email({email, password, callbackURL: "/editor"})
    if (res.error) setError(res.error.message || "Sign in failed")
    setLoading(false)
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await authClient.signIn.magicLink({email, callbackURL: "/editor"})
    if (res.error) {
      setError(res.error.message || "Failed to send magic link")
    } else {
      setMagicLinkSent(true)
    }
    setLoading(false)
  }

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

          {magicLinkSent ? (
            <div className="text-center py-4">
              <div className="size-12 rounded-xl bg-[#2a9] border-2 border-black shadow-small flex items-center justify-center mx-auto mb-4">
                <HugeiconsIcon icon={Mail01Icon} size={20} color="white" />
              </div>
              <p className="font-bold mb-1">Check your email</p>
              <p className="text-sm text-[#888]">We sent a login link to {email}</p>
            </div>
          ) : (
            <>
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

              <form onSubmit={mode === "password" ? handlePasswordSignIn : handleMagicLink} className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border-2 border-black rounded-xl px-3 py-2 text-sm shadow-hard focus:outline-none focus:shadow-small focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
                />
                {mode === "password" && (
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border-2 border-black rounded-xl px-3 py-2 text-sm shadow-hard focus:outline-none focus:shadow-small focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
                  />
                )}

                {error && <p className="text-red-500 text-xs">{error}</p>}

                <Button className="bg-[#2a9] w-full py-2.5 gap-2 mt-1">
                  <span className="text-sm font-medium">{loading ? "..." : mode === "password" ? "Sign in" : "Send magic link"}</span>
                  <HugeiconsIcon icon={mode === "password" ? ArrowRight01Icon : Mail01Icon} size={16} />
                </Button>
              </form>

              <p className="text-xs text-[#888] mt-5 text-center">
                Don&apos;t have an account?{" "}
                <a href="/sign-up" className="text-black hover:text-[#2a9] transition-colors">
                  Sign up
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
