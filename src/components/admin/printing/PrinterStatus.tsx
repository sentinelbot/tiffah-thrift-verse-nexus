
import { useState, useEffect } from 'react';
import { Printer, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { getPrinterIdForRole, checkPrinterStatus } from '@/services/printNodeService';
import { Button } from '@/components/ui/button';

const PrinterStatus = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [printerId, setPrinterId] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      const id = getPrinterIdForRole(user.role);
      setPrinterId(id);
      checkPrinterConnection(id);
    }
  }, [user]);
  
  const checkPrinterConnection = async (id: string) => {
    setIsLoading(true);
    try {
      const status = await checkPrinterStatus(id);
      setIsOnline(status);
    } catch (error) {
      console.error('Error checking printer status:', error);
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefresh = () => {
    if (printerId) {
      checkPrinterConnection(printerId);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Printer className="mr-2 h-5 w-5" />
          Your Printer
        </CardTitle>
        <CardDescription>
          Default printer for your role
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Checking printer status...</span>
            </div>
          ) : isOnline === null ? (
            <div className="text-muted-foreground">
              No printer configured
            </div>
          ) : isOnline ? (
            <div className="flex items-center text-green-500">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Printer is online and ready</span>
            </div>
          ) : (
            <div className="flex items-center text-red-500">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>Printer is offline</span>
            </div>
          )}
          
          {printerId && (
            <div className="text-xs text-muted-foreground mt-1">
              Printer ID: {printerId}
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isLoading}
            className="mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-2" />
                Checking...
              </>
            ) : (
              'Refresh Status'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrinterStatus;
