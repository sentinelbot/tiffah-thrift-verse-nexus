
import { Link } from "react-router-dom";
import { 
  Github, 
  Twitter, 
  Instagram, 
  Facebook,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useI18n } from "@/contexts/I18nContext";

const Footer = () => {
  const { t } = useI18n();
  
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Tiffah Thrift Store</h3>
            <p className="text-muted-foreground mb-4">
              {t('footer.company_description')}
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github size={20} />
                <span className="sr-only">Github</span>
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.quick_links')}</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('common.header.home')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/shop" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('common.header.shop')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/cart" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('common.header.cart')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/account" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('common.header.account')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.customer_service')}</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('common.footer.about')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('common.footer.contact')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('common.footer.terms')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('common.footer.privacy')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipping" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('common.footer.shipping')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/returns" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('common.footer.returns')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact info */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.contact_us')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">
                  123 Ngong Road, Nairobi, Kenya
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">+254 712 345 678</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">info@tiffahthrift.co.ke</span>
              </li>
              <li className="pt-2">
                <LanguageSelector />
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            &copy; 2025 Tiffah Thrift Store. {t('footer.all_rights')}
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/2560px-M-PESA_LOGO-01.svg.png" 
              alt="M-Pesa" 
              className="h-6 object-contain"
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" 
              alt="Visa" 
              className="h-6 object-contain"
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1920px-Mastercard_2019_logo.svg.png" 
              alt="Mastercard" 
              className="h-6 object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
