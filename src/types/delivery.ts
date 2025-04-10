
export type DeliveryStatus = 'assigned' | 'in-progress' | 'completed';

export interface DeliveryItem {
  id: string;
  name: string;
  barcode: string;
}

export interface DeliveryCustomer {
  name: string;
  phone: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
}

export interface DeliveryType {
  id: string;
  orderNumber: string;
  customer: DeliveryCustomer;
  items: DeliveryItem[];
  status: DeliveryStatus;
  deliveryDate: string;
}

// Mock delivery data for demo
export const mockDeliveries: DeliveryType[] = [
  {
    id: 'DEL-001',
    orderNumber: 'TTS-20240410-0001',
    customer: {
      name: 'Jane Smith',
      phone: '+254712345678',
      address: {
        street: '123 Kimathi Street',
        city: 'Nairobi',
        zipCode: '00100'
      }
    },
    items: [
      {
        id: 'ITEM-001',
        name: 'Vintage Denim Jacket',
        barcode: '1234567890'
      },
      {
        id: 'ITEM-002',
        name: 'Floral Summer Dress',
        barcode: '0987654321'
      }
    ],
    status: 'assigned',
    deliveryDate: '2024-04-10'
  },
  {
    id: 'DEL-002',
    orderNumber: 'TTS-20240410-0002',
    customer: {
      name: 'John Doe',
      phone: '+254723456789',
      address: {
        street: '456 Moi Avenue',
        city: 'Nairobi',
        zipCode: '00100'
      }
    },
    items: [
      {
        id: 'ITEM-003',
        name: 'Leather Boots',
        barcode: '5678901234'
      }
    ],
    status: 'in-progress',
    deliveryDate: '2024-04-10'
  },
  {
    id: 'DEL-003',
    orderNumber: 'TTS-20240410-0003',
    customer: {
      name: 'Alice Johnson',
      phone: '+254734567890',
      address: {
        street: '789 Tom Mboya Street',
        city: 'Nairobi',
        zipCode: '00100'
      }
    },
    items: [
      {
        id: 'ITEM-004',
        name: 'Cotton T-Shirt',
        barcode: '4321098765'
      },
      {
        id: 'ITEM-005',
        name: 'Linen Pants',
        barcode: '6789012345'
      }
    ],
    status: 'completed',
    deliveryDate: '2024-04-09'
  }
];
