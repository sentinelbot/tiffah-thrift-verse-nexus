
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Search, Book, MessageSquare, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const HelpButton = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const role = user?.role || 'customer';
  
  const helpCategories = {
    customer: [
      {
        title: "Shopping",
        content: [
          { 
            question: "How do I search for products?", 
            answer: "You can use the search bar at the top of any page to find products. You can also browse by category using the menu options."
          },
          { 
            question: "How do I filter search results?", 
            answer: "After searching, you can use the filter options on the left side of the search results to narrow down by size, color, brand, and price range."
          },
          { 
            question: "Can I save items for later?", 
            answer: "Yes! Click the heart icon on any product to add it to your wishlist. You can view your wishlist from your account page."
          }
        ]
      },
      {
        title: "Orders & Payment",
        content: [
          { 
            question: "What payment methods do you accept?", 
            answer: "We accept M-Pesa, credit/debit cards, and PayPal."
          },
          { 
            question: "How do I track my order?", 
            answer: "You can track your order from your account page under 'Orders'. Each order will show its current status and estimated delivery date."
          },
          { 
            question: "Do you have a return policy?", 
            answer: "Due to the nature of second-hand items, we do not accept returns. All sales are final, but we ensure quality through our detailed inspection process."
          }
        ]
      },
      {
        title: "Account",
        content: [
          { 
            question: "How do I create an account?", 
            answer: "Click 'Sign in' at the top of the page, then select 'Create account'. Fill in your details to register."
          },
          { 
            question: "How do I reset my password?", 
            answer: "On the login page, click 'Forgot password?' and follow the instructions sent to your email."
          },
          { 
            question: "Can I update my shipping address?", 
            answer: "Yes, you can manage your shipping addresses in your account settings."
          }
        ]
      }
    ],
    staff: [
      {
        title: "Staff Dashboard",
        content: [
          { 
            question: "How do I access my dashboard?", 
            answer: "After logging in, click on your profile picture and select 'Staff Dashboard'. You'll be directed to the appropriate section based on your role."
          },
          { 
            question: "What features can I access?", 
            answer: "Your access is based on your role. Product Managers can manage inventory, Order Preparers handle orders, and Delivery Staff manage deliveries."
          }
        ]
      },
      {
        title: "Product Management",
        content: [
          { 
            question: "How do I add a new product?", 
            answer: "From the Products page, click 'Add Product' and fill in all required details. Don't forget to add multiple images and set the condition accurately."
          },
          { 
            question: "How do I use the barcode system?", 
            answer: "After adding a product, a barcode is automatically generated. Navigate to the Scanning page to print labels or scan existing products."
          }
        ]
      },
      {
        title: "Order Processing",
        content: [
          { 
            question: "How do I mark an order as prepared?", 
            answer: "From the Orders page, find the order and click 'Process'. Once all items are collected and packed, click 'Mark as Ready'."
          },
          { 
            question: "How do I print order receipts?", 
            answer: "From any order detail page, click the 'Print Receipt' button. This will use your assigned printer."
          }
        ]
      }
    ],
    admin: [
      {
        title: "Admin Dashboard",
        content: [
          { 
            question: "How do I access analytics?", 
            answer: "From the Admin Dashboard, navigate to the Analytics section. You'll find comprehensive reports on sales, inventory, and customer behavior."
          },
          { 
            question: "How do I manage staff accounts?", 
            answer: "Go to Staff Management to add new staff members, assign roles, and monitor performance."
          }
        ]
      },
      {
        title: "System Settings",
        content: [
          { 
            question: "How do I update shipping rates?", 
            answer: "Navigate to Settings > Shipping Zones to manage shipping rates by region."
          },
          { 
            question: "How do I configure payment methods?", 
            answer: "Go to Settings > Payment to enable or disable payment methods and update API credentials."
          },
          { 
            question: "How do I manage categories?", 
            answer: "Navigate to Categories to add, edit, or deactivate product categories and subcategories."
          }
        ]
      },
      {
        title: "Content Management",
        content: [
          { 
            question: "How do I update the home page?", 
            answer: "Go to Content Management > Homepage to change featured products, banners, and promotional sections."
          },
          { 
            question: "How do I manage customer feedback?", 
            answer: "Navigate to Customer Feedback to view, respond to, and feature customer reviews."
          }
        ]
      }
    ]
  };
  
  // Get relevant help content based on user role
  const getRelevantContent = () => {
    if (role === 'admin') {
      return [...helpCategories.admin, ...helpCategories.staff, ...helpCategories.customer];
    } else if (['productManager', 'orderPreparer', 'deliveryStaff'].includes(role)) {
      return [...helpCategories.staff, ...helpCategories.customer];
    } else {
      return helpCategories.customer;
    }
  };
  
  const relevantContent = getRelevantContent();
  
  // Filter content based on search query
  const filteredContent = searchQuery.trim() === "" 
    ? relevantContent 
    : relevantContent.map(category => ({
        title: category.title,
        content: category.content.filter(item => 
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.content.length > 0);
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg z-50">
          <HelpCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Help Center</SheetTitle>
          <SheetDescription>
            Find answers to common questions and get support
          </SheetDescription>
        </SheetHeader>
        
        <div className="relative mb-6">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            className="pl-8 pr-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="faq">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="faq">
              <Book className="h-4 w-4 mr-2" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="contact">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Support
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="faq" className="mt-4">
            {filteredContent.length === 0 ? (
              <div className="text-center py-8">
                <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <h3 className="mt-4 font-medium">No results found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Try a different search term or browse the categories below
                </p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {filteredContent.map((category, categoryIndex) => (
                  category.content.length > 0 && (
                    <AccordionItem key={`${category.title}-${categoryIndex}`} value={`${category.title}-${categoryIndex}`}>
                      <AccordionTrigger>{category.title}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {category.content.map((item, itemIndex) => (
                            <div key={`${category.title}-${itemIndex}`} className="border rounded-lg p-3">
                              <h4 className="font-medium">{item.question}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{item.answer}</p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                ))}
              </Accordion>
            )}
          </TabsContent>
          
          <TabsContent value="contact" className="mt-4">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Send us an email and we'll get back to you within 24 hours.
                </p>
                <Button variant="outline" className="w-full mt-2" onClick={() => window.location.href = 'mailto:support@tiffahthrift.co.ke'}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  support@tiffahthrift.co.ke
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Phone Support</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Available Monday to Friday, 9am to 5pm EAT
                </p>
                <Button variant="outline" className="w-full mt-2" onClick={() => window.location.href = 'tel:+254712345678'}>
                  +254 712 345 678
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">WhatsApp Support</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Get quick assistance via WhatsApp
                </p>
                <Button variant="outline" className="w-full mt-2" onClick={() => window.location.href = 'https://wa.me/254712345678'}>
                  Chat on WhatsApp
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <SheetFooter className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-between border-t pt-4">
          <span className="text-xs text-muted-foreground">
            © 2024 Tiffah Thrift Store. All rights reserved.
          </span>
          <SheetClose asChild>
            <Button variant="outline" size="sm">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default HelpButton;
