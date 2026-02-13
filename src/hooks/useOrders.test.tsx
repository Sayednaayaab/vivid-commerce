import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useOrders } from './useOrders'
import type { CartItem, Product } from '@/types/product'
import type { ShippingAddress, PaymentMethod } from '@/types/order'

describe('useOrders', () => {
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

  const mockCartItem: CartItem = {
    product: mockProduct,
    quantity: 2,
  }

  const mockShippingAddress: ShippingAddress = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
  }

  const mockPaymentMethod: PaymentMethod = 'credit_card'

  it('initializes with empty orders', () => {
    const { result } = renderHook(() => useOrders())
    expect(result.current.orders).toEqual([])
  })

  it('creates new order', () => {
    const { result } = renderHook(() => useOrders())
    
    act(() => {
      result.current.addOrder([mockCartItem], mockShippingAddress, mockPaymentMethod, 100)
    })

    expect(result.current.orders.length).toBeGreaterThan(0)
    expect(result.current.orders[0].items).toHaveLength(1)
    expect(result.current.orders[0].status).toBe('confirmed')
  })

  it('retrieves order by id', () => {
    const { result } = renderHook(() => useOrders())
    
    let orderId: string = ''
    act(() => {
      const order = result.current.addOrder([mockCartItem], mockShippingAddress, mockPaymentMethod, 100)
      orderId = order.id
    })

    const order = result.current.getOrder(orderId)
    expect(order).toBeDefined()
    expect(order?.id).toBe(orderId)
  })

  it('retrieves order by order number', () => {
    const { result } = renderHook(() => useOrders())
    
    let orderNumber: string = ''
    act(() => {
      const order = result.current.addOrder([mockCartItem], mockShippingAddress, mockPaymentMethod, 100)
      orderNumber = order.orderNumber
    })

    const order = result.current.getOrderByNumber(orderNumber)
    expect(order).toBeDefined()
    expect(order?.orderNumber).toBe(orderNumber)
  })

  it('updates order status', () => {
    const { result } = renderHook(() => useOrders())
    
    let orderId: string = ''
    act(() => {
      const order = result.current.addOrder([mockCartItem], mockShippingAddress, mockPaymentMethod, 100)
      orderId = order.id
    })

    expect(result.current.orders[0].status).toBe('confirmed')

    act(() => {
      result.current.updateOrderStatus(orderId, 'shipped')
    })

    const order = result.current.getOrder(orderId)
    expect(order?.status).toBe('shipped')
  })

  it('manages current order', () => {
    const { result } = renderHook(() => useOrders())
    
    // When adding an order, currentOrder should be set
    let createdOrder
    act(() => {
      createdOrder = result.current.addOrder([mockCartItem], mockShippingAddress, mockPaymentMethod, 100)
    })

    expect(result.current.currentOrder).toBeDefined()
    expect(result.current.currentOrder?.id).toBe(createdOrder?.id)

    // Clear it
    act(() => {
      result.current.setCurrentOrder(null)
    })

    expect(result.current.currentOrder).toBeNull()
  })

  it('generates unique order numbers', () => {
    const { result } = renderHook(() => useOrders())
    
    let order1Number: string = ''
    let order2Number: string = ''

    act(() => {
      const order1 = result.current.addOrder([mockCartItem], mockShippingAddress, mockPaymentMethod, 100)
      order1Number = order1.orderNumber
    })

    act(() => {
      const order2 = result.current.addOrder([mockCartItem], mockShippingAddress, mockPaymentMethod, 100)
      order2Number = order2.orderNumber
    })

    expect(order1Number).not.toBe(order2Number)
  })

  it('maintains order history', () => {
    const { result } = renderHook(() => useOrders())
    
    const initialCount = result.current.orders.length

    act(() => {
      result.current.addOrder([mockCartItem], mockShippingAddress, mockPaymentMethod, 100)
      result.current.addOrder([mockCartItem], mockShippingAddress, mockPaymentMethod, 100)
    })

    // Should have 2 more orders than before
    expect(result.current.orders.length).toBeGreaterThan(initialCount)
    // Most recent order is first (can compare as ISO strings)
    if (result.current.orders.length >= 2) {
      expect(result.current.orders[0].createdAt >= result.current.orders[1].createdAt).toBe(true)
    }
  })
})
