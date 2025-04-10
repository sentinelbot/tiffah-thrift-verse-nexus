
import React from 'react';
import { Link } from 'react-router-dom';
import { Delivery } from '@/types/delivery';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
  AlertOctagon,
  CheckCircle2,
  CircleDashed,
  Info,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface DeliveryDetailProps {
  delivery: Delivery;
  onStatusChange?: (deliveryId: string, newStatus: string) => void;
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleString();
};

const DeliveryDetail: React.FC<DeliveryDetailProps> = ({ 
  delivery, 
  onStatusChange 
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-500">
            <CircleDashed className="mr-1 h-3 w-3" /> Pending
          </Badge>
        );
      case 'inProgress':
        return (
          <Badge variant="outline" className="bg-blue-500/20 text-blue-500 border-blue-500">
            <Truck className="mr-1 h-3 w-3" /> In Progress
          </Badge>
        );
      case 'delivered':
        return (
          <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Delivered
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500">
            <AlertOctagon className="mr-1 h-3 w-3" /> Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            <Info className="mr-1 h-3 w-3" /> {status}
          </Badge>
        );
    }
  };

  const renderStatusChangeActions = () => {
    if (!onStatusChange) return null;
    
    if (delivery.status === 'pending') {
      return (
        <Button 
          onClick={() => onStatusChange(delivery.id, 'inProgress')}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Truck className="mr-2 h-4 w-4" />
          Start Delivery
        </Button>
      );
    }
    
    if (delivery.status === 'inProgress') {
      return (
        <div className="flex space-x-2">
          <Button 
            onClick={() => onStatusChange(delivery.id, 'delivered')}
            className="bg-green-500 hover:bg-green-600 flex-1"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark as Delivered
          </Button>
          <Button 
            variant="destructive"
            onClick={() => onStatusChange(delivery.id, 'failed')}
          >
            <AlertOctagon className="mr-2 h-4 w-4" />
            Mark as Failed
          </Button>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <CardTitle className="text-xl">Delivery #{delivery.orderNumber}</CardTitle>
            <CardDescription>
              {delivery.estimatedDeliveryTime && (
                <span className="flex items-center text-sm mt-1">
                  <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                  Estimated delivery: {formatDate(delivery.estimatedDeliveryTime)}
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(delivery.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-2">
          <User className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">Customer Details</p>
            <p>{delivery.customerName}</p>
            <p className="flex items-center text-sm text-muted-foreground">
              <Phone className="mr-1 h-3 w-3" /> {delivery.phone}
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <MapPin className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">Delivery Address</p>
            <p>{delivery.address}</p>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <p className="font-medium mb-2">Order Items</p>
          <div className="space-y-2">
            {delivery.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-2 rounded-md bg-muted/40">
                <div className="flex items-center">
                  <Package className="h-4 w-4 text-primary mr-2" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
                {item.price && <p className="font-medium">${item.price.toFixed(2)}</p>}
                {item.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
              </div>
            ))}
          </div>
        </div>
        
        {delivery.totalPrice && (
          <div className="flex justify-between pt-2">
            <p className="font-medium">Total</p>
            <p className="font-bold">${delivery.totalPrice.toFixed(2)}</p>
          </div>
        )}
        
        {delivery.notes && (
          <div className="mt-4 p-3 rounded-md bg-muted/40">
            <p className="font-medium mb-1">Delivery Notes</p>
            <p className="text-sm">{delivery.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {delivery.status === 'pending' && (
          <p className="text-sm text-muted-foreground mb-2 w-full">
            This delivery is waiting to be started.
          </p>
        )}
        
        {delivery.status === 'inProgress' && (
          <p className="text-sm text-muted-foreground mb-2 w-full">
            This delivery is currently in progress.
          </p>
        )}
        
        {delivery.status === 'delivered' && (
          <div className="text-sm text-muted-foreground mb-2 w-full">
            <p className="flex items-center text-green-500">
              <CheckCircle className="mr-1 h-4 w-4" />
              Delivered successfully
            </p>
            {delivery.actualDeliveryTime && (
              <p className="mt-1">
                Delivered on {formatDate(delivery.actualDeliveryTime)}
              </p>
            )}
          </div>
        )}
        
        {delivery.status === 'failed' && (
          <p className="text-sm text-destructive mb-2 w-full flex items-center">
            <AlertOctagon className="mr-1 h-4 w-4" />
            Delivery failed
          </p>
        )}
        
        <div className="w-full">
          {renderStatusChangeActions()}
        </div>
      </CardFooter>
    </Card>
  );
};

export default DeliveryDetail;
