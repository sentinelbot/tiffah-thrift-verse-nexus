
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { createOrder } from '@/services/orderService';
import { 
  CreditCard, 
  Truck, 
  Check, 
  Lock, 
  Home,
  Building,
  PhoneIcon
} from 'lucide-react';

// Define the shipping and payment method options
const shippingMethods = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    description: '2-3 business days',
    price: 200,
  },
  {
    id: 'express',
    name: 'Express Delivery',
    description: 'Next business day',
    price: 500,
  },
];

const paymentMethods = [
  {
    id: 'mpesa',
    name: 'M-Pesa',
    description: 'Pay via M-Pesa',
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Pay with Visa, Mastercard, etc.',
  },
  {
    id: 'cash',
    name: 'Cash on Delivery',
    description: 'Pay when your order arrives',
  },
];

const Checkout = () => {
  const { items, calculateCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: 'Nairobi',
    postalCode: '',
    specialInstructions: '',
  });
  
  const [shippingMethod, setShippingMethod] = useState(shippingMethods[0].id);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].id);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const subtotal = calculateCartTotal();
  const shipping = shippingMethods.find(method => method.id === shippingMethod)?.price || 0;
  const tax = 0; // No tax for this example
  const total = subtotal + shipping + tax;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare order data
      const orderData = {
        customerId: user?.id || 'guest',
        items: items.map(item => ({
          productId: item.id,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: total,
        paymentMethod: paymentMethod,
        shippingInfo: {
          ...formData,
          shippingMethod
        }
      };
      
      // Create order
      const order = await createOrder(orderData);
      
      if (order) {
        // Handle successful order
        toast.success('Order placed successfully!');
        clearCart();
        navigate('/order-confirmation');
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Redirect to cart if cart is empty
  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Add some items to your cart before proceeding to checkout.
            </p>
            <Button onClick={() => navigate('/shop')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground">
            Complete your order by providing shipping and payment details
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Home className="mr-2 h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                  <CardDescription>
                    Enter your shipping details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                        <PhoneIcon className="h-4 w-4" />
                      </span>
                      <Input
                        id="phone"
                        name="phone"
                        className="rounded-l-none"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+254 712 345 678"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input value="Kenya" disabled />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                    <Textarea
                      id="specialInstructions"
                      name="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={handleInputChange}
                      placeholder="Any special delivery instructions..."
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="mr-2 h-5 w-5" />
                    Shipping Method
                  </CardTitle>
                  <CardDescription>
                    Select your preferred shipping method
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={shippingMethod}
                    onValueChange={setShippingMethod}
                    className="space-y-3"
                  >
                    {shippingMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`flex items-center justify-between space-x-2 rounded-md border p-4 ${
                          shippingMethod === method.id ? 'border-primary bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <RadioGroupItem value={method.id} id={`shipping-${method.id}`} />
                          <div>
                            <Label
                              htmlFor={`shipping-${method.id}`}
                              className="font-medium"
                            >
                              {method.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {method.description}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium">
                          KSh {method.price.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>
                    Select your preferred payment method
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-3"
                  >
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`flex items-center space-x-2 rounded-md border p-4 ${
                          paymentMethod === method.id ? 'border-primary bg-primary/5' : ''
                        }`}
                      >
                        <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
                        <Label
                          htmlFor={`payment-${method.id}`}
                          className="w-full flex items-start cursor-pointer"
                        >
                          <div>
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {method.description}
                            </p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
              
              <div className="flex justify-between items-center mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/cart')}
                >
                  Return to Cart
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="min-w-[150px]"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span>Place Order</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
          
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-[300px] overflow-auto space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="h-16 w-16 bg-muted shrink-0 rounded-md overflow-hidden">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × KSh {item.price.toLocaleString()}
                        </p>
                        <p className="font-medium">
                          KSh {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>KSh {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>KSh {shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>KSh {tax.toLocaleString()}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>KSh {total.toLocaleString()}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 pt-0">
                <div className="flex items-center justify-center gap-2 w-full text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span>Secure Checkout</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
