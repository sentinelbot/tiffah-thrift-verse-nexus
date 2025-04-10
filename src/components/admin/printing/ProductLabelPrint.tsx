
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PrintDialog from './PrintDialog';
import { printProductLabel, downloadProductLabel } from '@/services/printNodeService';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types';
import { formatPrice } from '@/utils/formatters';

interface ProductLabelPrintProps {
  product: Product;
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
      downloadProductLabel(product);
    } catch (error) {
      console.error('Error generating product label PDF:', error);
    }
  };
  
  // Product label preview component
  const PreviewContent = () => (
    <div className="w-full overflow-auto bg-white text-black p-4 rounded-md">
      <div className="w-[2.25in] h-[1.25in] border border-dashed border-gray-300 p-2 mx-auto bg-white text-black">
        <div className="text-center mb-1">
          <span className="font-bold text-xs">Tiffah Thrift</span>
        </div>
        
        <div className="font-bold text-xs truncate">
          {product.name}
        </div>
        
        <div className="text-[8px] my-1">
          {product.category} | {product.size || 'N/A'} | {product.condition}
        </div>
        
        <div className="font-bold text-base">
          {formatPrice(product.price)}
        </div>
        
        <div className="text-center mt-1">
          <div className="font-mono text-xs tracking-tighter">*{product.barcode}*</div>
          <div className="text-[8px] font-mono">{product.barcode}</div>
        </div>
      </div>
    </div>
  );
  
  return (
    <PrintDialog
      title="Print Product Label"
      description="Preview and print a label for this product"
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
