export interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

// Speech Recognition type definition
export interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult: (event: any) => void
  onerror: (event: any) => void
  onend: () => void
}
