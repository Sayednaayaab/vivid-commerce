import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWishlist } from './useWishlist'
import type { Product } from '@/types/product'

describe('useWishlist', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'Test description',
    price: 99.99,
    images: ['test.jpg'],
    category: 'Electronics',
    subcategory: 'phones',
    tags: ['test'],
    rating: 4.5,
    reviewCount: 10,
    inStock: true,
    brand: 'TestBrand',
  }

  const mockProduct2: Product = {
    ...mockProduct,
    id: '2',
    name: 'Test Product 2',
  }

  it('initializes with empty wishlist', () => {
    const { result } = renderHook(() => useWishlist())
    expect(result.current.items).toEqual([])
  })

  it('adds item to wishlist', () => {
    const { result } = renderHook(() => useWishlist())
    
    act(() => {
      result.current.addItem(mockProduct)
    })

    expect(result.current.items.length).toBeGreaterThan(0)
    expect(result.current.items[0].id).toBe('1')
  })

  it('removes item from wishlist', () => {
    const { result } = renderHook(() => useWishlist())
    
    act(() => {
      result.current.addItem(mockProduct)
    })

    expect(result.current.isInWishlist('1')).toBe(true)

    act(() => {
      result.current.removeItem('1')
    })

    expect(result.current.isInWishlist('1')).toBe(false)
  })

  it('prevents duplicate items', () => {
    const { result } = renderHook(() => useWishlist())
    
    act(() => {
      result.current.addItem(mockProduct)
      result.current.addItem(mockProduct)
    })

    expect(result.current.items).toHaveLength(1)
  })

  it('toggles item in wishlist', () => {
    const { result } = renderHook(() => useWishlist())
    
    const wasInWishlist = result.current.isInWishlist('1')

    act(() => {
      result.current.toggleItem(mockProduct)
    })

    expect(result.current.isInWishlist('1')).toBe(!wasInWishlist)

    act(() => {
      result.current.toggleItem(mockProduct)
    })

    expect(result.current.isInWishlist('1')).toBe(wasInWishlist)
  })

  it('manages multiple items', () => {
    const { result } = renderHook(() => useWishlist())
    
    act(() => {
      result.current.addItem(mockProduct)
      result.current.addItem(mockProduct2)
    })

    expect(result.current.items).toHaveLength(2)
    expect(result.current.isInWishlist('1')).toBe(true)
    expect(result.current.isInWishlist('2')).toBe(true)

    act(() => {
      result.current.removeItem('1')
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.isInWishlist('1')).toBe(false)
    expect(result.current.isInWishlist('2')).toBe(true)
  })
})
