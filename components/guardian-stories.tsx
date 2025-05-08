"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

interface Testimonial {
  id: number
  name: string
  role: string
  quote: string
  image: string
}

export function GuardianStories() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Recovered with Narcoguard",
      quote:
        "Narcoguard literally saved my life. The app detected my overdose and alerted my emergency contacts. I wouldn't be here today without it.",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "Hero Network Volunteer",
      quote:
        "Being part of the Hero Network has given me purpose. I've helped save three lives in my community, and it's the most rewarding thing I've ever done.",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Dr. Emily Chen",
      role: "Addiction Specialist",
      quote:
        "As a healthcare professional, I recommend Narcoguard to all my at-risk patients. The technology is impressive, but it's the community aspect that makes the real difference.",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Guardian Stories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real stories from people whose lives have been touched by Narcoguard's mission to prevent overdose and
            support recovery.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-none shadow-lg bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950/50">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-purple-200 dark:border-purple-800 flex-shrink-0">
                      <Image
                        src={testimonials[activeIndex].image || "/placeholder.svg"}
                        alt={testimonials[activeIndex].name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Quote className="h-10 w-10 text-purple-300 dark:text-purple-700 mb-2" />
                      <p className="text-lg mb-4 italic">{testimonials[activeIndex].quote}</p>
                      <div>
                        <h4 className="font-semibold text-lg">{testimonials[activeIndex].name}</h4>
                        <p className="text-muted-foreground">{testimonials[activeIndex].role}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-6 gap-4">
            <Button variant="outline" size="icon" onClick={prevTestimonial} aria-label="Previous testimonial">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === activeIndex ? "bg-purple-600" : "bg-purple-200 dark:bg-purple-800"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={nextTestimonial} aria-label="Next testimonial">
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
