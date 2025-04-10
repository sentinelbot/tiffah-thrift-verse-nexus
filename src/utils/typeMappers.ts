
import {
  SupabaseProduct,
  ProductImageSupabase,
  OrderSupabase,
  OrderItemSupabase,
  SalesDataSupabase,
  SalesByCategorySupabase,
  InventoryStatusSupabase,
  StaffPerformanceSupabase
} from '@/types/supabase';
import {
  Product,
  ProductImage,
  Order,
  OrderItem,
  SalesData,
  SalesByCategory,
  InventoryStatus,
  StaffPerformanceData
} from '@/types';

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
export function convertToProductType(product: SupabaseProduct | Product) {
  return {
    id: product.id,
    name: product.name,
    title: 'title' in product ? product.title : product.name,
    price: Number(product.price),
    originalPrice: 'original_price' in product ? Number(product.original_price) : product.originalPrice,
    size: product.size,
    imageUrl: 'image_url' in product ? product.image_url : 
              product.images && product.images.length > 0 ? 
              product.images.find(img => img.isMain)?.url || product.images[0].url : 
              '/placeholder.svg'
  };
}
