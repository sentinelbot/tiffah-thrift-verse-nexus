
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PrintDialog from './PrintDialog';
import { printOrderReceipt } from '@/services/printNodeService';
import { generateReceiptHTML, downloadReceipt } from '@/services/receiptService';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types/order';

interface OrderReceiptPrintProps {
  order: Order;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const OrderReceiptPrint = ({ order, variant = 'outline', size = 'default' }: OrderReceiptPrintProps) => {
  const { user } = useAuth();
  
  // Handle print action
  const handlePrint = async (printerId: string) => {
    if (!user) return false;
    
    try {
      return await printOrderReceipt(order, printerId, user.id);
    } catch (error) {
      console.error('Error printing order receipt:', error);
      return false;
    }
  };
  
  // Handle download action
  const handleDownload = () => {
    try {
      downloadReceipt(order);
    } catch (error) {
      console.error('Error generating receipt PDF:', error);
    }
  };
  
  // Order receipt preview component
  const PreviewContent = () => (
    <div className="w-full overflow-auto bg-white text-black p-4 rounded-md scale-[0.85] origin-top">
      <div dangerouslySetInnerHTML={{ __html: generateReceiptHTML(order) }} />
    </div>
  );
  
  return (
    <PrintDialog
      title="Print Order Receipt"
      description="Preview and print a receipt for this order"
      previewContent={<PreviewContent />}
      onPrint={handlePrint}
      onDownload={handleDownload}
    >
      <Button variant={variant} size={size}>
        <Printer className={`${size === 'icon' ? 'h-4 w-4' : 'h-4 w-4 mr-2'}`} />
        {size !== 'icon' && 'Print Receipt'}
      </Button>
    </PrintDialog>
  );
};

export default OrderReceiptPrint;
