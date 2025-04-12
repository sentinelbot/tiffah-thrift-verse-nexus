
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
 * Alias for generateBarcode for backward compatibility
 */
export const generateUniqueBarcode = generateBarcode;

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
 * Generates a Data URL for a barcode
 */
export const generateBarcodeDataURL = (barcode: string): string => {
  try {
    // Create a canvas element to render the barcode
    const canvas = document.createElement('canvas');
    
    // Use JSBarcode to render the barcode to the canvas
    JsBarcode(canvas, barcode, {
      format: 'CODE128',
      lineColor: '#000',
      width: 2,
      height: 100,
      displayValue: true,
      fontSize: 20,
      margin: 10
    });
    
    // Return the Data URL of the barcode image
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error generating barcode data URL:', error);
    return '';
  }
};

/**
 * Synchronous version that returns an empty string if there's an error
 * This helps with resolving Promise<string> vs string type issues
 */
export const getBarcodeDataURL = (barcode: string): string => {
  if (!barcode) return '';
  
  try {
    return generateBarcodeDataURL(barcode);
  } catch (error) {
    console.error('Error getting barcode data URL:', error);
    return '';
  }
};

/**
 * Asynchronously gets or generates a barcode
 */
export const getOrGenerateBarcode = async (existingBarcode?: string): Promise<string> => {
  if (existingBarcode && validateBarcode(existingBarcode)) {
    return existingBarcode;
  }
  
  return generateBarcode();
};
