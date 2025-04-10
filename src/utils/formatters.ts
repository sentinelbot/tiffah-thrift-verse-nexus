
/**
 * Format a number as a price in KSh
 * @param value - The number to format
 * @returns Formatted price string
 */
export const formatPrice = (value: number): string => {
  return `KSh ${value.toLocaleString()}`;
};

/**
 * Format a number as a percentage
 * @param value - The percentage value (e.g., 0.25 for 25%)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

/**
 * Format a number with thousand separators
 * @param value - The number to format
 * @returns Formatted number string
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString();
};

/**
 * Format a date as a relative time (e.g., "2 days ago")
 * @param date - The date to format
 * @returns Formatted relative time string
 */
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
};

/**
 * Format a date as a short date string (e.g., "Jan 1, 2023")
 * @param date - The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format a date as a time string (e.g., "12:30 PM")
 * @param date - The date to format
 * @returns Formatted time string
 */
export const formatTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Format a date as a date and time string (e.g., "Jan 1, 2023 at 12:30 PM")
 * @param date - The date to format
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: Date | string): string => {
  return `${formatDate(date)} at ${formatTime(date)}`;
};
