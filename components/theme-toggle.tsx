"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sun, Moon, Laptop, Droplet, Leaf, Flame, Palette } from "lucide-react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-[1.2rem] w-[1.2rem]" />
      case "dark":
        return <Moon className="h-[1.2rem] w-[1.2rem]" />
      case "ocean":
        return <Droplet className="h-[1.2rem] w-[1.2rem]" />
      case "forest":
        return <Leaf className="h-[1.2rem] w-[1.2rem]" />
      case "sunset":
        return <Flame className="h-[1.2rem] w-[1.2rem]" />
      case "custom":
        return <Palette className="h-[1.2rem] w-[1.2rem]" />
      default:
        return <Laptop className="h-[1.2rem] w-[1.2rem]" />
    }
  }

  const variants = {
    initial: { scale: 0.6, rotate: 0, opacity: 0 },
    animate: { scale: 1, rotate: 360, opacity: 1 },
    exit: { scale: 0.6, rotate: 0, opacity: 0 },
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative overflow-hidden">
          <motion.div
            key={theme}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.35 }}
          >
            {getIcon()}
          </motion.div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2 cursor-pointer">
          <Sun className="h-4 w-4" />
          <span>Light</span>
          {theme === "light" && (
            <motion.div className="absolute right-2 h-2 w-2 rounded-full bg-primary" layoutId="theme-indicator" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2 cursor-pointer">
          <Moon className="h-4 w-4" />
          <span>Dark</span>
          {theme === "dark" && (
            <motion.div className="absolute right-2 h-2 w-2 rounded-full bg-primary" layoutId="theme-indicator" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("ocean")} className="flex items-center gap-2 cursor-pointer">
          <Droplet className="h-4 w-4" />
          <span>Ocean</span>
          {theme === "ocean" && (
            <motion.div className="absolute right-2 h-2 w-2 rounded-full bg-primary" layoutId="theme-indicator" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("forest")} className="flex items-center gap-2 cursor-pointer">
          <Leaf className="h-4 w-4" />
          <span>Forest</span>
          {theme === "forest" && (
            <motion.div className="absolute right-2 h-2 w-2 rounded-full bg-primary" layoutId="theme-indicator" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("sunset")} className="flex items-center gap-2 cursor-pointer">
          <Flame className="h-4 w-4" />
          <span>Sunset</span>
          {theme === "sunset" && (
            <motion.div className="absolute right-2 h-2 w-2 rounded-full bg-primary" layoutId="theme-indicator" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-2 cursor-pointer">
          <Laptop className="h-4 w-4" />
          <span>System</span>
          {theme === "system" && (
            <motion.div className="absolute right-2 h-2 w-2 rounded-full bg-primary" layoutId="theme-indicator" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
