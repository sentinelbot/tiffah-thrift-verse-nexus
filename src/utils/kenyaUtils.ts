
// Kenya counties data with delivery pricing and estimated delivery times
export interface CountyData {
  name: string;
  standardDelivery: {
    price: number;
    days: string;
  };
  expressDelivery: {
    price: number;
    days: string;
  };
  zone: 'nairobi' | 'central' | 'other';
}

// Define Kenya counties with shipping data according to zones
export const kenyaCounties: CountyData[] = [
  {
    name: 'Nairobi',
    standardDelivery: { price: 200, days: '1-2' },
    expressDelivery: { price: 350, days: 'Same day' },
    zone: 'nairobi'
  },
  {
    name: 'Kiambu',
    standardDelivery: { price: 250, days: '1-3' },
    expressDelivery: { price: 400, days: '1' },
    zone: 'central'
  },
  {
    name: 'Kajiado',
    standardDelivery: { price: 300, days: '2-3' },
    expressDelivery: { price: 450, days: '1' },
    zone: 'central'
  },
  {
    name: 'Machakos',
    standardDelivery: { price: 300, days: '2-3' },
    expressDelivery: { price: 450, days: '1' },
    zone: 'central'
  },
  {
    name: 'Muranga',
    standardDelivery: { price: 350, days: '2-4' },
    expressDelivery: { price: 500, days: '1-2' },
    zone: 'central'
  },
  {
    name: 'Nyeri',
    standardDelivery: { price: 400, days: '2-4' },
    expressDelivery: { price: 550, days: '1-2' },
    zone: 'central'
  },
  {
    name: 'Kirinyaga',
    standardDelivery: { price: 400, days: '2-4' },
    expressDelivery: { price: 550, days: '1-2' },
    zone: 'central'
  },
  {
    name: 'Nakuru',
    standardDelivery: { price: 450, days: '3-5' },
    expressDelivery: { price: 600, days: '1-2' },
    zone: 'other'
  },
  {
    name: 'Mombasa',
    standardDelivery: { price: 500, days: '3-5' },
    expressDelivery: { price: 750, days: '2-3' },
    zone: 'other'
  },
  {
    name: 'Kisumu',
    standardDelivery: { price: 500, days: '3-5' },
    expressDelivery: { price: 750, days: '2-3' },
    zone: 'other'
  },
  // Add remaining 37 counties with appropriate pricing and delivery times
  {
    name: 'Kakamega',
    standardDelivery: { price: 500, days: '3-5' },
    expressDelivery: { price: 750, days: '2-3' },
    zone: 'other'
  },
  {
    name: 'Bungoma',
    standardDelivery: { price: 500, days: '3-5' },
    expressDelivery: { price: 750, days: '2-3' },
    zone: 'other'
  },
  {
    name: 'Other',
    standardDelivery: { price: 500, days: '3-7' },
    expressDelivery: { price: 800, days: '2-3' },
    zone: 'other'
  }
];

// Kenya public holidays for current year (2025)
export const kenyaHolidays = [
  { date: '2025-01-01', name: 'New Year\'s Day' },
  { date: '2025-04-18', name: 'Good Friday' },
  { date: '2025-04-21', name: 'Easter Monday' },
  { date: '2025-05-01', name: 'Labour Day' },
  { date: '2025-06-01', name: 'Madaraka Day' },
  { date: '2025-10-20', name: 'Mashujaa Day' },
  { date: '2025-12-12', name: 'Jamhuri Day' },
  { date: '2025-12-25', name: 'Christmas Day' },
  { date: '2025-12-26', name: 'Boxing Day' }
];

// Check if a date is a holiday
export const isHoliday = (date: Date): boolean => {
  const dateString = date.toISOString().split('T')[0];
  return kenyaHolidays.some(holiday => holiday.date === dateString);
};

// Calculate delivery date based on county and delivery method, accounting for holidays
export const calculateEstimatedDeliveryDate = (
  county: string,
  deliveryMethod: 'standard' | 'express'
): Date => {
  const countyData = kenyaCounties.find(c => c.name === county) || kenyaCounties.find(c => c.name === 'Other')!;
  const deliveryDays = deliveryMethod === 'standard' 
    ? parseInt(countyData.standardDelivery.days.split('-')[1] || countyData.standardDelivery.days)
    : parseInt(countyData.expressDelivery.days.split('-')[1] || countyData.expressDelivery.days);
  
  let estimatedDate = new Date();
  let daysToAdd = deliveryDays;
  
  // If same day delivery and it's past 2 PM, move to next day
  if (deliveryDays === 0 && estimatedDate.getHours() >= 14) {
    daysToAdd = 1;
  }
  
  // Skip weekends and holidays
  while (daysToAdd > 0) {
    estimatedDate.setDate(estimatedDate.getDate() + 1);
    const dayOfWeek = estimatedDate.getDay();
    
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday(estimatedDate)) {
      daysToAdd--;
    }
  }
  
  return estimatedDate;
};

// Get delivery pricing for a county
export const getDeliveryPricing = (county: string, deliveryMethod: 'standard' | 'express'): number => {
  const countyData = kenyaCounties.find(c => c.name === county) || kenyaCounties.find(c => c.name === 'Other')!;
  return deliveryMethod === 'standard' 
    ? countyData.standardDelivery.price 
    : countyData.expressDelivery.price;
};

// Format phone number to M-Pesa format (07XX or +254)
export const formatMpesaPhone = (phone: string): string => {
  // Remove any spaces or special characters
  let cleanPhone = phone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
  
  // Handle +254 format
  if (cleanPhone.startsWith('+254')) {
    return cleanPhone;
  }
  
  // Handle 07XX format, convert to +254
  if (cleanPhone.startsWith('0')) {
    return `+254${cleanPhone.substring(1)}`;
  }
  
  // If it doesn't match expected formats, return as is
  return cleanPhone;
};

// Check if date is a business day (not weekend or holiday)
export const isBusinessDay = (date: Date): boolean => {
  const dayOfWeek = date.getDay();
  return dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday(date);
};

// Get next business day
export const getNextBusinessDay = (date: Date = new Date()): Date => {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  
  while (!isBusinessDay(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  return nextDay;
};
