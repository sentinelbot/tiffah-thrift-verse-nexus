
/**
 * Format a price to the KSh currency format
 */
export const formatPrice = (price: number): string => {
  return `KSh ${price.toFixed(2)}`;
};

/**
 * Format a percentage
 */
export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(1)}%`;
};

/**
 * Format a number with commas
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};
