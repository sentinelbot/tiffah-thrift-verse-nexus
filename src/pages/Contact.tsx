
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MessageSquare, MapPin, Clock } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }, 1500);
  };

  return (
    <PageLayout title="Contact Us" description="Get in touch with our team">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email address"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Subject
              </label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this regarding?"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message"
                rows={5}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Email Us</p>
                  <a href="mailto:info@tiffahthrift.com" className="text-muted-foreground hover:text-primary">
                    info@tiffahthrift.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Call Us</p>
                  <a href="tel:+254712345678" className="text-muted-foreground hover:text-primary">
                    +254 712 345 678
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <MessageSquare className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">WhatsApp</p>
                  <a href="https://wa.me/254712345678" className="text-muted-foreground hover:text-primary">
                    +254 712 345 678
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Visit Our Store</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">
                    123 Thrift Avenue<br />
                    Kilimani, Nairobi<br />
                    Kenya
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Business Hours</p>
                  <p className="text-muted-foreground">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <p className="mb-2">Stay connected with us on social media for updates, styling tips, and more!</p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/tiffahthrift" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Instagram
              </a>
              <a href="https://facebook.com/tiffahthrift" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Facebook
              </a>
              <a href="https://twitter.com/tiffahthrift" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Store Location</h3>
        <div className="border border-border rounded-lg overflow-hidden h-80">
          {/* This would typically be a Google Maps embed - using a placeholder for now */}
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Map Loading... (Google Maps integration would go here)</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Contact;
