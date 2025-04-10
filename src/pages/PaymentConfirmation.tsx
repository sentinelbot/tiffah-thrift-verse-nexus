
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentConfirmation } from "@/components/checkout/PaymentConfirmation";
import { Link } from "react-router-dom";
import { PaymentStatus } from "@/types/order";

const PaymentConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState<{
    status: PaymentStatus;
    orderNumber?: string;
    orderId?: string;
    transactionId?: string;
    errorMessage?: string;
  } | null>(null);
  
  useEffect(() => {
    // Get payment details from location state or query parameters
    const params = new URLSearchParams(location.search);
    const state = location.state as any;
    
    if (state && state.paymentDetails) {
      setPaymentDetails(state.paymentDetails);
    } else if (params.get('status')) {
      setPaymentDetails({
        status: params.get('status') as PaymentStatus,
        orderNumber: params.get('orderNumber') || undefined,
        orderId: params.get('orderId') || undefined,
        transactionId: params.get('transactionId') || undefined,
        errorMessage: params.get('error') || undefined
      });
    } else {
      // No payment details found, redirect to home
      navigate('/');
    }
  }, [location, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              {paymentDetails ? (
                <PaymentConfirmation 
                  status={paymentDetails.status}
                  orderNumber={paymentDetails.orderNumber}
                  orderId={paymentDetails.orderId}
                  transactionId={paymentDetails.transactionId}
                  errorMessage={paymentDetails.errorMessage}
                  isProcessing={false}
                />
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold mb-4">Payment Information Not Found</h2>
                  <p className="text-muted-foreground mb-6">
                    We couldn't retrieve your payment information. Please check your order history or contact customer support.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button asChild>
                      <Link to="/shop">Continue Shopping</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentConfirmationPage;
