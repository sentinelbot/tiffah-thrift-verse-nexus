
import { 
  SalesData, 
  SalesByCategory, 
  InventoryStatus, 
  StaffPerformanceData, 
  CustomerBehavior, 
  MarketingEffectiveness, 
  SystemPerformance 
} from '@/types';

// Utility functions
export const formatCurrency = (value: number): string => {
  return `KSh ${value.toFixed(2)}`;
};

export const exportToCSV = (data: any[], filename: string) => {
  // Implementation of CSV export
  console.log(`Exporting ${filename} to CSV`, data);
  // In a real app, this would generate and download a CSV file
};

export const exportToPDF = (elementId: string, filename: string) => {
  // Implementation of PDF export
  console.log(`Exporting ${elementId} to PDF as ${filename}`);
  // In a real app, this would generate and download a PDF file
};

// Page load time analytics
export const recordPageLoadTime = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigationTiming.loadEventEnd - navigationTiming.startTime;
      console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
      
      // In a real app, we would send this data to an analytics service
      // For now, we just log it to the console
    });
  }
};

// Sample data functions for analytics
export const fetchSalesData = async (): Promise<SalesData[]> => {
  // This would be an API call in a real application
  return [
    { date: '2023-01-01', revenue: 5000, orders: 120, averageOrderValue: 41.67 },
    { date: '2023-01-02', revenue: 6200, orders: 145, averageOrderValue: 42.76 },
    { date: '2023-01-03', revenue: 5800, orders: 135, averageOrderValue: 42.96 },
    { date: '2023-01-04', revenue: 7500, orders: 160, averageOrderValue: 46.88 },
    { date: '2023-01-05', revenue: 7800, orders: 170, averageOrderValue: 45.88 },
    { date: '2023-01-06', revenue: 8200, orders: 175, averageOrderValue: 46.86 },
    { date: '2023-01-07', revenue: 9000, orders: 190, averageOrderValue: 47.37 },
  ];
};

export const fetchSalesByCategory = async (): Promise<SalesByCategory[]> => {
  return [
    { category: 'Dresses', revenue: 12000, units: 240, percentage: 30 },
    { category: 'Shirts', revenue: 8000, units: 200, percentage: 20 },
    { category: 'Pants', revenue: 6000, units: 120, percentage: 15 },
    { category: 'Shoes', revenue: 10000, units: 150, percentage: 25 },
    { category: 'Accessories', revenue: 4000, units: 100, percentage: 10 },
  ];
};

export const fetchInventoryStatus = async (): Promise<InventoryStatus[]> => {
  return [
    { category: 'Dresses', inStock: 120, lowStock: 15, outOfStock: 5, totalValue: 12000 },
    { category: 'Shirts', inStock: 200, lowStock: 10, outOfStock: 3, totalValue: 8000 },
    { category: 'Pants', inStock: 150, lowStock: 12, outOfStock: 8, totalValue: 7500 },
    { category: 'Shoes', inStock: 90, lowStock: 20, outOfStock: 10, totalValue: 13500 },
    { category: 'Accessories', inStock: 300, lowStock: 5, outOfStock: 2, totalValue: 4500 },
  ];
};

export const fetchStaffPerformance = async (): Promise<StaffPerformanceData[]> => {
  return [
    { staffId: '1', name: 'John Doe', role: 'productManager', ordersProcessed: 120, itemsProcessed: 350, averageTime: 5.2, rating: 4.8 },
    { staffId: '2', name: 'Jane Smith', role: 'orderPreparer', ordersProcessed: 85, itemsProcessed: 280, averageTime: 4.5, rating: 4.6 },
    { staffId: '3', name: 'Bob Johnson', role: 'deliveryStaff', ordersProcessed: 65, itemsProcessed: 65, averageTime: 22.3, rating: 4.2 },
    { staffId: '4', name: 'Alice Brown', role: 'productManager', ordersProcessed: 110, itemsProcessed: 320, averageTime: 5.7, rating: 4.7 },
  ];
};

export const fetchCustomerBehavior = async (): Promise<CustomerBehavior[]> => {
  return [
    { metric: 'Average Order Value', value: 45.32, previousValue: 42.18, change: 7.4, count: 1250 },
    { metric: 'Cart Abandonment Rate', value: 22.5, previousValue: 24.8, change: -9.3, averageSpend: 38.45 },
    { metric: 'Return Rate', value: 3.2, previousValue: 3.5, change: -8.6, repeatRate: 65.2 },
    { metric: 'Customer Retention', value: 68.4, previousValue: 65.9, change: 3.8, averageItemsPerOrder: 2.7 },
    { metric: 'Time on Site (mins)', value: 4.2, previousValue: 3.8, change: 10.5 },
  ];
};

export const fetchMarketingEffectiveness = async (): Promise<MarketingEffectiveness[]> => {
  return [
    { channel: 'Social Media', visits: 4560, conversions: 320, revenue: 15000, roi: 3.2 },
    { channel: 'Email', visits: 3200, conversions: 280, revenue: 12500, roi: 4.5 },
    { channel: 'Search', visits: 6800, conversions: 450, revenue: 20000, roi: 3.8 },
    { channel: 'Direct', visits: 2500, conversions: 180, revenue: 8200, roi: 2.1 },
    { channel: 'Referral', visits: 1800, conversions: 150, revenue: 6500, roi: 3.4 },
  ];
};

export const fetchSystemPerformance = async (): Promise<SystemPerformance[]> => {
  return [
    { metric: 'Page Load Time (s)', value: 1.8, target: 2, status: 'good', pageLoadTime: 1.8 },
    { metric: 'API Response Time (ms)', value: 220, target: 200, status: 'warning', serverResponseTime: 220 },
    { metric: 'Database Query Time (ms)', value: 85, target: 100, status: 'good', errorRate: 0.8 },
    { metric: 'Error Rate (%)', value: 0.8, target: 1, status: 'good', userSatisfaction: 4.5 },
    { metric: 'Server CPU Usage (%)', value: 78, target: 80, status: 'warning' },
  ];
};
