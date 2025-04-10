import { Order } from '@/types';
import { formatPrice } from '@/utils/formatters';

/**
 * Generate HTML for order receipt
 * @param order Order data
 * @returns HTML string for the receipt
 */
export const generateReceiptHTML = (order: Order): string => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 4px 8px;">${item.quantity}x ${item.product.name}</td>
      <td style="padding: 4px 8px; text-align: right;">${formatPrice(item.price)}</td>
      <td style="padding: 4px 8px; text-align: right;">${formatPrice(item.price * item.quantity)}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 24px;">Tiffah Thrift Store</h1>
        <p style="margin: 5px 0;">123 Thrift Avenue, Nairobi</p>
        <p style="margin: 5px 0;">Tel: +254 700 000000</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 18px; margin-bottom: 5px;">Receipt</h2>
        <p style="margin: 2px 0;"><strong>Order #:</strong> ${order.orderNumber}</p>
        <p style="margin: 2px 0;"><strong>Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
        <p style="margin: 2px 0;"><strong>Customer:</strong> ${order.customer.name}</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="border-bottom: 1px solid #ddd;">
            <th style="text-align: left; padding: 8px;">Item</th>
            <th style="text-align: right; padding: 8px;">Price</th>
            <th style="text-align: right; padding: 8px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot style="border-top: 1px solid #ddd;">
          <tr>
            <td colspan="2" style="text-align: right; padding: 8px;"><strong>Subtotal:</strong></td>
            <td style="text-align: right; padding: 8px;">${formatPrice(order.totalAmount)}</td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: right; padding: 8px;"><strong>Total:</strong></td>
            <td style="text-align: right; padding: 8px; font-weight: bold;">${formatPrice(order.totalAmount)}</td>
          </tr>
        </tfoot>
      </table>
      
      <div style="margin-bottom: 20px;">
        <p style="margin: 2px 0;"><strong>Payment Method:</strong> ${order.paymentInfo.method}</p>
        <p style="margin: 2px 0;"><strong>Payment Status:</strong> ${order.paymentInfo.status}</p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; font-size: 14px;">
        <p>Thank you for shopping with us!</p>
        <p>Returns accepted within 7 days with receipt.</p>
      </div>
    </div>
  `;
};

/**
 * Generate and download receipt as PDF
 * @param order Order data
 */
export const downloadReceipt = (order: Order): void => {
  const html = generateReceiptHTML(order);
  
  // Create a Blob with the HTML content
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create a link and click it to download
  const a = document.createElement('a');
  a.href = url;
  a.download = `receipt-${order.orderNumber}.html`;
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
};

/**
 * Print receipt directly to browser's print dialog
 * @param order Order data
 */
export const printReceipt = (order: Order): void => {
  const html = generateReceiptHTML(order);
  
  // Create a new window with the receipt HTML
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    
    // Print the window after a short delay to ensure content is loaded
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  } else {
    console.error('Unable to open print window. Please check if pop-ups are blocked.');
    alert('Unable to open print window. Please check if pop-ups are blocked.');
  }
};
