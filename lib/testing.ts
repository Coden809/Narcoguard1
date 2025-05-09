/**
 * Testing utilities for Narcoguard application
 */

import { jest } from "@jest/globals"

// Mock window.matchMedia for testing
export function mockMatchMedia(matches: boolean): void {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

// Mock IntersectionObserver for testing
export function mockIntersectionObserver(): void {
  class MockIntersectionObserver {
    readonly root: Element | null
    readonly rootMargin: string
    readonly thresholds: ReadonlyArray<number>
    constructor() {
      this.root = null
      this.rootMargin = ""
      this.thresholds = []
    }
    disconnect() {
      return null
    }
    observe() {
      return null
    }
    takeRecords() {
      return []
    }
    unobserve() {
      return null
    }
  }
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  })
}

// Mock ResizeObserver for testing
export function mockResizeObserver(): void {
  class MockResizeObserver {
    constructor() {}
    disconnect() {
      return null
    }
    observe() {
      return null
    }
    unobserve() {
      return null
    }
  }
  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    configurable: true,
    value: MockResizeObserver,
  })
}

// Mock fetch for testing
export function mockFetch(response: any, status = 200): void {
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      headers: new Headers(),
    }),
  )
}

// Mock localStorage for testing
export function mockLocalStorage(): void {
  const localStorageMock = (() => {
    let store: Record<string, string> = {}
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString()
      },
      removeItem: (key: string) => {
        delete store[key]
      },
      clear: () => {
        store = {}
      },
    }
  })()
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  })
}

// Mock sessionStorage for testing
export function mockSessionStorage(): void {
  const sessionStorageMock = (() => {
    let store: Record<string, string> = {}
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString()
      },
      removeItem: (key: string) => {
        delete store[key]
      },
      clear: () => {
        store = {}
      },
    }
  })()
  Object.defineProperty(window, "sessionStorage", {
    value: sessionStorageMock,
  })
}

// Setup all mocks for testing
export function setupTestEnvironment(): void {
  mockMatchMedia(false)
  mockIntersectionObserver()
  mockResizeObserver()
  mockLocalStorage()
  mockSessionStorage()
}

// Clean up test environment
export function cleanupTestEnvironment(): void {
  jest.restoreAllMocks()
}
