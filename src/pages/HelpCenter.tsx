
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  HelpCircle, 
  Book, 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  User,
  ArrowRight,
  MessageSquare,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Layout components
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Common FAQ categories and questions
const faqCategories = [
  {
    id: 'ordering',
    name: 'Ordering & Payment',
    icon: ShoppingBag,
    questions: [
      {
        question: 'How do I place an order?',
        answer: 'Browse our collection, add items to your cart, and proceed to checkout. You can pay using M-Pesa, card, or other available payment methods.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept M-Pesa, Visa, Mastercard, and PayPal. Cash on delivery is available for select locations in Nairobi.'
      },
      {
        question: 'Can I cancel my order?',
        answer: 'Orders can be cancelled within 1 hour of placing them, before they enter the processing stage. Please contact our customer service team immediately if you need to cancel.'
      },
      {
        question: 'Do you have a return policy?',
        answer: 'Due to the unique nature of second-hand items, we do not offer returns or exchanges. All sales are final. We provide detailed descriptions and multiple photos to help you make informed decisions.'
      },
      {
        question: 'How can I check my order status?',
        answer: 'You can check your order status by logging into your account and going to the "Orders" section, or by using the order tracking feature with your order number and email.'
      }
    ]
  },
  {
    id: 'shipping',
    name: 'Shipping & Delivery',
    icon: Truck,
    questions: [
      {
        question: 'What are your delivery options?',
        answer: 'We offer standard delivery across Kenya, with express delivery available in Nairobi. Delivery times vary based on your location.'
      },
      {
        question: 'How much does shipping cost?',
        answer: 'Shipping costs are calculated based on your location: Nairobi (KSh 200), Central Kenya (KSh 350), and Rest of Kenya (KSh 500).'
      },
      {
        question: 'How long will it take to receive my order?',
        answer: 'Delivery times: Nairobi (same-day or next-day), Central Kenya (2-3 days), and other regions (3-5 business days).'
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Currently, we only ship within Kenya. We plan to expand to East Africa in the future.'
      },
      {
        question: 'Can I track my delivery?',
        answer: 'Yes, once your order is shipped, you will receive a tracking number via email and SMS that you can use to monitor your delivery status.'
      }
    ]
  },
  {
    id: 'products',
    name: 'Products & Inventory',
    icon: Book,
    questions: [
      {
        question: 'How do you determine the condition of items?',
        answer: 'We use a standardized rating system: New (with tags), Like New (excellent condition), Good (minor signs of wear), and Fair (visible wear but functional).'
      },
      {
        question: 'Are measurements provided for clothing items?',
        answer: 'Yes, we provide detailed measurements for all clothing items to help you determine fit, as sizing can vary by brand and era.'
      },
      {
        question: 'How often do you add new items?',
        answer: 'We update our inventory daily with new arrivals. The best time to check is in the morning when most new items are listed.'
      },
      {
        question: 'Can I reserve an item I like?',
        answer: 'Items in your cart are automatically reserved for 15 minutes. We do not offer longer reservation periods.'
      },
      {
        question: 'Do you verify the authenticity of branded items?',
        answer: 'Yes, our team carefully verifies the authenticity of all branded items before listing them on our platform.'
      }
    ]
  },
  {
    id: 'account',
    name: 'Account & Profile',
    icon: User,
    questions: [
      {
        question: 'How do I create an account?',
        answer: 'Click on "Sign In" at the top right of the page, then select "Create Account" and follow the instructions to register.'
      },
      {
        question: 'Can I use Tiffah without creating an account?',
        answer: 'You can browse products without an account, but you\'ll need to create one to make purchases, save favorites, or track orders.'
      },
      {
        question: 'How do I reset my password?',
        answer: 'Click on "Sign In", then "Forgot Password", and follow the instructions sent to your email to reset your password.'
      },
      {
        question: 'Can I have multiple shipping addresses?',
        answer: 'Yes, you can save multiple shipping addresses in your account settings for convenient checkout.'
      },
      {
        question: 'Is my personal information secure?',
        answer: 'Yes, we use industry-standard security measures to protect your personal and payment information. We never share your details with third parties without your consent.'
      }
    ]
  },
  {
    id: 'payment',
    name: 'Payment & Pricing',
    icon: CreditCard,
    questions: [
      {
        question: 'Why are prices in Kenyan Shillings (KSh)?',
        answer: 'As a Kenyan business, we display all prices in Kenyan Shillings (KSh) to provide a clear and consistent shopping experience.'
      },
      {
        question: 'Do you offer discounts or promotions?',
        answer: 'Yes, we regularly offer seasonal sales and promotions. Sign up for our newsletter to be notified about upcoming discounts.'
      },
      {
        question: 'Is M-Pesa payment secure?',
        answer: 'Yes, our M-Pesa integration is fully secure and uses the official Safaricom API for all transactions.'
      },
      {
        question: 'When will my card be charged?',
        answer: 'Your card will be charged immediately upon completing your purchase. We do not store your full card details.'
      },
      {
        question: 'Do you offer installment payments?',
        answer: 'Currently, we do not offer installment payment options. All purchases must be paid in full at checkout.'
      }
    ]
  }
];

// Staff-specific FAQs
const staffFaqs = [
  {
    id: 'product-management',
    name: 'Product Management',
    icon: Book,
    questions: [
      {
        question: 'How do I add a new product to the inventory?',
        answer: 'Navigate to the Staff Dashboard > Products > Add New Product. Fill in all required fields, upload photos, and submit the form to add the item to inventory.'
      },
      {
        question: 'How do I use the barcode system?',
        answer: 'After adding a product, a barcode is automatically generated. You can print the barcode from the product details page. Use the mobile scanner app to scan products during inventory management or order fulfillment.'
      },
      {
        question: 'What should I do if an item has damage not mentioned in the description?',
        answer: 'Update the product details immediately with accurate condition information. If the damage significantly affects the value, consult with a manager about adjusting the price.'
      },
      {
        question: 'How do I take proper product photos?',
        answer: 'Use the photo booth with consistent lighting. Take photos from multiple angles showing the entire item, close-ups of details, and any imperfections. Make sure to capture brand labels and size tags.'
      },
      {
        question: 'How do I categorize unusual items?',
        answer: 'Use the most specific category that applies. If unsure, check the category guidelines document in the Staff Knowledge Base or consult with a senior staff member.'
      }
    ]
  },
  {
    id: 'order-processing',
    name: 'Order Processing',
    icon: ShoppingBag,
    questions: [
      {
        question: 'What is the order fulfillment workflow?',
        answer: 'Orders progress through these stages: New Order > Processing > Ready for Pickup/Delivery > Out for Delivery > Delivered. Update the status at each stage using the Orders dashboard.'
      },
      {
        question: 'How do I process an order?',
        answer: 'Click "Process" on a new order, use the barcode scanner to verify each item, pack them securely, print the packing slip and shipping label, then mark as "Ready for Pickup/Delivery".'
      },
      {
        question: 'What if an ordered item is damaged or missing?',
        answer: 'Mark the order as "Issue" in the system, document the problem, and contact the customer immediately to offer alternatives (similar item, store credit, or refund).'
      },
      {
        question: 'How do I print shipping labels and receipts?',
        answer: 'Go to the order details page and click "Print Shipping Label" or "Print Receipt". Make sure you have the correct printer selected in the printing dialog.'
      },
      {
        question: 'What should I include in order packages?',
        answer: 'Each package should include: the ordered items (verified by barcode), packing slip, thank you card, and any promotional materials currently in rotation.'
      }
    ]
  },
  {
    id: 'delivery',
    name: 'Delivery Management',
    icon: Truck,
    questions: [
      {
        question: 'How do I view my delivery assignments?',
        answer: 'Log in to the Staff Dashboard and go to the Deliveries section to see all orders assigned to you for delivery, sorted by priority and location.'
      },
      {
        question: 'How do I record a successful delivery?',
        answer: 'When delivering an order, scan the package barcode, collect the customer\'s signature on your device, and take a photo as proof of delivery if required. Then mark the order as "Delivered" in the app.'
      },
      {
        question: 'What if the customer is not available for delivery?',
        answer: 'Call the customer before marking as "Delivery Attempted". Leave a delivery notice with instructions to reschedule. Log the attempt and reason in the delivery app.'
      },
      {
        question: 'How do I use the route optimization feature?',
        answer: 'In the Deliveries dashboard, click "Optimize Route" to automatically arrange deliveries in the most efficient order. You can manually adjust if needed.'
      },
      {
        question: 'What if I encounter vehicle issues during delivery?',
        answer: 'Contact the logistics manager immediately. If deliveries will be significantly delayed, they will notify affected customers while you address the vehicle issue.'
      }
    ]
  },
  {
    id: 'admin',
    name: 'Admin & Settings',
    icon: User,
    questions: [
      {
        question: 'How do I add a new staff account?',
        answer: 'Go to Admin > Staff Management > Add Staff Member. Fill in their details, select the appropriate role, and submit. The system will send them login credentials.'
      },
      {
        question: 'How do I access the analytics dashboard?',
        answer: 'Navigate to Admin > Analytics to view comprehensive business metrics, including sales performance, inventory turnover, and staff productivity.'
      },
      {
        question: 'How do I configure printer settings?',
        answer: 'Go to Admin > Settings > Printing to set up or modify printer configurations for different purposes (product labels, receipts, shipping labels).'
      },
      {
        question: 'How do I create a new promotion?',
        answer: 'Navigate to Admin > Marketing > Promotions > New Promotion. Set the discount parameters, applicable products, duration, and promotion code, then activate it.'
      },
      {
        question: 'How do I respond to customer feedback?',
        answer: 'Go to Admin > Customer Feedback, select the feedback entry, and click "Respond". Your response will be sent to the customer via email and visible in their account.'
      }
    ]
  }
];

// Role-based help content access
const getRoleSpecificFAQs = (role: string) => {
  if (role === 'admin') {
    return [...faqCategories, ...staffFaqs];
  } else if (['productManager', 'orderPreparer', 'deliveryStaff'].includes(role)) {
    // Filter staff FAQs based on role
    let roleFaqs = [];
    if (role === 'productManager') {
      roleFaqs = staffFaqs.filter(cat => ['product-management', 'admin'].includes(cat.id));
    } else if (role === 'orderPreparer') {
      roleFaqs = staffFaqs.filter(cat => ['order-processing', 'product-management'].includes(cat.id));
    } else if (role === 'deliveryStaff') {
      roleFaqs = staffFaqs.filter(cat => ['delivery', 'order-processing'].includes(cat.id));
    }
    return [...faqCategories, ...roleFaqs];
  } else {
    // Customer or non-logged in user
    return faqCategories;
  }
};

const HelpCenter = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  
  // Get FAQs based on user role
  const availableFaqs = getRoleSpecificFAQs(user?.role || 'customer');
  
  // Filter FAQs based on search query and selected category
  const filteredFaqs = availableFaqs.filter(category => 
    selectedCategory === 'all' || category.id === selectedCategory
  ).map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      !searchQuery ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);
  
  // Handle contact form submission
  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Your message has been sent! Our team will respond shortly.');
    setContactSubject('');
    setContactMessage('');
  };
  
  return (
    <>
      <Navbar />
      <main className="container py-10 max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">How Can We Help You?</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions, get support, or reach out to our team.
          </p>
          
          <div className="relative max-w-2xl mx-auto mt-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="search"
              placeholder="Search for answers..."
              className="pl-10 py-6 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <Card className="p-6 bg-primary/5 hover:bg-primary/10 transition duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Frequently Asked Questions</h3>
              <p className="text-muted-foreground mb-4">Find answers to common questions about ordering, shipping, and more.</p>
              <Button variant="link" asChild>
                <a href="#faqs">Browse FAQs <ArrowRight className="ml-1 h-4 w-4" /></a>
              </Button>
            </div>
          </Card>
          
          <Card className="p-6 bg-primary/5 hover:bg-primary/10 transition duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Contact Support</h3>
              <p className="text-muted-foreground mb-4">Need more help? Reach out to our customer support team directly.</p>
              <Button variant="link" asChild>
                <a href="#contact">Contact Us <ArrowRight className="ml-1 h-4 w-4" /></a>
              </Button>
            </div>
          </Card>
          
          <Card className="p-6 bg-primary/5 hover:bg-primary/10 transition duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Book className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Thrift Store Policies</h3>
              <p className="text-muted-foreground mb-4">Learn about our shipping, payment, and no-return policies.</p>
              <Button variant="link" asChild>
                <a href="#policies">View Policies <ArrowRight className="ml-1 h-4 w-4" /></a>
              </Button>
            </div>
          </Card>
        </div>
        
        <div id="faqs" className="mb-16 scroll-mt-16">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          
          <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="mb-8 flex flex-wrap">
              <TabsTrigger value="all">All Topics</TabsTrigger>
              {availableFaqs.map(category => (
                <TabsTrigger key={category.id} value={category.id}>
                  <category.icon className="h-4 w-4 mr-2" />
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={selectedCategory} className="mt-0">
              {searchQuery && filteredFaqs.length === 0 ? (
                <div className="text-center py-10">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find answers matching "{searchQuery}".
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
                    <Button variant="outline" asChild>
                      <a href="#contact">Contact Support</a>
                    </Button>
                  </div>
                </div>
              ) : (
                filteredFaqs.map(category => (
                  <div key={category.id} className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <category.icon className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-semibold">{category.name}</h3>
                    </div>
                    
                    <Accordion type="single" collapsible className="mb-6">
                      {category.questions.map((faq, index) => (
                        <AccordionItem key={index} value={`${category.id}-${index}`}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-muted-foreground">{faq.answer}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    
                    <Separator className="my-8" />
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div id="contact" className="mb-16 scroll-mt-16">
          <h2 className="text-2xl font-bold mb-6">Contact Support</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card className="p-6 h-full">
                <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
                <p className="text-muted-foreground mb-6">
                  Our customer support team is here to help. Reach out through any of these channels:
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">support@tiffahthrift.co.ke</p>
                      <p className="text-xs text-muted-foreground">Responses within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground">+254 712 345 678</p>
                      <p className="text-xs text-muted-foreground">Mon-Fri, 8am-5pm EAT</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Live Chat</p>
                      <p className="text-muted-foreground">Available on our website</p>
                      <p className="text-xs text-muted-foreground">Mon-Sat, 9am-7pm EAT</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Send a Message</h3>
                <form onSubmit={handleSubmitContact}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">Email Address</Label>
                        <Input 
                          id="contact-email"
                          type="email"
                          placeholder="Your email address"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contact-subject">Subject</Label>
                        <Select value={contactSubject} onValueChange={setContactSubject} required>
                          <SelectTrigger id="contact-subject">
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="order">Order Inquiry</SelectItem>
                            <SelectItem value="product">Product Question</SelectItem>
                            <SelectItem value="shipping">Shipping & Delivery</SelectItem>
                            <SelectItem value="payment">Payment Issue</SelectItem>
                            <SelectItem value="account">Account Help</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contact-message">Message</Label>
                      <Textarea 
                        id="contact-message"
                        placeholder="Please describe your issue or question in detail..."
                        rows={6}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full md:w-auto">
                      Send Message
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </div>
        
        <div id="policies" className="mb-16 scroll-mt-16">
          <h2 className="text-2xl font-bold mb-6">Store Policies</h2>
          
          <Card>
            <Accordion type="single" collapsible>
              <AccordionItem value="shipping">
                <AccordionTrigger className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Shipping Policy</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      At Tiffah Thrift Store, we strive to deliver your items as quickly and reliably as possible. We ship throughout Kenya with the following delivery options:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                      <div className="border rounded p-4">
                        <h4 className="font-medium">Nairobi</h4>
                        <p className="text-sm">Same-day or next-day delivery</p>
                        <p className="text-sm font-medium mt-2">KSh 200</p>
                      </div>
                      
                      <div className="border rounded p-4">
                        <h4 className="font-medium">Central Kenya</h4>
                        <p className="text-sm">2-3 business days</p>
                        <p className="text-sm font-medium mt-2">KSh 350</p>
                      </div>
                      
                      <div className="border rounded p-4">
                        <h4 className="font-medium">Rest of Kenya</h4>
                        <p className="text-sm">3-5 business days</p>
                        <p className="text-sm font-medium mt-2">KSh 500</p>
                      </div>
                    </div>
                    
                    <p>
                      All orders are processed within 24 hours during business days (Monday-Friday, excluding holidays). Once your order ships, you will receive tracking information via email and SMS.
                    </p>
                    
                    <p>
                      If you need a rush delivery or have special delivery requirements, please contact our customer service team.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="returns">
                <AccordionTrigger className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    <span className="font-semibold">No-Return Policy</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Due to the unique nature of second-hand items, <strong>all sales are final</strong> at Tiffah Thrift Store. We do not accept returns or exchanges.
                    </p>
                    
                    <p>
                      To help ensure you're satisfied with your purchase:
                    </p>
                    
                    <ul className="list-disc pl-5 space-y-2">
                      <li>We provide detailed descriptions of each item's condition</li>
                      <li>Multiple high-resolution photos showing all aspects of the item</li>
                      <li>Precise measurements for clothing items</li>
                      <li>Clear disclosure of any imperfections or wear</li>
                    </ul>
                    
                    <p>
                      If you have questions about a specific item before purchasing, please contact our customer service team who can provide additional information.
                    </p>
                    
                    <p>
                      In the rare case that you receive an item significantly different from its description, please contact us within 24 hours of delivery with photos documenting the discrepancy. These cases will be reviewed individually.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="payment">
                <AccordionTrigger className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Payment Policy</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Tiffah Thrift Store accepts the following payment methods:
                    </p>
                    
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>M-Pesa:</strong> Our preferred payment method for local customers</li>
                      <li><strong>Credit/Debit Cards:</strong> Visa and Mastercard</li>
                      <li><strong>PayPal:</strong> Available for all customers</li>
                      <li><strong>Cash on Delivery:</strong> Available in select areas of Nairobi with additional fee</li>
                    </ul>
                    
                    <p>
                      All prices are listed in Kenyan Shillings (KSh). Payment is required at the time of purchase. For M-Pesa payments, please ensure your phone is available to complete the transaction.
                    </p>
                    
                    <p>
                      We use industry-standard encryption and security protocols to protect your payment information. We do not store your full credit card details on our servers.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="privacy">
                <AccordionTrigger className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Privacy Policy</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      At Tiffah Thrift Store, we respect your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.
                    </p>
                    
                    <h4 className="font-medium">Information We Collect:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Contact information (name, email, phone number)</li>
                      <li>Shipping and billing addresses</li>
                      <li>Purchase history and preferences</li>
                      <li>Payment information (processed securely through our payment providers)</li>
                      <li>Website usage data and preferences</li>
                    </ul>
                    
                    <h4 className="font-medium">How We Use Your Information:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Process and fulfill your orders</li>
                      <li>Communicate about your purchases and account</li>
                      <li>Improve our website and services</li>
                      <li>Provide personalized shopping recommendations</li>
                      <li>Send promotional offers and updates (with consent)</li>
                    </ul>
                    
                    <p>
                      We do not sell or share your personal information with third parties except as necessary to provide our services (e.g., payment processing, shipping). You can request access to your data or opt out of marketing communications at any time.
                    </p>
                    
                    <p>
                      For the complete privacy policy, please visit our <Button variant="link" className="p-0 h-auto">Privacy Policy</Button> page.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </div>
        
        {user && ['admin', 'productManager', 'orderPreparer', 'deliveryStaff'].includes(user.role) && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Staff Resources</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Book className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Staff Knowledge Base</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Access our comprehensive knowledge base with detailed guides, SOPs, and training materials.
                </p>
                <Button asChild>
                  <Link to="/staff/training">
                    Access Knowledge Base
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Staff Communications</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Connect with your team, share updates, and access important announcements.
                </p>
                <Button asChild>
                  <Link to={user.role === 'admin' ? "/admin/communications" : "/staff/communications"}>
                    Open Communications
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </Card>
            </div>
          </div>
        )}
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Still Need Help?</h3>
          <p className="text-muted-foreground mb-4">
            Our customer support team is ready to assist you with any questions or concerns.
          </p>
          <Button asChild>
            <a href="#contact">Contact Support</a>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default HelpCenter;
