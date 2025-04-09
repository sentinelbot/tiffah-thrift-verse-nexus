
import { Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PrintDialog from './PrintDialog';
import { printShippingLabel } from '@/services/printNodeService';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types/order';
import { generateBarcodeDataURL } from '@/utils/barcodeUtils';

interface ShippingLabelPrintProps {
  order: Order;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const ShippingLabelPrint = ({ order, variant = 'outline', size = 'default' }: ShippingLabelPrintProps) => {
  const { user } = useAuth();
  
  // Handle print action
  const handlePrint = async (printerId: string) => {
    if (!user) return false;
    
    try {
      return await printShippingLabel(order, printerId, user.id);
    } catch (error) {
      console.error('Error printing shipping label:', error);
      return false;
    }
  };
  
  // Handle download action
  const handleDownload = () => {
    try {
      // Create a simple HTML representation of the shipping label
      const html = `
        <html>
          <head>
            <title>Shipping Label: Order #${order.orderNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .label { border: 1px solid #ccc; padding: 20px; max-width: 400px; }
              .header { font-size: 14px; margin-bottom: 20px; text-align: center; }
              .store-name { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
              .order-number { font-size: 14px; }
              .address { margin-bottom: 20px; }
              .address-title { font-weight: bold; margin-bottom: 5px; }
              .customer-name { font-size: 16px; font-weight: bold; margin-bottom: 5px; }
              .shipping-method { margin-top: 15px; font-weight: bold; }
              .barcode-container { text-align: center; margin: 15px 0; }
              .barcode-id { font-family: monospace; margin-top: 5px; font-size: 12px; }
              .footer { font-size: 12px; text-align: center; margin-top: 20px; color: #666; }
            </style>
          </head>
          <body>
            <div class="label">
              <div class="header">
                <div class="store-name">Tiffah Thrift Store</div>
                <div class="order-number">Order #${order.orderNumber}</div>
              </div>
              
              <div class="address">
                <div class="address-title">SHIP TO:</div>
                <div class="customer-name">${order.shippingInfo.fullName}</div>
                <div>${order.shippingInfo.address}</div>
                <div>${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.postalCode}</div>
                <div>${order.shippingInfo.country}</div>
                <div>Phone: ${order.shippingInfo.phone}</div>
              </div>
              
              <div class="shipping-method">
                Shipping Method: ${order.shippingInfo.shippingMethod === 'express' ? 'EXPRESS DELIVERY' : 'STANDARD DELIVERY'}
              </div>
              
              <div class="barcode-container">
                <img src="${generateBarcodeDataURL(order.orderNumber)}" alt="Barcode" />
                <div class="barcode-id">${order.orderNumber}</div>
              </div>
              
              <div class="footer">
                Thank you for shopping with Tiffah Thrift Store
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
      link.download = `shipping-label-${order.orderNumber}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating shipping label PDF:', error);
    }
  };
  
  // Shipping label preview component
  const PreviewContent = () => (
    <div className="flex flex-col items-center justify-center p-4 border rounded-md bg-white text-black">
      <div className="max-w-[400px] w-full border border-gray-300 p-6 rounded-md">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold">Tiffah Thrift Store</h3>
          <p className="text-sm">Order #{order.orderNumber}</p>
        </div>
        
        <div className="mb-6">
          <p className="font-bold mb-1">SHIP TO:</p>
          <p className="font-bold">{order.shippingInfo.fullName}</p>
          <p>{order.shippingInfo.address}</p>
          <p>{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.postalCode}</p>
          <p>{order.shippingInfo.country}</p>
          <p>Phone: {order.shippingInfo.phone}</p>
        </div>
        
        <p className="font-bold mb-4">
          Shipping Method: {order.shippingInfo.shippingMethod === 'express' 
            ? 'EXPRESS DELIVERY' 
            : 'STANDARD DELIVERY'
          }
        </p>
        
        <div className="flex flex-col items-center mb-4">
          <img 
            src={generateBarcodeDataURL(order.orderNumber)} 
            alt="Barcode" 
            className="max-w-[200px]"
          />
          <span className="text-xs font-mono mt-1">{order.orderNumber}</span>
        </div>
        
        <p className="text-center text-sm text-gray-500">
          Thank you for shopping with Tiffah Thrift Store
        </p>
      </div>
    </div>
  );
  
  return (
    <PrintDialog
      title="Print Shipping Label"
      description="Preview and print a shipping label for this order"
      previewContent={<PreviewContent />}
      onPrint={handlePrint}
      onDownload={handleDownload}
    >
      <Button variant={variant} size={size}>
        <Truck className={`${size === 'icon' ? 'h-4 w-4' : 'h-4 w-4 mr-2'}`} />
        {size !== 'icon' && 'Print Shipping Label'}
      </Button>
    </PrintDialog>
  );
};

export default ShippingLabelPrint;
