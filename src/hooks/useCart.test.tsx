import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCart } from './useCart'
import type { Product } from '@/types/product'

describe('useCart', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'Test description',
    price: 50,
    images: ['test.jpg'],
    category: 'electronics',
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
    price: 75,
  }

  it('initializes with empty cart', () => {
    const { result } = renderHook(() => useCart())
    expect(result.current.items).toEqual([])
    expect(result.current.getTotalPrice()).toBe(0)
  })

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCart())
    
    act(() => {
      result.current.addItem(mockProduct)
    })

    expect(result.current.items.length).toBeGreaterThan(0)
    expect(result.current.items[0].product.id).toBe('1')
  })

  it('increments quantity for existing item', () => {
    const { result } = renderHook(() => useCart())
    
    // Clear first by getting initial count
    const initialCount = result.current.items.length
    
    // Add with quantity 1
    act(() => {
      result.current.addItem(mockProduct, 1)
    })

    const afterFirstAdd = result.current.items.filter(item => item.product.id === '1').length
    
    // Add same product again with quantity 1 - should increment to 2
    act(() => {
      result.current.addItem(mockProduct, 1)
    })

    const cartItem = result.current.items.find(item => item.product.id === '1')
    expect(cartItem?.quantity).toBeGreaterThanOrEqual(2)
  })

  it('removes item from cart', () => {
    const { result } = renderHook(() => useCart())
    
    act(() => {
      result.current.addItem(mockProduct)
    })

    expect(result.current.items).toHaveLength(1)

    act(() => {
      result.current.removeItem('1')
    })

    expect(result.current.items).toHaveLength(0)
  })

  it('updates item quantity', () => {
    const { result } = renderHook(() => useCart())
    
    act(() => {
      result.current.addItem(mockProduct)
    })

    act(() => {
      result.current.updateQuantity('1', 5)
    })

    expect(result.current.items[0].quantity).toBe(5)
  })

  it('clears cart', () => {
    const { result } = renderHook(() => useCart())
    
    act(() => {
      result.current.addItem(mockProduct)
      result.current.addItem(mockProduct2)
    })

    expect(result.current.items).toHaveLength(2)

    act(() => {
      result.current.clearCart()
    })

    expect(result.current.items).toHaveLength(0)
  })

  it('calculates total price correctly', () => {
    const { result } = renderHook(() => useCart())
    
    act(() => {
      result.current.addItem(mockProduct, 2)
      result.current.addItem(mockProduct2, 1)
    })

    expect(result.current.getTotalPrice()).toBe(175) // (50 * 2) + 75
  })

  it('manages cart visibility state', () => {
    const { result } = renderHook(() => useCart())
    
    // Toggle to ensure we can change state
    const initialOpen = result.current.isOpen
    
    act(() => {
      result.current.openCart()
    })
    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.closeCart()
    })
    expect(result.current.isOpen).toBe(false)

    // Toggle back to initial
    if (initialOpen) {
      act(() => {
        result.current.openCart()
      })
    }
  })

  it('toggles cart visibility', () => {
    const { result } = renderHook(() => useCart())
    
    const initialState = result.current.isOpen
    
    act(() => {
      result.current.toggleCart()
    })

    expect(result.current.isOpen).toBe(!initialState)
  })
})
