
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success('Message sent successfully!');
      
      // Reset form after a delay
      setTimeout(() => {
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setIsSubmitted(false);
      }, 3000);
    }, 1500);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about your order, our products, or anything else? We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3 h-12 w-12 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Visit Us</h3>
                  <p className="text-muted-foreground">
                    123 Fashion Street<br />
                    Westlands<br />
                    Nairobi, Kenya
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3 h-12 w-12 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Email Us</h3>
                  <p className="text-muted-foreground mb-1">
                    <a href="mailto:info@tiffahthrift.com" className="hover:text-primary">
                      info@tiffahthrift.com
                    </a>
                  </p>
                  <p className="text-muted-foreground">
                    <a href="mailto:support@tiffahthrift.com" className="hover:text-primary">
                      support@tiffahthrift.com
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3 h-12 w-12 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Call Us</h3>
                  <p className="text-muted-foreground mb-1">
                    <a href="tel:+254712345678" className="hover:text-primary">
                      +254 712 345 678
                    </a>
                  </p>
                  <p className="text-muted-foreground">
                    <a href="tel:+254712345679" className="hover:text-primary">
                      +254 712 345 679
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input 
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting || isSubmitted}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting || isSubmitted}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject"
                  type="text"
                  placeholder="How can we help you?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={isSubmitting || isSubmitted}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message"
                  placeholder="Type your message here..."
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting || isSubmitted}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting || isSubmitted}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </>
                ) : isSubmitted ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">Business Hours</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="rounded-full bg-primary/10 p-3 h-12 w-12 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">When We're Open</h3>
                    <p className="text-muted-foreground">
                      We're here to assist you during the following hours:
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span>Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Public Holidays</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-bold mb-2">Customer Support</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Our dedicated customer support team typically responds to emails within 24 hours on business days.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    For urgent inquiries, please call our customer service hotline during business hours.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Find Us</h2>
              <div className="rounded-lg overflow-hidden h-[300px] bg-muted flex items-center justify-center">
                <MapPin className="h-10 w-10 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Map goes here</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="mb-6">
            Find answers to our most commonly asked questions in our FAQ section.
          </p>
          <Button variant="outline">
            Visit FAQ Page
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;
