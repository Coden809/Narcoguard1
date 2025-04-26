"use client"

import { motion } from "framer-motion"

interface ProgressTrackerProps {
  currentStep: number
  totalSteps: number
}

export default function ProgressTracker({ currentStep, totalSteps }: ProgressTrackerProps) {
  return (
    <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mt-4">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
        initial={{ width: 0 }}
        animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  )
}
