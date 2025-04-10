
export interface SalesData {
  date: string;
  value: number;
  previousValue?: number;
  // Additional properties needed by EnhancedSalesChart
  period: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
  previousPeriodChange: number;
}

export interface SalesByCategory {
  category: string;
  value: number;
  percentage: number;
  // Additional property needed
  sales: number;
}

export interface InventoryStatus {
  status: string;
  count: number;
  value: number;
  // Additional properties
  category: string;
  inStock: number;
  lowStock: number;
  totalValue: number;
}

export interface StaffPerformanceData {
  name: string;
  ordersProcessed: number;
  productsUploaded: number;
  deliveriesCompleted: number;
  customerRating: number;
  // Additional properties
  role: string;
  processed?: number;
  fulfilled?: number;
  completed?: number;
  target: number;
  efficiency: number;
}

export interface CustomerBehavior {
  period: string;
  newCustomers: number;
  returningCustomers: number;
  averageOrderValue: number;
  conversionRate: number;
  // Additional properties
  segment: string;
  count: number;
  averageSpend: number;
  repeatRate: number;
  averageItemsPerOrder: number;
}

export interface MarketingEffectiveness {
  channel: string;
  visitors: number;
  conversion: number;
  revenue: number;
  roi: number;
  // Additional properties
  campaign: string;
  clicks: number;
  conversions: number;
}

export interface SystemPerformance {
  metric: string;
  value: number;
  target: number;
  status: 'good' | 'warning' | 'critical';
  // Additional properties
  pageLoadTime: number;
  serverResponseTime: number;
  errorRate: number;
  userSatisfaction: number;
}
