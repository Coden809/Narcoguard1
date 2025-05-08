"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

const AppPreview = () => {
  const [currentScreen, setCurrentScreen] = useState(0)
  const screens = ["/app-screen-1.png", "/app-screen-2.png", "/app-screen-3.png", "/app-screen-4.png"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % screens.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-[280px] h-[560px]">
      <div className="absolute inset-0 bg-gray-800 rounded-[3rem] overflow-hidden shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <Image
              src={screens[currentScreen] || "/placeholder.svg"}
              alt={`App Screen ${currentScreen + 1}`}
              layout="fill"
              objectFit="cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-3xl"></div>
    </div>
  )
}

export default AppPreview
