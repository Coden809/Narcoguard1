/**
 * Enhanced browser compatibility utilities for Narcoguard application
 */

// Interface for browser info
interface BrowserInfo {
  name: string
  version: string
  os: string
  mobile: boolean
  tablet: boolean
  engine: string
  userAgent: string
}

// Cache feature detection results
const featureDetectionCache = new Map<string, boolean>()

// Check if the browser supports a specific feature with caching
export function supportsFeature(feature: string): boolean {
  // Return from cache if available
  if (featureDetectionCache.has(feature)) {
    return featureDetectionCache.get(feature) as boolean
  }

  let supported = false

  // Feature detection logic
  switch (feature) {
    case "IntersectionObserver":
      supported = typeof IntersectionObserver !== "undefined"
      break
    case "ResizeObserver":
      supported = typeof ResizeObserver !== "undefined"
      break
    case "MutationObserver":
      supported = typeof MutationObserver !== "undefined"
      break
    case "AbortController":
      supported = typeof AbortController !== "undefined"
      break
    case "WebP":
      supported = hasWebPSupport()
      break
    case "AVIF":
      supported = hasAVIFSupport()
      break
    case "WebGL":
      supported = hasWebGLSupport()
      break
    case "WebRTC":
      supported = hasWebRTCSupport()
      break
    case "ServiceWorker":
      supported = "serviceWorker" in navigator
      break
    case "WebShare":
      supported = "share" in navigator
      break
    case "Geolocation":
      supported = "geolocation" in navigator
      break
    case "Notifications":
      supported = "Notification" in window
      break
    case "SpeechRecognition":
      supported = "SpeechRecognition" in window || "webkitSpeechRecognition" in window
      break
    case "PaymentRequest":
      supported = "PaymentRequest" in window
      break
    case "Bluetooth":
      supported = "bluetooth" in navigator
      break
    case "WebUSB":
      supported = "usb" in navigator
      break
    case "WebNFC":
      supported = "NDEFReader" in window
      break
    case "WebXR":
      supported = "xr" in navigator
      break
    case "StorageManager":
      supported = "storage" in navigator && "estimate" in navigator.storage
      break
    case "ScreenOrientation":
      supported = "screen" in window && "orientation" in window.screen
      break
    case "VibrationAPI":
      supported = "vibrate" in navigator
      break
    case "NetworkInformation":
      supported = "connection" in navigator && "type" in (navigator as any).connection
      break
    case "BatteryAPI":
      supported = "getBattery" in navigator
      break
    case "WebAnimations":
      supported = "animate" in document.createElement("div")
      break
    case "PictureInPicture":
      supported = "pictureInPictureEnabled" in document
      break
    case "PageVisibility":
      supported = "hidden" in document
      break
    case "IndexedDB":
      supported = "indexedDB" in window
      break
    default:
      supported = false
  }

  // Cache the result
  featureDetectionCache.set(feature, supported)

  return supported
}

// Run async feature detection tests
export async function runAsyncFeatureDetection(): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {}

  // Test clipboard features (requires user activation)
  try {
    results.ClipboardRead = "clipboard" in navigator && "readText" in navigator.clipboard
    results.ClipboardWrite = "clipboard" in navigator && "writeText" in navigator.clipboard
  } catch (error) {
    results.ClipboardRead = false
    results.ClipboardWrite = false
  }

  // Test WebGL2
  try {
    const canvas = document.createElement("canvas")
    results.WebGL2 = Boolean(canvas.getContext("webgl2"))
  } catch (error) {
    results.WebGL2 = false
  }

  // Test audio formats
  try {
    const audio = document.createElement("audio")
    results.AudioMP3 = audio.canPlayType("audio/mpeg").replace(/no/, "") !== ""
    results.AudioOGG = audio.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, "") !== ""
    results.AudioWAV = audio.canPlayType('audio/wav; codecs="1"').replace(/no/, "") !== ""
  } catch (error) {
    results.AudioMP3 = false
    results.AudioOGG = false
    results.AudioWAV = false
  }

  // Test video formats
  try {
    const video = document.createElement("video")
    results.VideoMP4 = video.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/no/, "") !== ""
    results.VideoWebM = video.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/no/, "") !== ""
  } catch (error) {
    results.VideoMP4 = false
    results.VideoWebM = false
  }

  // Add more async tests if needed

  return results
}

// Check WebP support
function hasWebPSupport(): boolean {
  try {
    const canvas = document.createElement("canvas")
    if (canvas.getContext && canvas.getContext("2d")) {
      // Check for WebP support
      return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0
    }
  } catch (e) {
    console.warn("WebP detection failed", e)
  }
  return false
}

// Check AVIF support
function hasAVIFSupport(): boolean {
  try {
    const img = new Image()
    img.src =
      "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeXhpAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A="
    return img.complete
  } catch (e) {
    console.warn("AVIF detection failed", e)
    return false
  }
}

// Check WebGL support
function hasWebGLSupport(): boolean {
  try {
    const canvas = document.createElement("canvas")
    const contexts = ["webgl", "experimental-webgl", "webgl2", "experimental-webgl2"]

    // Try different context names
    for (const name of contexts) {
      try {
        const context = canvas.getContext(name)
        if (context) {
          return true
        }
      } catch (e) {
        // Ignore errors and try next context
      }
    }

    return false
  } catch (e) {
    console.warn("WebGL detection failed", e)
    return false
  }
}

// Check WebRTC support
function hasWebRTCSupport(): boolean {
  return (
    typeof RTCPeerConnection !== "undefined" &&
    typeof navigator.mediaDevices !== "undefined" &&
    typeof navigator.mediaDevices.getUserMedia !== "undefined"
  )
}

// Get detailed browser information
export function getBrowserInfo(): BrowserInfo {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      name: "Unknown",
      version: "Unknown",
      os: "Unknown",
      mobile: false,
      tablet: false,
      engine: "Unknown",
      userAgent: "",
    }
  }

  const userAgent = navigator.userAgent
  let name = "Unknown"
  let version = "Unknown"
  let os = "Unknown"
  let mobile = false
  let tablet = false
  let engine = "Unknown"

  // Detect browser name
  if (userAgent.indexOf("Firefox") > -1) {
    name = "Firefox"
    engine = "Gecko"
  } else if (userAgent.indexOf("SamsungBrowser") > -1) {
    name = "Samsung Browser"
    engine = "Blink"
  } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
    name = "Opera"
    engine = "Blink"
  } else if (userAgent.indexOf("Edg") > -1) {
    name = "Edge"
    engine = "Blink"
  } else if (userAgent.indexOf("Chrome") > -1) {
    name = "Chrome"
    engine = "Blink"
  } else if (userAgent.indexOf("Safari") > -1) {
    name = "Safari"
    engine = "WebKit"
  } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
    name = "Internet Explorer"
    engine = "Trident"
  }

  // Detect browser version
  const nameOffset =
    userAgent.indexOf(name === "Edge" ? "Edge" : name === "Internet Explorer" ? "MSIE" : name) +
    (name === "Internet Explorer" ? 4 : name.length)

  if (name === "Firefox") {
    version = userAgent.substring(nameOffset + 1)
  } else if (name === "Safari") {
    version = userAgent.substring(userAgent.indexOf("Version/") + 8)
  } else if (name === "Chrome") {
    version = userAgent.substring(nameOffset + 1)
  } else if (name === "Opera") {
    version =
      userAgent.indexOf("Version") !== -1
        ? userAgent.substring(userAgent.indexOf("Version") + 8)
        : userAgent.substring(nameOffset + 1)
  } else if (name === "Edge") {
    version =
      userAgent.indexOf("Edge") !== -1
        ? userAgent.substring(userAgent.indexOf("Edge") + 5)
        : userAgent.substring(userAgent.indexOf("Edg") + 4)
  } else if (name === "Internet Explorer") {
    version =
      userAgent.indexOf("MSIE") !== -1
        ? userAgent.substring(userAgent.indexOf("MSIE") + 5)
        : userAgent.substring(userAgent.indexOf("rv:") + 3)
  }

  if (version.indexOf(";") !== -1) version = version.substring(0, version.indexOf(";"))
  if (version.indexOf(" ") !== -1) version = version.substring(0, version.indexOf(" "))
  if (version.indexOf(")") !== -1) version = version.substring(0, version.indexOf(")"))

  // Detect OS
  if (userAgent.indexOf("Windows") !== -1) {
    os = "Windows"
    if (userAgent.indexOf("Windows NT 10.0") !== -1) os = "Windows 10/11"
    else if (userAgent.indexOf("Windows NT 6.3") !== -1) os = "Windows 8.1"
    else if (userAgent.indexOf("Windows NT 6.2") !== -1) os = "Windows 8"
    else if (userAgent.indexOf("Windows NT 6.1") !== -1) os = "Windows 7"
  } else if (userAgent.indexOf("Mac") !== -1) {
    os = "macOS"
    if (userAgent.indexOf("iPad") !== -1) {
      os = "iPadOS"
      tablet = true
    } else if (userAgent.indexOf("iPhone") !== -1) {
      os = "iOS"
      mobile = true
    }
  } else if (userAgent.indexOf("Android") !== -1) {
    os = "Android"
    mobile = true
    // Check if Android tablet
    if (userAgent.indexOf("Mobile") === -1) {
      tablet = true
      mobile = false
    }
  } else if (userAgent.indexOf("Linux") !== -1) {
    os = "Linux"
  } else if (userAgent.indexOf("iOS") !== -1) {
    os = "iOS"
    mobile = true
  } else if (userAgent.indexOf("iPadOS") !== -1) {
    os = "iPadOS"
    tablet = true
  }

  // Check if mobile
  if (!mobile && !tablet) {
    mobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)

    // Distinguish between tablets and mobile phones
    if (mobile && /iPad|Android/i.test(userAgent) && !/Mobile/i.test(userAgent)) {
      tablet = true
      mobile = false
    }
  }

  return { name, version, os, mobile, tablet, engine, userAgent }
}

// Apply polyfills based on browser
export function applyPolyfills(): void {
  // Polyfill for Element.prototype.closest
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (s: string) {
      let el = this
      do {
        if (el.matches(s)) return el
        el = el.parentElement || (el.parentNode as Element)
      } while (el !== null && el.nodeType === 1)
      return null
    }
  }

  // Polyfill for Element.prototype.matches
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function (s) {
        const matches = (this.document || this.ownerDocument).querySelectorAll(s)
        let i = matches.length
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1
      }
  }

  // Polyfill for requestAnimationFrame
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (callback) =>
      window.setTimeout(() => {
        callback(Date.now())
      }, 1000 / 60)
  }

  // Polyfill for cancelAnimationFrame
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = (id) => {
      clearTimeout(id)
    }
  }

  // Polyfill for Array.from
  if (!Array.from) {
    Array.from = (arrayLike) => [].slice.call(arrayLike)
  }

  // Polyfill for Object.entries
  if (!Object.entries) {
    Object.entries = (obj) => Object.keys(obj).map((key) => [key, obj[key]])
  }

  // Polyfill for String.prototype.includes
  if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
      if (start === undefined) start = 0
      return this.indexOf(search, start) !== -1
    }
  }

  // Polyfill for Array.prototype.includes
  if (!Array.prototype.includes) {
    Array.prototype.includes = function (searchElement, fromIndex) {
      if (this == null) throw new TypeError('"this" is null or not defined')
      return this.indexOf(searchElement, fromIndex) !== -1
    }
  }
}

// Provide fallbacks for unsupported features
export function provideFallbacks(): void {
  // Add classes to document root for CSS feature detection
  const docEl = document.documentElement

  // WebP fallback
  if (!supportsFeature("WebP")) {
    docEl.classList.add("no-webp")
  } else {
    docEl.classList.add("webp")
  }

  // AVIF fallback
  if (!supportsFeature("AVIF")) {
    docEl.classList.add("no-avif")
  } else {
    docEl.classList.add("avif")
  }

  // Intersection Observer fallback
  if (!supportsFeature("IntersectionObserver")) {
    docEl.classList.add("no-intersection-observer")
    // In a real implementation, load a polyfill here
  }

  // Service Worker fallback
  if (!supportsFeature("ServiceWorker")) {
    docEl.classList.add("no-service-worker")

    // Show offline warning if applicable
    if (typeof document !== "undefined") {
      const offlineWarning = document.createElement("div")
      offlineWarning.className = "offline-warning hidden"
      offlineWarning.textContent = "Offline support is limited in this browser"
      document.body.appendChild(offlineWarning)

      // Show warning when offline
      window.addEventListener("offline", () => {
        offlineWarning.classList.remove("hidden")
      })

      window.addEventListener("online", () => {
        offlineWarning.classList.add("hidden")
      })
    }
  }

  // Add device-specific classes
  const browserInfo = getBrowserInfo()
  if (browserInfo.mobile) docEl.classList.add("is-mobile")
  if (browserInfo.tablet) docEl.classList.add("is-tablet")
  docEl.classList.add(`browser-${browserInfo.name.toLowerCase()}`)

  // Add OS-specific classes
  if (browserInfo.os) {
    docEl.classList.add(`os-${browserInfo.os.toLowerCase().replace(/[\s./]/g, "-")}`)
  }
}

// Check if a browser meets minimum requirements
export function meetsMinimumRequirements(): boolean {
  // List of critical features that must be supported
  const criticalFeatures = ["IntersectionObserver", "ResizeObserver", "MutationObserver", "AbortController"]

  // Check if all critical features are supported
  const supported = criticalFeatures.every((feature) => supportsFeature(feature))

  // Get browser info
  const browser = getBrowserInfo()

  // Check for minimum browser versions
  if (browser.name === "Internet Explorer") {
    return false // IE is not supported
  }

  if (browser.name === "Safari" && Number.parseInt(browser.version, 10) < 13) {
    return false // Safari < 13 is not supported
  }

  return supported
}

// Initialize browser compatibility checks and apply appropriate polyfills
export function initBrowserCompatibility(): void {
  // Apply polyfills
  applyPolyfills()

  // Provide feature fallbacks
  provideFallbacks()

  // Check if browser meets minimum requirements
  const compatible = meetsMinimumRequirements()

  if (!compatible) {
    // Show browser compatibility warning
    if (typeof document !== "undefined") {
      const warning = document.createElement("div")
      warning.className = "browser-compatibility-warning"
      warning.innerHTML = `
        <div class="browser-warning-content">
          <h2>Browser Compatibility Issue</h2>
          <p>Your browser may not support all features needed for Narcoguard to function properly.</p>
          <p>For the best experience, please use a modern browser like Chrome, Firefox, Edge, or Safari.</p>
        </div>
      `
      document.body.prepend(warning)
    }
  }

  // Run async feature detection
  runAsyncFeatureDetection().then((results) => {
    console.log("Async feature detection results:", results)
  })
}
