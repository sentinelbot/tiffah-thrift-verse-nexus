
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, Copyright } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccessControl } from "@/hooks/useAccessControl";
import AdminAccessModal from "@/components/admin/AdminAccessModal";

const Footer = () => {
  // Access control state management
  const { processAccessAttempt, triggerAccessAnimation } = useAccessControl();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const copyrightRef = useRef<HTMLSpanElement>(null);
  
  // Handle copyright text click
  const handleCopyrightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Process click with security measures
    const accessGranted = processAccessAttempt('copyright');
    if (accessGranted) {
      // Only show animation and modal if access is granted
      triggerAccessAnimation(copyrightRef.current, () => {
        setShowAdminModal(true);
      });
    }
  };

  return (
    <footer className="bg-muted mt-8 pt-12 pb-6 text-muted-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">
              <span className="text-gradient">Tiffah</span>
              <span className="text-foreground">Thrift</span>
            </h2>
            <p className="text-sm">
              Sustainable fashion at affordable prices. 
              Discover unique pre-loved treasures that tell a story.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="touch-target flex items-center justify-center hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="touch-target flex items-center justify-center hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="touch-target flex items-center justify-center hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="mailto:hello@tiffahthrift.com" aria-label="Email" className="touch-target flex items-center justify-center hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/shop" className="text-sm hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/category/clothing" className="text-sm hover:text-primary transition-colors">
                  Clothing
                </Link>
              </li>
              <li>
                <Link to="/category/accessories" className="text-sm hover:text-primary transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/category/home" className="text-sm hover:text-primary transition-colors">
                  Home Goods
                </Link>
              </li>
              <li>
                <Link to="/category/vintage" className="text-sm hover:text-primary transition-colors">
                  Vintage Collection
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="text-sm hover:text-primary transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Information</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm hover:text-primary transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-sm mb-4">
              Subscribe to our newsletter for exclusive deals and updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="h-10 min-w-0 flex-grow"
              />
              <Button variant="default" className="h-10 bg-primary hover:bg-primary/90 whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-xs">
          <p className="flex items-center justify-center gap-1">
            <span 
              ref={copyrightRef}
              onClick={handleCopyrightClick}
              className="inline-flex items-center select-none cursor-default transition-all duration-300" 
            >
              <Copyright className="h-3 w-3 mr-1" />
              {new Date().getFullYear()} TiffahThrift. All rights reserved.
            </span>
          </p>
        </div>
      </div>
      
      {/* Admin access modal */}
      <AdminAccessModal 
        open={showAdminModal} 
        onClose={() => setShowAdminModal(false)} 
      />
    </footer>
  );
};

export default Footer;
