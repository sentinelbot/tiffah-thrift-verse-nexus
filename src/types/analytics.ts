
export interface SalesData {
  date: string;
  value: number;
  previousValue?: number;
}

export interface SalesByCategory {
  category: string;
  value: number;
  percentage: number;
}

export interface InventoryStatus {
  status: string;
  count: number;
  value: number;
}

export interface StaffPerformanceData {
  name: string;
  ordersProcessed: number;
  productsUploaded: number;
  deliveriesCompleted: number;
  customerRating: number;
}

export interface CustomerBehavior {
  period: string;
  newCustomers: number;
  returningCustomers: number;
  averageOrderValue: number;
  conversionRate: number;
}

export interface MarketingEffectiveness {
  channel: string;
  visitors: number;
  conversion: number;
  revenue: number;
  roi: number;
}

export interface SystemPerformance {
  metric: string;
  value: number;
  target: number;
  status: 'good' | 'warning' | 'critical';
}
