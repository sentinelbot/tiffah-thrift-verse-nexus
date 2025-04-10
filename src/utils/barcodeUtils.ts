
import JsBarcode from 'jsbarcode';

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

/**
 * Generates a data URL for a barcode image
 * @param data The data to encode in the barcode
 * @param options Optional configuration options
 * @returns A data URL string for the barcode image
 */
export const generateBarcodeDataURL = (data: string, options: any = {}): string => {
  // Create a canvas element to render the barcode
  const canvas = document.createElement('canvas');
  
  // Set default options
  const defaultOptions = {
    format: 'CODE128',
    width: 2,
    height: 100,
    displayValue: true,
    background: '#ffffff',
    lineColor: '#000000',
    margin: 10,
    fontSize: 14,
    ...options
  };
  
  // Generate barcode on the canvas
  try {
    JsBarcode(canvas, data, defaultOptions);
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error generating barcode:', error);
    // Return a placeholder if barcode generation fails
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
  }
};
