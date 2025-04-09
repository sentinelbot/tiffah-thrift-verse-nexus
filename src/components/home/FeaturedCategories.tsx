
import { Link } from "react-router-dom";

const categories = [
  {
    id: "clothing",
    title: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=600&auto=format&fit=crop",
    description: "Sustainable fashion for every style"
  },
  {
    id: "accessories",
    title: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?q=80&w=600&auto=format&fit=crop",
    description: "Unique pieces to complete your look"
  },
  {
    id: "home",
    title: "Home Goods",
    imageUrl: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?q=80&w=600&auto=format&fit=crop",
    description: "Pre-loved treasures for your space"
  },
  {
    id: "vintage",
    title: "Vintage",
    imageUrl: "https://images.unsplash.com/photo-1602810320073-1230c46d89d4?q=80&w=600&auto=format&fit=crop",
    description: "Timeless classics from decades past"
  }
];

const FeaturedCategories = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Shop By Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              to={`/category/${category.id}`} 
              key={category.id}
              className="group relative overflow-hidden rounded-lg hover-scale"
            >
              <div className="aspect-square overflow-hidden rounded-lg">
                <img 
                  src={category.imageUrl} 
                  alt={category.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                <h3 className="text-xl font-semibold mb-1">{category.title}</h3>
                <p className="text-sm opacity-90">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
