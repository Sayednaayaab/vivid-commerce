import '@testing-library/jest-dom'
import { vi, beforeEach, afterEach } from 'vitest'

// ===== Window API Mocks =====

// Mock window.matchMedia for responsive components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  })),
})

// Mock IntersectionObserver for lazy loading/visibility detection
class MockIntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  unobserveAll = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn(() => [])

  constructor(public callback: IntersectionObserverCallback) {}
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
})

// Mock ResizeObserver for responsive layouts
class MockResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()

  constructor(public callback: ResizeObserverCallback) {}
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
})

// Mock Web Audio API context
class MockAudioContext {
  createGain = vi.fn(() => ({
    gain: { value: 1, linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    connect: vi.fn(),
  }))
  createOscillator = vi.fn(() => ({
    type: 'sine',
    frequency: { value: 440 },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  }))
  destination = {}
  currentTime = 0
}

Object.defineProperty(window, 'AudioContext', {
  writable: true,
  configurable: true,
  value: MockAudioContext,
})

// ===== Storage Mocks =====

// Comprehensive localStorage mock with listener support
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  const listeners: Set<() => void> = new Set()

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
      listeners.forEach(listener => listener())
    },
    removeItem: (key: string) => {
      delete store[key]
      listeners.forEach(listener => listener())
    },
    clear: () => {
      store = {}
      listeners.forEach(listener => listener())
    },
    key: (index: number) => {
      const keys = Object.keys(store)
      return keys[index] || null
    },
    get length() {
      return Object.keys(store).length
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Comprehensive sessionStorage mock
const sessionStorageMock = (() => {
  let store: Record<string, string> = {}
  const listeners: Set<() => void> = new Set()

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
      listeners.forEach(listener => listener())
    },
    removeItem: (key: string) => {
      delete store[key]
      listeners.forEach(listener => listener())
    },
    clear: () => {
      store = {}
      listeners.forEach(listener => listener())
    },
    key: (index: number) => {
      const keys = Object.keys(store)
      return keys[index] || null
    },
    get length() {
      return Object.keys(store).length
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
})()

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
})

// ===== Navigation Mocks =====

// Mock window.history for navigation testing
Object.defineProperty(window, 'history', {
  value: {
    ...window.history,
    pushState: vi.fn(),
    replaceState: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    go: vi.fn(),
  },
  writable: true,
})

// Mock window.location
const mockLocation = {
  href: '',
  hash: '',
  host: 'localhost',
  hostname: 'localhost',
  origin: 'http://localhost',
  pathname: '/',
  port: '',
  protocol: 'http:',
  search: '',
  reload: vi.fn(),
  replace: vi.fn(),
}

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
})

// ===== Request/Response Mocks =====

// Mock fetch API
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    clone: () => ({ json: () => Promise.resolve({}) }),
  } as unknown as Response)
)

// Mock XMLHttpRequest
global.XMLHttpRequest = vi.fn(() => ({
  open: vi.fn(),
  send: vi.fn(),
  setRequestHeader: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  abort: vi.fn(),
  status: 200,
  readyState: 4,
  responseText: '',
  response: {},
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4,
} as unknown as XMLHttpRequest)) as any

// ===== Console Mocks =====

// Mock console methods for cleaner test output
const originalError = console.error
const originalWarn = console.warn
const originalLog = console.log

global.console = {
  ...console,
  error: vi.fn(originalError),
  warn: vi.fn(originalWarn),
  log: vi.fn(originalLog),
}

// ===== Crypto API Mock =====

if (!global.crypto) {
  global.crypto = {
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256)
      }
      return arr
    },
    subtle: {
      encrypt: vi.fn(),
      decrypt: vi.fn(),
      sign: vi.fn(),
      verify: vi.fn(),
      digest: vi.fn(() => Promise.resolve(new ArrayBuffer(32))),
      generateKey: vi.fn(),
      importKey: vi.fn(),
      exportKey: vi.fn(),
    } as unknown as SubtleCrypto,
  } as Crypto
}

// ===== Cleanup After Each Test =====

afterEach(() => {
  // Clear all mocks
  vi.clearAllMocks()

  // Clear all storage
  localStorage.clear()
  sessionStorage.clear()

  // Reset location
  mockLocation.href = '/'
  mockLocation.pathname = '/'
  mockLocation.search = ''
  mockLocation.hash = ''

  // Reset console mocks
  vi.resetAllMocks()
})

// ===== Global Test Utilities =====

// Export utility functions for tests
export const testUtils = {
  // Storage utilities
  setLocalStorage: (key: string, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value))
  },
  getLocalStorage: (key: string) => {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  },
  setSessionStorage: (key: string, value: unknown) => {
    sessionStorage.setItem(key, JSON.stringify(value))
  },
  getSessionStorage: (key: string) => {
    const value = sessionStorage.getItem(key)
    return value ? JSON.parse(value) : null
  },

  // Mock setup utilities
  mockFetch: (response: unknown, options?: { status?: number; ok?: boolean }) => {
    const mockResponse = {
      ok: options?.ok ?? true,
      status: options?.status ?? 200,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
      blob: () => Promise.resolve(new Blob([JSON.stringify(response)])),
      headers: new Map(),
      clone: function() {
        return { ...this, json: () => Promise.resolve(response) }
      },
    } as unknown as Response
    ;(global.fetch as unknown as { mockResolvedValueOnce: (arg: Response) => void }).mockResolvedValueOnce(mockResponse)
  },

  mockMediaQuery: (query: string, matches: boolean) => {
    const mockQueryList = {
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    } as unknown as MediaQueryList
    ;(window.matchMedia as unknown as { mockReturnValueOnce: (arg: MediaQueryList) => void }).mockReturnValueOnce(mockQueryList)
  },
}