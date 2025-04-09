
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
import { CheckCircle2 } from "lucide-react";

const steps = [
  { id: "shipping", title: "Shipping" },
  { id: "payment", title: "Payment" },
  { id: "confirmation", title: "Confirmation" }
];

interface CheckoutData {
  shipping: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    shippingMethod: string;
  };
  payment: {
    method: string;
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
  const { toast } = useToast();
  const navigate = useNavigate();
  const { cartItems, calculateCartTotal, clearCart } = useCart();
  
  // Calculate costs
  const subtotal = calculateCartTotal();
  const shippingCost = formData.shipping.shippingMethod === "express" ? 9.99 : 5.99;
  const total = subtotal + shippingCost;
  
  // Ensure cart is not empty
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
    setCurrentStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };
  
  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };
  
  const handleComplete = () => {
    // In a real application, we would submit the order to the backend here
    toast({
      title: "Order placed successfully!",
      description: "Your order has been placed and will be processed shortly.",
    });
    
    // Clear the cart after successful order
    clearCart();
    
    // Navigate to confirmation page or home
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Checkout</h1>
        
        {/* Checkout steps */}
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
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Shipping Address</h3>
                      <div className="text-sm text-muted-foreground">
                        <p>{formData.shipping.fullName}</p>
                        <p>{formData.shipping.address}</p>
                        <p>{formData.shipping.city}, {formData.shipping.state} {formData.shipping.postalCode}</p>
                        <p>{formData.shipping.country}</p>
                        <p>Phone: {formData.shipping.phone}</p>
                        <p>Email: {formData.shipping.email}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Shipping Method</h3>
                      <p className="text-sm text-muted-foreground">
                        {formData.shipping.shippingMethod === "standard" 
                          ? "Standard Shipping (3-7 business days)" 
                          : "Express Shipping (1-3 business days)"}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Payment Method</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {formData.payment.method}
                        {formData.payment.method === "mpesa" && ` (${formData.payment.mpesaPhone})`}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Order Items</h3>
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.product.id} className="flex justify-between">
                            <div className="flex gap-3">
                              <div className="w-12 h-12 rounded overflow-hidden border border-border flex-shrink-0">
                                <img 
                                  src={item.product.imageUrl} 
                                  alt={item.product.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{item.product.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {currentStep > 0 ? (
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <Button onClick={handleNext}>
                    Continue
                  </Button>
                ) : (
                  <Button onClick={handleComplete}>
                    Place Order
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <OrderSummary 
              subtotal={subtotal} 
              shippingCost={shippingCost} 
              total={total} 
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
