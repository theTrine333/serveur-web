// Core types for the restaurant management system
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  avatar?: string;
  createdAt: string;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  isSpecial: boolean;
  specialPrice?: number;
  preparationTime: number;
  ingredients: string[];
  allergens: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  items: OrderItem[];
  status: 'new' | 'preparing' | 'ready' | 'served' | 'cancelled';
  specialRequests?: string;
  totalAmount: number;
  orderTime: string;
  servedTime?: string;
  tableNumber?: string;
  paymentMethod: string;
  isDelivery: boolean;
  deliveryAddress?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
  price: number;
}

export interface Transaction {
  id: string;
  type: 'sale' | 'refund' | 'withdrawal' | 'deposit';
  amount: number;
  description: string;
  orderId?: string;
  timestamp: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Receipt {
  id: string;
  orderId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  timestamp: string;
  receiptNumber: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  lastRestocked: string;
  expiryDate?: string;
}

export interface Feedback {
  id: string;
  customerName: string;
  customerEmail?: string;
  rating: number;
  comment: string;
  orderId?: string;
  timestamp: string;
  response?: string;
  responseTime?: string;
}

export interface Analytics {
  dailyRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  popularItems: { item: MenuItem; count: number }[];
  revenueByDay: { date: string; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
}