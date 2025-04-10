
import {
  Product,
  ProductImage,
  Order,
  OrderItem,
  Customer,
  ShippingAddress,
  DeliveryInfo,
  PaymentInfo,
  OrderHistory,
  SalesData,
  SalesByCategory,
  InventoryStatus,
  StaffPerformanceData
} from '@/types';

// Map from database response to frontend types
export const mapDbProductToProduct = (dbProduct: any): Product => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    title: dbProduct.title || dbProduct.name,
    description: dbProduct.description,
    price: dbProduct.price,
    originalPrice: dbProduct.original_price,
    category: dbProduct.category,
    subCategory: dbProduct.sub_category,
    condition: dbProduct.condition,
    size: dbProduct.size,
    color: dbProduct.color,
    brand: dbProduct.brand,
    barcode: dbProduct.barcode,
    status: dbProduct.status,
    imageUrl: dbProduct.image_url || dbProduct.images?.[0]?.url,
    featured: dbProduct.featured
  };
};

export const mapDbProductImageToProductImage = (dbImage: any): ProductImage => {
  return {
    id: dbImage.id,
    url: dbImage.url,
    alt: dbImage.alt || '',
    isMain: dbImage.is_main,
    displayOrder: dbImage.display_order || 0
  };
};

export const mapDbOrderToOrder = (dbOrder: any): Order => {
  return {
    id: dbOrder.id,
    orderNumber: dbOrder.order_number,
    customerId: dbOrder.customer_id,
    totalAmount: dbOrder.total_amount,
    status: dbOrder.status,
    paymentMethod: dbOrder.payment_method,
    paymentStatus: dbOrder.payment_status,
    paymentTransactionId: dbOrder.payment_transaction_id,
    createdAt: dbOrder.created_at,
    updatedAt: dbOrder.updated_at,
    orderDate: dbOrder.order_date || dbOrder.created_at,
    processedBy: dbOrder.processed_by,
    notes: dbOrder.notes,
    barcodeData: dbOrder.barcode_data
  };
};

// Helper function to safely convert dates
export const toISOString = (date: string | Date | undefined): string | undefined => {
  if (!date) return undefined;
  if (typeof date === 'string') return date;
  return date.toISOString();
};

export const mapInventoryTrackingToDb = (tracking: any): Record<string, string> => {
  return {
    inStockDate: tracking.inStockDate ? toISOString(tracking.inStockDate) : undefined,
    reservedUntil: tracking.reservedUntil ? toISOString(tracking.reservedUntil) : undefined,
    soldDate: tracking.soldDate ? toISOString(tracking.soldDate) : undefined
  };
};

// More mappers as needed for analytics data
export const mapDbSalesDataToSalesData = (dbData: any): SalesData => {
  return {
    date: dbData.date,
    revenue: dbData.revenue,
    orders: dbData.orders,
    averageOrderValue: dbData.average_order_value
  };
};

export const mapDbSalesByCategoryToSalesByCategory = (dbData: any): SalesByCategory => {
  return {
    category: dbData.category,
    revenue: dbData.revenue,
    units: dbData.units,
    percentage: dbData.percentage
  };
};

export const mapDbInventoryStatusToInventoryStatus = (dbData: any): InventoryStatus => {
  return {
    category: dbData.category,
    inStock: dbData.in_stock,
    lowStock: dbData.low_stock,
    outOfStock: dbData.out_of_stock,
    totalValue: dbData.total_value
  };
};

export const mapDbStaffPerformanceToStaffPerformance = (dbData: any): StaffPerformanceData => {
  return {
    staffId: dbData.staff_id,
    name: dbData.name,
    ordersProcessed: dbData.orders_processed,
    itemsProcessed: dbData.items_processed,
    averageTimeHours: dbData.average_time_hours
  };
};
