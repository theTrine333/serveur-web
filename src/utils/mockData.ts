import { MenuItem, Category, Order, Transaction, Receipt, InventoryItem, Feedback } from '../types';

export const generateMockData = () => {
  const categories: Category[] = [
    {
      id: '1',
      name: 'Appetizers',
      description: 'Start your meal with our delicious appetizers',
      sortOrder: 1,
      isActive: true
    },
    {
      id: '2',
      name: 'Main Courses',
      description: 'Hearty and satisfying main dishes',
      sortOrder: 2,
      isActive: true
    },
    {
      id: '3',
      name: 'Desserts',
      description: 'Sweet endings to your perfect meal',
      sortOrder: 3,
      isActive: true
    },
    {
      id: '4',
      name: 'Beverages',
      description: 'Refreshing drinks and specialty beverages',
      sortOrder: 4,
      isActive: true
    }
  ];

  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with parmesan cheese and croutons',
      price: 12.99,
      category: 'Appetizers',
      image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=500',
      isAvailable: true,
      isSpecial: false,
      preparationTime: 10,
      ingredients: ['romaine lettuce', 'parmesan cheese', 'croutons', 'caesar dressing'],
      allergens: ['dairy', 'gluten'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon with lemon herb butter',
      price: 24.99,
      category: 'Main Courses',
      image: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=500',
      isAvailable: true,
      isSpecial: true,
      specialPrice: 19.99,
      preparationTime: 20,
      ingredients: ['salmon fillet', 'lemon', 'herbs', 'butter'],
      allergens: ['fish'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with molten center',
      price: 8.99,
      category: 'Desserts',
      image: 'https://images.pexels.com/photos/2113556/pexels-photo-2113556.jpeg?auto=compress&cs=tinysrgb&w=500',
      isAvailable: true,
      isSpecial: false,
      preparationTime: 15,
      ingredients: ['dark chocolate', 'eggs', 'flour', 'sugar', 'vanilla'],
      allergens: ['eggs', 'gluten', 'dairy'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Fresh Lemonade',
      description: 'House-made lemonade with fresh lemons',
      price: 4.99,
      category: 'Beverages',
      image: 'https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?auto=compress&cs=tinysrgb&w=500',
      isAvailable: true,
      isSpecial: false,
      preparationTime: 5,
      ingredients: ['fresh lemons', 'sugar', 'water', 'ice'],
      allergens: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const orders: Order[] = [
    {
      id: '1',
      customerName: 'John Smith',
      customerPhone: '+1-555-0123',
      customerEmail: 'john@example.com',
      items: [
        {
          id: '1',
          menuItemId: '1',
          menuItem: menuItems[0],
          quantity: 2,
          price: 12.99
        },
        {
          id: '2',
          menuItemId: '2',
          menuItem: menuItems[1],
          quantity: 1,
          price: 19.99
        }
      ],
      status: 'preparing',
      totalAmount: 45.97,
      orderTime: new Date(Date.now() - 30000).toISOString(),
      tableNumber: 'A1',
      paymentMethod: 'Credit Card',
      isDelivery: false
    },
    {
      id: '2',
      customerName: 'Sarah Johnson',
      customerPhone: '+1-555-0456',
      items: [
        {
          id: '3',
          menuItemId: '3',
          menuItem: menuItems[2],
          quantity: 1,
          price: 8.99
        },
        {
          id: '4',
          menuItemId: '4',
          menuItem: menuItems[3],
          quantity: 2,
          price: 4.99
        }
      ],
      status: 'new',
      totalAmount: 18.97,
      orderTime: new Date(Date.now() - 10000).toISOString(),
      tableNumber: 'B3',
      paymentMethod: 'Cash',
      isDelivery: false
    }
  ];

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'sale',
      amount: 45.97,
      description: 'Order #1 - John Smith',
      orderId: '1',
      timestamp: new Date(Date.now() - 30000).toISOString(),
      paymentMethod: 'Credit Card',
      status: 'completed'
    },
    {
      id: '2',
      type: 'sale',
      amount: 18.97,
      description: 'Order #2 - Sarah Johnson',
      orderId: '2',
      timestamp: new Date(Date.now() - 10000).toISOString(),
      paymentMethod: 'Cash',
      status: 'completed'
    }
  ];

  const receipts: Receipt[] = [
    {
      id: '1',
      orderId: '1',
      customerName: 'John Smith',
      items: orders[0].items,
      subtotal: 45.97,
      tax: 3.68,
      total: 49.65,
      paymentMethod: 'Credit Card',
      timestamp: new Date(Date.now() - 30000).toISOString(),
      receiptNumber: 'RCP-001'
    }
  ];

  const inventory: InventoryItem[] = [
    {
      id: '1',
      name: 'Salmon Fillets',
      currentStock: 25,
      minStock: 10,
      unit: 'pieces',
      costPerUnit: 12.50,
      supplier: 'Fresh Fish Co.',
      lastRestocked: new Date(Date.now() - 86400000).toISOString(),
      expiryDate: new Date(Date.now() + 172800000).toISOString()
    },
    {
      id: '2',
      name: 'Romaine Lettuce',
      currentStock: 5,
      minStock: 15,
      unit: 'heads',
      costPerUnit: 2.99,
      supplier: 'Green Valley Farms',
      lastRestocked: new Date(Date.now() - 43200000).toISOString(),
      expiryDate: new Date(Date.now() + 259200000).toISOString()
    }
  ];

  const feedback: Feedback[] = [
    {
      id: '1',
      customerName: 'Alice Brown',
      customerEmail: 'alice@example.com',
      rating: 5,
      comment: 'Excellent food and service! The salmon was perfectly cooked.',
      orderId: '1',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: '2',
      customerName: 'Mike Wilson',
      rating: 4,
      comment: 'Great atmosphere and tasty food. Will definitely come back!',
      timestamp: new Date(Date.now() - 7200000).toISOString()
    }
  ];

  return {
    categories,
    menuItems,
    orders,
    transactions,
    receipts,
    inventory,
    feedback,
    walletBalance: 2500.75
  };
};