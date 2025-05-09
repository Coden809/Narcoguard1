"use client"

import { useState, useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Download, Info, ChevronDown } from "lucide-react"
import Link from "next/link"
import DownloadModal from "@/components/download-modal"
import { throttle } from "@/lib/performance"
import { announceToScreenReader } from "@/lib/accessibility"
import { NoSignIcon } from "@/components/no-sign-icon"

export default function HeroSection() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inViewRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(inViewRef, { once: true })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9])

  const scrollToContent = throttle(() => {
    const contentSection = document.getElementById("content-section")
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: "smooth" })
      announceToScreenReader("Scrolled to content section")
    }
  }, 300)

  const handleDownloadClick = () => {
    setIsDownloadModalOpen(true)
    announceToScreenReader("Download modal opened")
  }

  return (
    <section
      ref={ref}
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-background to-muted"
    >
      {/* Skip to content link for accessibility */}
      <a href="#content-section" className="skip-to-content">
        Skip to content
      </a>

      {/* Background with No Sign Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large No Sign Icon - Top Right */}
        <div className="absolute top-[10%] right-[5%] transform -translate-y-1/2 hidden md:block">
          <NoSignIcon size={280} animated={true} />
        </div>

        {/* Medium No Sign Icon - Bottom Left */}
        <div className="absolute bottom-[15%] left-[8%] transform rotate-12 hidden lg:block">
          <NoSignIcon size={180} animated={true} strokeColor="#ff5555" strokeWidth={3} />
        </div>

        {/* Small No Sign Icon - Top Left */}
        <div className="absolute top-[20%] left-[15%] transform -rotate-6 hidden xl:block">
          <NoSignIcon size={120} animated={true} strokeColor="#ff4444" strokeWidth={3} />
        </div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <motion.div
          style={{ y, opacity, scale }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          ref={inViewRef}
        >
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">
                Preventing Overdose Deaths with Technology
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-muted-foreground mb-8"
            >
              Narcoguard uses advanced monitoring and alert systems to detect overdoses and connect users with
              life-saving help in critical moments.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                onClick={handleDownloadClick}
                className="btn-gradient text-white shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center">
                  <Download className="mr-2 h-5 w-5" />
                  Download App
                </span>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-2 hover:bg-muted/50 focus-visible">
                <Link href="/about">
                  <Info className="mr-2 h-5 w-5" />
                  Learn More
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-background/80 to-muted">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 z-0" />

              {/* Central No Sign Icon */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <NoSignIcon size={300} className="opacity-90" animated={true} strokeWidth={5} />
              </div>

              <img
                src="/placeholder.svg?height=600&width=800"
                alt="Narcoguard App Interface showing the main dashboard with emergency features"
                className="w-full h-auto relative z-10 opacity-40"
                loading="lazy"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-background/80 to-transparent z-20" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl z-0"></div>
            <div className="absolute -top-6 -left-6 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl z-0"></div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollToContent}
            className="rounded-full animate-bounce"
            aria-label="Scroll down to content"
          >
            <ChevronDown className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>

      <DownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />
    </section>
  )
}
