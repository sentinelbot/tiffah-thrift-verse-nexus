
import { supabase } from '@/integrations/supabase/client';
import JsBarcode from 'jsbarcode';

/**
 * Generates a unique barcode for a product
 * Format: TTS-XXXXX where X is a random digit
 */
export const generateBarcode = async (): Promise<string> => {
  // Generate a random 5-digit number
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  const barcode = `TTS-${randomDigits}`;
  
  // Check if the barcode already exists in the database
  const { data } = await supabase
    .from('products')
    .select('id')
    .eq('barcode', barcode)
    .single();
  
  // If the barcode exists, generate a new one recursively
  if (data) {
    return generateBarcode();
  }
  
  return barcode;
};

/**
 * Formats a barcode string for display
 */
export const formatBarcode = (barcode: string): string => {
  if (!barcode) return '';
  return barcode.toUpperCase();
};

/**
 * Validates a barcode format
 */
export const validateBarcode = (barcode: string): boolean => {
  // Check if the barcode follows the TTS-XXXXX format
  const regex = /^TTS-\d{5}$/;
  return regex.test(barcode);
};

/**
 * Generates a barcode data URL for display or printing
 * This is a synchronous function that returns a data URL string
 */
export const generateBarcodeDataURL = (barcodeText: string): string => {
  if (!barcodeText) return '';
  
  // Create a canvas element to render the barcode
  const canvas = document.createElement('canvas');
  
  try {
    // Generate the barcode on the canvas
    JsBarcode(canvas, barcodeText, {
      format: 'CODE128',
      displayValue: false,
      background: '#ffffff',
      lineColor: '#000000',
      width: 2,
      height: 70,
      margin: 10,
    });
    
    // Convert the canvas to a data URL
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error generating barcode:', error);
    return '';
  }
};

/**
 * Synchronous version of generateBarcode for immediate use
 * This doesn't check the database but generates a unique code for immediate use
 */
export const getBarcodeSynchronously = (): string => {
  // Generate a random 5-digit number for immediate use
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `TTS-${randomDigits}`;
};

/**
 * Generate a unique barcode synchronously (for cases where we can't use async)
 */
export const generateUniqueBarcode = (): string => {
  // Generate a random 5-digit number for immediate use
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `TTS-${randomDigits}`;
};

/**
 * Normalize product data to ensure consistent property naming
 * This is useful when dealing with data from different sources (API, database, etc.)
 */
export const normalizeProductData = (product: any) => {
  return {
    ...product,
    name: product.name || product.title, // Support both name and title
    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
    originalPrice: product.originalPrice || product.original_price,
    subCategory: product.subCategory || product.sub_category,
  };
};
