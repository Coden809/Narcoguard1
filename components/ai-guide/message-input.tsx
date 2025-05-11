"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, ChevronRight } from "lucide-react"

interface MessageInputProps {
  input: string
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  isProcessing: boolean
  isListening: boolean
  toggleListening: () => void
}

export function MessageInput({
  input,
  onChange,
  onSubmit,
  isProcessing,
  isListening,
  toggleListening,
}: MessageInputProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <input
          id="message-input"
          type="text"
          value={input}
          onChange={(e) => onChange(e.target.value)}
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
          aria-label={isListening ? "Stop listening" : "Start listening"}
          aria-pressed={isListening}
        >
          {isListening ? <Mic className="h-5 w-5 animate-pulse" /> : <MicOff className="h-5 w-5" />}
        </Button>
      </div>

      <Button type="submit" disabled={!input.trim() || isProcessing} aria-label="Send message">
        {isProcessing ? (
          <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </Button>
    </form>
  )
}
