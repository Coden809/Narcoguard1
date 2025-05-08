"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Download, Info } from "lucide-react"
import Link from "next/link"
import DownloadModal from "@/components/download-modal"

export default function HeroSection() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Preventing Overdose Deaths with Technology</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Narcoguard uses advanced monitoring and alert systems to detect overdoses and connect users with
              life-saving help in critical moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => setIsDownloadModalOpen(true)}>
                <Download className="mr-2 h-5 w-5" />
                Download App
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">
                  <Info className="mr-2 h-5 w-5" />
                  Learn More
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl">
              <img
                src="/placeholder.svg?height=600&width=800"
                alt="Narcoguard App Interface"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-primary/20 rounded-full blur-3xl z-0"></div>
            <div className="absolute -top-6 -left-6 w-64 h-64 bg-secondary/20 rounded-full blur-3xl z-0"></div>
          </motion.div>
        </div>
      </div>

      <DownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />
    </section>
  )
}
