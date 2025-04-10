
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import { ProductType } from "@/types/product";

// Mock data for new arrivals
const newArrivals: ProductType[] = [
  {
    id: "1",
    title: "Vintage Denim Jacket",
    name: "Vintage Denim Jacket",
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
    name: "Floral Summer Dress",
    price: 28.50,
    category: "Clothing",
    condition: "Like New",
    size: "S",
    imageUrl: "https://images.unsplash.com/photo-1542295669297-4d352b042bca?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Leather Crossbody Bag",
    name: "Leather Crossbody Bag",
    price: 34.99,
    originalPrice: 50.00,
    category: "Accessories",
    condition: "Excellent",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "4",
    title: "Knit Wool Sweater",
    name: "Knit Wool Sweater",
    price: 32.00,
    category: "Clothing",
    condition: "Good",
    size: "L",
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "5",
    title: "Vintage Polaroid Camera",
    name: "Vintage Polaroid Camera",
    price: 65.00,
    category: "Home",
    condition: "Fair",
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "6",
    title: "Classic Trench Coat",
    name: "Classic Trench Coat",
    price: 75.99,
    originalPrice: 120.00,
    category: "Clothing",
    condition: "Like New",
    size: "M",
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop"
  }
];

const NewArrivals = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">New Arrivals</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our latest curated collection of unique pre-loved treasures. 
              New items are added daily, so check back often!
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewArrivals;
