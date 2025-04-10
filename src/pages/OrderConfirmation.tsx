
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, ShoppingCart } from 'lucide-react';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <CheckCircle className="h-8 w-8" />
          </div>
          
          <h1 className="text-3xl font-bold">Thank You for Your Order!</h1>
          <p className="text-xl text-muted-foreground">
            Your order has been received and is being processed.
          </p>
          
          <div className="bg-background border rounded-lg p-6 mt-8 text-left">
            <h2 className="text-xl font-semibold mb-4">Order #TTS-20250410-1234</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Delivery Information</h3>
                <p className="text-muted-foreground">
                  Your order will be delivered to the address you provided within 2-3 business days.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Payment Information</h3>
                <p className="text-muted-foreground">
                  Your payment of $123.45 has been processed successfully.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Order Updates</h3>
                <p className="text-muted-foreground">
                  We'll send you updates about your order via email and SMS.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              Return to Home
            </Button>
            <Button onClick={() => navigate('/shop')} className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
