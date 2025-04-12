
import PageLayout from "@/components/layout/PageLayout";

const ShippingReturns = () => {
  return (
    <PageLayout 
      title="Shipping & Returns" 
      description="Information about our shipping methods, delivery times, and return policy"
    >
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
        <p>
          At Tiffah Thrift Store, we aim to provide reliable and efficient shipping services to ensure your 
          pre-loved treasures reach you as quickly as possible.
        </p>
        
        <h3 className="text-xl font-medium mt-4 mb-2">Shipping Zones & Rates</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Nairobi:</strong> Same-day delivery available for orders placed before 12 PM. 
            KES 200 flat rate.
          </li>
          <li>
            <strong>Central Kenya:</strong> 2-day delivery service. 
            KES 350 flat rate.
          </li>
          <li>
            <strong>Rest of Kenya:</strong> 3-5 day delivery service. 
            KES 500 flat rate.
          </li>
          <li>
            <strong>Free Shipping:</strong> Orders above KES 5,000 qualify for free shipping within Kenya.
          </li>
        </ul>
        
        <h3 className="text-xl font-medium mt-4 mb-2">Order Processing Times</h3>
        <p>
          All orders are processed within 1-2 business days. Orders placed on weekends or public holidays 
          will be processed on the next business day.
        </p>
        
        <h3 className="text-xl font-medium mt-4 mb-2">Delivery Methods</h3>
        <p>
          We currently offer two delivery methods:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>
            <strong>Home Delivery:</strong> Direct delivery to your specified address by our delivery team.
          </li>
          <li>
            <strong>Pick-Up:</strong> Collection from our physical store location at no additional cost.
          </li>
        </ul>
        
        <h3 className="text-xl font-medium mt-4 mb-2">Tracking Your Order</h3>
        <p>
          Once your order is shipped, you will receive a confirmation email with tracking information. 
          You can also track your order through your account dashboard.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Return Policy</h2>
        <p>
          Due to the nature of second-hand items, we have a specific return policy to ensure fairness for all parties involved.
        </p>
        
        <h3 className="text-xl font-medium mt-4 mb-2">Return Eligibility</h3>
        <p>
          Returns are accepted only under the following circumstances:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>
            <strong>Significant Misrepresentation:</strong> If the item's condition was significantly misrepresented in the listing.
          </li>
          <li>
            <strong>Damaged During Shipping:</strong> If the item was damaged during the shipping process.
          </li>
          <li>
            <strong>Incorrect Item:</strong> If you received an item different from what you ordered.
          </li>
        </ul>
        <p className="mt-2 italic">
          Please note: We provide detailed measurements and multiple photos of all items. 
          Returns based on fit or personal preference are not accepted.
        </p>
        
        <h3 className="text-xl font-medium mt-4 mb-2">Return Process</h3>
        <ol className="list-decimal pl-6 mt-2 space-y-2">
          <li>
            Contact our customer service within 48 hours of receiving your order to initiate a return request.
          </li>
          <li>
            Provide clear photos showing the issue with the item.
          </li>
          <li>
            If approved, you will receive return instructions via email.
          </li>
          <li>
            Return the item in its original packaging within 7 days of approval.
          </li>
          <li>
            Once we receive and inspect the returned item, we will process your refund or exchange.
          </li>
        </ol>
        
        <h3 className="text-xl font-medium mt-4 mb-2">Refunds</h3>
        <p>
          Refunds will be issued to the original payment method used for the purchase. 
          Processing time for refunds may take 5-7 business days depending on your payment provider.
        </p>
        
        <h3 className="text-xl font-medium mt-4 mb-2">Return Shipping</h3>
        <p>
          If the return is due to our error (wrong item shipped, misrepresented condition), we will cover the return shipping costs. 
          In other cases, the customer is responsible for return shipping charges.
        </p>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Contact Our Shipping & Returns Team</h2>
        <p>
          If you have any questions about our shipping process or return policy, please contact us at:
          <br />
          Email: returns@tiffahthrift.com
          <br />
          Phone: +254 712 345 678
          <br />
          WhatsApp: +254 712 345 678
        </p>
      </section>
    </PageLayout>
  );
};

export default ShippingReturns;
