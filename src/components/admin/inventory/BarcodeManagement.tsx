
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Barcode, Printer, Search, Download, RefreshCw } from 'lucide-react';
import ProductScanner from '@/components/barcode/ProductScanner';
import { generateUniqueBarcode } from '@/utils/barcodeUtils';
import { toast } from 'sonner';

const BarcodeManagement = () => {
  const [barcodePrefix, setBarcodePrefix] = useState('TTS-');
  const [generatedBarcode, setGeneratedBarcode] = useState('');
  const [productId, setProductId] = useState('');
  const [activeTab, setActiveTab] = useState('generator');
  
  const handleGenerateBarcode = () => {
    const newBarcode = generateUniqueBarcode(barcodePrefix);
    setGeneratedBarcode(newBarcode);
    toast.success('Barcode generated successfully');
  };
  
  const handlePrintBarcode = () => {
    // In a real implementation, this would send the barcode to a printer
    toast.success('Barcode sent to printer');
  };
  
  const handleScanComplete = (code: string) => {
    setProductId(code);
    toast.success(`Product scanned: ${code}`);
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="generator" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="generator">Barcode Generator</TabsTrigger>
          <TabsTrigger value="scanner">Barcode Scanner</TabsTrigger>
          <TabsTrigger value="batch">Batch Printing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator">
          <Card>
            <CardHeader>
              <CardTitle>Generate Barcodes</CardTitle>
              <CardDescription>
                Create and print barcodes for new products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="prefix">Barcode Prefix</Label>
                  <Input 
                    id="prefix" 
                    value={barcodePrefix}
                    onChange={(e) => setBarcodePrefix(e.target.value)}
                    placeholder="Enter prefix for barcode"
                  />
                </div>
                
                <Button onClick={handleGenerateBarcode}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Barcode
                </Button>
                
                {generatedBarcode && (
                  <div className="border rounded-md p-6 flex flex-col items-center">
                    <Barcode className="h-16 w-16 mb-4" />
                    <p className="font-mono text-xl mb-4">{generatedBarcode}</p>
                    <Button onClick={handlePrintBarcode}>
                      <Printer className="mr-2 h-4 w-4" />
                      Print Barcode
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scanner">
          <ProductScanner onScanComplete={handleScanComplete} />
          
          {productId && (
            <Card className="mt-4">
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Product Details</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Product ID: {productId}
                </p>
                <Button variant="outline" size="sm">
                  <Search className="mr-2 h-4 w-4" />
                  View Full Details
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="batch">
          <Card>
            <CardHeader>
              <CardTitle>Batch Barcode Printing</CardTitle>
              <CardDescription>
                Print multiple barcodes at once
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Select products to generate and print barcodes in batch. This is useful for new inventory arrivals.
                </p>
                
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export as PDF
                  </Button>
                  <Button>
                    <Printer className="mr-2 h-4 w-4" />
                    Print All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BarcodeManagement;
