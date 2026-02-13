import { describe, it, expect } from 'vitest'

describe('Test Setup Verification', () => {
  it('should have localStorage available', () => {
    localStorage.setItem('test-key', 'test-value')
    expect(localStorage.getItem('test-key')).toBe('test-value')
    localStorage.clear()
  })

  it('should have sessionStorage available', () => {
    sessionStorage.setItem('session-key', 'session-value')
    expect(sessionStorage.getItem('session-key')).toBe('session-value')
    sessionStorage.clear()
  })

  it('should have window.matchMedia available', () => {
    expect(window.matchMedia).toBeDefined()
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    expect(mediaQuery).toBeDefined()
    expect(mediaQuery.matches).toBe(false)
  })

  it('should have IntersectionObserver available', () => {
    expect(window.IntersectionObserver).toBeDefined()
    const observer = new window.IntersectionObserver(() => {})
    expect(observer).toBeDefined()
    expect(observer.disconnect).toBeDefined()
  })

  it('should have ResizeObserver available', () => {
    expect(window.ResizeObserver).toBeDefined()
    const observer = new window.ResizeObserver(() => {})
    expect(observer).toBeDefined()
    expect(observer.disconnect).toBeDefined()
  })
})
