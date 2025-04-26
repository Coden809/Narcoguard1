"use client"

import { AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

export default function EnvironmentWarning() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-yellow-500/20 p-4 rounded-md flex items-center mb-4"
    >
      <AlertTriangle className="text-yellow-500 mr-2" />
      <p className="text-yellow-500">
        Warning: Using fallback encryption key. For production, please set the HIPAA_SECRET_KEY environment variable.
      </p>
    </motion.div>
  )
}
