"use client"

import { useState, useEffect } from "react"
import { AnimationToggle } from "@/components/animation-toggle"
import { AccessibilityMenu } from "@/components/accessibility-menu"

export default function AccessibilityControls() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
      <AccessibilityMenu />
      <div className="bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-md border border-border">
        <AnimationToggle />
      </div>
    </div>
  )
}
