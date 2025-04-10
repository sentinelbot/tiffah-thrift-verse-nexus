import { Order, OrderStatus, PaymentMethod, ShippingMethod } from '@/types/order';

// Generate a unique order number in format TTS-YYYYMMDD-XXXX
export const generateOrderNumber = (): string => {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `TTS-${datePart}-${randomPart}`;
};

// Function to get all orders (mock for now)
export const getAllOrders = async (): Promise<Order[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data for demonstration
  const mockOrders: Order[] = [
    {
      id: "order-123",
      orderNumber: "TTS-20250409-1234",
      totalAmount: 4500,
      status: "processing",
      paymentMethod: "mpesa",
      paymentStatus: "completed",
      paymentTransactionId: "MPESA123456",
      createdAt: new Date(),
      orderDate: new Date(),
      customer: {
        id: "cust-123",
        name: "Jane Smith",
        email: "jane@example.com"
      },
      items: [
        {
          id: "item-001",
          orderId: "order-123",
          productId: "prod-001",
          product: {
            id: "prod-001",
            title: "Vintage Denim Jacket",
            price: 2500,
            imageUrl: "/placeholder.svg"
          },
          quantity: 1,
          price: 2500
        },
        {
          id: "item-002",
          orderId: "order-123",
          productId: "prod-002",
          product: {
            id: "prod-002",
            title: "Floral Summer Dress",
            price: 1800,
            imageUrl: "/placeholder.svg"
          },
          quantity: 1,
          price: 1800
        }
      ],
      paymentInfo: {
        method: "mpesa",
        status: "completed",
        transactionId: "MPESA123456",
        amount: 4500
      },
      shippingInfo: {
        fullName: "Jane Smith",
        email: "jane@example.com",
        phone: "+254712345678",
        address: "123 Main St",
        city: "Nairobi",
        state: "Nairobi",
        postalCode: "00100",
        country: "Kenya",
        shippingMethod: "express"
      },
      deliveryInfo: {
        estimatedDelivery: new Date(Date.now() + 86400000), // Tomorrow
        trackingId: "TRK12345"
      },
      history: [
        {
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          status: "pending",
          note: "Order placed"
        },
        {
          timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
          status: "processing",
          note: "Payment confirmed"
        }
      ]
    },
    {
      id: "order-456",
      orderNumber: "TTS-20250409-5678",
      totalAmount: 3200,
      status: "pending",
      paymentMethod: "card",
      paymentStatus: "pending",
      createdAt: new Date(Date.now() - 7200000), // 2 hours ago
      orderDate: new Date(Date.now() - 7200000),
      customer: {
        id: "cust-456",
        name: "John Doe",
        email: "john@example.com"
      },
      items: [
        {
          id: "item-003",
          orderId: "order-456",
          productId: "prod-003",
          product: {
            id: "prod-003",
            title: "Leather Boots",
            price: 3200,
            imageUrl: "/placeholder.svg"
          },
          quantity: 1,
          price: 3200
        }
      ],
      paymentInfo: {
        method: "card",
        status: "pending",
        amount: 3200
      },
      shippingInfo: {
        fullName: "John Doe",
        email: "john@example.com",
        phone: "+254723456789",
        address: "456 Park Ave",
        city: "Nairobi",
        state: "Nairobi",
        postalCode: "00200",
        country: "Kenya",
        shippingMethod: "standard"
      },
      deliveryInfo: {
        estimatedDelivery: new Date(Date.now() + 172800000), // 2 days from now
      },
      history: [
        {
          timestamp: new Date(Date.now() - 7200000), // 2 hours ago
          status: "pending",
          note: "Order placed"
        }
      ]
    }
  ];
  
  return mockOrders;
};

// Mock API functions - these would connect to your backend in production
export const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would be a POST request to your API
  console.log('Creating order with data:', orderData);
  
  // Mock successful response
  return {
    id: Math.random().toString(36).substring(2, 15),
    orderNumber: generateOrderNumber(),
    orderDate: new Date(),
    status: 'pending',
    history: [
      {
        timestamp: new Date(),
        status: 'pending',
        note: 'Order created',
      }
    ],
    ...orderData
  } as Order;
};

export const updateOrderStatus = async (
  orderId: string, 
  status: OrderStatus, 
  note?: string
): Promise<Order> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would be a PUT request to your API
  console.log(`Updating order ${orderId} to status: ${status}`);
  
  // Mock successful response
  return {
    id: orderId,
    status,
    history: [
      // Previous history would be included in real implementation
      {
        timestamp: new Date(),
        status,
        note,
      }
    ]
  } as Order;
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would be a GET request to your API
  console.log(`Fetching order ${orderId}`);
  
  // Mock successful response
  return {
    id: orderId,
    orderNumber: 'TTS-20250409-1234',
    customer: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    },
    items: [
      {
        productId: '1',
        product: {
          id: '1',
          title: 'Vintage Denim Jacket',
          price: 59.99,
          imageUrl: '/placeholder.svg'
        },
        quantity: 1,
        price: 59.99
      }
    ],
    totalAmount: 59.99,
    status: 'processing',
    paymentInfo: {
      method: 'mpesa',
      status: 'completed',
      transactionId: 'MPE1234567',
      amount: 59.99
    },
    shippingInfo: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '0712345678',
      address: '123 Main St',
      city: 'Nairobi',
      state: 'Nairobi',
      postalCode: '00100',
      country: 'Kenya',
      shippingMethod: 'standard'
    },
    deliveryInfo: {
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    orderDate: new Date(),
    history: [
      {
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'pending',
        note: 'Order created',
      },
      {
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        status: 'processing',
        note: 'Payment confirmed',
        updatedBy: 'system'
      }
    ]
  } as Order;
};

export const getCustomerOrders = async (customerId: string): Promise<Order[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would be a GET request to your API
  console.log(`Fetching orders for customer ${customerId}`);
  
  // Mock successful response with a list of orders
  return [
    {
      id: '1',
      orderNumber: 'TTS-20250409-1234',
      customer: {
        id: customerId,
        name: 'John Doe',
        email: 'john@example.com'
      },
      items: [
        {
          productId: '1',
          product: {
            id: '1',
            title: 'Vintage Denim Jacket',
            price: 59.99,
            imageUrl: '/placeholder.svg'
          },
          quantity: 1,
          price: 59.99
        }
      ],
      totalAmount: 59.99,
      status: 'delivered',
      paymentInfo: {
        method: 'mpesa',
        status: 'completed',
        transactionId: 'MPE1234567',
        amount: 59.99
      },
      shippingInfo: {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '0712345678',
        address: '123 Main St',
        city: 'Nairobi',
        state: 'Nairobi',
        postalCode: '00100',
        country: 'Kenya',
        shippingMethod: 'standard'
      },
      deliveryInfo: {
        estimatedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        actualDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      history: [
        {
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          status: 'pending',
          note: 'Order created',
        },
        {
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          status: 'processing',
          note: 'Payment confirmed',
        },
        {
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          status: 'ready',
          note: 'Order ready for delivery',
        },
        {
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: 'outForDelivery',
          note: 'Order out for delivery',
        },
        {
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          status: 'delivered',
          note: 'Order delivered',
        }
      ]
    },
    {
      id: '2',
      orderNumber: 'TTS-20250408-5678',
      customer: {
        id: customerId,
        name: 'John Doe',
        email: 'john@example.com'
      },
      items: [
        {
          productId: '2',
          product: {
            id: '2',
            title: 'Classic White Shirt',
            price: 29.99,
            imageUrl: '/placeholder.svg'
          },
          quantity: 2,
          price: 59.98
        }
      ],
      totalAmount: 59.98,
      status: 'processing',
      paymentInfo: {
        method: 'card',
        status: 'completed',
        transactionId: 'CARD9876543',
        amount: 59.98
      },
      shippingInfo: {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '0712345678',
        address: '123 Main St',
        city: 'Nairobi',
        state: 'Nairobi',
        postalCode: '00100',
        country: 'Kenya',
        shippingMethod: 'express'
      },
      deliveryInfo: {
        estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      },
      orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      history: [
        {
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          status: 'pending',
          note: 'Order created',
        },
        {
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          status: 'processing',
          note: 'Payment confirmed',
        }
      ]
    }
  ];
};
