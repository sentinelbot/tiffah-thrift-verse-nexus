
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Printer, Download, AlertCircle } from 'lucide-react';
import { checkPrinterStatus, getPrinterIdForRole } from '@/services/printNodeService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface PrintDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
  previewContent: React.ReactNode;
  onPrint: (printerId: string) => Promise<boolean>;
  onDownload: () => void;
}

const PrintDialog = ({
  children,
  title,
  description,
  previewContent,
  onPrint,
  onDownload
}: PrintDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [printerStatus, setPrinterStatus] = useState<boolean | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printOption, setPrintOption] = useState<'printer' | 'pdf'>('printer');
  
  // Check printer status when dialog opens
  const handleOpenChange = async (isOpen: boolean) => {
    if (isOpen && user) {
      try {
        const printerId = getPrinterIdForRole(user.role);
        const status = await checkPrinterStatus(printerId);
        setPrinterStatus(status);
      } catch (error) {
        console.error('Error checking printer status:', error);
        setPrinterStatus(false);
      }
    }
    setOpen(isOpen);
  };
  
  // Handle print action
  const handlePrint = async () => {
    if (!user) return;
    
    try {
      setIsPrinting(true);
      
      if (printOption === 'pdf') {
        onDownload();
        toast({
          title: 'PDF Generated',
          description: 'Your document has been generated as a PDF.',
        });
        setOpen(false);
        return;
      }
      
      const printerId = getPrinterIdForRole(user.role);
      const success = await onPrint(printerId);
      
      if (success) {
        toast({
          title: 'Print Job Sent',
          description: 'Your document has been sent to the printer.',
        });
        setOpen(false);
      } else {
        toast({
          title: 'Print Failed',
          description: 'Failed to send print job. Generated PDF as fallback.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error during print operation:', error);
      toast({
        title: 'Print Error',
        description: 'An unexpected error occurred during printing.',
        variant: 'destructive',
      });
    } finally {
      setIsPrinting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] md:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="preview">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="options">Print Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="border rounded-md p-4 min-h-[300px] max-h-[500px] overflow-auto">
            {previewContent}
          </TabsContent>
          
          <TabsContent value="options">
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <h4 className="font-medium">Output Options</h4>
                <RadioGroup 
                  value={printOption} 
                  onValueChange={(value) => setPrintOption(value as 'printer' | 'pdf')}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="printer" 
                      id="printer" 
                      disabled={!printerStatus}
                    />
                    <Label 
                      htmlFor="printer" 
                      className={`flex items-center gap-2 ${!printerStatus ? 'text-muted-foreground' : ''}`}
                    >
                      <Printer className="h-4 w-4" />
                      Send to Printer
                      {printerStatus === false && (
                        <span className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Printer offline
                        </span>
                      )}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pdf" id="pdf" />
                    <Label htmlFor="pdf" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Generate PDF
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              {printerStatus === false && (
                <div className="text-sm bg-amber-500/10 border border-amber-500/20 text-amber-500 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <p>
                      Your printer appears to be offline. You can download a PDF instead
                      or try again when the printer is online.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handlePrint} disabled={isPrinting}>
            {isPrinting ? 'Processing...' : printOption === 'printer' ? 'Print' : 'Download PDF'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrintDialog;
