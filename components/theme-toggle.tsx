"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sun, Moon, Laptop, Droplet, Leaf, Flame, Palette } from "lucide-react"
import { useEffect, useState } from "react"

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {getIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("ocean")}>
          <Droplet className="mr-2 h-4 w-4" />
          <span>Ocean</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("forest")}>
          <Leaf className="mr-2 h-4 w-4" />
          <span>Forest</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("sunset")}>
          <Flame className="mr-2 h-4 w-4" />
          <span>Sunset</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("custom")}>
          <Palette className="mr-2 h-4 w-4" />
          <span>Custom</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
