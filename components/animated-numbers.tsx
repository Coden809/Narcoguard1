"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface AnimatedNumbersProps {
  value: number
  duration: number
  label: string
  isInView: boolean
}

const AnimatedNumbers: React.FC<AnimatedNumbersProps> = ({ value, duration, label, isInView }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (isInView) {
      let start = 0
      const end = value
      const incrementTime = (duration / end) * 1000

      const timer = setInterval(() => {
        start += 1
        setCount(start)
        if (start === end) clearInterval(timer)
      }, incrementTime)

      return () => {
        clearInterval(timer)
      }
    }
  }, [value, duration, isInView])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <motion.span
        className="text-4xl md:text-5xl font-bold text-primary"
        key={count}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {count.toLocaleString()}
      </motion.span>
      <p className="text-lg text-muted-foreground mt-2">{label}</p>
    </motion.div>
  )
}

export default AnimatedNumbers
