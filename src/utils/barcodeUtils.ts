
import JsBarcode from 'jsbarcode';

export const generateBarcodeDataURL = (value: string): string => {
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, value, {
    format: 'CODE128',
    width: 2,
    height: 100,
    displayValue: true,
    fontSize: 18,
    margin: 10,
    background: '#171717',
    lineColor: '#ffffff'
  });
  return canvas.toDataURL('image/png');
};

export const generateUniqueBarcode = (): string => {
  // Format: TTS-YYYYMMDD-XXXX (where XXXX is a random number)
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  
  return `TTS-${year}${month}${day}-${random}`;
};
