export interface Store {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance?: number;
  businessHours: string;
  rating: number;
  reviewCount: number;
  images: string[];
  pricePerHour: number;
  pricePerDay: number;
  tags: string[];
  phone: string;
  capacity: {
    small: { total: number; available: number };
    medium: { total: number; available: number };
    large: { total: number; available: number };
  };
}

export interface OrderItem {
  id: string;
  size: 'small' | 'medium' | 'large';
  quantity: number;
  description: string;
}

export interface Insurance {
  amount: number;
  premium: number;
}

export type OrderStatus = 'pending' | 'stored' | 'extended' | 'overdue' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  storeId: string;
  storeName: string;
  storeAddress: string;
  customerName: string;
  customerPhone: string;
  startTime: string;
  endTime: string;
  actualEndTime?: string;
  status: OrderStatus;
  items: OrderItem[];
  insurance?: Insurance;
  basePrice: number;
  insurancePrice: number;
  totalPrice: number;
  pickupCode: string;
  createdAt: string;
  lockerNumber?: string;
  photoUrl?: string;
}

export type TicketType = 'cancel' | 'lost' | 'compensation' | 'complaint';
export type TicketStatus = 'pending' | 'processing' | 'resolved' | 'closed';

export interface Ticket {
  id: string;
  orderId: string;
  type: TicketType;
  status: TicketStatus;
  description: string;
  createdAt: string;
  handler?: string;
  handleNotes?: string;
  customerName: string;
  customerPhone: string;
}

export interface Settlement {
  id: string;
  storeId: string;
  storeName: string;
  period: string;
  orderCount: number;
  totalAmount: number;
  platformFee: number;
  storeIncome: number;
  status: 'pending' | 'settled';
  settledAt?: string;
}

export type UserRole = 'visitor' | 'store' | 'service' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  storeId?: string;
}
