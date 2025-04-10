
import React from 'react';
import { MapPin, Camera, ChevronLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import OfflineDeliveryNotice from '../OfflineDeliveryNotice';
import { DeliveryType } from '@/types/delivery';

interface DeliveryDetailProps {
  delivery: DeliveryType;
  onBack: () => void;
  onScanClick: () => void;
}

const DeliveryDetail = ({ delivery, onBack, onScanClick }: DeliveryDetailProps) => {
  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="bg-background p-4 flex items-center shadow-sm">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium ml-2">Delivery Details</h1>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <OfflineDeliveryNotice className="mb-4" />
        
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {delivery.orderNumber}
              <Badge 
                className={
                  delivery.status === 'completed' 
                    ? 'bg-green-500' 
                    : delivery.status === 'in-progress' 
                      ? 'bg-blue-500' 
                      : 'bg-yellow-500'
                }
              >
                {delivery.status === 'assigned' 
                  ? 'Assigned' 
                  : delivery.status === 'in-progress' 
                    ? 'In Progress' 
                    : 'Completed'}
              </Badge>
            </CardTitle>
            <CardDescription>
              Scheduled for {delivery.deliveryDate}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-secondary/50 p-3 rounded-md">
              <h3 className="font-medium mb-1">Customer Information</h3>
              <p className="text-sm">{delivery.customer.name}</p>
              <p className="text-sm">{delivery.customer.phone}</p>
              <div className="mt-1 text-sm text-muted-foreground">
                <p>{delivery.customer.address.street}</p>
                <p>{delivery.customer.address.city}, {delivery.customer.address.zipCode}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Items</h3>
              <div className="space-y-2">
                {delivery.items.map((item) => (
                  <div key={item.id} className="bg-secondary/50 p-3 rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Barcode: {item.barcode}</p>
                    </div>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-2">
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button 
                className="w-full" 
                variant={delivery.status === 'assigned' ? 'default' : 'outline'}
                disabled={delivery.status === 'completed'}
              >
                Start Delivery
              </Button>
              <Button 
                className="w-full" 
                onClick={onScanClick}
                disabled={delivery.status === 'completed'}
              >
                <Camera className="h-4 w-4 mr-2" />
                Scan Items
              </Button>
            </div>
            
            {delivery.status !== 'completed' && (
              <Button 
                className="w-full" 
                variant="outline"
                disabled={delivery.status === 'completed'}
              >
                Mark as Delivered
              </Button>
            )}
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Delivery Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Call the customer before arriving. The building has security at the entrance.
              If no response, leave the package with the security guard and take a photo.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="p-4 border-t">
        <Button className="w-full" onClick={() => window.open(`https://maps.google.com?q=${encodeURIComponent(delivery.customer.address.street + ', ' + delivery.customer.address.city)}`, '_blank')}>
          <MapPin className="h-4 w-4 mr-2" />
          Navigate to Address
        </Button>
      </div>
    </div>
  );
};

export default DeliveryDetail;
