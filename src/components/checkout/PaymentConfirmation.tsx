
import React from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PaymentStatus } from "@/types/order";

interface PaymentConfirmationProps {
  status: PaymentStatus;
  orderNumber?: string;
  orderId?: string;
  transactionId?: string;
  errorMessage?: string;
  isProcessing: boolean;
}

export function PaymentConfirmation({
  status,
  orderNumber,
  orderId,
  transactionId,
  errorMessage,
  isProcessing
}: PaymentConfirmationProps) {
  
  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-6" />
        <h2 className="text-2xl font-bold mb-2">Processing Your Payment</h2>
        <p className="text-muted-foreground">
          Please wait while we process your payment. This might take a moment...
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {status === 'completed' ? (
        <>
          <CheckCircle2 className="h-16 w-16 text-green-500 mb-6" />
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground mb-2">
            Your order #{orderNumber} has been confirmed.
          </p>
          {transactionId && (
            <p className="text-sm text-muted-foreground mb-6">
              Transaction ID: {transactionId}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button asChild>
              <Link to={`/order-confirmation?id=${orderId}`}>
                View Order
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/shop">
                Continue Shopping
              </Link>
            </Button>
          </div>
        </>
      ) : (
        <>
          <AlertCircle className="h-16 w-16 text-destructive mb-6" />
          <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
          <p className="text-muted-foreground mb-6">
            {errorMessage || "There was an issue processing your payment. Please try again or use another payment method."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link to="/checkout">
                Try Again
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/cart">
                Return to Cart
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
