"use client"
import {useState} from "react"
import Button from "@/components/button"
import {ArrowRight01Icon} from "@hugeicons/core-free-icons"
import {HugeiconsIcon} from "@hugeicons/react"

export default function Upgrade() {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    const res = await fetch("/api/checkout", {method: "POST"})
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
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
          <h1 className="text-2xl font-bold mb-1">Upgrade to Pro</h1>
          <p className="text-sm text-[#888] mb-6">Get full access to the MiniStudio editor</p>

          <ul className="flex flex-col gap-2 mb-6">
            <li className="text-sm flex items-center gap-2">
              <span className="size-5 rounded-full bg-[#2a9] border-2 border-black flex items-center justify-center text-white text-xs font-bold">✓</span>
              Unlimited projects
            </li>
            <li className="text-sm flex items-center gap-2">
              <span className="size-5 rounded-full bg-[#2a9] border-2 border-black flex items-center justify-center text-white text-xs font-bold">✓</span>
              Export in full quality
            </li>
            <li className="text-sm flex items-center gap-2">
              <span className="size-5 rounded-full bg-[#2a9] border-2 border-black flex items-center justify-center text-white text-xs font-bold">✓</span>
              All effects and transitions
            </li>
          </ul>

          <Button className="bg-[#2a9] w-full py-2.5 gap-2" buttonProps={{onClick: handleCheckout, disabled: loading}}>
            <span className="text-sm font-medium">{loading ? "..." : "Subscribe now"}</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </Button>

          <p className="text-xs text-[#888] mt-5 text-center">
            <a href="/" className="text-black hover:text-[#2a9] transition-colors">
              Back to home
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
