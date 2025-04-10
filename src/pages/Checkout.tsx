import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/context/CartContext";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { PaymentMethod } from "@/components/checkout/PaymentMethod";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { OrderReview } from "@/components/checkout/OrderReview";
import { PaymentConfirmation } from "@/components/checkout/PaymentConfirmation";
import { PaymentStatusTracker } from "@/components/checkout/PaymentStatusTracker";
import { CheckCircle2, Loader2 } from "lucide-react";
import { createOrder } from "@/services/orderService";
import { useAuth } from "@/contexts/AuthContext";
import { PaymentMethod as PaymentMethodType, PaymentStatus, ShippingInfo } from "@/types/order";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const steps = [
  { id: "shipping", title: "Shipping" },
  { id: "payment", title: "Payment" },
  { id: "review", title: "Review" },
  { id: "confirmation", title: "Confirmation" }
];

interface CheckoutData {
  shipping: ShippingInfo;
  payment: {
    method: PaymentMethodType;
    cardName?: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    mpesaPhone?: string;
  };
}

const defaultData: CheckoutData = {
  shipping: {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Kenya",
    shippingMethod: "standard"
  },
  payment: {
    method: "mpesa",
    mpesaPhone: ""
  }
};

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CheckoutData>(defaultData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<{
    id: string;
    orderNumber: string;
  } | null>(null);
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    transactionId?: string;
    status?: PaymentStatus;
    errorMessage?: string;
  } | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, calculateCartTotal, clearCart } = useCart();
  
  const subtotal = calculateCartTotal();
  const shippingCost = formData.shipping.shippingMethod === "express" ? 500 : 200;
  const vatRate = 0.16;
  const vatAmount = subtotal * vatRate;
  const total = subtotal + shippingCost + vatAmount;
  
  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }
  
  const updateFormData = (step: keyof CheckoutData, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [step]: {
        ...prev[step],
        ...data
      }
    }));
  };
  
  const handleNext = () => {
    if (currentStep === 0) {
      const { fullName, email, phone, address, city, state, postalCode } = formData.shipping;
      if (!fullName || !email || !phone || !address || !city || !state || !postalCode) {
        toast({
          title: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "Invalid email address",
          variant: "destructive"
        });
        return;
      }
      
      const phoneRegex = /^(?:\+254|0)[1-9][0-9]{8}$/;
      if (!phoneRegex.test(phone)) {
        toast({
          title: "Invalid phone number",
          description: "Please enter a valid Kenyan phone number",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (currentStep === 1) {
      const { method, cardName, cardNumber, expiryDate, cvv, mpesaPhone } = formData.payment;
      
      if (method === "card") {
        if (!cardName || !cardNumber || !expiryDate || !cvv) {
          toast({
            title: "Please fill in all card details",
            variant: "destructive"
          });
          return;
        }
        
        if (!/^[0-9]{16}$/.test(cardNumber.replace(/\s/g, ""))) {
          toast({
            title: "Invalid card number",
            description: "Please enter a valid 16-digit card number",
            variant: "destructive"
          });
          return;
        }
        
        if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiryDate)) {
          toast({
            title: "Invalid expiry date",
            description: "Please enter a valid expiry date (MM/YY)",
            variant: "destructive"
          });
          return;
        }
        
        if (!/^[0-9]{3,4}$/.test(cvv)) {
          toast({
            title: "Invalid CVV",
            description: "Please enter a valid CVV (3 or 4 digits)",
            variant: "destructive"
          });
          return;
        }
      } else if (method === "mpesa") {
        if (!mpesaPhone) {
          toast({
            title: "Please enter your M-Pesa phone number",
            variant: "destructive"
          });
          return;
        }
        
        const phoneRegex = /^(?:\+254|0)[1-9][0-9]{8}$/;
        if (!phoneRegex.test(mpesaPhone)) {
          toast({
            title: "Invalid M-Pesa phone number",
            description: "Please enter a valid Kenyan phone number",
            variant: "destructive"
          });
          return;
        }
      }
    }
    
    if (currentStep === 2) {
      if (!termsAccepted) {
        toast({
          title: "Please accept the terms and conditions",
          variant: "destructive"
        });
        return;
      }
    }
    
    setCurrentStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };
  
  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };
  
  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      const orderItems = cartItems.map(item => ({
        productId: item.product.id,
        product: {
          id: item.product.id,
          title: item.product.title || item.product.name || '',
          price: item.product.price,
          imageUrl: item.product.imageUrl || ''
        },
        quantity: item.quantity,
        price: item.product.price
      }));
      
      const order = await createOrder({
        customer: {
          id: user?.id || 'guest',
          name: formData.shipping.fullName,
          email: formData.shipping.email
        },
        items: orderItems,
        totalAmount: total,
        paymentInfo: {
          method: formData.payment.method,
          status: 'pending',
          amount: total
        },
        shippingInfo: formData.shipping,
        deliveryInfo: {
          estimatedDelivery: new Date(Date.now() + (formData.shipping.shippingMethod === 'express' ? 2 : 5) * 24 * 60 * 60 * 1000)
        }
      });
      
      setCreatedOrder({
        id: order.id,
        orderNumber: order.orderNumber
      });
      
      setPaymentDialogOpen(true);
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error creating your order",
        description: "Please try again or contact customer support.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };
  
  const handlePaymentComplete = (success: boolean, transactionId?: string, status?: PaymentStatus) => {
    setPaymentResult({
      success,
      transactionId,
      status: status || 'failed',
      errorMessage: success ? undefined : "There was an issue processing your payment."
    });
    
    setTimeout(() => {
      setPaymentDialogOpen(false);
      
      setCurrentStep(3);
      
      if (success) {
        clearCart();
      }
      
      setIsProcessing(false);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Checkout</h1>
        
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className="flex flex-col items-center"
              style={{ width: `${100 / steps.length}%` }}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentStep 
                    ? "bg-primary text-primary-foreground" 
                    : index === currentStep 
                    ? "bg-primary/80 text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index < currentStep ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
              </div>
              <span 
                className={`mt-2 text-sm ${
                  index <= currentStep ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div 
                  className={`h-1 mt-3 ${
                    index < currentStep ? "bg-primary" : "bg-muted"
                  }`}
                  style={{ width: "100%" }}
                ></div>
              )}
            </div>
          ))}
        </div>
        
        {currentStep < 3 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{steps[currentStep].title}</CardTitle>
                  <CardDescription>
                    {currentStep === 0 && "Enter your shipping details"}
                    {currentStep === 1 && "Choose your payment method"}
                    {currentStep === 2 && "Review and confirm your order"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentStep === 0 && (
                    <ShippingForm 
                      data={formData.shipping} 
                      updateData={(data) => updateFormData("shipping", data)} 
                    />
                  )}
                  
                  {currentStep === 1 && (
                    <PaymentMethod 
                      data={formData.payment} 
                      updateData={(data) => updateFormData("payment", data)} 
                    />
                  )}
                  
                  {currentStep === 2 && (
                    <OrderReview 
                      shippingInfo={formData.shipping}
                      paymentInfo={{
                        method: formData.payment.method,
                        details: formData.payment
                      }}
                      cartItems={cartItems}
                      subtotal={subtotal}
                      vatAmount={vatAmount}
                      shippingCost={shippingCost}
                      total={total}
                      termsAccepted={termsAccepted}
                      onTermsChange={setTermsAccepted}
                    />
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  {currentStep > 0 ? (
                    <Button variant="outline" onClick={handleBack} disabled={isProcessing}>
                      Back
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  
                  {currentStep < 2 ? (
                    <Button onClick={handleNext}>
                      Continue
                    </Button>
                  ) : (
                    <Button onClick={handlePlaceOrder} disabled={isProcessing || !termsAccepted}>
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <OrderSummary 
                subtotal={subtotal} 
                shippingCost={shippingCost}
                vatAmount={vatAmount} 
                total={total} 
              />
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <PaymentConfirmation 
                  status={paymentResult?.status || 'pending'}
                  orderNumber={createdOrder?.orderNumber}
                  orderId={createdOrder?.id}
                  transactionId={paymentResult?.transactionId}
                  errorMessage={paymentResult?.errorMessage}
                  isProcessing={isProcessing}
                />
              </CardContent>
            </Card>
          </div>
        )}

        <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
          <DialogContent className="sm:max-w-md" hideCloseButton>
            <div className="py-6">
              <h2 className="text-xl font-semibold text-center mb-4">Processing Payment</h2>
              
              {createdOrder && (
                <PaymentStatusTracker 
                  orderId={createdOrder.id}
                  orderNumber={createdOrder.orderNumber}
                  paymentMethod={formData.payment.method}
                  paymentDetails={formData.payment}
                  amount={total}
                  onPaymentComplete={handlePaymentComplete}
                />
              )}
              
              <p className="text-sm text-muted-foreground text-center mt-4">
                Please do not close this window while your payment is being processed.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
