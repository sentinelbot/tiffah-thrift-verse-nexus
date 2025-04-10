
import React from 'react';
import { MapPin, Package, Clock, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DeliveryType } from '@/types/delivery';

interface DeliveryListProps {
  deliveries: DeliveryType[];
  activeTab: string;
  onTabChange: (value: string) => void;
  onDeliverySelect: (delivery: DeliveryType) => void;
}

const DeliveryList = ({ 
  deliveries, 
  activeTab, 
  onTabChange, 
  onDeliverySelect 
}: DeliveryListProps) => {
  // Filter deliveries based on active tab
  const filteredDeliveries = deliveries.filter(delivery => {
    if (activeTab === 'assigned') return delivery.status === 'assigned';
    if (activeTab === 'in-progress') return delivery.status === 'in-progress';
    if (activeTab === 'completed') return delivery.status === 'completed';
    return true;
  });

  return (
    <>
      <Tabs defaultValue="assigned" value={activeTab} onValueChange={onTabChange} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assigned">
            <Package className="h-4 w-4 mr-2" />
            To Deliver
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            <Clock className="h-4 w-4 mr-2" />
            In Progress
          </TabsTrigger>
          <TabsTrigger value="completed">
            <Check className="h-4 w-4 mr-2" />
            Completed
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="space-y-3">
        {filteredDeliveries.length === 0 ? (
          <EmptyDeliveryState activeTab={activeTab} />
        ) : (
          filteredDeliveries.map(delivery => (
            <DeliveryCard 
              key={delivery.id} 
              delivery={delivery} 
              onSelect={() => onDeliverySelect(delivery)} 
            />
          ))
        )}
      </div>
    </>
  );
};

// Empty state component
const EmptyDeliveryState = ({ activeTab }: { activeTab: string }) => (
  <div className="text-center py-12">
    <Package className="h-12 w-12 mx-auto text-muted-foreground" />
    <h3 className="mt-4 text-lg font-medium">No deliveries</h3>
    <p className="text-sm text-muted-foreground">
      {activeTab === 'assigned' 
        ? 'You have no pending deliveries.'
        : activeTab === 'in-progress' 
          ? 'You have no deliveries in progress.'
          : 'You have no completed deliveries.'}
    </p>
  </div>
);

// Delivery card component
const DeliveryCard = ({ 
  delivery, 
  onSelect 
}: { 
  delivery: DeliveryType; 
  onSelect: () => void; 
}) => (
  <Card className="cursor-pointer hover:bg-secondary/50 transition-colors" onClick={onSelect}>
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{delivery.orderNumber}</h3>
          <p className="text-sm text-muted-foreground">{delivery.customer.name}</p>
          <p className="text-xs text-muted-foreground mt-1">{delivery.customer.address.street}</p>
          <p className="text-xs text-muted-foreground">{delivery.customer.address.city}, {delivery.customer.address.zipCode}</p>
        </div>
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
            ? 'To Deliver' 
            : delivery.status === 'in-progress' 
              ? 'In Progress' 
              : 'Completed'}
        </Badge>
      </div>
      <div className="flex justify-between items-center mt-3">
        <div className="text-sm">
          <span className="text-muted-foreground">Items: </span>
          {delivery.items.length}
        </div>
        <Button size="sm" variant="outline">
          <MapPin className="h-3.5 w-3.5 mr-1.5" />
          View Location
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default DeliveryList;
