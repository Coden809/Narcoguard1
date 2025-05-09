"use client"

import { useState } from "react"
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

export function AccessibilityMenu() {
  const [fontSize, setFontSize] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [screenReader, setScreenReader] = useState(false)

  const updateFontSize = (value: number[]) => {
    setFontSize(value[0])
    document.documentElement.style.setProperty("--font-size-multiplier", `${value[0] / 100}`)
  }

  const updateContrast = (value: number[]) => {
    setContrast(value[0])
    document.documentElement.style.setProperty("--contrast-multiplier", `${value[0] / 100}`)
  }

  const toggleReducedMotion = (checked: boolean) => {
    setReducedMotion(checked)
    if (checked) {
      document.documentElement.classList.add("reduce-motion")
    } else {
      document.documentElement.classList.remove("reduce-motion")
    }
  }

  const toggleScreenReader = (checked: boolean) => {
    setScreenReader(checked)
    // This would typically integrate with a screen reader API
    console.log("Screen reader:", checked)
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
