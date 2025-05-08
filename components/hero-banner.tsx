"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Download, Heart } from "lucide-react"

export function HeroBanner() {
  const bannerRef = useRef<HTMLDivElement>(null)

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!bannerRef.current) return
      const scrollY = window.scrollY
      const bannerElement = bannerRef.current
      const imageElement = bannerElement.querySelector(".hero-image") as HTMLElement
      const contentElement = bannerElement.querySelector(".hero-content") as HTMLElement

      if (imageElement && contentElement) {
        // Move the image slightly slower than the scroll for parallax effect
        imageElement.style.transform = `translateY(${scrollY * 0.2}px)`
        // Move the content slightly faster for contrast
        contentElement.style.transform = `translateY(${scrollY * -0.1}px)`
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      ref={bannerRef}
      className="relative h-[80vh] min-h-[600px] overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)",
            backgroundSize: "100px 100px",
          }}
        ></div>
      </div>

      {/* Hero image */}
      <div className="absolute inset-0 flex items-center justify-center hero-image">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative w-[80%] max-w-[500px] h-[80%] max-h-[500px]"
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%201%2C%202025%2C%2005_14_06%20AM-Jsi3fp5WhwwqBkTJTUh5EDcRJxPBGd.png"
            alt="Narcoguard Guardian"
            fill
            className="object-contain"
            priority
          />
          <motion.div
            animate={{
              boxShadow: [
                "0 0 50px 20px rgba(255,255,255,0.3)",
                "0 0 100px 40px rgba(255,255,255,0.5)",
                "0 0 50px 20px rgba(255,255,255,0.3)",
              ],
            }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            className="absolute inset-0 rounded-full"
          />
        </motion.div>
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

      {/* Hero content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-20 hero-content">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Protecting Lives from Overdose</h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl">
            Narcoguard is your guardian angel, watching over you and your loved ones to prevent overdose fatalities and
            support recovery.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild className="bg-white text-purple-700 hover:bg-white/90">
              <Link href="/download">
                <Download className="mr-2 h-5 w-5" /> Download Narcoguard
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white/10">
              <Link href="/donate">
                <Heart className="mr-2 h-5 w-5" /> Support Our Mission
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
