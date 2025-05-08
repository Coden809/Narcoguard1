"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Hide splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  // Store splash screen state in localStorage to only show it once per session
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash")
    if (hasSeenSplash) {
      setIsVisible(false)
    } else {
      sessionStorage.setItem("hasSeenSplash", "true")
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"
        >
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-48 h-48 mb-6"
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%201%2C%202025%2C%2005_14_06%20AM-Jsi3fp5WhwwqBkTJTUh5EDcRJxPBGd.png"
                alt="Narcoguard Guardian"
                fill
                className="object-contain"
                priority
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="absolute inset-0 rounded-full bg-white/30 blur-xl"
              />
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-4xl font-bold text-white mb-2"
            >
              Narcoguard
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-white/80 text-lg"
            >
              Protecting Lives, Preventing Overdose
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
