"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function BackgroundAnimation() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 1000, height: 1000 })

  useEffect(() => {
    setMounted(true)
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!mounted) return null

  // Generate theme-specific gradient colors
  const getGradientColors = () => {
    switch (theme) {
      case "light":
        return {
          start: "#FFD700", // Gold
          mid: "#FF8C00", // Dark Orange
          end: "#FF4500", // Orange Red
          particle: "rgba(255, 215, 0, 0.8)",
        }
      case "dark":
        return {
          start: "#4B0082", // Indigo
          mid: "#8A2BE2", // Blue Violet
          end: "#9400D3", // Violet
          particle: "rgba(138, 43, 226, 0.8)",
        }
      case "ocean":
        return {
          start: "#00FFFF", // Cyan
          mid: "#00CED1", // Dark Turquoise
          end: "#20B2AA", // Light Sea Green
          particle: "rgba(0, 255, 255, 0.8)",
        }
      case "forest":
        return {
          start: "#00FF00", // Lime
          mid: "#32CD32", // Lime Green
          end: "#228B22", // Forest Green
          particle: "rgba(50, 205, 50, 0.8)",
        }
      case "sunset":
        return {
          start: "#FF4500", // Orange Red
          mid: "#FF1493", // Deep Pink
          end: "#FF00FF", // Magenta
          particle: "rgba(255, 69, 0, 0.8)",
        }
      case "custom":
        return {
          start: "#FF00FF", // Magenta
          mid: "#4169E1", // Royal Blue
          end: "#00FFFF", // Cyan
          particle: "rgba(255, 0, 255, 0.8)",
        }
      default:
        return {
          start: "#4B0082", // Indigo
          mid: "#8A2BE2", // Blue Violet
          end: "#9400D3", // Violet
          particle: "rgba(138, 43, 226, 0.8)",
        }
    }
  }

  const colors = getGradientColors()
  const particles = Array.from({ length: 50 })

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `linear-gradient(45deg, ${colors.start} 0%, ${colors.mid} 50%, ${colors.end} 100%)`,
            `linear-gradient(225deg, ${colors.start} 0%, ${colors.mid} 50%, ${colors.end} 100%)`,
            `linear-gradient(45deg, ${colors.start} 0%, ${colors.mid} 50%, ${colors.end} 100%)`,
          ],
        }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      {/* Overlay to soften the background */}
      <div className="absolute inset-0 bg-background/40" />

      {/* Floating particles */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              background: colors.particle,
              boxShadow: `0 0 10px ${colors.particle}, 0 0 20px ${colors.particle}`,
            }}
            initial={{
              x: Math.random() * windowSize.width,
              y: Math.random() * windowSize.height,
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.6 + 0.2,
            }}
            animate={{
              x: [Math.random() * windowSize.width, Math.random() * windowSize.width, Math.random() * windowSize.width],
              y: [
                Math.random() * windowSize.height,
                Math.random() * windowSize.height,
                Math.random() * windowSize.height,
              ],
              scale: [Math.random() * 0.5 + 0.5, Math.random() * 1 + 1, Math.random() * 0.5 + 0.5],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
            }}
          />
        ))}
      </motion.div>

      {/* Wave effect at the bottom */}
      <svg className="absolute bottom-0 left-0 w-full h-64" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <motion.path
          fill={`url(#gradient-${theme})`}
          fillOpacity="0.3"
          initial={{
            d: "M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,165.3C960,171,1056,149,1152,128C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
          }}
          animate={{
            d: [
              "M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,165.3C960,171,1056,149,1152,128C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,64L48,85.3C96,107,192,149,288,165.3C384,181,480,171,576,144C672,117,768,75,864,80C960,85,1056,139,1152,160C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            ],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
            duration: 20,
            ease: "linear",
          }}
        />
        <defs>
          <linearGradient id={`gradient-${theme}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="50%" stopColor={colors.mid} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
        </defs>
      </svg>

      {/* Additional decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  )
}
