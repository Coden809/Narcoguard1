"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accessibility, Type, Eye, Volume2 } from "lucide-react"
import { AnimationToggle } from "@/components/animation-toggle"
import { announceToScreenReader } from "@/lib/accessibility"
import { useLocalStorage } from "@/hooks/use-local-storage"

export function AccessibilityMenu() {
  const [fontSize, setFontSize] = useLocalStorage<number>("narcoguard-font-size", 100)
  const [contrast, setContrast] = useLocalStorage<number>("narcoguard-contrast", 100)
  const [reducedMotion, setReducedMotion] = useLocalStorage<boolean>("narcoguard-reduced-motion", false)
  const [screenReader, setScreenReader] = useLocalStorage<boolean>("narcoguard-screen-reader", false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      document.documentElement.style.setProperty("--font-size-multiplier", `${fontSize / 100}`)
      announceToScreenReader(`Font size set to ${fontSize} percent`)
    }
  }, [fontSize, mounted])

  useEffect(() => {
    if (mounted) {
      document.documentElement.style.setProperty("--contrast-multiplier", `${contrast / 100}`)
      announceToScreenReader(`Contrast set to ${contrast} percent`)
    }
  }, [contrast, mounted])

  useEffect(() => {
    if (mounted) {
      if (reducedMotion) {
        document.documentElement.classList.add("reduce-motion")
        announceToScreenReader("Reduced motion enabled")
      } else {
        document.documentElement.classList.remove("reduce-motion")
        announceToScreenReader("Reduced motion disabled")
      }
    }
  }, [reducedMotion, mounted])

  useEffect(() => {
    if (mounted) {
      // This would typically integrate with a screen reader API
      announceToScreenReader(`Screen reader support ${screenReader ? "enabled" : "disabled"}`)
    }
  }, [screenReader, mounted])

  if (!mounted) return null

  const updateFontSize = (value: number[]) => {
    setFontSize(value[0])
  }

  const updateContrast = (value: number[]) => {
    setContrast(value[0])
  }

  const toggleReducedMotion = (checked: boolean) => {
    setReducedMotion(checked)
  }

  const toggleScreenReader = (checked: boolean) => {
    setScreenReader(checked)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full" aria-label="Accessibility options">
          <Accessibility className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Accessibility Options</DialogTitle>
          <DialogDescription>
            Customize your experience to make Narcoguard more accessible for your needs.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="text">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span>Text</span>
            </TabsTrigger>
            <TabsTrigger value="visual" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>Visual</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <span>Audio</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="text" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="font-size">Font Size: {fontSize}%</Label>
              </div>
              <Slider id="font-size" min={75} max={200} step={5} value={[fontSize]} onValueChange={updateFontSize} />
            </div>
          </TabsContent>
          <TabsContent value="visual" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="contrast">Contrast: {contrast}%</Label>
              </div>
              <Slider id="contrast" min={75} max={150} step={5} value={[contrast]} onValueChange={updateContrast} />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="reduced-motion" checked={reducedMotion} onCheckedChange={toggleReducedMotion} />
              <Label htmlFor="reduced-motion">Reduced Motion</Label>
            </div>
            <div className="pt-2 border-t border-border">
              <Label className="block mb-2">Animation Control</Label>
              <AnimationToggle className="mt-1" />
            </div>
          </TabsContent>
          <TabsContent value="audio" className="space-y-4 pt-4">
            <div className="flex items-center space-x-2">
              <Switch id="screen-reader" checked={screenReader} onCheckedChange={toggleScreenReader} />
              <Label htmlFor="screen-reader">Screen Reader Support</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Enable enhanced screen reader support for better navigation and descriptions.
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
