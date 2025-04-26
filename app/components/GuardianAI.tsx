"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, VolumeX, Volume2 } from "lucide-react"
import type React from "react" // Added import for React

interface GuardianAIProps {
  speak: (text: string) => void
  isMuted: boolean
  currentStep: number
  steps: { title: string; component: React.ReactNode }[]
  toggleMute: () => void
}

export default function GuardianAI({ speak, isMuted, currentStep, steps, toggleMute }: GuardianAIProps) {
  const [currentMessage, setCurrentMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messageQueue = useRef<string[]>([])
  const [allText, setAllText] = useState("")
  const [hasSpoken, setHasSpoken] = useState(false)

  useEffect(() => {
    const stepContent = steps[currentStep]
    const title = stepContent.title
    const messages = [title]
    messageQueue.current = messages
    typeNextMessage()

    // Extract all text from the current step's component
    const componentText = extractTextFromComponent(stepContent.component)
    setAllText(componentText)

    // Reset hasSpoken state when step changes
    setHasSpoken(false)
  }, [currentStep, steps])

  useEffect(() => {
    if (!isMuted && !hasSpoken && allText) {
      speak(allText)
      setHasSpoken(true)
    }
  }, [isMuted, hasSpoken, allText, speak])

  const extractTextFromComponent = (component: React.ReactNode): string => {
    if (typeof component === "string") {
      return component
    }
    if (Array.isArray(component)) {
      return component.map(extractTextFromComponent).join(" ")
    }
    if (typeof component === "object" && component !== null && "props" in component) {
      if ("children" in component.props) {
        return extractTextFromComponent(component.props.children)
      }
    }
    return ""
  }

  const typeNextMessage = () => {
    if (messageQueue.current.length > 0) {
      const message = messageQueue.current.shift()!
      typeMessage(message)
    }
  }

  const typeMessage = (message: string) => {
    setIsTyping(true)
    let i = 0
    const intervalId = setInterval(() => {
      setCurrentMessage(message.slice(0, i))
      i++
      if (i > message.length) {
        clearInterval(intervalId)
        setIsTyping(false)
        setTimeout(() => {
          typeNextMessage()
        }, 1000)
      }
    }, 50)
  }

  return (
    <motion.div
      className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 rounded-lg shadow-lg mb-6 border border-white/20 backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <Sparkles className="w-8 h-8 text-yellow-300 mr-2 filter drop-shadow-lg" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white">Guardian AI</h2>
        </div>
        <motion.button
          className="text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isMuted ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
          transition={isMuted ? { duration: 2, repeat: Number.POSITIVE_INFINITY } : {}}
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </motion.button>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={currentMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-white text-lg"
        >
          {currentMessage}
          {isTyping && (
            <motion.span
              animate={{ opacity: [0, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.5 }}
              className="inline-block ml-1"
            >
              <span className="animate-pulse text-yellow-300">▮</span>
            </motion.span>
          )}
        </motion.p>
      </AnimatePresence>
      <motion.div
        className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-300 via-green-300 to-blue-300"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
        />
      </motion.div>
    </motion.div>
  )
}
