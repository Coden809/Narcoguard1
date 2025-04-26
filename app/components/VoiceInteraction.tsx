"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function VoiceInteraction() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")

  useEffect(() => {
    let recognition: SpeechRecognition | null = null

    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true

      recognition.onresult = (event) => {
        const current = event.resultIndex
        const transcript = event.results[current][0].transcript
        setTranscript(transcript)
      }

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error)
      }
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [])

  const toggleListening = () => {
    if (isListening) {
      // Stop listening
      setIsListening(false)
      // Implement stop listening logic here
    } else {
      // Start listening
      setIsListening(true)
      // Implement start listening logic here
    }
  }

  return (
    <div>
      <Button onClick={toggleListening}>{isListening ? "Stop Listening" : "Start Listening"}</Button>
      {transcript && (
        <div className="mt-4">
          <h3 className="font-bold">Transcript:</h3>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  )
}
