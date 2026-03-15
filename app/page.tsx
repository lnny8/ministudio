"use client"
import React from "react"
import Button from "@/components/button"
import Image from "next/image"
import Link from "next/link"
import {motion} from "motion/react"
import {VideoReplayIcon, TextIcon, DragDropIcon, SparklesIcon, Tick02Icon, ArrowRight01Icon, PlayIcon, Image01Icon, Time04Icon, MoneyBag02Icon} from "@hugeicons/core-free-icons"
import {HugeiconsIcon} from "@hugeicons/react"

const features = [
  {
    icon: DragDropIcon,
    title: "Drag & Drop Timeline",
    description: "Drop your media onto the timeline. Trim, rearrange and layer videos, images and audio intuitively.",
  },
  {
    icon: TextIcon,
    title: "Auto Captions",
    description: "AI-powered captions with stylish designs. One click to make your content accessible and engaging.",
  },
  {
    icon: SparklesIcon,
    title: "Animated Badges",
    description: "Ready-to-use animated elements for enumerations, highlights and viral video formats.",
  },
  {
    icon: VideoReplayIcon,
    title: "Runs in Your Browser",
    description: "No downloads, no installs. Open the editor and start cutting — everything runs locally in your browser.",
  },
]

const checkpoints = ["Done in minutes, not hours", "Export in browser", "Only €8/mo"]

const showcaseMedia = [
  {src: "/placeholder-video-1.svg", type: "video", label: "Travel Vlog"},
  {src: "/placeholder-photo-1.svg", type: "photo", label: "Landscape"},
  {src: "/placeholder-video-2.svg", type: "video", label: "Product Demo"},
  {src: "/placeholder-photo-2.svg", type: "photo", label: "Portrait"},
]

function scrollToPricing() {
  const pricingSection = document.getElementById("pricing")
  if (pricingSection) {
    pricingSection.scrollIntoView({behavior: "smooth"})
  }
}

export default function Page() {
  return (
    <main
      className="min-h-screen"
      style={{
        background: "white",
        backgroundSize: "10px 10px",
        backgroundImage: "radial-gradient(circle, #ddd 1.5px, transparent 1.5px)",
      }}>
      <div className="max-w-7xl mx-auto px-10">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 w-full h-16 z-50 px-10">
          <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
            <div className="flex items-center">
              <Button className="bg-[#2a9] size-10">
                <HugeiconsIcon color="white" strokeWidth={2} icon={PlayIcon} />
              </Button>
              <Link href="/" className="ml-2 text-3xl translate-y-1">
                MiniStudio
              </Link>
            </div>
            <div className="flex gap-3 items-center">
              <Link href="/sign-in" className="text-sm text-[#888] hover:text-black transition-colors px-3 py-1.5">
                Sign in
              </Link>
              <Link href="/sign-up">
                <Button className="bg-[#2a9] px-4 py-1.5 gap-2">
                  <span className="text-sm font-medium">Get started</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-28 pb-16">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
            {/* Left — MacBook */}
            <motion.div className="w-full md:w-[58%] shrink-0" initial={{opacity: 0, x: -30}} animate={{opacity: 1, x: 0}} transition={{duration: 0.6, delay: 0.3}}>
              <Image src="/macbook_ministudio.png" alt="ministudio editor on MacBook" width={1600} height={1000} className="w-full h-auto scale-130 -z-1" priority />
            </motion.div>

            {/* Right — Text */}
            <div className="w-full md:w-1/2 flex flex-col gap-5 text-center md:text-left">
              <motion.div initial={{opacity: 0, y: 16}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}}>
                <span className="inline-block border-2 border-black rounded-full px-3 py-0.5 text-xs shadow-small">Video Editing — simplified</span>
              </motion.div>

              <motion.h1 className="text-4xl md:text-5xl font-bold leading-tight" initial={{opacity: 0, y: 16}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5, delay: 0.1}}>
                Finished videos in <span className="text-[#2a9] font-(family-name:--font-schoolbell)">minutes</span>, not hours.
              </motion.h1>

              <motion.p className="text-sm md:text-base text-[#666]" initial={{opacity: 0, y: 16}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5, delay: 0.2}}>
                The fastest way to turn raw footage into social media ready posts. Drop your clips, pick a template, export. That simple.
              </motion.p>

              <motion.div className="flex gap-4 items-center mt-1 justify-center md:justify-start" initial={{opacity: 0, y: 16}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5, delay: 0.3}}>
                <Link href="/editor">
                  <Button className="bg-[#2a9] px-5 py-2.5 gap-2">
                    <span className="text-sm font-medium">Start editing</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                  </Button>
                </Link>
                <a
                  href="#pricing"
                  className="text-[#888] hover:text-black transition-colors text-xs"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToPricing()
                  }}>
                  See pricing
                </a>
              </motion.div>

              <motion.div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-1 justify-center md:justify-start" initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.5, delay: 0.45}}>
                {checkpoints.map((point) => (
                  <div key={point} className="flex items-center gap-1.5 text-xs text-[#888]">
                    <HugeiconsIcon icon={Tick02Icon} size={14} color="#2a9" />
                    {point}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className=" py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              className="border-2 border-black rounded-xl p-6 bg-white shadow-hard text-center cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-small active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              initial={{opacity: 0, y: 16}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.4}}>
              <div className="size-10 rounded-lg bg-[#2a9] border-2 border-black shadow-small flex items-center justify-center mb-3 mx-auto">
                <HugeiconsIcon icon={Time04Icon} size={18} color="white" />
              </div>
              <div className="text-3xl font-bold">3 min</div>
              <p className="text-[#888] text-xs mt-1">Average time to finished video</p>
            </motion.div>

            <motion.div className="border-2 border-black rounded-xl p-6 bg-white shadow-hard text-center cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-small active:translate-x-1 active:translate-y-1 active:shadow-none transition-all" initial={{opacity: 0, y: 16}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{duration: 0.4, delay: 0.1}}>
              <div className="size-10 rounded-lg bg-[#2a9] border-2 border-black shadow-small flex items-center justify-center mb-3 mx-auto">
                <HugeiconsIcon icon={MoneyBag02Icon} size={18} color="white" />
              </div>
              <div className="text-3xl font-bold">
                €8<span className="text-sm text-[#aaa] font-normal">/mo</span>
              </div>
              <p className="text-[#888] text-xs mt-1">Cheaper than any alternative</p>
            </motion.div>

            <motion.div className="border-2 border-black rounded-xl p-6 bg-white shadow-hard text-center cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-small active:translate-x-1 active:translate-y-1 active:shadow-none transition-all" initial={{opacity: 0, y: 16}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{duration: 0.4, delay: 0.2}}>
              <div className="size-10 rounded-lg bg-[#2a9] border-2 border-black shadow-small flex items-center justify-center mb-3 mx-auto">
                <HugeiconsIcon icon={SparklesIcon} size={18} color="white" />
              </div>
              <div className="text-3xl font-bold">0</div>
              <p className="text-[#888] text-xs mt-1">Learning curve — just drag & drop</p>
            </motion.div>
          </div>
        </section>

        {/* Media Showcase */}
        <section className=" py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">
              Your media. <br />
              <span className="text-[#aaa]">Ready in seconds.</span>
            </h2>
            <p className="text-[#666] mt-3 text-sm max-w-md mx-auto">Drop in your videos and photos — ministudio handles the rest.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {showcaseMedia.map((item, i) => (
              <motion.div
                key={item.label}
                className="border-2 border-black rounded-xl overflow-hidden shadow-hard bg-white group cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-small active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                initial={{opacity: 0, y: 16}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.4, delay: i * 0.08}}>
                <div className="relative">
                  <Image src={item.src} alt={item.label} width={600} height={400} className="w-full h-auto" />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="size-8 rounded-full bg-black/40 flex items-center justify-center backdrop-blur-sm">
                        <HugeiconsIcon icon={PlayIcon} size={14} color="white" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="px-2.5 py-1.5 flex items-center gap-1.5">
                  <HugeiconsIcon icon={item.type === "video" ? VideoReplayIcon : Image01Icon} size={12} color="#aaa" />
                  <span className="text-[11px] text-[#888]">{item.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className=" py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="">Everything</span> you need. <br />
              <span className="text-[#aaa]">Nothing you don&apos;t.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div key={feature.title} className="border-2 border-black rounded-xl p-6 bg-white shadow-hard cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-small active:translate-x-1 active:translate-y-1 active:shadow-none transition-all" initial={{opacity: 0, y: 16}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{duration: 0.4, delay: i * 0.1}}>
                <div className="size-10 rounded-lg bg-[#2a9] border-2 border-black shadow-small flex items-center justify-center mb-4">
                  <HugeiconsIcon icon={feature.icon} size={18} color="white" />
                </div>
                <h3 className="text-base font-bold mb-1.5">{feature.title}</h3>
                <p className="text-[#666] text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className=" py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">
              Simple pricing. <br />
              <span className="text-[#aaa]">No surprises.</span>
            </h2>
          </div>

          <motion.div className="border-2 border-[#2a9] rounded-xl p-8 bg-white shadow-hard max-w-md mx-auto relative cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-small active:translate-x-1 active:translate-y-1 active:shadow-none transition-all" initial={{opacity: 0, y: 16}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{duration: 0.4}}>
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2a9] text-white text-xs font-medium px-3 py-0.5 rounded-full border-2 border-black shadow-small">All-inclusive</span>
            <div className="text-center mb-6">
              <h3 className="text-base font-bold mb-1">MiniStudio</h3>
              <div className="text-5xl font-bold">
                €8<span className="text-lg text-[#aaa] font-normal">/mo</span>
              </div>
              <p className="text-xs text-[#888] mt-1">Cancel anytime</p>
            </div>
            <div className="space-y-2.5 text-sm text-[#666]">
              {["Simple Drag & drop editing", "Auto captions (AI)", "Animated badges & templates", "Edit Videos everywhere", "All on your device"].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <HugeiconsIcon icon={Tick02Icon} size={14} color="#2a9" />
                  {f}
                </div>
              ))}
            </div>
            <Link href="/sign-up" className="block mt-6">
              <Button className="bg-[#2a9] px-5 py-2.5 w-full gap-2">
                <span className="text-sm font-medium">Get started</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </Button>
            </Link>
          </motion.div>
        </section>

        <footer className="text-center py-10 text-[#888] text-xs">&copy; {new Date().getFullYear()} MiniStudio. All rights reserved.</footer>
      </div>
    </main>
  )
}
