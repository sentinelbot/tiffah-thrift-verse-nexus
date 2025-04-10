import Quagga from '@ericblade/quagga2';
import { toast } from 'sonner';

// Initialize the barcode scanner
export const initScanner = async (elementId: string, onDetect: (result: { code: string }) => void) => {
  try {
    await Quagga.init({
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: document.getElementById(elementId) as HTMLElement,
        constraints: {
          width: 480,
          height: 320,
          facingMode: 'environment',
        },
      },
      decoder: {
        readers: ['code_128_reader', 'ean_reader', 'ean_8_reader', 'code_39_reader', 'code_39_vin_reader'],
      },
      locate: true,
    });

    Quagga.start();

    Quagga.onDetected((result) => {
      if (result.codeResult.code) {
        // Play beep sound
        const audio = new Audio('/sounds/beep.mp3');
        audio.play().catch(() => {
          // Ignore audio play errors
        });
        
        onDetect({ code: result.codeResult.code });
      }
    });

    return true;
  } catch (error) {
    console.error('Failed to initialize scanner:', error);
    return false;
  }
};

// Stop the barcode scanner
export const stopScanner = () => {
  Quagga.stop();
};

// Check if online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Process product scan
export const processProductScan = async (code: string): Promise<boolean> => {
  // In a real app, this would make an API call to the backend
  try {
    console.log(`Processing product scan: ${code}`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock successful scan
    return true;
  } catch (error) {
    console.error('Error processing product scan:', error);
    return false;
  }
};

// Process order scan
export const processOrderScan = async (code: string): Promise<boolean> => {
  // In a real app, this would make an API call to the backend
  try {
    console.log(`Processing order scan: ${code}`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock successful scan
    return true;
  } catch (error) {
    console.error('Error processing order scan:', error);
    return false;
  }
};

// Process delivery scan
export const processDeliveryScan = async (code: string): Promise<boolean> => {
  // In a real app, this would make an API call to the backend
  try {
    console.log(`Processing delivery scan: ${code}`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock successful scan
    return true;
  } catch (error) {
    console.error('Error processing delivery scan:', error);
    return false;
  }
};

// Save scan to history (localStorage for now, would be database in real app)
export const saveScanToHistory = (scanType: 'product' | 'order' | 'delivery', code: string): void => {
  try {
    const history = localStorage.getItem('scanHistory') 
      ? JSON.parse(localStorage.getItem('scanHistory') as string) 
      : [];
    
    history.unshift({
      id: `scan-${Date.now()}`,
      type: scanType,
      code,
      timestamp: new Date().toISOString(),
      status: 'success'
    });
    
    // Keep only the 50 most recent scans
    if (history.length > 50) {
      history.pop();
    }
    
    localStorage.setItem('scanHistory', JSON.stringify(history));
  } catch (error) {
    console.error('Error saving scan history:', error);
  }
};

// Get scan history from localStorage
export const getScanHistory = () => {
  try {
    return localStorage.getItem('scanHistory') 
      ? JSON.parse(localStorage.getItem('scanHistory') as string) 
      : [];
  } catch (error) {
    console.error('Error retrieving scan history:', error);
    return [];
  }
};
