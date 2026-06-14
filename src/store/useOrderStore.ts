import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, OrderStatus } from '@/types';
import { mockOrders } from '@/data/orders';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  setOrders: (orders: Order[]) => void;
  setCurrentOrder: (order: Order | null) => void;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByStatus: (status: OrderStatus) => Order[];
  getOrdersByStore: (storeId: string) => Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addOrder: (order: Order) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: mockOrders,
      currentOrder: null,

      setOrders: (orders) => set({ orders }),

      setCurrentOrder: (order) => set({ currentOrder: order }),

      getOrderById: (id) => get().orders.find((o) => o.id === id),

      getOrdersByStatus: (status) =>
        get().orders.filter((o) => o.status === status),

      getOrdersByStore: (storeId) =>
        get().orders.filter((o) => o.storeId === storeId),

      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          ),
        })),

      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),
    }),
    {
      name: 'luggage-storage-orders',
    }
  )
);
