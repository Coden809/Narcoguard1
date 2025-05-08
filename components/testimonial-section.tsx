"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

export default function TestimonialSection() {
  const testimonials = [
    {
      quote:
        "Narcoguard saved my brother's life. The app detected his overdose and alerted me while I was at work. I was able to get to him in time with Narcan.",
      name: "Sarah Johnson",
      role: "Family Member",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      quote:
        "As an ER doctor, I've seen the impact of delayed response to overdoses. Narcoguard's technology is a game-changer for getting help to people faster.",
      name: "Dr. Michael Chen",
      role: "Emergency Physician",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      quote:
        "Being part of the Hero Network has allowed me to help save three lives in my community. The app makes it easy to respond quickly when minutes matter.",
      name: "David Rodriguez",
      role: "Hero Network Volunteer",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Lives Saved, Stories Shared</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from people whose lives have been impacted by Narcoguard's technology and community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-primary/40 mb-4" />
                  <p className="mb-6 italic">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
