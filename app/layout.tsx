import type {Metadata} from "next"
import "./globals.css"
import localfont from "next/font/local"
import {Schoolbell} from "next/font/google"

const schoolbell = Schoolbell({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-schoolbell",
})

const clashDisplay = localfont({
  src: "/clashdisplay.otf",
  variable: "--font-clash-display",
})
export const metadata: Metadata = {
  title: "MiniStudio",
  description: "Finished videos in minutes, not hours.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${clashDisplay.className} ${schoolbell.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
