/**
 * Performance utilities for Narcoguard application
 */

// Debounce function to limit how often a function can be called
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      timeout = null
      func(...args)
    }, wait)
  }
}

// Throttle function with leading and trailing options
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
  options: { leading?: boolean; trailing?: boolean } = { leading: true, trailing: true },
): (...args: Parameters<T>) => void {
  let lastFunc: ReturnType<typeof setTimeout> | null = null
  let lastRan = 0
  const { leading, trailing } = options

  return (...args: Parameters<T>) => {
    const now = Date.now()

    // Handle leading edge call
    if (!lastRan && leading) {
      func(...args)
      lastRan = now
      return
    }

    const remaining = limit - (now - lastRan)

    if (remaining <= 0) {
      // Time elapsed, run function immediately
      if (lastFunc) {
        clearTimeout(lastFunc)
        lastFunc = null
      }

      func(...args)
      lastRan = now
    } else if (trailing && !lastFunc) {
      // Set up trailing edge call
      lastFunc = setTimeout(() => {
        func(...args)
        lastRan = Date.now()
        lastFunc = null
      }, remaining)
    }
  }
}

// Memoize function for expensive calculations
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => string,
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>()

  return (...args: Parameters<T>): ReturnType<T> => {
    // Create cache key
    const key = resolver ? resolver(...args) : JSON.stringify(args)

    // Check if result is cached
    if (cache.has(key)) {
      return cache.get(key)!
    }

    // Calculate result and cache it
    const result = func(...args)
    cache.set(key, result)

    return result
  }
}

// Measure performance of a function with optional sampling
export function measurePerformance<T extends (...args: any[]) => any>(
  func: T,
  label: string,
  options: { sampleRate?: number; detailed?: boolean } = {},
): (...args: Parameters<T>) => ReturnType<T> {
  const { sampleRate = 1, detailed = false } = options

  return (...args: Parameters<T>): ReturnType<T> => {
    // Only measure based on sample rate
    if (Math.random() > sampleRate) {
      return func(...args)
    }

    // Performance measurement
    const start = performance.now()
    const result = func(...args)
    const end = performance.now()
    const duration = end - start

    if (process.env.NODE_ENV === "development") {
      if (detailed) {
        console.group(`Performance: ${label}`)
        console.log(`Duration: ${duration.toFixed(2)}ms`)
        console.log("Arguments:", ...args)
        console.log("Result:", result)
        console.groupEnd()
      } else {
        console.log(`${label} took ${duration.toFixed(2)}ms`)
      }
    }

    // Could send to analytics in production
    if (process.env.NODE_ENV === "production" && duration > 100) {
      // Report slow operations to analytics
      if (typeof window !== "undefined") {
        navigator.sendBeacon(
          "/api/metrics",
          JSON.stringify({
            type: "performance",
            label,
            duration,
            timestamp: Date.now(),
          }),
        )
      }
    }

    return result
  }
}

// Lazy load images with proper error handling and placeholder support
export function lazyLoadImage(
  imageElement: HTMLImageElement,
  src: string,
  options: {
    placeholder?: string
    errorFallback?: string
    onLoad?: () => void
    onError?: (error: unknown) => void
  } = {},
): () => void {
  const {
    placeholder = "/placeholder.svg?height=100&width=100",
    errorFallback = "/placeholder.svg?height=100&width=100&error=true",
    onLoad,
    onError,
  } = options

  // Set placeholder initially
  imageElement.src = placeholder

  // Track if the component is still mounted
  let isMounted = true

  // Create new image to preload
  const img = new Image()

  // Set up load handler
  img.onload = () => {
    if (isMounted) {
      imageElement.src = src
      imageElement.classList.add("loaded")
      onLoad?.()
    }
  }

  // Set up error handler
  img.onerror = (error) => {
    if (isMounted) {
      console.error(`Failed to load image: ${src}`, error)
      imageElement.src = errorFallback
      imageElement.classList.add("error")
      onError?.(error)
    }
  }

  // Start loading
  img.src = src

  // Return cleanup function
  return () => {
    isMounted = false
    img.onload = null
    img.onerror = null
  }
}

// Create a reusable intersection observer for lazy loading
export function createLazyLoadObserver(
  loadCallback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = { rootMargin: "200px 0px", threshold: 0.1 },
): { observe: (element: Element) => void; disconnect: () => void } {
  if (typeof IntersectionObserver === "undefined") {
    // Fallback for browsers without IntersectionObserver
    return {
      observe: (element) => {
        // Immediately load the element
        loadCallback({ target: element } as IntersectionObserverEntry)
      },
      disconnect: () => {},
    }
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadCallback(entry)
        observer.unobserve(entry.target)
      }
    })
  }, options)

  return {
    observe: (element: Element) => observer.observe(element),
    disconnect: () => observer.disconnect(),
  }
}
