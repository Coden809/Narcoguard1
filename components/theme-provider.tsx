"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useEffect } from "react"
import { announceToScreenReader } from "@/lib/accessibility"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Announce theme changes to screen readers
  useEffect(() => {
    const handleThemeChange = () => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || document.documentElement.classList.contains("dark")
          ? "dark"
          : "light"
      announceToScreenReader(`Theme changed to ${currentTheme} mode`, "polite")
    }

    // Listen for theme changes
    window.addEventListener("themeChange", handleThemeChange)

    return () => {
      window.removeEventListener("themeChange", handleThemeChange)
    }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
