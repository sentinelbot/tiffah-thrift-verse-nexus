
import { supabase } from '@/integrations/supabase/client';
import { 
  SalesData, 
  SalesByCategory, 
  InventoryStatus, 
  StaffPerformanceData,
  CustomerBehavior,
  MarketingEffectiveness,
  SystemPerformance
} from '@/types';

// Helper to format numbers with commas
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

// Helper to format currency
export const formatCurrency = (amount: number): string => {
  return `KSh ${amount.toLocaleString()}`;
};

// Fetch sales data by time period (daily, weekly, monthly)
export const fetchSalesData = async (period: 'daily' | 'weekly' | 'monthly'): Promise<SalesData[]> => {
  // This would typically fetch from Supabase, but we're mocking data for now
  
  // Daily data
  if (period === 'daily') {
    return [
      { period: 'Mon', revenue: 1200, orders: 5, averageOrderValue: 240, previousPeriodChange: 10 },
      { period: 'Tue', revenue: 1800, orders: 7, averageOrderValue: 257, previousPeriodChange: 15 },
      { period: 'Wed', revenue: 1500, orders: 6, averageOrderValue: 250, previousPeriodChange: -5 },
      { period: 'Thu', revenue: 2000, orders: 8, averageOrderValue: 250, previousPeriodChange: 12 },
      { period: 'Fri', revenue: 2400, orders: 9, averageOrderValue: 267, previousPeriodChange: 20 },
      { period: 'Sat', revenue: 2800, orders: 11, averageOrderValue: 255, previousPeriodChange: 18 },
      { period: 'Sun', revenue: 1900, orders: 8, averageOrderValue: 238, previousPeriodChange: -8 },
    ];
  }
  
  // Weekly data
  if (period === 'weekly') {
    return [
      { period: 'Week 1', revenue: 12000, orders: 45, averageOrderValue: 267, previousPeriodChange: 8 },
      { period: 'Week 2', revenue: 18000, orders: 65, averageOrderValue: 277, previousPeriodChange: 15 },
      { period: 'Week 3', revenue: 15000, orders: 58, averageOrderValue: 259, previousPeriodChange: -5 },
      { period: 'Week 4', revenue: 20000, orders: 72, averageOrderValue: 278, previousPeriodChange: 12 },
    ];
  }
  
  // Monthly data
  return [
    { period: 'Jan', revenue: 45000, orders: 160, averageOrderValue: 281, previousPeriodChange: 5 },
    { period: 'Feb', revenue: 52000, orders: 180, averageOrderValue: 289, previousPeriodChange: 12 },
    { period: 'Mar', revenue: 49000, orders: 172, averageOrderValue: 285, previousPeriodChange: -3 },
    { period: 'Apr', revenue: 60000, orders: 210, averageOrderValue: 286, previousPeriodChange: 18 },
    { period: 'May', revenue: 55000, orders: 190, averageOrderValue: 289, previousPeriodChange: -8 },
    { period: 'Jun', revenue: 70000, orders: 235, averageOrderValue: 298, previousPeriodChange: 22 },
  ];
};

// Fetch sales data by category
export const fetchSalesByCategory = async (): Promise<SalesByCategory[]> => {
  // Mock data for sales by category
  return [
    { category: 'Dresses', sales: 35, percentage: 35 },
    { category: 'Tops', sales: 25, percentage: 25 },
    { category: 'Bottoms', sales: 15, percentage: 15 },
    { category: 'Accessories', sales: 10, percentage: 10 },
    { category: 'Shoes', sales: 15, percentage: 15 },
  ];
};

// Fetch inventory status
export const fetchInventoryStatus = async (): Promise<InventoryStatus[]> => {
  // Mock data for inventory status
  return [
    { category: 'Dresses', inStock: 65, lowStock: 5, totalValue: 18500 },
    { category: 'Tops', inStock: 45, lowStock: 8, totalValue: 9800 },
    { category: 'Bottoms', inStock: 30, lowStock: 4, totalValue: 7500 },
    { category: 'Accessories', inStock: 50, lowStock: 10, totalValue: 4200 },
    { category: 'Shoes', inStock: 20, lowStock: 15, totalValue: 12000 },
  ];
};

// Fetch staff performance data
export const fetchStaffPerformance = async (role: 'productManager' | 'orderPreparer' | 'deliveryStaff'): Promise<StaffPerformanceData[]> => {
  // Mock data for staff performance
  if (role === 'productManager') {
    return [
      { name: 'John', role: 'productManager', processed: 48, target: 40, efficiency: 120 },
      { name: 'Sarah', role: 'productManager', processed: 65, target: 40, efficiency: 162 },
      { name: 'Michael', role: 'productManager', processed: 38, target: 40, efficiency: 95 },
      { name: 'Emily', role: 'productManager', processed: 52, target: 40, efficiency: 130 },
    ];
  }
  
  if (role === 'orderPreparer') {
    return [
      { name: 'Alex', role: 'orderPreparer', fulfilled: 32, target: 25, efficiency: 128 },
      { name: 'Diana', role: 'orderPreparer', fulfilled: 28, target: 25, efficiency: 112 },
      { name: 'Robert', role: 'orderPreparer', fulfilled: 20, target: 25, efficiency: 80 },
      { name: 'Jessica', role: 'orderPreparer', fulfilled: 35, target: 25, efficiency: 140 },
    ];
  }
  
  // Delivery staff
  return [
    { name: 'Thomas', role: 'deliveryStaff', completed: 18, target: 15, efficiency: 120 },
    { name: 'Lisa', role: 'deliveryStaff', completed: 22, target: 15, efficiency: 147 },
    { name: 'Mark', role: 'deliveryStaff', completed: 12, target: 15, efficiency: 80 },
    { name: 'Sophie', role: 'deliveryStaff', completed: 19, target: 15, efficiency: 127 },
  ];
};

// Fetch customer behavior data
export const fetchCustomerBehavior = async (): Promise<CustomerBehavior[]> => {
  // Mock data for customer behavior
  return [
    { segment: 'New Customers', count: 120, averageSpend: 1800, repeatRate: 15, averageItemsPerOrder: 1.2 },
    { segment: 'Returning Customers', count: 85, averageSpend: 2400, repeatRate: 65, averageItemsPerOrder: 2.3 },
    { segment: 'VIP Customers', count: 25, averageSpend: 5200, repeatRate: 85, averageItemsPerOrder: 3.5 },
    { segment: 'One-time Shoppers', count: 210, averageSpend: 1200, repeatRate: 0, averageItemsPerOrder: 1.0 },
  ];
};

// Fetch marketing effectiveness data
export const fetchMarketingEffectiveness = async (): Promise<MarketingEffectiveness[]> => {
  // Mock data for marketing effectiveness
  return [
    { campaign: 'Spring Sale', clicks: 1250, conversions: 125, revenue: 25000, roi: 350 },
    { campaign: 'Fashion Week', clicks: 980, conversions: 82, revenue: 18500, roi: 245 },
    { campaign: 'Email Newsletter', clicks: 580, conversions: 63, revenue: 12600, roi: 420 },
    { campaign: 'Instagram Ads', clicks: 2300, conversions: 198, revenue: 38000, roi: 280 },
    { campaign: 'Referral Program', clicks: 450, conversions: 72, revenue: 15800, roi: 520 },
  ];
};

// Fetch system performance metrics
export const fetchSystemPerformance = async (): Promise<SystemPerformance> => {
  // Mock data for system performance
  return {
    pageLoadTime: 1.2, // seconds
    serverResponseTime: 0.3, // seconds
    errorRate: 0.5, // percentage
    userSatisfaction: 92, // percentage
  };
};

// Export simple reports in CSV format
export const exportToCSV = (data: any[], filename: string): void => {
  if (!data || !data.length) {
    console.error('No data to export');
    return;
  }

  // Get headers
  const headers = Object.keys(data[0]);
  
  // Convert data to CSV rows
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const cell = row[header];
        // Handle cells with commas by wrapping in quotes
        return typeof cell === 'string' && cell.includes(',') 
          ? `"${cell}"` 
          : cell;
      }).join(',')
    )
  ];
  
  // Create blob and download
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export reports in PDF format (mock - would require a PDF library in production)
export const exportToPDF = (data: any[], filename: string): void => {
  console.log('PDF export would be implemented with a library like jsPDF');
  alert('PDF Export functionality would be implemented with a library like jsPDF');
};

// Performance monitoring utility
export const recordPageLoadTime = (): void => {
  if (typeof window !== 'undefined' && window.performance) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    
    // In a real app, we would send this to our analytics backend
    console.log(`Page load time: ${pageLoadTime}ms`);
    
    // You could send this to Supabase for tracking
    // supabase.from('performance_metrics').insert([{ 
    //   page: window.location.pathname,
    //   load_time_ms: pageLoadTime,
    //   user_agent: navigator.userAgent,
    //   timestamp: new Date()
    // }]);
  }
};

// Error tracking utility
export const trackError = (error: Error, context: any = {}): void => {
  console.error('Error tracked:', error, context);
  
  // In a real app, we would send this to our error tracking system
  // supabase.from('error_logs').insert([{
  //   error_message: error.message,
  //   error_stack: error.stack,
  //   context: JSON.stringify(context),
  //   url: window.location.href,
  //   user_agent: navigator.userAgent,
  //   timestamp: new Date()
  // }]);
};
