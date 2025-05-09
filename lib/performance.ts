/**
 * Performance utilities for Narcoguard application
 */

// Debounce function to limit how often a function can be called
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function to limit the rate at which a function can fire
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Measure performance of a function
export function measurePerformance<T extends (...args: any[]) => any>(
  func: T,
  label: string,
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    const start = performance.now()
    const result = func(...args)
    const end = performance.now()

    if (process.env.NODE_ENV === "development") {
      console.log(`${label} took ${end - start}ms`)
    }

    return result
  }
}

// Lazy load images
export function lazyLoadImage(
  imageElement: HTMLImageElement,
  src: string,
  placeholder = "/placeholder.svg?height=100&width=100",
): void {
  // Set placeholder initially
  imageElement.src = placeholder

  // Create new image to preload
  const img = new Image()
  img.src = src

  // When image is loaded, replace placeholder
  img.onload = () => {
    imageElement.src = src
    imageElement.classList.add("loaded")
  }
}

// Check if intersection observer is supported
export const supportsIntersectionObserver = typeof IntersectionObserver !== "undefined"

// Create a simple intersection observer for lazy loading
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = { rootMargin: "200px 0px" },
): IntersectionObserver | null {
  if (!supportsIntersectionObserver) return null
  return new IntersectionObserver(callback, options)
}
