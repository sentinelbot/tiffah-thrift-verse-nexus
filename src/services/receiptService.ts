import { Order } from '@/types/order';
import { formatPrice } from '@/utils/formatters';
import { toast } from 'sonner';
import { printOrderReceipt } from './printNodeService';
import { useAuth } from '@/contexts/AuthContext';

const generateOrderTable = (order: Order): string => {
  // Generate item rows
  const itemRows = order.items.map((item) => {
    return `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.product.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.price)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.price * item.quantity)}</td>
      </tr>
    `;
  }).join('');

  // Generate the table
  return `
    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
          <th style="padding: 8px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
          <th style="padding: 8px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
          <th style="padding: 8px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold;">Subtotal:</td>
          <td style="padding: 8px; text-align: right;">${formatPrice(order.totalAmount)}</td>
        </tr>
        <tr>
          <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold;">Shipping:</td>
          <td style="padding: 8px; text-align: right;">${formatPrice(order.shippingInfo.shippingMethod === 'express' ? 500 : 200)}</td>
        </tr>
        <tr>
          <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold; border-top: 2px solid #ddd;">Total:</td>
          <td style="padding: 8px; text-align: right; font-weight: bold; border-top: 2px solid #ddd;">${formatPrice(order.totalAmount + (order.shippingInfo.shippingMethod === 'express' ? 500 : 200))}</td>
        </tr>
      </tfoot>
    </table>
  `;
};

// Generate receipt HTML
export const generateReceiptHTML = (order: Order): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Receipt: ${order.orderNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .receipt-header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        .receipt-header h1 {
          margin: 0;
          color: #ec4899;
        }
        .logo {
          max-width: 150px;
          margin-bottom: 15px;
        }
        .order-info {
          margin-bottom: 20px;
        }
        .order-info p {
          margin: 5px 0;
        }
        .columns {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }
        .column {
          flex: 1;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 0.8em;
          color: #777;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="receipt-header">
        <img class="logo" src="https://thrift.lovable.dev/logo.png" alt="Tiffah Thrift Store">
        <h1>Tiffah Thrift Store</h1>
        <p>123 Thrift Avenue, Nairobi, Kenya</p>
        <p>Tel: +254 700 000000 | Email: info@tiffahthrift.com</p>
      </div>
      
      <div class="order-info">
        <h2>Order Receipt</h2>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
      </div>
      
      <div class="columns">
        <div class="column">
          <h3>Customer Information</h3>
          <p>${order.shippingInfo.fullName}</p>
          <p>${order.shippingInfo.email}</p>
          <p>${order.shippingInfo.phone}</p>
        </div>
        
        <div class="column">
          <h3>Shipping Address</h3>
          <p>${order.shippingInfo.address}</p>
          <p>${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.postalCode}</p>
          <p>${order.shippingInfo.country}</p>
        </div>
      </div>
      
      <h3>Order Details</h3>
      ${generateOrderTable(order)}
      
      <div class="order-info">
        <p><strong>Payment Method:</strong> ${order.paymentInfo.method.charAt(0).toUpperCase() + order.paymentInfo.method.slice(1)}</p>
        <p><strong>Payment Status:</strong> ${order.paymentInfo.status.charAt(0).toUpperCase() + order.paymentInfo.status.slice(1)}</p>
        ${order.paymentInfo.transactionId ? `<p><strong>Transaction ID:</strong> ${order.paymentInfo.transactionId}</p>` : ''}
        <p><strong>Shipping Method:</strong> ${order.shippingInfo.shippingMethod === 'express' ? 'Express (1-3 business days)' : 'Standard (3-7 business days)'}</p>
      </div>
      
      <div class="footer">
        <p>Thank you for shopping with Tiffah Thrift Store!</p>
        <p>For any questions or concerns, please contact our customer service at support@tiffahthrift.com</p>
        <p>© ${new Date().getFullYear()} Tiffah Thrift Store. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

// Print receipt
export const printReceipt = async (order: Order): Promise<boolean> => {
  try {
    // Get the current user - in a real implementation, this would be handled differently
    // since hooks can't be used outside of components
    let userId = "default-user";
    let printerId = "default-printer";
    
    // In a real implementation, we'd get these values from context or params
    // This is a simplified version for demo purposes
    return await printOrderReceipt(order, printerId, userId);
  } catch (error) {
    console.error('Error printing receipt:', error);
    toast.error('Error printing receipt. Downloading as PDF instead.');
    
    // Fallback to downloading receipt
    downloadReceipt(order);
    return false;
  }
};

// Download receipt as PDF
export const downloadReceipt = (order: Order): void => {
  const filename = `receipt-${order.orderNumber}.pdf`;
  
  // In a real app, you would use a PDF generation library like jsPDF
  // For this demo, let's simulate a download by opening a new window with the HTML
  const receiptHTML = generateReceiptHTML(order);
  const blob = new Blob([receiptHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create a link and trigger download
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  
  // Clean up
  URL.revokeObjectURL(url);
};
