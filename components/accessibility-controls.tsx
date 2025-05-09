"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accessibility, Type, MousePointer, Eye, Volume2 } from "lucide-react"
import { createFocusTrap } from "@/lib/accessibility"

export default function AccessibilityControls() {
  const [fontSize, setFontSize] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [dyslexicFont, setDyslexicFont] = useState(false)
  const [cursorSize, setCursorSize] = useState(16)
  const [isOpen, setIsOpen] = useState(false)
  const [focusTrap, setFocusTrap] = useState<{ activate: () => void; deactivate: () => void } | null>(null)

  // Initialize focus trap
  useEffect(() => {
    if (isOpen && !focusTrap) {
      const popoverContent = document.querySelector("[data-accessibility-controls]")
      if (popoverContent) {
        setFocusTrap(createFocusTrap(popoverContent as HTMLElement))
      }
    }
  }, [isOpen, focusTrap])

  // Activate/deactivate focus trap
  useEffect(() => {
    if (isOpen && focusTrap) {
      focusTrap.activate()
    } else if (!isOpen && focusTrap) {
      focusTrap.deactivate()
    }
  }, [isOpen, focusTrap])

  // Apply accessibility settings
  useEffect(() => {
    // Font size
    document.documentElement.style.setProperty("--font-size-multiplier", `${fontSize / 100}`)

    // Contrast
    document.documentElement.style.setProperty("--contrast-multiplier", `${contrast / 100}`)

    // Reduced motion
    if (reduceMotion) {
      document.documentElement.classList.add("reduce-motion")
    } else {
      document.documentElement.classList.remove("reduce-motion")
    }

    // High contrast
    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    // Dyslexic font
    if (dyslexicFont) {
      document.documentElement.classList.add("dyslexic-font")
    } else {
      document.documentElement.classList.remove("dyslexic-font")
    }

    // Cursor size
    document.documentElement.style.setProperty("--cursor-size", `${cursorSize}px`)
  }, [fontSize, contrast, reduceMotion, highContrast, dyslexicFont, cursorSize])

  // Load saved preferences
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const savedPreferences = localStorage.getItem("accessibility-preferences")
      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences)
        setFontSize(preferences.fontSize || 100)
        setContrast(preferences.contrast || 100)
        setReduceMotion(preferences.reduceMotion || false)
        setHighContrast(preferences.highContrast || false)
        setDyslexicFont(preferences.dyslexicFont || false)
        setCursorSize(preferences.cursorSize || 16)
      }
    } catch (error) {
      console.error("Error loading accessibility preferences:", error)
    }
  }, [])

  // Save preferences
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(
        "accessibility-preferences",
        JSON.stringify({
          fontSize,
          contrast,
          reduceMotion,
          highContrast,
          dyslexicFont,
          cursorSize,
        }),
      )
    } catch (error) {
      console.error("Error saving accessibility preferences:", error)
    }
  }, [fontSize, contrast, reduceMotion, highContrast, dyslexicFont, cursorSize])

  const resetSettings = () => {
    setFontSize(100)
    setContrast(100)
    setReduceMotion(false)
    setHighContrast(false)
    setDyslexicFont(false)
    setCursorSize(16)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-24 right-4 z-50 rounded-full shadow-lg"
          aria-label="Accessibility controls"
        >
          <Accessibility className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" data-accessibility-controls side="top" align="end" sideOffset={16}>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Accessibility Settings</h2>
          <p className="text-sm text-muted-foreground">Customize your experience</p>
        </div>
        <Tabs defaultValue="text">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="text" className="flex flex-col items-center py-2">
              <Type className="h-4 w-4 mb-1" />
              <span className="text-xs">Text</span>
            </TabsTrigger>
            <TabsTrigger value="vision" className="flex flex-col items-center py-2">
              <Eye className="h-4 w-4 mb-1" />
              <span className="text-xs">Vision</span>
            </TabsTrigger>
            <TabsTrigger value="motion" className="flex flex-col items-center py-2">
              <MousePointer className="h-4 w-4 mb-1" />
              <span className="text-xs">Motion</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex flex-col items-center py-2">
              <Volume2 className="h-4 w-4 mb-1" />
              <span className="text-xs">Audio</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="font-size">Font Size ({fontSize}%)</Label>
              </div>
              <Slider
                id="font-size"
                min={75}
                max={200}
                step={5}
                value={[fontSize]}
                onValueChange={(value) => setFontSize(value[0])}
                aria-label="Font size"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="dyslexic-font" checked={dyslexicFont} onCheckedChange={setDyslexicFont} />
              <Label htmlFor="dyslexic-font">Dyslexia-friendly font</Label>
            </div>
          </TabsContent>

          <TabsContent value="vision" className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="contrast">Contrast ({contrast}%)</Label>
              </div>
              <Slider
                id="contrast"
                min={75}
                max={150}
                step={5}
                value={[contrast]}
                onValueChange={(value) => setContrast(value[0])}
                aria-label="Contrast"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
              <Label htmlFor="high-contrast">High contrast mode</Label>
            </div>
          </TabsContent>

          <TabsContent value="motion" className="p-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="reduce-motion" checked={reduceMotion} onCheckedChange={setReduceMotion} />
              <Label htmlFor="reduce-motion">Reduce motion</Label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="cursor-size">Cursor Size ({cursorSize}px)</Label>
              </div>
              <Slider
                id="cursor-size"
                min={16}
                max={64}
                step={4}
                value={[cursorSize]}
                onValueChange={(value) => setCursorSize(value[0])}
                aria-label="Cursor size"
              />
            </div>
          </TabsContent>

          <TabsContent value="audio" className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="audio-volume">Audio Volume</Label>
              </div>
              <Slider id="audio-volume" min={0} max={100} step={5} defaultValue={[100]} aria-label="Audio volume" />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="captions" />
              <Label htmlFor="captions">Always show captions</Label>
            </div>
          </TabsContent>
        </Tabs>

        <div className="p-4 border-t flex justify-between">
          <Button variant="outline" size="sm" onClick={resetSettings}>
            Reset
          </Button>
          <Button size="sm" onClick={() => setIsOpen(false)}>
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
