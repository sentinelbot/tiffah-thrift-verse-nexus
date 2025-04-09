
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: "1",
    text: "I've found some of my favorite clothing pieces through TiffahThrift. The quality is always better than expected and the prices are unbeatable!",
    author: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?img=1",
    initials: "SJ",
    rating: 5
  },
  {
    id: "2",
    text: "As someone who cares about sustainable fashion, I love that I can find unique pieces while reducing waste. The shipping is always fast too!",
    author: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?img=2",
    initials: "MC",
    rating: 5
  },
  {
    id: "3",
    text: "The vintage section is a treasure trove. I've found items that I couldn't find anywhere else, and they always arrive in the condition described.",
    author: "Aisha Patel",
    avatar: "https://i.pravatar.cc/150?img=3",
    initials: "AP",
    rating: 4
  },
  {
    id: "4",
    text: "TiffahThrift has completely changed how I shop for clothes. Their commitment to sustainability aligns perfectly with my values.",
    author: "David Williams",
    avatar: "https://i.pravatar.cc/150?img=4",
    initials: "DW",
    rating: 5
  }
];

const Testimonials = () => {
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = isMobile ? 1 : 2;
  const maxIndex = Math.max(0, testimonials.length - itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <section className="py-12 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">What Our Customers Say</h2>
        </div>
        
        <div className="flex justify-center mb-6">
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
        
        <div className="relative">
          <div 
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100 / itemsPerPage}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className={cn(
                  "flex-none transition-opacity duration-300 px-4",
                  isMobile ? "w-full" : "w-1/2"
                )}
              >
                <div className="bg-card rounded-lg p-6 h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={cn(
                          "h-4 w-4",
                          i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                        )} 
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground flex-grow italic mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center mt-auto">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                      <AvatarFallback>{testimonial.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{testimonial.author}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
