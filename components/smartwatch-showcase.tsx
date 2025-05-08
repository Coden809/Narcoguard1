"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SmartWatchProps {
  className?: string
}

export function SmartWatchShowcase({ className }: SmartWatchProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const watches = [
    {
      name: "Narcoguard 2 - Obsidian",
      description: "Premium model with advanced health monitoring",
      features: ["Heart rate monitoring", "Blood oxygen", "Fall detection", "Emergency alerts"],
      image: "/placeholder.svg?height=400&width=400",
      color: "bg-black",
    },
    {
      name: "Narcoguard 2 - Silver",
      description: "Sleek design with all essential features",
      features: ["Heart rate monitoring", "Emergency alerts", "GPS tracking", "Water resistant"],
      image: "/placeholder.svg?height=400&width=400",
      color: "bg-gray-200",
    },
    {
      name: "Narcoguard 2 - Rose Gold",
      description: "Elegant design with premium features",
      features: ["Heart rate monitoring", "Blood oxygen", "Emergency alerts", "Sleep tracking"],
      image: "/placeholder.svg?height=400&width=400",
      color: "bg-rose-200",
    },
  ]

  const nextWatch = () => {
    setActiveIndex((prev) => (prev + 1) % watches.length)
  }

  const prevWatch = () => {
    setActiveIndex((prev) => (prev - 1 + watches.length) % watches.length)
  }

  return (
    <div className={cn("relative overflow-hidden py-10", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background z-0"></div>

      <div className="relative z-10 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Introducing Narcoguard 2</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Our next-generation smartwatch designed to save lives with advanced monitoring and alert systems
        </p>

        <div className="flex items-center justify-center mb-8">
          <Button variant="outline" size="icon" onClick={prevWatch} className="mr-4" aria-label="Previous watch">
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <div className="relative">
            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
              <div className={cn("absolute inset-0 rounded-full", watches[activeIndex].color)}>
                <div className="absolute inset-[10%] rounded-full bg-black flex items-center justify-center overflow-hidden">
                  <div className="relative w-full h-full">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%201%2C%202025%2C%2005_14_06%20AM-Jsi3fp5WhwwqBkTJTUh5EDcRJxPBGd.png"
                      alt="Narcoguard Guardian"
                      fill
                      className="object-cover opacity-70"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <div className="text-xs mb-1">12:45</div>
                      <div className="text-xs mb-2">HEART RATE: 72 BPM</div>
                      <div className="text-[10px] bg-green-500 px-2 py-0.5 rounded-full mb-1">STATUS: NORMAL</div>
                    </div>
                  </div>
                </div>
                <div className="absolute right-[15%] top-[50%] translate-y-[-50%] w-[10%] h-[30%] rounded-full bg-gray-800"></div>
              </div>
            </div>
          </div>

          <Button variant="outline" size="icon" onClick={nextWatch} className="ml-4" aria-label="Next watch">
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-2">{watches[activeIndex].name}</h3>
            <p className="text-muted-foreground mb-4">{watches[activeIndex].description}</p>
            <ul className="space-y-2">
              {watches[activeIndex].features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground mb-4">Coming soon. Support our development by donating today.</p>
          <Button asChild>
            <a href="/donate">Support Development</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
