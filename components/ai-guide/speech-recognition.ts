"use client"

import { useRef, useEffect } from "react"
import type { SpeechRecognition } from "./types"

export function useSpeechRecognition(
  isListening: boolean,
  onTranscript: (text: string) => void,
): { toggleListening: () => void; isSupported: boolean } {
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const isSupported =
    typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)

  useEffect(() => {
    if (!isSupported) return

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognitionAPI()

    if (recognitionRef.current) {
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("")

        onTranscript(transcript)
      }

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error)
      }

      recognitionRef.current.onend = () => {
        // Only restart if still in listening mode
        if (isListening && recognitionRef.current) {
          recognitionRef.current.start()
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isSupported, onTranscript, isListening])

  // Set up listening state
  useEffect(() => {
    if (!isSupported || !recognitionRef.current) return

    if (isListening) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        // Handle case where it's already started
        console.warn("Speech recognition already started")
      }
    } else {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        console.warn("Speech recognition already stopped")
      }
    }
  }, [isListening, isSupported])

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error("Failed to start speech recognition:", error)
      }
    }
  }

  return { toggleListening, isSupported }
}
