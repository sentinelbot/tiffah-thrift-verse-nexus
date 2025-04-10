
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { processPayment } from "@/services/paymentService";
import { updateOrderStatus } from "@/services/orderService";
import { PaymentMethod, PaymentStatus } from "@/types/order";

interface PaymentStatusTrackerProps {
  orderId: string;
  orderNumber: string;
  paymentMethod: PaymentMethod;
  paymentDetails: any;
  amount: number;
  onPaymentComplete: (success: boolean, transactionId?: string, status?: PaymentStatus) => void;
}

export function PaymentStatusTracker({
  orderId,
  orderNumber,
  paymentMethod,
  paymentDetails,
  amount,
  onPaymentComplete
}: PaymentStatusTrackerProps) {
  const [status, setStatus] = useState<"processing" | "checking" | "completed" | "failed">("processing");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const maxAttempts = 3;
  
  useEffect(() => {
    let isMounted = true;
    let checkStatusInterval: number | undefined;
    
    const processOrderPayment = async () => {
      try {
        // Process the payment
        const result = await processPayment(
          paymentMethod,
          amount,
          orderNumber,
          paymentDetails
        );
        
        if (!isMounted) return;
        
        if (result.success) {
          setStatus("completed");
          
          // Update order status based on payment
          await updateOrderStatus(
            orderId, 
            result.status === 'completed' ? 'processing' : 'pending',
            `Payment ${result.status} via ${paymentMethod}`
          );
          
          onPaymentComplete(true, result.transactionId, result.status);
        } else {
          // For Mpesa, we might need to check status multiple times
          if (paymentMethod === 'mpesa' && attempts < maxAttempts) {
            setStatus("checking");
            setAttempts(prev => prev + 1);
            
            // We'll check again in 5 seconds
            setTimeout(processOrderPayment, 5000);
          } else {
            setStatus("failed");
            setError(result.message);
            onPaymentComplete(false);
          }
        }
      } catch (err) {
        if (!isMounted) return;
        
        console.error("Payment processing error:", err);
        setStatus("failed");
        setError("An unexpected error occurred during payment processing.");
        onPaymentComplete(false);
      }
    };
    
    processOrderPayment();
    
    return () => {
      isMounted = false;
      if (checkStatusInterval) clearInterval(checkStatusInterval);
    };
  }, []);
  
  let statusMessage = "";
  switch (status) {
    case "processing":
      statusMessage = `Processing your ${paymentMethod} payment...`;
      break;
    case "checking":
      statusMessage = `Checking payment status (attempt ${attempts}/${maxAttempts})...`;
      break;
    case "completed":
      statusMessage = "Payment completed successfully!";
      break;
    case "failed":
      statusMessage = error || "Payment failed. Please try again.";
      break;
  }
  
  return (
    <div className="flex items-center justify-center p-4">
      {(status === "processing" || status === "checking") && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      <span>{statusMessage}</span>
    </div>
  );
}
