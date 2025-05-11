"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Moon, Sun, Palette, Droplet, Leaf, FlameIcon as Fire, Cloud, Sparkles, Zap, Coffee } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const themes = [
  { name: "light", icon: Sun, gradient: "from-yellow-400 to-orange-500", label: "Light" },
  { name: "dark", icon: Moon, gradient: "from-indigo-500 to-purple-600", label: "Dark" },
  { name: "ocean", icon: Droplet, gradient: "from-blue-400 to-cyan-300", label: "Ocean" },
  { name: "forest", icon: Leaf, gradient: "from-green-400 to-emerald-500", label: "Forest" },
  { name: "sunset", icon: Fire, gradient: "from-orange-400 to-pink-500", label: "Sunset" },
  { name: "sky", icon: Cloud, gradient: "from-sky-400 to-blue-500", label: "Sky" },
  { name: "cosmic", icon: Sparkles, gradient: "from-violet-500 to-fuchsia-500", label: "Cosmic" },
  { name: "electric", icon: Zap, gradient: "from-yellow-300 to-blue-600", label: "Electric" },
  { name: "coffee", icon: Coffee, gradient: "from-amber-700 to-yellow-900", label: "Coffee" },
  { name: "custom", icon: Palette, gradient: "from-fuchsia-500 to-blue-600", label: "Custom" },
]

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && theme) {
      document.documentElement.classList.remove(
        "light",
        "dark",
        "ocean",
        "forest",
        "sunset",
        "custom",
        "sky",
        "cosmic",
        "electric",
        "coffee",
      )
      document.documentElement.classList.add(theme)
      localStorage.setItem("theme", theme)
    }
  }, [theme, mounted])

  if (!mounted) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4">Choose Your Theme</h2>
      <p className="mb-6">
        Let's make sure Narcoguard looks good on your device. Choose from a variety of themes to suit your style and
        preferences.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <TooltipProvider>
          {themes.map((themeOption) => (
            <motion.div key={themeOption.name} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setTheme(themeOption.name)}
                    className={`p-4 rounded-full bg-gradient-to-r ${themeOption.gradient} text-white ${
                      theme === themeOption.name ? "ring-4 ring-primary ring-opacity-50" : ""
                    }`}
                    aria-label={`Set ${themeOption.label} theme`}
                  >
                    <themeOption.icon className="w-8 h-8" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{themeOption.label}</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          ))}
        </TooltipProvider>
      </div>
    </motion.div>
  )
}
