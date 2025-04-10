
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OrderTrackingForm from "@/components/orders/OrderTrackingForm";

const TrackOrderPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
            Track Your Order
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Enter your order number below to check the current status of your order.
          </p>
          
          <OrderTrackingForm />
          
          <div className="mt-12 space-y-6">
            <div>
              <h2 className="font-medium text-lg mb-2">Why isn't my order showing up?</h2>
              <p className="text-muted-foreground">
                Orders may take up to 1 hour to appear in our system after placing them. If you've just placed an order, please check back soon.
              </p>
            </div>
            
            <div>
              <h2 className="font-medium text-lg mb-2">Lost your order number?</h2>
              <p className="text-muted-foreground">
                Your order number was sent to the email address you provided during checkout. You can also find it in your account if you were logged in when placing the order.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrackOrderPage;
