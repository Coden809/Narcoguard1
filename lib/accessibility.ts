/**
 * Accessibility utilities for Narcoguard application
 */

// Focus trap for modals and dialogs
export function createFocusTrap(element: HTMLElement): {
  activate: () => void
  deactivate: () => void
} {
  let focusableElements: HTMLElement[] = []
  let firstFocusableElement: HTMLElement | null = null
  let lastFocusableElement: HTMLElement | null = null
  let previousActiveElement: HTMLElement | null = null

  const getFocusableElements = () => {
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const elements = element.querySelectorAll(selector)
    return Array.from(elements).filter(
      (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"),
    ) as HTMLElement[]
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return

    // If shift + tab, move focus to the last focusable element when on the first
    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement?.focus()
        e.preventDefault()
      }
    }
    // If tab, move focus to the first focusable element when on the last
    else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement?.focus()
        e.preventDefault()
      }
    }
  }

  return {
    activate: () => {
      previousActiveElement = document.activeElement as HTMLElement
      focusableElements = getFocusableElements()
      firstFocusableElement = focusableElements[0] || null
      lastFocusableElement = focusableElements[focusableElements.length - 1] || null

      // Set initial focus
      firstFocusableElement?.focus()

      // Add event listener
      element.addEventListener("keydown", handleKeyDown)
    },
    deactivate: () => {
      // Remove event listener
      element.removeEventListener("keydown", handleKeyDown)

      // Restore focus
      previousActiveElement?.focus()
    },
  }
}

// Announce messages to screen readers
export function announceToScreenReader(message: string, politeness: "polite" | "assertive" = "polite"): void {
  const announcer = document.createElement("div")
  announcer.setAttribute("aria-live", politeness)
  announcer.setAttribute("aria-atomic", "true")
  announcer.classList.add("sr-only")

  document.body.appendChild(announcer)

  // Use setTimeout to ensure the DOM change is announced
  setTimeout(() => {
    announcer.textContent = message

    // Clean up after announcement
    setTimeout(() => {
      document.body.removeChild(announcer)
    }, 3000)
  }, 100)
}

// Check contrast ratio between two colors
export function getContrastRatio(foreground: string, background: string): number {
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    let r, g, b

    if (color.startsWith("#")) {
      const hex = color.slice(1)
      r = Number.parseInt(hex.slice(0, 2), 16) / 255
      g = Number.parseInt(hex.slice(2, 4), 16) / 255
      b = Number.parseInt(hex.slice(4, 6), 16) / 255
    } else if (color.startsWith("rgb")) {
      const match = color.match(/(\d+),\s*(\d+),\s*(\d+)/)
      if (!match) return 0
      r = Number.parseInt(match[1]) / 255
      g = Number.parseInt(match[2]) / 255
      b = Number.parseInt(match[3]) / 255
    } else {
      return 0
    }

    // Calculate luminance
    const toLinear = (val: number) => {
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
    }

    r = toLinear(r)
    g = toLinear(g)
    b = toLinear(b)

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const luminance1 = getLuminance(foreground)
  const luminance2 = getLuminance(background)

  const lighter = Math.max(luminance1, luminance2)
  const darker = Math.min(luminance1, luminance2)

  return (lighter + 0.05) / (darker + 0.05)
}

// Check if contrast meets WCAG standards
export function meetsContrastStandards(
  ratio: number,
  level: "AA" | "AAA" = "AA",
  size: "normal" | "large" = "normal",
): boolean {
  if (level === "AA") {
    return size === "normal" ? ratio >= 4.5 : ratio >= 3
  } else {
    return size === "normal" ? ratio >= 7 : ratio >= 4.5
  }
}

// Add keyboard navigation to custom components
export function enableKeyboardNavigation(
  element: HTMLElement,
  selector: string,
  callback: (el: HTMLElement) => void,
): () => void {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      callback(e.currentTarget as HTMLElement)
    }
  }

  const elements = element.querySelectorAll(selector)
  elements.forEach((el) => {
    el.setAttribute("tabindex", "0")
    el.setAttribute("role", "button")
    el.addEventListener("keydown", handleKeyDown)
  })

  // Return cleanup function
  return () => {
    elements.forEach((el) => {
      el.removeEventListener("keydown", handleKeyDown)
    })
  }
}
