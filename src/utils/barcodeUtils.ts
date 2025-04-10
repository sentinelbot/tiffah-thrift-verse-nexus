
/**
 * Generates a unique barcode with an optional prefix
 * @param prefix Optional prefix for the barcode (default: 'TTS-')
 * @returns A unique barcode string
 */
export const generateUniqueBarcode = (prefix: string = 'TTS-'): string => {
  // Generate a timestamp component (base36 encoded)
  const timestamp = Date.now().toString(36).toUpperCase();
  
  // Generate a random component (5 characters)
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  
  // Combine parts to create a unique barcode
  return `${prefix}${timestamp}-${randomPart}`;
};

/**
 * Validates a barcode format
 * @param barcode The barcode to validate
 * @returns boolean indicating if the barcode is valid
 */
export const validateBarcode = (barcode: string): boolean => {
  // Simple validation - can be expanded based on specific requirements
  const pattern = /^[A-Z0-9-]+$/;
  return pattern.test(barcode) && barcode.length >= 10;
};

/**
 * Formats a barcode for display
 * @param barcode The barcode to format
 * @returns A formatted barcode string
 */
export const formatBarcode = (barcode: string): string => {
  // Format the barcode for display or printing
  return barcode.trim().toUpperCase();
};
