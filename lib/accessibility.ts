/**
 * Comprehensive accessibility utilities for Narcoguard application
 * This module provides tools and helpers to ensure the application
 * is accessible to users with disabilities.
 */

// Types for accessibility preferences
export interface AccessibilityPreferences {
  reduceMotion: boolean
  highContrast: boolean
  largeText: boolean
  screenReader: boolean
  keyboardNavigation: boolean
  colorBlindMode: ColorBlindMode
  focusIndicators: boolean
  animations: boolean
}

export enum ColorBlindMode {
  NONE = "none",
  PROTANOPIA = "protanopia",
  DEUTERANOPIA = "deuteranopia",
  TRITANOPIA = "tritanopia",
  ACHROMATOPSIA = "achromatopsia",
}

// Default accessibility preferences
export const defaultAccessibilityPreferences: AccessibilityPreferences = {
  reduceMotion: false,
  highContrast: false,
  largeText: false,
  screenReader: false,
  keyboardNavigation: true,
  colorBlindMode: ColorBlindMode.NONE,
  focusIndicators: true,
  animations: true,
}

// Detect system accessibility preferences
export function detectSystemAccessibilityPreferences(): Partial<AccessibilityPreferences> {
  if (typeof window === "undefined") return {}

  const preferences: Partial<AccessibilityPreferences> = {}

  // Detect reduced motion preference
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    preferences.reduceMotion = true
    preferences.animations = false
  }

  // Detect contrast preference
  if (window.matchMedia("(prefers-contrast: more)").matches) {
    preferences.highContrast = true
  }

  // Detect larger text preference
  if (
    window.matchMedia("(prefers-reduced-transparency: reduce)").matches ||
    window.matchMedia("(prefers-contrast: more)").matches
  ) {
    // These are rough proxies for potential text size preferences
    preferences.largeText = true
  }

  return preferences
}

// Apply accessibility classes to document based on preferences
export function applyAccessibilityPreferences(preferences: AccessibilityPreferences): void {
  if (typeof document === "undefined") return

  // Apply or remove classes based on preferences
  document.documentElement.classList.toggle("reduce-motion", preferences.reduceMotion)
  document.documentElement.classList.toggle("high-contrast", preferences.highContrast)
  document.documentElement.classList.toggle("large-text", preferences.largeText)
  document.documentElement.classList.toggle("screen-reader-mode", preferences.screenReader)
  document.documentElement.classList.toggle("keyboard-navigation", preferences.keyboardNavigation)
  document.documentElement.classList.toggle("focus-visible-mode", preferences.focusIndicators)
  document.documentElement.classList.toggle("animations-disabled", !preferences.animations)

  // Remove any existing color blind mode classes
  document.documentElement.classList.remove("protanopia", "deuteranopia", "tritanopia", "achromatopsia")

  // Apply color blind mode if not NONE
  if (preferences.colorBlindMode !== ColorBlindMode.NONE) {
    document.documentElement.classList.add(preferences.colorBlindMode.toLowerCase())
  }

  // Set CSS variables for animation durations
  if (preferences.reduceMotion || !preferences.animations) {
    document.documentElement.style.setProperty("--animation-duration-factor", "0.01")
    document.documentElement.style.setProperty("--transition-duration-factor", "0.01")
  } else {
    document.documentElement.style.setProperty("--animation-duration-factor", "1")
    document.documentElement.style.setProperty("--transition-duration-factor", "1")
  }

  // Set CSS variables for text size
  if (preferences.largeText) {
    document.documentElement.style.setProperty("--text-size-adjust", "1.2")
  } else {
    document.documentElement.style.setProperty("--text-size-adjust", "1")
  }
}

/**
 * Narcoguard Accessibility Utilities
 *
 * This module provides utilities for enhancing application accessibility,
 * including screen reader support, keyboard navigation, and focus management.
 */

// Screen reader announcement utility
export function announceToScreenReader(message: string, priority: "polite" | "assertive" = "polite") {
  if (typeof window === "undefined") return

  // Create or get the announcement element
  let announcementElement = document.getElementById("screen-reader-announcement")

  if (!announcementElement) {
    announcementElement = document.createElement("div")
    announcementElement.id = "screen-reader-announcement"
    announcementElement.setAttribute("aria-live", priority)
    announcementElement.setAttribute("aria-atomic", "true")
    announcementElement.classList.add("sr-only") // Screen reader only
    document.body.appendChild(announcementElement)
  } else {
    // Update the aria-live attribute in case the priority changed
    announcementElement.setAttribute("aria-live", priority)
  }

  // Set the message
  announcementElement.textContent = message

  // Clear the announcement after a delay to prevent screen readers
  // from announcing it multiple times
  setTimeout(() => {
    if (announcementElement) {
      announcementElement.textContent = ""
    }
  }, 3000)
}

// Focus trap utility for modals and dialogs
export function createFocusTrap(containerElement: HTMLElement): {
  activate: () => void
  deactivate: () => void
} {
  if (typeof window === "undefined") return { activate: () => {}, deactivate: () => {} }

  const focusableElements = containerElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )

  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus()
        e.preventDefault()
      }
    }
  }

  return {
    activate: () => {
      containerElement.addEventListener("keydown", handleTabKey)
      firstElement.focus()
    },
    deactivate: () => {
      containerElement.removeEventListener("keydown", handleTabKey)
    },
  }
}

// Keyboard navigation utility
export function enableKeyboardNavigation(selector: string, callback: (element: HTMLElement) => void) {
  if (typeof window === "undefined") return () => {}

  const elements = document.querySelectorAll<HTMLElement>(selector)

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      const target = e.target as HTMLElement
      if (target.matches(selector)) {
        e.preventDefault()
        callback(target)
      }
    }
  }

  document.addEventListener("keydown", handleKeyDown)

  return () => {
    document.removeEventListener("keydown", handleKeyDown)
  }
}

// Skip to content link setup
export function setupSkipToContentLink() {
  if (typeof window === "undefined") return

  const skipLink = document.querySelector(".skip-to-content") as HTMLAnchorElement
  if (!skipLink) return

  skipLink.addEventListener("click", (e) => {
    e.preventDefault()
    const target = document.querySelector("#main-content")
    if (target) {
      target.setAttribute("tabindex", "-1")
      ;(target as HTMLElement).focus()
    }
  })
}

// High contrast mode toggle
export function toggleHighContrastMode(enabled: boolean) {
  if (typeof window === "undefined") return

  if (enabled) {
    document.documentElement.classList.add("high-contrast")
  } else {
    document.documentElement.classList.remove("high-contrast")
  }

  // Announce the change to screen readers
  const message = enabled ? "High contrast mode enabled" : "High contrast mode disabled"
  announceToScreenReader(message)
}

// Initialize accessibility features
export function initializeAccessibility() {
  if (typeof window === "undefined") return

  // Add global styles for accessibility
  const style = document.createElement("style")
  style.textContent = `
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
    
    .skip-to-content {
      position: absolute;
      top: -40px;
      left: 0;
      background: var(--color-primary);
      color: white;
      padding: 8px;
      z-index: 100;
      transition: top 0.2s;
    }
    
    .skip-to-content:focus {
      top: 0;
    }
    
    .high-contrast {
      --contrast-multiplier: 1.5;
    }
    
    :focus {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
    
    :focus:not(:focus-visible) {
      outline: none;
    }
    
    :focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  `

  document.head.appendChild(style)

  // Setup skip to content link
  setupSkipToContentLink()

  // Add screen reader announcement element
  const announcementElement = document.createElement("div")
  announcementElement.id = "screen-reader-announcement"
  announcementElement.setAttribute("aria-live", "polite")
  announcementElement.setAttribute("aria-atomic", "true")
  announcementElement.classList.add("sr-only")
  document.body.appendChild(announcementElement)
}
