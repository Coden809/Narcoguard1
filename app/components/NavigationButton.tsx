"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface NavigationButtonProps {
  onClick: () => void
  disabled: boolean
  icon: React.ReactNode
  text: string
  gradient: string
}

export default function NavigationButton({ onClick, disabled, icon, text, gradient }: NavigationButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        onClick={onClick}
        disabled={disabled}
        className={`relative overflow-hidden group bg-white/20 hover:bg-white/30 border border-white/50 rounded-full px-6 py-2 transition-all duration-300`}
        aria-label={text}
      >
        <span className="relative z-10 flex items-center text-white">
          {icon}
          {text}
        </span>
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${gradient}`}
          initial={{ x: text === "Previous" ? "100%" : "-100%" }}
          whileHover={{ x: 0 }}
          transition={{ duration: 0.3 }}
        />
      </Button>
    </motion.div>
  )
}
