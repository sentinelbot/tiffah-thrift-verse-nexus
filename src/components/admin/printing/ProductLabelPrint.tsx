
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PrintDialog from './PrintDialog';
import { printProductLabel } from '@/services/printNodeService';
import { useAuth } from '@/contexts/AuthContext';
import { generateBarcodeDataURL } from '@/utils/barcodeUtils';

interface ProductLabelPrintProps {
  product: {
    id: string;
    name: string;
    price: number;
    barcode: string;
  };
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const ProductLabelPrint = ({ product, variant = 'outline', size = 'default' }: ProductLabelPrintProps) => {
  const { user } = useAuth();
  
  // Handle print action
  const handlePrint = async (printerId: string) => {
    if (!user) return false;
    
    try {
      return await printProductLabel(product, printerId, user.id);
    } catch (error) {
      console.error('Error printing product label:', error);
      return false;
    }
  };
  
  // Handle download action
  const handleDownload = () => {
    try {
      // Create a simple HTML representation of the label
      const html = `
        <html>
          <head>
            <title>Product Label: ${product.name}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .label { border: 1px solid #ccc; padding: 20px; max-width: 300px; }
              .product-name { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
              .price { font-size: 16px; color: #ec4899; margin-bottom: 10px; }
              .barcode-container { text-align: center; margin: 15px 0; }
              .barcode-id { font-family: monospace; margin-top: 5px; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="label">
              <div class="product-name">${product.name}</div>
              <div class="price">KSh ${product.price.toFixed(2)}</div>
              <div class="barcode-container">
                <img src="${generateBarcodeDataURL(product.barcode)}" alt="Barcode" />
                <div class="barcode-id">${product.barcode}</div>
              </div>
            </div>
          </body>
        </html>
      `;
      
      // Create a blob from the HTML
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `product-label-${product.barcode}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating label PDF:', error);
    }
  };
  
  // Product label preview component
  const PreviewContent = () => (
    <div className="flex flex-col items-center justify-center p-4 border rounded-md bg-white text-black">
      <div className="max-w-[300px] w-full border border-gray-300 p-6 rounded-md">
        <h3 className="text-lg font-bold mb-2">{product.name}</h3>
        <p className="text-pink-500 font-semibold mb-4">KSh {product.price.toFixed(2)}</p>
        <div className="flex flex-col items-center mb-2">
          <img 
            src={generateBarcodeDataURL(product.barcode)} 
            alt="Barcode" 
            className="max-w-[200px]"
          />
          <span className="text-xs font-mono mt-1">{product.barcode}</span>
        </div>
      </div>
    </div>
  );
  
  return (
    <PrintDialog
      title="Print Product Label"
      description="Preview and print a barcode label for this product"
      previewContent={<PreviewContent />}
      onPrint={handlePrint}
      onDownload={handleDownload}
    >
      <Button variant={variant} size={size}>
        <Printer className={`${size === 'icon' ? 'h-4 w-4' : 'h-4 w-4 mr-2'}`} />
        {size !== 'icon' && 'Print Label'}
      </Button>
    </PrintDialog>
  );
};

export default ProductLabelPrint;
