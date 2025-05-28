"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Moon, Sun, Palette, Droplet, Leaf, FlameIcon as Fire } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

const themes = [
  { name: "light", icon: Sun, gradient: "from-yellow-400 to-orange-500" },
  { name: "dark", icon: Moon, gradient: "from-indigo-500 to-purple-600" },
  { name: "ocean", icon: Droplet, gradient: "from-blue-400 to-cyan-300" },
  { name: "forest", icon: Leaf, gradient: "from-green-400 to-emerald-500" },
  { name: "sunset", icon: Fire, gradient: "from-orange-400 to-pink-500" },
  { name: "custom", icon: Palette, gradient: "from-fuchsia-500 to-blue-600" },
]

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && theme) {
      document.documentElement.classList.remove("light", "dark", "ocean", "forest", "sunset", "custom")
      document.documentElement.classList.add(theme)
      localStorage.setItem("theme", theme)
    }
  }, [theme, mounted])

  if (!mounted) {
    return null
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h2 className="text-2xl font-bold mb-4">Choose Your Theme</h2>
      <p className="mb-4">
        Let's make sure Narcoguard looks good on your device. Choose from a variety of themes to suit your style and
        preferences.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {themes.map((themeOption) => (
          <motion.div key={themeOption.name} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={() => setTheme(themeOption.name)}
              className={`p-4 rounded-full bg-gradient-to-r ${themeOption.gradient} text-white`}
            >
              <themeOption.icon className="w-8 h-8" />
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
