/**
 * Browser compatibility utilities for Narcoguard application
 */

// Check if the browser supports a specific feature
export function supportsFeature(feature: string): boolean {
  switch (feature) {
    case "IntersectionObserver":
      return typeof IntersectionObserver !== "undefined"
    case "ResizeObserver":
      return typeof ResizeObserver !== "undefined"
    case "MutationObserver":
      return typeof MutationObserver !== "undefined"
    case "WebP":
      return hasWebPSupport()
    case "AVIF":
      return hasAVIFSupport()
    case "WebGL":
      return hasWebGLSupport()
    case "WebRTC":
      return hasWebRTCSupport()
    case "ServiceWorker":
      return "serviceWorker" in navigator
    case "WebShare":
      return "share" in navigator
    case "Geolocation":
      return "geolocation" in navigator
    case "Notifications":
      return "Notification" in window
    case "SpeechRecognition":
      return "SpeechRecognition" in window || "webkitSpeechRecognition" in window
    case "PaymentRequest":
      return "PaymentRequest" in window
    case "Bluetooth":
      return "bluetooth" in navigator
    case "WebUSB":
      return "usb" in navigator
    case "WebNFC":
      return "NDEFReader" in window
    case "WebXR":
      return "xr" in navigator
    default:
      return false
  }
}

// Check WebP support
function hasWebPSupport(): boolean {
  const canvas = document.createElement("canvas")
  if (canvas.getContext && canvas.getContext("2d")) {
    // Check for WebP support
    return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0
  }
  return false
}

// Check AVIF support
function hasAVIFSupport(): boolean {
  const img = new Image()
  img.src =
    "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A="
  return img.complete
}

// Check WebGL support
function hasWebGLSupport(): boolean {
  try {
    const canvas = document.createElement("canvas")
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")))
  } catch (e) {
    return false
  }
}

// Check WebRTC support
function hasWebRTCSupport(): boolean {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.RTCPeerConnection)
}

// Get browser information
export function getBrowserInfo(): {
  name: string
  version: string
  os: string
  mobile: boolean
} {
  const userAgent = navigator.userAgent
  let name = "Unknown"
  let version = "Unknown"
  let os = "Unknown"
  let mobile = false

  // Detect browser name
  if (userAgent.indexOf("Firefox") > -1) {
    name = "Firefox"
  } else if (userAgent.indexOf("SamsungBrowser") > -1) {
    name = "Samsung Browser"
  } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
    name = "Opera"
  } else if (userAgent.indexOf("Edge") > -1 || userAgent.indexOf("Edg") > -1) {
    name = "Edge"
  } else if (userAgent.indexOf("Chrome") > -1) {
    name = "Chrome"
  } else if (userAgent.indexOf("Safari") > -1) {
    name = "Safari"
  } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
    name = "Internet Explorer"
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
  } else if (userAgent.indexOf("Mac") !== -1) {
    os = "MacOS"
  } else if (userAgent.indexOf("Linux") !== -1) {
    os = "Linux"
  } else if (userAgent.indexOf("Android") !== -1) {
    os = "Android"
    mobile = true
  } else if (
    userAgent.indexOf("iOS") !== -1 ||
    userAgent.indexOf("iPhone") !== -1 ||
    userAgent.indexOf("iPad") !== -1
  ) {
    os = "iOS"
    mobile = true
  }

  // Check if mobile
  if (!mobile) {
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  }

  return { name, version, os, mobile }
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
}

// Provide fallbacks for unsupported features
export function provideFallbacks(): void {
  // WebP fallback
  if (!supportsFeature("WebP")) {
    document.documentElement.classList.add("no-webp")
  }

  // Intersection Observer fallback
  if (!supportsFeature("IntersectionObserver")) {
    document.documentElement.classList.add("no-intersection-observer")
    // Load a polyfill or alternative implementation
  }

  // Service Worker fallback
  if (!supportsFeature("ServiceWorker")) {
    document.documentElement.classList.add("no-service-worker")
    // Implement alternative caching or offline strategy
  }
}
