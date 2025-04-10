
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { processScan } from '@/utils/scannerUtils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PackageCheck, AlertCircle } from 'lucide-react';
import BarcodeScanner from './BarcodeScanner';

const ProductScanner = () => {
  const { user } = useAuth();
  const [scannedProduct, setScannedProduct] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScanSuccess = async (code: string) => {
    if (!user) {
      setError('You must be logged in to scan products');
      return;
    }

    setIsLoading(true);
    setError(null);
    setScannedProduct(null);

    try {
      // First, record the scan
      await processScan(code, 'product', user.id);

      // Then, try to find the product in the database
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('barcode', code)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setScannedProduct(data);
        toast.success(`Product found: ${data.name}`);
      } else {
        setError('No product found with this barcode');
        toast.error('No product found with this barcode');
      }
    } catch (err: any) {
      console.error('Error scanning product:', err);
      setError(err.message || 'An error occurred while scanning');
      toast.error('Error scanning product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanError = (error: any) => {
    console.error('Scan error:', error);
    setError('Error accessing camera: ' + error.message);
    toast.error('Error accessing camera');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <span className="text-green-500 font-medium">Available</span>;
      case 'reserved':
        return <span className="text-yellow-500 font-medium">Reserved</span>;
      case 'sold':
        return <span className="text-blue-500 font-medium">Sold</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const getConditionDisplay = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'New';
      case 'likeNew':
        return 'Like New';
      case 'good':
        return 'Good';
      case 'fair':
        return 'Fair';
      default:
        return condition;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <BarcodeScanner
            onScanSuccess={handleScanSuccess}
            onScanError={handleScanError}
            scannerTitle="Scan Product Barcode"
          />
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {scannedProduct && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-muted h-24 w-24 rounded-md flex items-center justify-center">
                {scannedProduct.image_url ? (
                  <img
                    src={scannedProduct.image_url}
                    alt={scannedProduct.name}
                    className="h-full w-full object-cover rounded-md"
                  />
                ) : (
                  <PackageCheck className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{scannedProduct.name}</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Price:</span>
                    <p>KSh {scannedProduct.price}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <p>{getStatusBadge(scannedProduct.status)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Category:</span>
                    <p>{scannedProduct.category}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Condition:</span>
                    <p>{getConditionDisplay(scannedProduct.condition)}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-muted-foreground">Barcode:</span>
                    <p className="font-mono">{scannedProduct.barcode}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductScanner;
