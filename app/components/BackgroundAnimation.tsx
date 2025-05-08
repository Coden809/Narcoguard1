"use client"

import type React from "react"

import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from "framer-motion"
import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useTheme } from "next-themes"
import { debounce } from "lodash"

interface Particle {
  id: number
  x: string
  y: string
  size: number
  duration: number
  delay: number
  opacity: number
  color: string
}

export default function BackgroundAnimation() {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const waveControls = useAnimation()

  // Determine current theme
  const currentTheme = theme === "system" ? systemTheme : theme
  const isDark = currentTheme === "dark"

  // Generate colors based on theme
  const primaryColor = isDark ? "#6366F1" : "#3B82F6"
  const secondaryColor = isDark ? "#8B5CF6" : "#60A5FA"
  const accentColor = isDark ? "#EC4899" : "#F472B6"

  // Motion values for interactive effects
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Transform mouse position to wave effect
  const waveHeight = useTransform(mouseY, [0, dimensions.height], [50, 150])

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setIsReducedMotion(mediaQuery.matches)

    const handleChange = () => setIsReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Handle window resize
  useEffect(() => {
    const handleResize = debounce(() => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }, 200)

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle mouse movement
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        setMousePosition({ x, y })
        mouseX.set(x)
        mouseY.set(y)
      }
    },
    [mouseX, mouseY],
  )

  // Generate particles with memoization
  const particles = useMemo(() => {
    const count = isReducedMotion ? 30 : 80
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.1,
      color: [primaryColor, secondaryColor, accentColor][Math.floor(Math.random() * 3)],
    }))
  }, [isReducedMotion, primaryColor, secondaryColor, accentColor])

  // Animate wave on mouse movement
  useEffect(() => {
    if (!isReducedMotion) {
      waveControls.start({
        d: [
          "M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,165.3C960,171,1056,149,1152,128C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
          "M0,64L48,85.3C96,107,192,149,288,165.3C384,181,480,171,576,144C672,117,768,75,864,80C960,85,1056,139,1152,160C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
          "M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,165.3C960,171,1056,149,1152,128C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
        ],
        transition: {
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          ease: "easeInOut",
        },
      })
    }
  }, [waveControls, isReducedMotion])

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      })
    }
  }, [])

  // Don't render until mounted to prevent hydration issues
  if (!mounted) return null

  // Render optimized animation
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      onMouseMove={isReducedMotion ? undefined : handleMouseMove}
      aria-hidden="true"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-background/80" />

      {/* Particles */}
      <AnimatePresence>
        {!isReducedMotion &&
          particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                x: particle.x,
                y: particle.y,
                opacity: particle.opacity,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, particle.opacity, 0],
                x: [particle.x, `calc(${particle.x} + ${(Math.random() - 0.5) * 20}%)`, particle.x],
                y: [particle.y, `calc(${particle.y} + ${(Math.random() - 0.5) * 20}%)`, particle.y],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                ease: "easeInOut",
              }}
            />
          ))}
      </AnimatePresence>

      {/* Interactive glow effect */}
      {!isReducedMotion && mousePosition.x > 0 && (
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${primaryColor}10 0%, transparent 70%)`,
            x: mousePosition.x - 250,
            y: mousePosition.y - 250,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Wave animation */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg className="w-full h-64" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.3" />
              <stop offset="50%" stopColor={secondaryColor} stopOpacity="0.2" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.3" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background wave */}
          <motion.path
            fill="url(#wave-gradient)"
            fillOpacity="0.2"
            initial={{
              d: "M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,165.3C960,171,1056,149,1152,128C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            }}
            animate={waveControls}
            style={{ filter: "url(#glow)" }}
          />

          {/* Foreground wave with mouse interaction */}
          {!isReducedMotion && (
            <motion.path
              fill="url(#wave-gradient)"
              fillOpacity="0.1"
              initial={{
                d: "M0,240L48,224C96,208,192,176,288,176C384,176,480,208,576,224C672,240,768,240,864,218.7C960,197,1056,155,1152,149.3C1248,144,1344,176,1392,192L1440,208L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              }}
              animate={{
                d: "M0,240L48,224C96,208,192,176,288,176C384,176,480,208,576,224C672,240,768,240,864,218.7C960,197,1056,155,1152,149.3C1248,144,1344,176,1392,192L1440,208L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
              style={{
                y: waveHeight,
                filter: "url(#glow)",
              }}
            />
          )}
        </svg>
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(${isDark ? "white" : "black"} 1px, transparent 1px), linear-gradient(to right, ${isDark ? "white" : "black"} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  )
}
