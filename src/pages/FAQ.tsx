
import PageLayout from "@/components/layout/PageLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <PageLayout 
      title="Frequently Asked Questions" 
      description="Find answers to commonly asked questions about Tiffah Thrift Store"
    >
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Shopping at Tiffah Thrift</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I know what condition the items are in?</AccordionTrigger>
            <AccordionContent>
              <p>
                We carefully inspect and grade each item based on a standardized condition scale:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>New:</strong> Unworn with original tags attached</li>
                <li><strong>Like New:</strong> Appears unworn with no visible flaws</li>
                <li><strong>Good:</strong> Gently used with minor signs of wear</li>
                <li><strong>Fair:</strong> Noticeable signs of wear but still functional and wearable</li>
              </ul>
              <p className="mt-2">
                Each product listing includes detailed condition notes and multiple photos from different angles to give you a clear understanding of the item's current state.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>How accurate are the sizes listed on your website?</AccordionTrigger>
            <AccordionContent>
              <p>
                We provide detailed measurements for all items rather than relying solely on the size tags, as sizing can vary significantly between brands and over time. Each listing includes specific measurements such as chest/bust, waist, hips, and length as applicable.
              </p>
              <p className="mt-2">
                We recommend comparing these measurements to items you already own that fit you well to ensure the best fit. Our size guide page also provides conversion charts between different sizing systems.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>Do you accept returns if an item doesn't fit?</AccordionTrigger>
            <AccordionContent>
              <p>
                Due to the unique nature of second-hand items, we do not accept returns based on fit or personal preference. This is why we provide detailed measurements for each item.
              </p>
              <p className="mt-2">
                Returns are only accepted if the item was significantly misrepresented, damaged during shipping, or if you received the wrong item. Please refer to our Returns Policy for more information.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger>How often do you add new items?</AccordionTrigger>
            <AccordionContent>
              <p>
                We add new items to our inventory daily! The best way to stay updated on new arrivals is to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Subscribe to our newsletter</li>
                <li>Follow us on social media</li>
                <li>Check the "New Arrivals" section on our website</li>
                <li>Enable notifications in your account settings</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Orders & Payment</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="payment-1">
            <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
            <AccordionContent>
              <p>We currently accept the following payment methods:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>M-Pesa:</strong> Our primary payment method for customers in Kenya</li>
                <li><strong>Credit/Debit Cards:</strong> Visa, Mastercard, and American Express</li>
                <li><strong>PayPal:</strong> Available for international customers</li>
                <li><strong>Cash on Delivery:</strong> For selected areas in Nairobi</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="payment-2">
            <AccordionTrigger>How long will it take to receive my order?</AccordionTrigger>
            <AccordionContent>
              <p>Delivery times depend on your location:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Nairobi:</strong> Same-day delivery for orders placed before 12 PM, or next-day delivery for later orders</li>
                <li><strong>Central Kenya:</strong> 2-3 business days</li>
                <li><strong>Rest of Kenya:</strong> 3-5 business days</li>
              </ul>
              <p className="mt-2">
                You can track your order status in real-time through your account dashboard or via the tracking link sent in your shipping confirmation email.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="payment-3">
            <AccordionTrigger>Can I change or cancel my order?</AccordionTrigger>
            <AccordionContent>
              <p>
                Orders can be modified or canceled within 1 hour of placement, provided they haven't entered the processing stage yet. To change or cancel an order:
              </p>
              <ol className="list-decimal pl-6 mt-2 space-y-2">
                <li>Log into your account</li>
                <li>Navigate to "Order History"</li>
                <li>Select the relevant order</li>
                <li>Click on "Change Order" or "Cancel Order"</li>
              </ol>
              <p className="mt-2">
                If your order has already entered processing, please contact our customer service team immediately at orders@tiffahthrift.com or via WhatsApp at +254 712 345 678.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="payment-4">
            <AccordionTrigger>Do you ship internationally?</AccordionTrigger>
            <AccordionContent>
              <p>
                Currently, we only ship within Kenya. We're working on expanding our shipping options to include other East African countries and international shipping in the near future. Subscribe to our newsletter to be notified when international shipping becomes available.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Account & Technical Support</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="tech-1">
            <AccordionTrigger>How do I reset my password?</AccordionTrigger>
            <AccordionContent>
              <p>To reset your password:</p>
              <ol className="list-decimal pl-6 mt-2 space-y-2">
                <li>Click on "Sign In" at the top of the page</li>
                <li>Select "Forgot Password?"</li>
                <li>Enter the email address associated with your account</li>
                <li>Check your email for a password reset link</li>
                <li>Click the link and follow the instructions to create a new password</li>
              </ol>
              <p className="mt-2">
                If you don't receive the reset email within a few minutes, please check your spam folder or contact our support team for assistance.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="tech-2">
            <AccordionTrigger>Can I use the website without creating an account?</AccordionTrigger>
            <AccordionContent>
              <p>
                Yes, you can browse our website, view products, and add items to your cart without creating an account. However, to complete a purchase, you will need to either:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Sign in to your existing account</li>
                <li>Create a new account</li>
                <li>Check out as a guest (limited features)</li>
              </ul>
              <p className="mt-2">
                Creating an account provides additional benefits such as order history, saved addresses, wishlists, and personalized recommendations.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="tech-3">
            <AccordionTrigger>The website is not loading or displaying correctly. What should I do?</AccordionTrigger>
            <AccordionContent>
              <p>If you're experiencing technical issues with our website, please try the following steps:</p>
              <ol className="list-decimal pl-6 mt-2 space-y-2">
                <li>Refresh the page</li>
                <li>Clear your browser cache and cookies</li>
                <li>Try using a different browser</li>
                <li>Check your internet connection</li>
                <li>Disable any ad-blockers or browser extensions that might interfere with the site</li>
              </ol>
              <p className="mt-2">
                If the problem persists, please contact our technical support team at support@tiffahthrift.com with details about the issue, including which device and browser you're using.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">About Our Products</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="products-1">
            <AccordionTrigger>How do you source your products?</AccordionTrigger>
            <AccordionContent>
              <p>
                We source our pre-loved items through multiple channels to ensure a diverse and high-quality inventory:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Direct Acquisitions:</strong> We purchase carefully selected second-hand items from individuals</li>
                <li><strong>Consignment Partners:</strong> We work with trusted partners who provide quality second-hand goods</li>
                <li><strong>Ethical Surplus:</strong> We rescue unsold inventory from retailers that would otherwise go to waste</li>
                <li><strong>Vintage Collections:</strong> We source unique vintage pieces from specialized collectors</li>
              </ul>
              <p className="mt-2">
                All items undergo a thorough cleaning and quality inspection process before being listed on our store.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="products-2">
            <AccordionTrigger>Do you clean the items before selling them?</AccordionTrigger>
            <AccordionContent>
              <p>
                Yes, absolutely! All clothing and textile items go through our comprehensive cleaning process before being listed for sale:
              </p>
              <ol className="list-decimal pl-6 mt-2 space-y-2">
                <li>Initial inspection for any stains or damage</li>
                <li>Professional cleaning appropriate to the fabric type</li>
                <li>Steaming or pressing to remove wrinkles</li>
                <li>Final quality check before photography and listing</li>
              </ol>
              <p className="mt-2">
                For non-textile items like accessories and homeware, we use appropriate cleaning methods specific to each material type to ensure everything is clean and ready for its new home.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="products-3">
            <AccordionTrigger>Can I sell or consign my items with you?</AccordionTrigger>
            <AccordionContent>
              <p>
                Yes! We are always looking for quality pre-loved items to add to our inventory. We offer two options:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  <strong>Direct Sale:</strong> We purchase your items outright based on their condition, brand, and current market value.
                </li>
                <li>
                  <strong>Consignment:</strong> We list and sell your items, and you receive a percentage of the sale price when the item sells.
                </li>
              </ul>
              <p className="mt-2">
                To start the process, please email sell@tiffahthrift.com with photos and details of the items you'd like to sell, or visit our physical store during business hours.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Still Have Questions?</h2>
        <p>
          If you couldn't find the answer you were looking for, please don't hesitate to contact us:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>Email: support@tiffahthrift.com</li>
          <li>Phone: +254 712 345 678 (Mon-Fri, 9am-5pm EAT)</li>
          <li>WhatsApp: +254 712 345 678</li>
          <li>Visit our <a href="/contact" className="text-primary hover:underline">Contact Page</a> for more ways to reach us</li>
        </ul>
      </section>
    </PageLayout>
  );
};

export default FAQ;
