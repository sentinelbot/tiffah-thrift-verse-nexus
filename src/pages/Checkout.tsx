
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import mock checkout components
import ShippingForm from '@/components/checkout/ShippingForm';
import PaymentMethod from '@/components/checkout/PaymentMethod';
import OrderSummary from '@/components/checkout/OrderSummary';

// Define the form schema
const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  address: z.string().min(5, { message: 'Address is required' }),
  city: z.string().min(2, { message: 'City is required' }),
  state: z.string().optional(),
  postalCode: z.string().min(4, { message: 'Postal code is required' }),
  country: z.string().min(2, { message: 'Country is required' }),
  shippingMethod: z.enum(['standard', 'express', 'same-day']),
  paymentMethod: z.enum(['mpesa', 'card', 'paypal']),
  saveAddress: z.boolean().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Checkout steps
const STEPS = {
  SHIPPING: 0,
  PAYMENT: 1,
  REVIEW: 2,
};

// Mock cart items for summary
const mockCartItems = [
  {
    id: '1',
    name: 'Vintage Denim Jacket',
    price: 2500,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=150&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Floral Summer Dress',
    price: 1800,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=150&auto=format&fit=crop',
  }
];

const Checkout = () => {
  const [step, setStep] = useState(STEPS.SHIPPING);
  
  // Calculate order totals
  const subtotal = mockCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 200; // Free shipping over KSh 5,000
  const total = subtotal + shipping;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Kenya',
      shippingMethod: 'standard',
      paymentMethod: 'mpesa',
      saveAddress: false,
      notes: '',
    },
  });
  
  const nextStep = () => {
    if (step < STEPS.REVIEW) {
      setStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => {
    if (step > STEPS.SHIPPING) {
      setStep(prev => prev - 1);
    }
  };
  
  const onSubmit = (data: FormValues) => {
    if (step === STEPS.REVIEW) {
      console.log('Order submitted:', data);
      // In a real app, you would process the order here
      // Then redirect to a confirmation page
      window.location.href = '/order-confirmation';
    } else {
      nextStep();
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/cart" className="text-sm text-muted-foreground hover:text-foreground flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Cart
          </Link>
          
          <h1 className="text-3xl font-bold mt-4">Checkout</h1>
          
          {/* Checkout Progress */}
          <div className="flex justify-between mt-6 mb-8 relative">
            {/* Progress bar */}
            <div className="absolute top-1/3 left-0 right-0 h-1 bg-muted -z-10">
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: `${Math.min(100, (step / (STEPS.REVIEW)) * 100)}%` }}
              ></div>
            </div>
            
            {/* Steps */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                step >= STEPS.SHIPPING ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                1
              </div>
              <span className="text-sm font-medium">Shipping</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                step >= STEPS.PAYMENT ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                2
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                step >= STEPS.REVIEW ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                3
              </div>
              <span className="text-sm font-medium">Review</span>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {step === STEPS.SHIPPING && <ShippingForm form={form} />}
                  {step === STEPS.PAYMENT && <PaymentMethod form={form} />}
                  {step === STEPS.REVIEW && (
                    <Card>
                      <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
                        
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-base font-medium mb-2">Shipping Information</h3>
                            <div className="bg-muted p-4 rounded-md">
                              <p>{form.getValues('fullName')}</p>
                              <p>{form.getValues('address')}</p>
                              <p>{form.getValues('city')}, {form.getValues('state')} {form.getValues('postalCode')}</p>
                              <p>{form.getValues('country')}</p>
                              <p>Phone: {form.getValues('phone')}</p>
                              <p>Email: {form.getValues('email')}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-base font-medium mb-2">Payment Method</h3>
                            <div className="bg-muted p-4 rounded-md capitalize">
                              {form.getValues('paymentMethod')}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-base font-medium mb-2">Shipping Method</h3>
                            <div className="bg-muted p-4 rounded-md capitalize">
                              {form.getValues('shippingMethod') === 'same-day' 
                                ? 'Same Day Delivery'
                                : form.getValues('shippingMethod') === 'express'
                                ? 'Express Shipping (1-2 days)'
                                : 'Standard Shipping (3-5 days)'
                              }
                            </div>
                          </div>
                          
                          {form.getValues('notes') && (
                            <div>
                              <h3 className="text-base font-medium mb-2">Order Notes</h3>
                              <div className="bg-muted p-4 rounded-md">
                                {form.getValues('notes')}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div>
                  <OrderSummary 
                    items={mockCartItems}
                    subtotal={subtotal}
                    shipping={shipping}
                    total={total}
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                {step > STEPS.SHIPPING ? (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                ) : (
                  <Button type="button" variant="outline" asChild>
                    <Link to="/cart">
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back to Cart
                    </Link>
                  </Button>
                )}
                
                <Button type="submit">
                  {step === STEPS.REVIEW ? 'Place Order' : 'Continue'}
                  {step !== STEPS.REVIEW && <ChevronRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
