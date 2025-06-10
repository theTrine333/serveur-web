import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, MenuItem, Order, Transaction, Receipt, Category, InventoryItem, Feedback } from '../types';
import { generateMockData } from '../utils/mockData';

interface RestaurantState {
  user: User | null;
  menuItems: MenuItem[];
  categories: Category[];
  orders: Order[];
  transactions: Transaction[];
  receipts: Receipt[];
  inventory: InventoryItem[];
  feedback: Feedback[];
  walletBalance: number;
  isLoading: boolean;
  notifications: string[];
}

type RestaurantAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_MENU_ITEMS'; payload: MenuItem[] }
  | { type: 'ADD_MENU_ITEM'; payload: MenuItem }
  | { type: 'UPDATE_MENU_ITEM'; payload: MenuItem }
  | { type: 'DELETE_MENU_ITEM'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'SET_RECEIPTS'; payload: Receipt[] }
  | { type: 'ADD_RECEIPT'; payload: Receipt }
  | { type: 'SET_INVENTORY'; payload: InventoryItem[] }
  | { type: 'UPDATE_INVENTORY'; payload: InventoryItem }
  | { type: 'SET_FEEDBACK'; payload: Feedback[] }
  | { type: 'ADD_FEEDBACK'; payload: Feedback }
  | { type: 'SET_WALLET_BALANCE'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' };

const initialState: RestaurantState = {
  user: null,
  menuItems: [],
  categories: [],
  orders: [],
  transactions: [],
  receipts: [],
  inventory: [],
  feedback: [],
  walletBalance: 0,
  isLoading: false,
  notifications: []
};

function restaurantReducer(state: RestaurantState, action: RestaurantAction): RestaurantState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_MENU_ITEMS':
      return { ...state, menuItems: action.payload };
    case 'ADD_MENU_ITEM':
      return { ...state, menuItems: [...state.menuItems, action.payload] };
    case 'UPDATE_MENU_ITEM':
      return {
        ...state,
        menuItems: state.menuItems.map(item => 
          item.id === action.payload.id ? action.payload : item
        )
      };
    case 'DELETE_MENU_ITEM':
      return {
        ...state,
        menuItems: state.menuItems.filter(item => item.id !== action.payload)
      };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.payload.id ? action.payload : order
        )
      };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'SET_RECEIPTS':
      return { ...state, receipts: action.payload };
    case 'ADD_RECEIPT':
      return { ...state, receipts: [action.payload, ...state.receipts] };
    case 'SET_INVENTORY':
      return { ...state, inventory: action.payload };
    case 'UPDATE_INVENTORY':
      return {
        ...state,
        inventory: state.inventory.map(item => 
          item.id === action.payload.id ? action.payload : item
        )
      };
    case 'SET_FEEDBACK':
      return { ...state, feedback: action.payload };
    case 'ADD_FEEDBACK':
      return { ...state, feedback: [action.payload, ...state.feedback] };
    case 'SET_WALLET_BALANCE':
      return { ...state, walletBalance: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    default:
      return state;
  }
}

const RestaurantContext = createContext<{
  state: RestaurantState;
  dispatch: React.Dispatch<RestaurantAction>;
} | null>(null);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(restaurantReducer, initialState);

  useEffect(() => {
    // Load data from localStorage or initialize with mock data
    const savedData = localStorage.getItem('restaurantData');
    if (savedData) {
      const data = JSON.parse(savedData);
      dispatch({ type: 'SET_MENU_ITEMS', payload: data.menuItems || [] });
      dispatch({ type: 'SET_CATEGORIES', payload: data.categories || [] });
      dispatch({ type: 'SET_ORDERS', payload: data.orders || [] });
      dispatch({ type: 'SET_TRANSACTIONS', payload: data.transactions || [] });
      dispatch({ type: 'SET_RECEIPTS', payload: data.receipts || [] });
      dispatch({ type: 'SET_INVENTORY', payload: data.inventory || [] });
      dispatch({ type: 'SET_FEEDBACK', payload: data.feedback || [] });
      dispatch({ type: 'SET_WALLET_BALANCE', payload: data.walletBalance || 0 });
    } else {
      const mockData = generateMockData();
      dispatch({ type: 'SET_MENU_ITEMS', payload: mockData.menuItems });
      dispatch({ type: 'SET_CATEGORIES', payload: mockData.categories });
      dispatch({ type: 'SET_ORDERS', payload: mockData.orders });
      dispatch({ type: 'SET_TRANSACTIONS', payload: mockData.transactions });
      dispatch({ type: 'SET_RECEIPTS', payload: mockData.receipts });
      dispatch({ type: 'SET_INVENTORY', payload: mockData.inventory });
      dispatch({ type: 'SET_FEEDBACK', payload: mockData.feedback });
      dispatch({ type: 'SET_WALLET_BALANCE', payload: mockData.walletBalance });
    }

    // Set default user
    dispatch({
      type: 'SET_USER',
      payload: {
        id: '1',
        name: 'Restaurant Manager',
        email: 'manager@restaurant.com',
        role: 'admin',
        createdAt: new Date().toISOString(),
        isActive: true
      }
    });
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      menuItems: state.menuItems,
      categories: state.categories,
      orders: state.orders,
      transactions: state.transactions,
      receipts: state.receipts,
      inventory: state.inventory,
      feedback: state.feedback,
      walletBalance: state.walletBalance
    };
    localStorage.setItem('restaurantData', JSON.stringify(dataToSave));
  }, [state]);

  return (
    <RestaurantContext.Provider value={{ state, dispatch }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};