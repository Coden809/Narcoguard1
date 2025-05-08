"use client"

import { motion } from "framer-motion"
import { Shield, Bell, MapPin, Heart, Clock, Phone } from "lucide-react"

export default function FeatureSection() {
  const features = [
    {
      icon: Shield,
      title: "Overdose Detection",
      description: "Advanced algorithms detect signs of overdose through wearable devices and smartphone sensors.",
    },
    {
      icon: Bell,
      title: "Automatic Alerts",
      description: "Sends immediate notifications to emergency contacts when an overdose is detected.",
    },
    {
      icon: MapPin,
      title: "Location Sharing",
      description: "Automatically shares your precise location with emergency responders and trusted contacts.",
    },
    {
      icon: Heart,
      title: "Hero Network",
      description: "Connects users with nearby volunteers carrying naloxone for rapid response.",
    },
    {
      icon: Clock,
      title: "24/7 Monitoring",
      description: "Continuous monitoring provides peace of mind for users and their loved ones.",
    },
    {
      icon: Phone,
      title: "Emergency Services",
      description: "One-touch emergency calling with automatic information sharing to 911 services.",
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Life-Saving Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Narcoguard combines cutting-edge technology with community response to create a comprehensive overdose
            prevention system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-lg p-6 shadow-sm border border-border"
            >
              <div className="mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
