
import {
  SupabaseProduct,
  ProductImageSupabase,
  SalesDataSupabase,
  SalesByCategorySupabase,
  InventoryStatusSupabase,
  StaffPerformanceSupabase
} from '@/types/supabase';
import {
  Product,
  ProductImage,
  SalesData,
  SalesByCategory,
  InventoryStatus,
  StaffPerformanceData
} from '@/types';
import { Order, OrderItem } from '@/types/order';
import { OrderSupabase, OrderItemSupabase } from '@/types/order';
import { Json, ProductType } from '@/types/product';

/**
 * Maps a Supabase product to a frontend Product
 */
export function mapSupabaseProduct(supabaseProduct: SupabaseProduct): Product {
  return {
    id: supabaseProduct.id,
    name: supabaseProduct.name,
    description: supabaseProduct.description || '',
    price: Number(supabaseProduct.price),
    originalPrice: supabaseProduct.original_price ? Number(supabaseProduct.original_price) : undefined,
    category: supabaseProduct.category,
    subCategory: supabaseProduct.sub_category,
    tags: supabaseProduct.tags || [],
    size: supabaseProduct.size,
    color: supabaseProduct.color,
    brand: supabaseProduct.brand,
    condition: supabaseProduct.condition,
    barcode: supabaseProduct.barcode,
    status: supabaseProduct.status,
    dateAdded: new Date(supabaseProduct.created_at),
    lastUpdated: new Date(supabaseProduct.updated_at),
    addedBy: supabaseProduct.created_by,
    featured: supabaseProduct.featured,
    measurements: supabaseProduct.measurements,
    inventoryTracking: supabaseProduct.inventory_tracking ? {
      inStockDate: supabaseProduct.inventory_tracking.inStockDate ? new Date(supabaseProduct.inventory_tracking.inStockDate) : undefined,
      reservedUntil: supabaseProduct.inventory_tracking.reservedUntil ? new Date(supabaseProduct.inventory_tracking.reservedUntil) : undefined,
      soldDate: supabaseProduct.inventory_tracking.soldDate ? new Date(supabaseProduct.inventory_tracking.soldDate) : undefined,
    } : undefined
  };
}

/**
 * Maps a Supabase product image to a frontend ProductImage
 */
export function mapSupabaseProductImage(supabaseImage: ProductImageSupabase): ProductImage {
  return {
    id: supabaseImage.id,
    url: supabaseImage.url,
    alt: supabaseImage.alt,
    isMain: supabaseImage.is_main,
    displayOrder: supabaseImage.display_order
  };
}

/**
 * Maps a frontend Product to a Supabase product format
 */
export function mapProductToSupabase(product: Partial<Product>): Partial<SupabaseProduct> {
  const result: Partial<SupabaseProduct> = {
    name: product.name,
    title: product.name, // Use name as title for compatibility
    description: product.description,
    price: product.price,
    original_price: product.originalPrice,
    category: product.category,
    sub_category: product.subCategory,
    tags: product.tags,
    size: product.size,
    color: product.color,
    brand: product.brand,
    condition: product.condition,
    barcode: product.barcode,
    status: product.status,
    featured: product.featured,
    measurements: product.measurements,
    inventory_tracking: product.inventoryTracking ? {
      inStockDate: product.inventoryTracking.inStockDate?.toISOString(),
      reservedUntil: product.inventoryTracking.reservedUntil?.toISOString(),
      soldDate: product.inventoryTracking.soldDate?.toISOString(),
    } : undefined
  };

  return result;
}

/**
 * Maps Supabase order data to frontend format
 */
export function mapSupabaseOrder(data: OrderSupabase): Order {
  return {
    id: data.id,
    orderNumber: data.order_number,
    totalAmount: Number(data.total_amount),
    status: data.status,
    paymentMethod: data.payment_method,
    paymentStatus: data.payment_status,
    paymentTransactionId: data.payment_transaction_id,
    customerId: data.customer_id,
    createdAt: new Date(data.created_at),
    updatedAt: data.updated_at ? new Date(data.updated_at) : undefined
  };
}

/**
 * Maps Supabase order item to frontend format
 */
export function mapSupabaseOrderItem(data: OrderItemSupabase): OrderItem {
  return {
    id: data.id,
    orderId: data.order_id,
    productId: data.product_id,
    price: Number(data.price),
    quantity: data.quantity,
    createdAt: data.created_at ? new Date(data.created_at) : undefined
  };
}

/**
 * Maps Supabase sales data to frontend format
 */
export function mapSupabaseSalesData(data: SalesDataSupabase): SalesData {
  return {
    date: data.date,
    revenue: Number(data.revenue),
    orders: data.orders,
    averageOrderValue: Number(data.average_order_value)
  };
}

/**
 * Maps Supabase sales by category to frontend format
 */
export function mapSupabaseSalesByCategory(data: SalesByCategorySupabase): SalesByCategory {
  return {
    category: data.category,
    revenue: Number(data.revenue),
    units: data.units,
    percentage: Number(data.percentage)
  };
}

/**
 * Maps Supabase inventory status to frontend format
 */
export function mapSupabaseInventoryStatus(data: InventoryStatusSupabase): InventoryStatus {
  return {
    category: data.category,
    inStock: data.in_stock,
    lowStock: data.low_stock,
    outOfStock: data.out_of_stock,
    totalValue: Number(data.total_value)
  };
}

/**
 * Maps Supabase staff performance to frontend format
 */
export function mapSupabaseStaffPerformance(data: StaffPerformanceSupabase): StaffPerformanceData {
  return {
    staffId: data.staff_id,
    name: data.name,
    role: 'staff', // Default role, would be determined by querying user_roles
    ordersProcessed: data.orders_processed,
    itemsProcessed: data.items_processed,
    averageTime: data.average_time_hours,
    rating: 0 // Default value, would be calculated or fetched separately
  };
}

/**
 * Converts a Supabase product to a simplified ProductType
 */
export function convertToProductType(product: any): ProductType {
  return {
    id: product.id,
    name: product.name || product.title,
    title: 'title' in product ? product.title : product.name,
    price: Number(product.price),
    originalPrice: 'original_price' in product ? Number(product.original_price) : product.originalPrice,
    size: product.size,
    category: product.category,
    condition: product.condition,
    brand: product.brand,
    color: product.color,
    imageUrl: product.imageUrl || product.image_url || 
              (product.images && product.images.length > 0 ? 
              product.images.find((img: any) => img.isMain || img.is_main)?.url || product.images[0].url : 
              '/placeholder.svg')
  };
}
