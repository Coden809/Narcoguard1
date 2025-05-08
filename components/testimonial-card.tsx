"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

interface TestimonialCardProps {
  name: string
  role: string
  content: string
  avatar: string
  delay?: number
}

export default function TestimonialCard({ name, role, content, avatar, delay = 0 }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-full">
        <CardContent className="pt-6">
          <Quote className="h-8 w-8 text-primary/20 mb-4" />
          <p className="text-muted-foreground">{content}</p>
        </CardContent>
        <CardFooter className="flex items-center space-x-4 border-t pt-4">
          <Avatar>
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
