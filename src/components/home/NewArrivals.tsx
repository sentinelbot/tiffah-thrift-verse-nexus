
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductCard, { ProductType } from "../products/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const newArrivals: ProductType[] = [
  {
    id: "1",
    title: "Vintage Denim Jacket",
    price: 45.99,
    originalPrice: 65.00,
    category: "Clothing",
    condition: "Good",
    size: "M",
    imageUrl: "https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Floral Summer Dress",
    price: 28.50,
    category: "Clothing",
    condition: "Like New",
    size: "S",
    imageUrl: "https://images.unsplash.com/photo-1542295669297-4d352b042bca?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Leather Crossbody Bag",
    price: 34.99,
    originalPrice: 50.00,
    category: "Accessories",
    condition: "Excellent",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "4",
    title: "Knit Wool Sweater",
    price: 32.00,
    category: "Clothing",
    condition: "Good",
    size: "L",
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "5",
    title: "Vintage Polaroid Camera",
    price: 65.00,
    category: "Home",
    condition: "Fair",
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "6",
    title: "Classic Trench Coat",
    price: 75.99,
    originalPrice: 120.00,
    category: "Clothing",
    condition: "Like New",
    size: "M",
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop"
  }
];

const NewArrivals = () => {
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = isMobile ? 2 : 4;
  const maxIndex = Math.max(0, newArrivals.length - itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">New Arrivals</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={prevSlide}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100 / itemsPerPage}%)` }}
          >
            {newArrivals.map((product) => (
              <div 
                key={product.id} 
                className={cn(
                  "flex-none transition-opacity duration-300",
                  isMobile ? "w-1/2 px-2" : "w-1/4 px-3"
                )}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
