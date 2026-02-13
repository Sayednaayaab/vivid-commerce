import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuth } from './useAuth'
import { AuthProvider } from './useAuth'
import { testUtils } from '@/test/setup'
import React from 'react'

describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(AuthProvider, { children })

  it('initializes with unauthenticated state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.userEmail).toBeNull()
  })

  it('authenticates user with email', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    act(() => {
      result.current.login('user@example.com')
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.userEmail).toBe('user@example.com')
  })

  it('logs out user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    act(() => {
      result.current.login('user@example.com')
    })

    expect(result.current.isAuthenticated).toBe(true)

    act(() => {
      result.current.logout()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.userEmail).toBeNull()
  })

  it('persists authentication state to localStorage', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    act(() => {
      result.current.login('user@example.com')
    })

    const isAuthenticated = localStorage.getItem('isAuthenticated')
    const userEmail = localStorage.getItem('auth_user')

    expect(isAuthenticated).toBe('true')
    expect(userEmail).toBe('user@example.com')
  })

  it('restores authentication from localStorage', () => {
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('auth_user', 'restored@example.com')

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.userEmail).toBe('restored@example.com')
  })

  it('handles guest login', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    act(() => {
      result.current.login(null)
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.userEmail).toBeNull()
  })

  it('clears localStorage on logout', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    act(() => {
      result.current.login('user@example.com')
    })

    expect(localStorage.getItem('isAuthenticated')).toBe('true')

    act(() => {
      result.current.logout()
    })

    expect(localStorage.getItem('isAuthenticated')).toBeNull()
    expect(localStorage.getItem('auth_user')).toBeNull()
  })
})
