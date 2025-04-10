
/**
 * Format a price value with Kenyan Shilling currency symbol
 */
export const formatPrice = (price: number): string => {
  return `KSh ${price.toFixed(2)}`;
};

/**
 * Format a percentage value
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

/**
 * Format a number with thousands separators
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString();
};
