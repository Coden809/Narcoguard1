"use client"

import { motion } from "framer-motion"
import { Phone } from "lucide-react"

export default function EmergencyFAB() {
  return (
    <motion.button
      className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-full shadow-lg"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Phone className="w-6 h-6" />
    </motion.button>
  )
}
