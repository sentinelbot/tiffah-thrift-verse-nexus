
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-muted mt-16 pt-12 pb-6 text-muted-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-thrift-700">
              Tiffah<span className="text-sage-500">Thrift</span>
            </h2>
            <p className="text-sm">
              Sustainable fashion at affordable prices. 
              Discover unique pre-loved treasures that tell a story.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5 hover:text-primary transition-colors" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-5 w-5 hover:text-primary transition-colors" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5 hover:text-primary transition-colors" />
              </a>
              <a href="mailto:hello@tiffahthrift.com" aria-label="Email">
                <Mail className="h-5 w-5 hover:text-primary transition-colors" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
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
                <Link to="/category/new-arrivals" className="text-sm hover:text-primary transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Information</h3>
            <ul className="space-y-2">
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
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Your email"
                className="h-10"
              />
              <Button variant="default" size="sm" className="h-10">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-xs">
          <p>© {new Date().getFullYear()} TiffahThrift. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
