"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface NoSignIconProps {
  className?: string
  size?: number
  animated?: boolean
  strokeWidth?: number
  strokeColor?: string
}

export function NoSignIcon({
  className,
  size = 200,
  animated = true,
  strokeWidth = 4,
  strokeColor = "#ff3333",
}: NoSignIconProps) {
  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ width: size, height: size }}
      aria-label="Say no to drug overdose"
    >
      {/* Narcoguard Icon */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
        <Image
          src="/images/narcoguard-icon.png"
          alt="Narcoguard"
          width={size * 0.9}
          height={size * 0.9}
          className="object-cover rounded-full"
          priority
        />
      </div>

      {/* Red Circle with Diagonal Line (No Sign) */}
      <div className="absolute inset-0">
        {animated ? (
          <motion.svg
            viewBox="0 0 100 100"
            width={size}
            height={size}
            initial={{ opacity: 0.7, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            {/* Circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2 }}
            />
            {/* Diagonal Line */}
            <motion.line
              x1="18"
              y1="18"
              x2="82"
              y2="82"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </motion.svg>
        ) : (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            {/* Circle */}
            <circle cx="50" cy="50" r="48" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Diagonal Line */}
            <line x1="18" y1="18" x2="82" y2="82" stroke={strokeColor} strokeWidth={strokeWidth} />
          </svg>
        )}
      </div>
    </div>
  )
}
