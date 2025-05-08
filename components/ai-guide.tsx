"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, ChevronRight, Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

// Declare SpeechRecognition variable
declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}

export default function AIGuide() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: "1",
        text: "I'm Guardian AI, your personal guide to using Narcoguard. How can I help you today?",
        sender: "ai",
        timestamp: new Date(),
      },
    ])
  }, [])

  // Set up speech recognition
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      console.log("Speech recognition not supported")
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()

    if (recognitionRef.current) {
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("")

        setInput(transcript)
      }

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current?.start()
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isListening])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle input submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    try {
      // Send request to AI
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])

      // Speak the response if speech synthesis is available
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(data.response)
        speechSynthesis.speak(utterance)
      }
    } catch (error) {
      console.error("Error getting AI response:", error)

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  // Toggle speech recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsListening(false)
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start()
      }
      setIsListening(true)
    }
  }

  // Generate quick response buttons based on conversation context
  const getQuickResponses = () => {
    // In a real app, this would be more sophisticated and context-aware
    const defaultResponses = [
      "How do I set up emergency contacts?",
      "What should I do if I witness an overdose?",
      "How does Narcoguard detect overdoses?",
      "Tell me about the Hero Network",
    ]

    return defaultResponses
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          Guardian AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 overflow-y-auto mb-4 p-4 bg-muted/50 rounded-lg">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex mb-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-card border"
                  }`}
                >
                  <p>{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {getQuickResponses().map((response, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => {
                setInput(response)
                document.getElementById("message-input")?.focus()
              }}
            >
              {response}
            </Button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              id="message-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full px-4 py-2 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isProcessing}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`absolute right-1 top-1/2 -translate-y-1/2 ${isListening ? "text-primary" : ""}`}
              onClick={toggleListening}
            >
              {isListening ? <Mic className="h-5 w-5 animate-pulse" /> : <MicOff className="h-5 w-5" />}
            </Button>
          </div>

          <Button type="submit" disabled={!input.trim() || isProcessing}>
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Guardian AI is designed to provide guidance on using Narcoguard. For medical emergencies, call 911.
      </CardFooter>
    </Card>
  )
}
