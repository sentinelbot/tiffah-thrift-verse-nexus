
import React from 'react';
import { Clock, PackageCheck, Truck, CheckCircle, X } from 'lucide-react';
import { OrderStatus } from '@/types/order';

interface OrderStatusTrackerProps {
  status: OrderStatus;
  className?: string;
}

const OrderStatusTracker = ({ status, className = '' }: OrderStatusTrackerProps) => {
  const statusSteps: OrderStatus[] = ['pending', 'processing', 'ready', 'outForDelivery', 'delivered'];
  
  // Find the current step index
  const currentStepIndex = statusSteps.indexOf(status);
  
  // Special case for cancelled orders
  const isCancelled = status === 'cancelled';
  
  // Get the appropriate icon for each status
  const getStatusIcon = (stepStatus: OrderStatus) => {
    switch (stepStatus) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'processing':
        return <PackageCheck className="h-5 w-5" />;
      case 'ready':
        return <PackageCheck className="h-5 w-5" />;
      case 'outForDelivery':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      case 'cancelled':
        return <X className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };
  
  // Get the display name for each status
  const getStatusName = (stepStatus: OrderStatus) => {
    switch (stepStatus) {
      case 'pending':
        return 'Order Placed';
      case 'processing':
        return 'Processing';
      case 'ready':
        return 'Ready';
      case 'outForDelivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return stepStatus;
    }
  };
  
  if (isCancelled) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-full">
          <X className="h-5 w-5" />
          <span className="font-medium">Order Cancelled</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center w-full">
        {statusSteps.map((stepStatus, index) => {
          // Determine if this step is active, completed, or upcoming
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isUpcoming = index > currentStepIndex;
          
          return (
            <div key={stepStatus} className="flex flex-col items-center relative z-10">
              {/* Status Circle */}
              <div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${isActive ? 'bg-primary text-primary-foreground' : ''}
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${isUpcoming ? 'bg-muted text-muted-foreground' : ''}
                `}
              >
                {getStatusIcon(stepStatus)}
              </div>
              
              {/* Status Label */}
              <span className={`
                mt-2 text-xs text-center
                ${isActive ? 'font-medium text-primary' : ''}
                ${isCompleted ? 'font-medium' : ''}
                ${isUpcoming ? 'text-muted-foreground' : ''}
              `}>
                {getStatusName(stepStatus)}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Progress Line */}
      <div className="relative mt-5 w-full">
        <div className="absolute top-0 left-5 right-5 h-0.5 bg-muted"></div>
        <div 
          className="absolute top-0 left-5 h-0.5 bg-primary transition-all duration-300"
          style={{ width: `${Math.min(100, currentStepIndex * 25)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default OrderStatusTracker;
