
import { Order } from '@/types/order';
import { formatDate } from '@/utils/dateUtils';

export const generateReceiptHTML = (order: Order): string => {
  // Format total with currency
  const formatCurrency = (amount: number): string => {
    return `KSh ${amount.toFixed(2)}`;
  };

  // Calculate subtotal (before shipping)
  const subtotal = order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Calculate tax (VAT - 16% in Kenya)
  const taxRate = 0.16;
  const taxAmount = subtotal * taxRate;
  
  // Calculate shipping cost
  const shippingCost = order.shippingInfo.shippingMethod === 'express' ? 500 : 200;
  
  // Create the HTML content for the receipt
  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #ec4899; margin-bottom: 5px;">Tiffah Thrift Store</h1>
        <p>Receipt for Order #${order.orderNumber}</p>
        <p style="color: #666;">${formatDate(order.orderDate)}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Customer Information</h2>
        <p><strong>Name:</strong> ${order.shippingInfo.fullName}</p>
        <p><strong>Email:</strong> ${order.shippingInfo.email}</p>
        <p><strong>Phone:</strong> ${order.shippingInfo.phone}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Shipping Address</h2>
        <p>${order.shippingInfo.address}</p>
        <p>${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.postalCode}</p>
        <p>${order.shippingInfo.country}</p>
        <p><strong>Shipping Method:</strong> ${order.shippingInfo.shippingMethod === 'express' ? 'Express Shipping' : 'Standard Shipping'}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Payment Information</h2>
        <p><strong>Payment Method:</strong> ${order.paymentInfo.method.charAt(0).toUpperCase() + order.paymentInfo.method.slice(1)}</p>
        <p><strong>Payment Status:</strong> ${order.paymentInfo.status.charAt(0).toUpperCase() + order.paymentInfo.status.slice(1)}</p>
        ${order.paymentInfo.transactionId ? `<p><strong>Transaction ID:</strong> ${order.paymentInfo.transactionId}</p>` : ''}
      </div>
      
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Order Items</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #eee;">Item</th>
              <th style="text-align: right; padding: 8px; border-bottom: 1px solid #eee;">Qty</th>
              <th style="text-align: right; padding: 8px; border-bottom: 1px solid #eee;">Price</th>
              <th style="text-align: right; padding: 8px; border-bottom: 1px solid #eee;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td style="text-align: left; padding: 8px; border-bottom: 1px solid #eee;">${item.product.name}</td>
                <td style="text-align: right; padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}</td>
                <td style="text-align: right; padding: 8px; border-bottom: 1px solid #eee;">${formatCurrency(item.price)}</td>
                <td style="text-align: right; padding: 8px; border-bottom: 1px solid #eee;">${formatCurrency(item.price * item.quantity)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div style="margin-left: auto; width: 250px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>Subtotal:</span>
          <span>${formatCurrency(subtotal)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>VAT (16%):</span>
          <span>${formatCurrency(taxAmount)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>Shipping:</span>
          <span>${formatCurrency(shippingCost)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: bold; margin-top: 10px; padding-top: 5px; border-top: 1px solid #eee;">
          <span>Total:</span>
          <span>${formatCurrency(order.totalAmount)}</span>
        </div>
      </div>
      
      <div style="margin-top: 40px; text-align: center; color: #666; font-size: 14px;">
        <p>Thank you for shopping at Tiffah Thrift Store!</p>
        <p>For any questions regarding your order, please contact us at support@tiffahthrift.com</p>
        <p>© ${new Date().getFullYear()} Tiffah Thrift Store. All rights reserved.</p>
      </div>
    </div>
  `;
};

export const downloadReceipt = (order: Order): void => {
  const html = generateReceiptHTML(order);
  
  // Create a Blob with the HTML content
  const blob = new Blob([html], { type: 'text/html' });
  
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  
  // Create a link element
  const link = document.createElement('a');
  link.href = url;
  link.download = `receipt-${order.orderNumber}.html`;
  
  // Append the link to the body
  document.body.appendChild(link);
  
  // Click the link to trigger the download
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const printReceipt = (order: Order): void => {
  const html = generateReceiptHTML(order);
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    // Write the HTML content to the new window
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Wait for resources to load and then print
    printWindow.onload = function() {
      printWindow.print();
      // Close the window after printing (optional)
      // printWindow.close();
    };
  } else {
    console.error('Failed to open print window');
  }
};
