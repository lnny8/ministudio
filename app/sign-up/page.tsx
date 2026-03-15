"use client"
import React, {useState} from "react"
import Button from "@/components/button"
import {signUp} from "@/lib/auth-client"
import {ArrowRight01Icon, Mail01Icon} from "@hugeicons/core-free-icons"
import {HugeiconsIcon} from "@hugeicons/react"

export default function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await signUp.email({name, email, password, callbackURL: "/editor"})
    if (res.error) {
      setError(res.error.message || "Sign up failed")
    } else {
      setSuccess(true)
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
          <h1 className="text-2xl font-bold mb-1">Create account</h1>
          <p className="text-sm text-[#888] mb-6">Start editing videos today</p>

          {success ? (
            <div className="text-center py-4">
              <div className="size-12 rounded-xl bg-[#2a9] border-2 border-black shadow-small flex items-center justify-center mx-auto mb-4">
                <HugeiconsIcon icon={Mail01Icon} size={20} color="white" />
              </div>
              <p className="font-bold mb-1">Verify your email</p>
              <p className="text-sm text-[#888]">We sent a verification link to {email}</p>
            </div>
          ) : (
            <>
              <form onSubmit={handleSignUp} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border-2 border-black rounded-xl px-3 py-2 text-sm shadow-hard focus:outline-none focus:shadow-small focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border-2 border-black rounded-xl px-3 py-2 text-sm shadow-hard focus:outline-none focus:shadow-small focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full border-2 border-black rounded-xl px-3 py-2 text-sm shadow-hard focus:outline-none focus:shadow-small focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
                />

                {error && <p className="text-red-500 text-xs">{error}</p>}

                <Button className="bg-[#2a9] w-full py-2.5 gap-2 mt-1">
                  <span className="text-sm font-medium">{loading ? "..." : "Create account"}</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                </Button>
              </form>

              <p className="text-xs text-[#888] mt-5 text-center">
                Already have an account?{" "}
                <a href="/sign-in" className="text-black hover:text-[#2a9] transition-colors">
                  Sign in
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
