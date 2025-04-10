
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PrintDialog from './PrintDialog';
import { printProductLabel } from '@/services/printNodeService';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types';

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
      return await printProductLabel(product.id, user.id, printerId);
    } catch (error) {
      console.error('Error printing product label:', error);
      return false;
    }
  };
  
  // Handle download action
  const handleDownload = () => {
    try {
      // For demo purposes, alert the user
      alert(`Product label for ${product.name} downloaded`);
    } catch (error) {
      console.error('Error generating product label PDF:', error);
    }
  };
  
  // Product label preview component
  const PreviewContent = () => (
    <div className="w-full overflow-auto bg-white text-black p-4 rounded-md scale-[0.85] origin-top">
      <div className="w-[3in] h-[2in] border border-dashed border-gray-300 p-4 mx-auto bg-white text-black">
        <div className="text-center mb-2">
          <div className="font-bold text-lg">Tiffah Thrift Store</div>
        </div>
        
        <div className="text-center my-2">
          <div className="font-bold overflow-hidden text-ellipsis">{product.name}</div>
          <div className="text-lg font-bold">KSh {product.price}</div>
        </div>
        
        <div className="flex justify-between text-xs mt-2">
          <div>
            <div><strong>Cat:</strong> {product.category}</div>
            <div><strong>Size:</strong> {product.size || 'N/A'}</div>
          </div>
          <div>
            <div><strong>Cond:</strong> {product.condition}</div>
            <div><strong>ID:</strong> {product.id.substring(0, 8)}</div>
          </div>
        </div>
        
        <div className="text-center mt-3">
          <div className="font-mono text-xs">*{product.barcode}*</div>
          <div className="text-[10px]">{product.barcode}</div>
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
