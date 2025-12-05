import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, ShippingAddress, PaymentMethod, OrderStatus, TrackingEvent } from '@/types/order';
import { CartItem } from '@/types/product';

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  addOrder: (items: CartItem[], shipping: ShippingAddress, paymentMethod: PaymentMethod, subtotal: number) => Order;
  getOrder: (orderId: string) => Order | undefined;
  getOrderByNumber: (orderNumber: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  setCurrentOrder: (order: Order | null) => void;
}

const generateOrderNumber = () => {
  const prefix = 'ORD';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

const generateTrackingNumber = () => {
  const prefix = 'TRK';
  const numbers = Math.random().toString().substring(2, 14);
  return `${prefix}${numbers}`;
};

const calculateEstimatedDelivery = () => {
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + Math.floor(Math.random() * 3) + 5); // 5-7 days
  return deliveryDate.toISOString().split('T')[0];
};

const generateInitialTrackingEvents = (createdAt: string): TrackingEvent[] => {
  const date = new Date(createdAt);
  return [
    {
      status: 'pending',
      date: date.toISOString().split('T')[0],
      time: date.toTimeString().split(' ')[0].substring(0, 5),
      location: 'Online',
      description: 'Order placed successfully'
    },
    {
      status: 'confirmed',
      date: date.toISOString().split('T')[0],
      time: new Date(date.getTime() + 300000).toTimeString().split(' ')[0].substring(0, 5),
      location: 'Warehouse',
      description: 'Order confirmed and payment received'
    }
  ];
};

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      currentOrder: null,

      addOrder: (items, shipping, paymentMethod, subtotal) => {
        const now = new Date().toISOString();
        const shippingCost = subtotal >= 50 ? 0 : 9.99;
        const tax = subtotal * 0.08;
        const total = subtotal + shippingCost + tax;

        const newOrder: Order = {
          id: crypto.randomUUID(),
          orderNumber: generateOrderNumber(),
          items: items.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            productImage: item.product.images[0],
            quantity: item.quantity,
            price: item.product.price,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
          })),
          shippingAddress: shipping,
          paymentMethod,
          subtotal,
          shipping: shippingCost,
          tax,
          discount: 0,
          total,
          status: 'confirmed',
          trackingNumber: generateTrackingNumber(),
          estimatedDelivery: calculateEstimatedDelivery(),
          createdAt: now,
          updatedAt: now,
          trackingEvents: generateInitialTrackingEvents(now),
        };

        set(state => ({
          orders: [newOrder, ...state.orders],
          currentOrder: newOrder,
        }));

        return newOrder;
      },

      getOrder: (orderId) => {
        return get().orders.find(o => o.id === orderId);
      },

      getOrderByNumber: (orderNumber) => {
        return get().orders.find(o => o.orderNumber === orderNumber);
      },

      updateOrderStatus: (orderId, status) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date().toISOString() }
              : order
          ),
        }));
      },

      setCurrentOrder: (order) => {
        set({ currentOrder: order });
      },
    }),
    {
      name: 'orders-storage',
    }
  )
);
