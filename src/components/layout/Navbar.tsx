
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useI18n } from "@/contexts/I18nContext";
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  Search,
  X
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const { cartItems } = useCart(); // Use the cart context
  const { user } = useAuth();
  const { t } = useI18n();
  
  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
              <div className="flex flex-col gap-6 py-4">
                <SheetClose asChild>
                  <Link to="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold text-primary">Tiffah</span>
                  </Link>
                </SheetClose>
                <div className="space-y-3">
                  <SheetClose asChild>
                    <Link 
                      to="/" 
                      className="block py-2 px-3 rounded-md hover:bg-muted"
                    >
                      {t('common.header.home')}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      to="/shop" 
                      className="block py-2 px-3 rounded-md hover:bg-muted"
                    >
                      {t('common.header.shop')}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      to="/cart" 
                      className="block py-2 px-3 rounded-md hover:bg-muted"
                    >
                      {t('common.header.cart')}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      to="/wishlist" 
                      className="block py-2 px-3 rounded-md hover:bg-muted"
                    >
                      {t('common.header.wishlist')}
                    </Link>
                  </SheetClose>
                  {user ? (
                    <SheetClose asChild>
                      <Link 
                        to="/account" 
                        className="block py-2 px-3 rounded-md hover:bg-muted"
                      >
                        {t('common.header.account')}
                      </Link>
                    </SheetClose>
                  ) : (
                    <SheetClose asChild>
                      <Link 
                        to="/auth" 
                        className="block py-2 px-3 rounded-md hover:bg-muted"
                      >
                        {t('common.header.login')}
                      </Link>
                    </SheetClose>
                  )}
                </div>
                <div className="mt-auto pt-4 border-t">
                  <LanguageSelector />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">Tiffah</span>
          </Link>
          
          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {t('common.header.home')}
            </Link>
            <Link 
              to="/shop" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {t('common.header.shop')}
            </Link>
          </nav>
          
          {/* Search bar (conditionally shown on mobile) */}
          <div className={cn(
            "absolute inset-x-0 top-0 bg-background h-16 px-4 flex items-center transition-transform duration-300 lg:static lg:inset-auto lg:h-auto lg:px-0 lg:w-full lg:max-w-sm lg:mx-4 lg:translate-y-0 lg:opacity-100",
            showSearchBar 
              ? "translate-y-0 opacity-100" 
              : "-translate-y-full opacity-0 lg:translate-y-0 lg:opacity-100"
          )}>
            <Input 
              placeholder={t('common.header.search')}
              className="flex-1"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setShowSearchBar(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Right-side items */}
          <div className="flex items-center space-x-4">
            {/* Search button (mobile only) */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setShowSearchBar(true)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">{t('common.header.search')}</span>
            </Button>
            
            {/* Language selector (desktop only) */}
            <div className="hidden lg:block">
              <LanguageSelector />
            </div>
            
            {/* User account */}
            <Link to={user ? "/account" : "/auth"}>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">
                  {user ? t('common.header.account') : t('common.header.login')}
                </span>
              </Button>
            </Link>
            
            {/* Wishlist */}
            <Link to="/wishlist">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
                <span className="sr-only">{t('common.header.wishlist')}</span>
              </Button>
            </Link>
            
            {/* Cart with item count */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
                <span className="sr-only">{t('common.header.cart')}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
