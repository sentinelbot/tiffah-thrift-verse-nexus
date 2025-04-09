
import { supabase } from '@/integrations/supabase/client';

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
