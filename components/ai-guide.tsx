"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { User } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageList } from "./ai-guide/message-list"
import { QuickResponses } from "./ai-guide/quick-responses"
import { MessageInput } from "./ai-guide/message-input"
import { useSpeechRecognition } from "./ai-guide/speech-recognition"
import type { Message } from "./ai-guide/types"

// Utility for generating IDs
const generateId = () => Date.now().toString() + Math.random().toString(36).substring(2, 9)

export default function AIGuide() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: generateId(),
        text: "I'm Guardian AI, your personal guide to using Narcoguard. How can I help you today?",
        sender: "ai",
        timestamp: new Date(),
      },
    ])
  }, [])

  // Set up speech recognition
  const handleTranscript = useCallback((transcript: string) => {
    setInput(transcript)
  }, [])

  const { toggleListening, isSupported } = useSpeechRecognition(isListening, handleTranscript)

  const handleToggleListening = useCallback(() => {
    if (!isSupported) {
      console.log("Speech recognition not supported")
      return
    }
    setIsListening((prev) => !prev)
    toggleListening()
  }, [isSupported, toggleListening])

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
      id: generateId(),
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
        id: generateId(),
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
        id: generateId(),
        text: "I'm sorry, I'm having trouble connecting. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
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

  const handleQuickResponseSelect = (response: string) => {
    setInput(response)
    document.getElementById("message-input")?.focus()
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          Guardian AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} aria-hidden="true" />

        <QuickResponses responses={getQuickResponses()} onSelectResponse={handleQuickResponseSelect} />

        <MessageInput
          input={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          isProcessing={isProcessing}
          isListening={isListening}
          toggleListening={handleToggleListening}
        />
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Guardian AI is designed to provide guidance on using Narcoguard. For medical emergencies, call 911.
      </CardFooter>
    </Card>
  )
}
