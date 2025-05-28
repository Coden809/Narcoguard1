"use client"

import { motion } from "framer-motion"
import { Shield, Heart, Zap, Watch, Users, Bell, Syringe } from "lucide-react"
import { useEffect } from "react"

export default function Introduction({ speak }: { speak: (text: string) => void }) {
  useEffect(() => {
    const textContent = document.getElementById("introduction-content")?.textContent || ""
    speak(textContent)
  }, [speak])

  const features = [
    { icon: Shield, text: "Protect yourself and others", color: "text-fuchsia-400" },
    { icon: Heart, text: "Quick access to life-saving resources", color: "text-red-400" },
    { icon: Zap, text: "Instant emergency response", color: "text-amber-400" },
    { icon: Watch, text: "Prequel to Narcoguard 2 smartwatch", color: "text-orange-400" },
    { icon: Users, text: "Join a network of heroes", color: "text-green-400" },
    { icon: Bell, text: "Real-time alerts and notifications", color: "text-blue-400" },
    { icon: Syringe, text: "Future auto-injecting technology", color: "text-purple-400" },
  ]

  return (
    <motion.div
      id="introduction-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-white space-y-6 bg-gradient-to-br from-indigo-600/30 via-purple-600/30 to-pink-500/30 p-6 rounded-lg backdrop-blur-md border border-white/20"
    >
      <motion.h2
        className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-orange-400 to-amber-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Welcome to Narcoguard: The Prequel to Life-Saving Innovation!
      </motion.h2>
      <motion.p
        className="text-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        I'm Guardian AIngel, your pocket-sized superhero for opioid overdose emergencies! I'm here to guide you through
        the setup process of Narcoguard, the groundbreaking prequel to our revolutionary Narcoguard 2 smartwatch.
      </motion.p>
      <motion.p
        className="text-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Narcoguard is more than just an app - it's the software foundation that will power Narcoguard 2, our upcoming
        naloxone auto-injecting smartwatch. This innovative wearable device will be activated when someone flatlines or
        overdoses, providing immediate, life-saving intervention.
      </motion.p>
      <motion.p
        className="text-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        By using Narcoguard now, you're not only protecting yourself and others today, but you're also helping us refine
        the technology that will save countless lives tomorrow. Let's set up emergency contacts, learn about naloxone,
        and prepare you for the future of overdose prevention!
      </motion.p>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center text-center p-6 bg-white/10 rounded-lg backdrop-blur-md"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            >
              <feature.icon className={`w-12 h-12 mb-4 ${feature.color}`} />
            </motion.div>
            <p className="font-semibold text-lg">{feature.text}</p>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        className="mt-8 p-6 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 rounded-lg backdrop-blur-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-amber-400">
          Narcoguard 2: The Future of Overdose Prevention
        </h3>
        <p className="text-lg mb-4">
          Narcoguard 2 will be a game-changing smartwatch that combines advanced monitoring with automatic naloxone
          injection. Here's how it will work:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.7 }}>
            Continuous vital sign monitoring
          </motion.li>
          <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.8 }}>
            Instant detection of overdose or flatlining
          </motion.li>
          <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.9 }}>
            Automatic naloxone injection when needed
          </motion.li>
          <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.0 }}>
            Immediate alert to emergency services and contacts
          </motion.li>
        </ul>
      </motion.div>
      <motion.p
        className="mt-8 text-center font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-orange-400 to-amber-400"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.2, duration: 0.5 }}
      >
        <motion.span animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
          Ready to be part of the future of overdose prevention? Let's get started with Narcoguard!
        </motion.span>
      </motion.p>
    </motion.div>
  )
}
