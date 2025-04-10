
import React, { useState } from 'react';
import { Delivery } from '@/types/delivery';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Clock, Package, User, Phone, Truck, CheckCircle, Camera } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatAddress, formatCurrency, formatDateTime, formatPhone } from '@/utils/formatters';
import { toast } from 'sonner';

interface DeliveryDetailProps {
  delivery: Delivery | null;
  onStatusUpdate: (deliveryId: string, newStatus: 'in-progress' | 'completed') => void;
}

const DeliveryDetail: React.FC<DeliveryDetailProps> = ({ delivery, onStatusUpdate }) => {
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);

  if (!delivery) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select a delivery to view details</p>
      </div>
    );
  }

  const handleStatusUpdate = (newStatus: 'in-progress' | 'completed') => {
    onStatusUpdate(delivery.id, newStatus);
    
    if (newStatus === 'in-progress') {
      toast.success('Delivery started successfully');
    } else {
      toast.success('Delivery completed successfully');
    }
  };

  const handleCapturePhoto = () => {
    setIsCapturingPhoto(true);
  };

  const handleSubmitPhoto = () => {
    // In a real app, this would upload the photo
    setIsCapturingPhoto(false);
    toast.success('Proof of delivery captured');
  };

  return (
    <div className="space-y-4 h-full overflow-y-auto pb-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Badge 
                className={
                  delivery.status === 'assigned' 
                    ? 'bg-blue-500' 
                    : delivery.status === 'in-progress' 
                    ? 'bg-orange-500' 
                    : 'bg-green-500'
                }
              >
                {delivery.status === 'assigned' 
                  ? 'Assigned' 
                  : delivery.status === 'in-progress' 
                  ? 'In Progress' 
                  : 'Completed'}
              </Badge>
              <CardTitle className="mt-2">Order #{delivery.orderNumber}</CardTitle>
            </div>
            <div className="text-right">
              <span className="text-muted-foreground text-sm">Delivery ID</span>
              <div className="font-mono text-xs">{delivery.id}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Delivery Address</h3>
                <p className="text-sm text-muted-foreground">
                  {formatAddress(delivery.address)}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Estimated Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(delivery.estimatedDelivery)}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Customer</h3>
                <p className="text-sm text-muted-foreground">
                  {delivery.customer.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Contact</h3>
                <p className="text-sm text-muted-foreground">
                  {formatPhone(delivery.customer.phone)}
                </p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-3">Order Items</h3>
            <div className="space-y-3">
              {delivery.items.map(item => (
                <div key={item.id} className="flex justify-between items-start p-3 bg-secondary/50 rounded-md">
                  <div className="flex gap-3">
                    <Package className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p>{formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-between font-medium">
              <span>Total</span>
              <span>{formatCurrency(delivery.totalAmount)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-3">
            {delivery.status === 'assigned' && (
              <Button 
                className="w-full"
                onClick={() => handleStatusUpdate('in-progress')}
              >
                <Truck className="mr-2 h-4 w-4" />
                Start Delivery
              </Button>
            )}
            
            {delivery.status === 'in-progress' && (
              <>
                {isCapturingPhoto ? (
                  <div className="space-y-3 w-full">
                    <div className="bg-black/90 h-48 flex items-center justify-center rounded-md">
                      <Camera className="h-10 w-10 text-white/50" />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setIsCapturingPhoto(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={handleSubmitPhoto}
                      >
                        Capture
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleCapturePhoto}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Capture Proof of Delivery
                    </Button>
                    
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusUpdate('completed')}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Complete Delivery
                    </Button>
                  </>
                )}
              </>
            )}
            
            {delivery.status === 'completed' && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-600 p-3 rounded-md flex items-center justify-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Delivery Completed
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeliveryDetail;
