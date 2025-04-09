
import { useState, useEffect } from "react";
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
import { CheckCircle2, Loader2 } from "lucide-react";
import { createOrder } from "@/services/orderService";
import { processPayment } from "@/services/paymentService";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { formatMpesaPhone } from "@/utils/kenyaUtils";
import { PaymentMethod as PaymentMethodType, PaymentStatus, ShippingInfo } from "@/types/order";

const steps = [
  { id: "shipping", title: "shipping" },
  { id: "payment", title: "payment" },
  { id: "confirmation", title: "confirmation" }
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
    shippingMethod: "standard",
    specialInstructions: ""
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
  const [shippingCost, setShippingCost] = useState(200); // Default to standard Nairobi shipping
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, calculateCartTotal, clearCart } = useCart();
  const { t, formatCurrency } = useI18n();
  
  // Pre-fill user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        shipping: {
          ...prev.shipping,
          fullName: user.name || prev.shipping.fullName,
          email: user.email || prev.shipping.email
        }
      }));
    }
  }, [user]);
  
  // Calculate costs
  const subtotal = calculateCartTotal();
  // VAT (16% in Kenya)
  const vatRate = 0.16;
  const vatAmount = subtotal * vatRate;
  const total = subtotal + shippingCost + vatAmount;
  
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

    // If the user updates the shipping phone number and M-Pesa phone is empty, sync them
    if (step === 'shipping' && data.phone && !formData.payment.mpesaPhone) {
      setFormData(prev => ({
        ...prev,
        payment: {
          ...prev.payment,
          mpesaPhone: data.phone
        }
      }));
    }
  };

  const updateShippingCost = (cost: number) => {
    setShippingCost(cost);
  };
  
  const handleNext = () => {
    // Validate shipping info
    if (currentStep === 0) {
      const { fullName, email, phone, address, city, state, postalCode } = formData.shipping;
      if (!fullName || !email || !phone || !address || !city || !state || !postalCode) {
        toast({
          title: t('common.errors.required_fields'),
          variant: "destructive"
        });
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: t('common.errors.invalid_email'),
          variant: "destructive"
        });
        return;
      }
      
      // Validate phone number (Kenyan format)
      const phoneRegex = /^(?:\+254|0)[1-9][0-9]{8}$/;
      if (!phoneRegex.test(phone)) {
        toast({
          title: t('common.errors.invalid_phone'),
          description: t('common.errors.invalid_kenyan_phone'),
          variant: "destructive"
        });
        return;
      }
    }
    
    // Validate payment info
    if (currentStep === 1) {
      const { method, cardName, cardNumber, expiryDate, cvv, mpesaPhone } = formData.payment;
      
      if (method === "card") {
        if (!cardName || !cardNumber || !expiryDate || !cvv) {
          toast({
            title: t('common.errors.card_details_required'),
            variant: "destructive"
          });
          return;
        }
        
        // Validate card number
        if (!/^[0-9]{16}$/.test(cardNumber?.replace(/\s/g, "") || "")) {
          toast({
            title: t('common.errors.invalid_card'),
            variant: "destructive"
          });
          return;
        }
        
        // Validate expiry date
        if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiryDate || "")) {
          toast({
            title: t('common.errors.invalid_expiry'),
            variant: "destructive"
          });
          return;
        }
        
        // Validate CVV
        if (!/^[0-9]{3,4}$/.test(cvv || "")) {
          toast({
            title: t('common.errors.invalid_cvv'),
            variant: "destructive"
          });
          return;
        }
      } else if (method === "mpesa") {
        if (!mpesaPhone) {
          toast({
            title: t('common.errors.mpesa_phone_required'),
            variant: "destructive"
          });
          return;
        }
        
        // Validate Mpesa phone number (Kenyan format)
        const phoneRegex = /^(?:\+254|0)[1-9][0-9]{8}$/;
        if (!phoneRegex.test(mpesaPhone)) {
          toast({
            title: t('common.errors.invalid_mpesa_phone'),
            variant: "destructive"
          });
          return;
        }
      }
    }
    
    setCurrentStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };
  
  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };
  
  const handleComplete = async () => {
    setIsProcessing(true);
    
    try {
      // Format M-Pesa phone number if needed
      if (formData.payment.method === 'mpesa' && formData.payment.mpesaPhone) {
        formData.payment.mpesaPhone = formatMpesaPhone(formData.payment.mpesaPhone);
      }
      
      // Process payment first
      const paymentResult = await processPayment(
        formData.payment.method,
        total,
        "TMP-" + Date.now(), // Temporary order number
        formData.payment
      );
      
      if (!paymentResult.success && formData.payment.method !== 'cash') {
        setIsProcessing(false);
        return;
      }
      
      // Prepare order items
      const orderItems = cartItems.map(item => ({
        productId: item.product.id,
        product: {
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          imageUrl: item.product.imageUrl
        },
        quantity: item.quantity,
        price: item.product.price
      }));
      
      // Create order
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
          status: paymentResult.status || 'pending',
          transactionId: paymentResult.transactionId,
          amount: total
        },
        shippingInfo: formData.shipping,
        deliveryInfo: {
          estimatedDelivery: new Date(Date.now() + (formData.shipping.shippingMethod === 'express' ? 2 : 5) * 24 * 60 * 60 * 1000)
        }
      });
      
      // Clear the cart after successful order
      clearCart();
      
      // Navigate to order confirmation page
      navigate("/order-confirmation", { state: { orderId: order.id } });
    } catch (error) {
      console.error("Error processing order:", error);
      toast({
        title: t('common.errors.order_processing'),
        description: t('common.errors.try_again'),
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">{t('common.checkout.checkout')}</h1>
        
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
                {t(`common.checkout.${steps[index].title}`)}
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
                <CardTitle>{t(`common.checkout.${steps[currentStep].title}`)}</CardTitle>
                <CardDescription>
                  {currentStep === 0 && t('common.checkout.enter_shipping')}
                  {currentStep === 1 && t('common.checkout.choose_payment')}
                  {currentStep === 2 && t('common.checkout.review_confirm')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentStep === 0 && (
                  <ShippingForm 
                    data={formData.shipping} 
                    updateData={(data) => updateFormData("shipping", data)} 
                    updateShippingCost={updateShippingCost}
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
                      <h3 className="font-medium mb-2">{t('common.checkout.shipping_address')}</h3>
                      <div className="text-sm text-muted-foreground">
                        <p>{formData.shipping.fullName}</p>
                        <p>{formData.shipping.address}</p>
                        <p>{formData.shipping.city}, {formData.shipping.state} {formData.shipping.postalCode}</p>
                        <p>{formData.shipping.country}</p>
                        <p>{t('common.checkout.phone')}: {formData.shipping.phone}</p>
                        <p>{t('common.checkout.email')}: {formData.shipping.email}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">{t('common.checkout.shipping_method')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formData.shipping.shippingMethod === "standard" 
                          ? t('common.checkout.standard_shipping_days', { days: '3-7' }) 
                          : t('common.checkout.express_shipping_days', { days: '1-3' })}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">{t('common.checkout.payment_method')}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {t(`common.payment.${formData.payment.method}`)}
                        {formData.payment.method === "mpesa" && ` (${formData.payment.mpesaPhone})`}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">{t('common.checkout.order_items')}</h3>
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
                                  {t('common.cart.quantity')}: {item.quantity} × {formatCurrency(item.product.price)}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm">
                              {formatCurrency(item.product.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6 ml-auto w-full max-w-[240px]">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{t('common.cart.subtotal')}:</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{t('common.cart.tax')}:</span>
                        <span>{formatCurrency(vatAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{t('common.cart.shipping')}:</span>
                        <span>{formatCurrency(shippingCost)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold">
                        <span>{t('common.cart.total')}:</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {currentStep > 0 ? (
                  <Button variant="outline" onClick={handleBack} disabled={isProcessing}>
                    {t('common.buttons.back')}
                  </Button>
                ) : (
                  <div></div>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <Button onClick={handleNext}>
                    {t('common.buttons.next')}
                  </Button>
                ) : (
                  <Button onClick={handleComplete} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('common.checkout.processing')}
                      </>
                    ) : (
                      t('common.checkout.place_order')
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
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
