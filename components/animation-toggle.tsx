"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { announceToScreenReader } from "@/lib/accessibility"

interface AnimationToggleProps {
  className?: string
}

export function AnimationToggle({ className = "" }: AnimationToggleProps) {
  const [animationsEnabled, setAnimationsEnabled] = useLocalStorage<boolean>("narcoguard-animations-enabled", true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      if (animationsEnabled) {
        document.documentElement.classList.remove("animations-disabled")
        announceToScreenReader("Animations enabled")
      } else {
        document.documentElement.classList.add("animations-disabled")
        announceToScreenReader("Animations disabled")
      }
    }
  }, [animationsEnabled, mounted])

  if (!mounted) return null

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setAnimationsEnabled(!animationsEnabled)}
      className={`rounded-full ${className}`}
      aria-label={animationsEnabled ? "Disable animations" : "Enable animations"}
      title={animationsEnabled ? "Disable animations" : "Enable animations"}
    >
      {animationsEnabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
    </Button>
  )
}
