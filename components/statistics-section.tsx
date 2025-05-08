"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Clock, MapPin, Heart } from "lucide-react"

export default function StatisticsSection() {
  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Active Users",
      description: "People protected by Narcoguard technology",
    },
    {
      icon: Clock,
      value: "500+",
      label: "Lives Saved",
      description: "Overdoses detected and reversed",
    },
    {
      icon: MapPin,
      value: "45",
      label: "Cities",
      description: "Communities with Narcoguard coverage",
    },
    {
      icon: Heart,
      value: "2,500+",
      label: "Hero Network",
      description: "Volunteers ready to respond",
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Narcoguard is making a measurable difference in the fight against overdose deaths.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                  <p className="font-medium mb-2">{stat.label}</p>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
