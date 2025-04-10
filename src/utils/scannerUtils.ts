import Quagga from '@ericblade/quagga2';
import { toast } from 'sonner';

// Define proper types for Quagga configuration
interface ScannerConfig {
  inputStream: {
    name?: string;
    type?: 'ImageStream' | 'VideoStream' | 'LiveStream';
    willReadFrequently?: boolean;
    target?: string | Element;
    constraints?: MediaTrackConstraints;
    area?: {
      top: string;
      right: string;
      left: string;
      bottom: string;
    };
    singleChannel?: boolean;
    sequence?: boolean;
  };
  locator: {
    patchSize: string;
    halfSample: boolean;
  };
  numOfWorkers: number;
  decoder: {
    readers: string[]; // Using string[] since we're passing string values
  };
  locate: boolean;
}

export const initScanner = (elementId: string, callback: (result: any) => void): Promise<void> => {
  // We'll use the any type here to work around the Quagga types issue
  const config: any = {
    inputStream: {
      name: 'Live',
      type: 'LiveStream',
      target: document.getElementById(elementId) as HTMLElement,
      constraints: {
        width: { min: 450 },
        height: { min: 300 },
        facingMode: 'environment',
        aspectRatio: { min: 1, max: 2 }
      },
    },
    locator: {
      patchSize: 'medium',
      halfSample: true
    },
    numOfWorkers: 4,
    decoder: {
      readers: [
        'code_128_reader',
        'ean_reader',
        'ean_8_reader',
        'code_39_reader',
        'code_93_reader',
        'upc_reader',
        'upc_e_reader'
      ]
    },
    locate: true
  };

  return new Promise((resolve, reject) => {
    Quagga.init(config, (err: any) => {
      if (err) {
        console.error('Error initializing scanner:', err);
        toast.error('Failed to initialize scanner. Please check camera permissions.');
        reject(err);
        return;
      }

      Quagga.start();
      resolve();

      // Register callback for when a barcode is detected
      Quagga.onDetected((data: any) => {
        if (data && data.codeResult) {
          // Play beep sound
          const audio = new Audio('/sounds/beep.mp3');
          audio.play().catch(e => console.error('Could not play beep:', e));
          callback(data.codeResult);
        }
      });

      // Process frames for debugging in development
      if (process.env.NODE_ENV === 'development') {
        Quagga.onProcessed((result: any) => {
          const drawingCtx = Quagga.canvas.ctx.overlay;
          const drawingCanvas = Quagga.canvas.dom.overlay;

          if (result) {
            if (result.boxes) {
              drawingCtx.clearRect(
                0,
                0,
                Number(drawingCanvas.getAttribute('width')),
                Number(drawingCanvas.getAttribute('height'))
              );
              result.boxes.filter((box: any) => box !== result.box).forEach((box: any) => {
                Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                  color: 'green',
                  lineWidth: 2
                });
              });
            }

            if (result.box) {
              Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
                color: '#00F',
                lineWidth: 2
              });
            }

            if (result.codeResult && result.codeResult.code) {
              Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, {
                color: 'red',
                lineWidth: 3
              });
            }
          }
        });
      }
    });
  });
};

export const stopScanner = (): void => {
  Quagga.stop();
};

// Additional utility functions for scanner-related operations
export const isOnline = (): boolean => {
  return navigator.onLine;
};

export const processProductScan = (code: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate product scan processing
    console.log(`Processing product scan: ${code}`);
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

export const processOrderScan = (code: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate order scan processing
    console.log(`Processing order scan: ${code}`);
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

export const processDeliveryScan = (code: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate delivery scan processing
    console.log(`Processing delivery scan: ${code}`);
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

export const syncScans = async (offlineScans: any[]): Promise<{synced: number, failed: number}> => {
  // Simulate syncing offline scans
  console.log(`Syncing ${offlineScans.length} offline scans`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        synced: offlineScans.length,
        failed: 0
      });
    }, 1000);
  });
};
