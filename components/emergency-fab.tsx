"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle, X, Heart, Info, Download } from "lucide-react"

export function EmergencyFAB() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col gap-2 mb-4"
          >
            <Button
              asChild
              size="icon"
              className="bg-narcoguard-blue hover:bg-narcoguard-blue/90 shadow-lg"
              title="Emergency Resources"
            >
              <Link href="/resources">
                <Info className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="icon"
              className="bg-narcoguard-pink hover:bg-narcoguard-pink/90 shadow-lg"
              title="Donate"
            >
              <Link href="/donate">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="icon"
              className="bg-narcoguard-purple hover:bg-narcoguard-purple/90 shadow-lg"
              title="Download App"
            >
              <Link href="/download">
                <Download className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
        <Button
          size="icon"
          className={`h-14 w-14 rounded-full shadow-lg ${
            isOpen ? "bg-gray-700 hover:bg-gray-800" : "bg-red-600 hover:bg-red-700"
          }`}
          onClick={toggleOpen}
        >
          {isOpen ? <X className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
        </Button>
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="absolute inset-0 rounded-full bg-red-600/30"
          ></motion.div>
        )}
      </motion.div>
    </div>
  )
}
