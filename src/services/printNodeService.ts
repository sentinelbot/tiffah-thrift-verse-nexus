import { Order } from '@/types/order';
import { Product } from '@/types';
import { toast } from 'sonner';
import { generateReceiptHTML } from './receiptService';
import { formatPrice } from '@/utils/formatters';

// Mock PrintNode API Key (in a real app, this would be in environment variables)
const PRINTNODE_API_KEY = 'demo_printnode_api_key';

// Mock printer IDs for different roles (in a real app, these would be in environment variables)
const PRINTERS = {
  admin: 'printer-001',
  productManager: 'printer-002',
  orderPreparer: 'printer-003',
  deliveryStaff: 'printer-004'
};

// Get printer ID based on user role
export const getPrinterIdForRole = (role: string): string => {
  return PRINTERS[role as keyof typeof PRINTERS] || PRINTERS.admin;
};

// Check printer status (simulate API call)
export const checkPrinterStatus = async (printerId: string): Promise<boolean> => {
  console.log(`Checking status of printer ${printerId}`);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate 80% chance of printer being online
  return Math.random() < 0.8;
};

// Print order receipt
export const printOrderReceipt = async (
  order: Order,
  printerId: string,
  userId: string
): Promise<boolean> => {
  try {
    console.log(`Printing receipt for order ${order.orderNumber} to printer ${printerId}`);
    
    // Generate receipt HTML
    const receiptHTML = generateReceiptHTML(order);
    
    // In a real app, this would send a request to PrintNode API
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Log the print job
    console.log({
      type: 'receipt',
      orderId: order.id,
      printerId,
      userId,
      timestamp: new Date().toISOString()
    });
    
    // Simulate 90% success rate
    const success = Math.random() < 0.9;
    
    if (!success) {
      throw new Error('Print job failed');
    }
    
    return true;
  } catch (error) {
    console.error('Error printing receipt:', error);
    toast.error('Printing failed. Generating PDF as fallback.');
    
    // Generate PDF as fallback
    try {
      const filename = `receipt-${order.orderNumber}.pdf`;
      const blob = new Blob([generateReceiptHTML(order)], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      
      URL.revokeObjectURL(url);
    } catch (pdfError) {
      console.error('Error generating PDF fallback:', pdfError);
    }
    
    return false;
  }
};

// Generate shipping label HTML
export const generateShippingLabelHTML = (order: Order): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Shipping Label: ${order.orderNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 12pt;
          width: 4in;
          height: 6in;
          margin: 0;
          padding: 0.25in;
          box-sizing: border-box;
          border: 1px dashed #ccc;
        }
        .header {
          text-align: center;
          margin-bottom: 0.25in;
          border-bottom: 1px solid #000;
          padding-bottom: 0.1in;
        }
        .logo {
          max-width: 1.5in;
          margin-bottom: 0.1in;
        }
        .barcode {
          text-align: center;
          margin: 0.2in 0;
        }
        .barcode img {
          max-width: 2.5in;
          height: auto;
        }
        .address {
          margin-top: 0.2in;
          border: 1px solid #000;
          padding: 0.15in;
        }
        .order-info {
          margin-top: 0.2in;
          font-size: 10pt;
        }
        .footer {
          margin-top: 0.2in;
          font-size: 8pt;
          text-align: center;
          position: absolute;
          bottom: 0.25in;
          width: 3.5in;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img class="logo" src="https://thrift.lovable.dev/logo.png" alt="Tiffah Thrift Store">
        <h2 style="margin: 0.05in 0;">Tiffah Thrift Store</h2>
        <p style="margin: 0;">123 Thrift Avenue, Nairobi, Kenya</p>
      </div>
      
      <div class="barcode">
        <!-- In a real app, generate an actual barcode image using a library -->
        <div style="font-family: monospace; font-size: 14pt;">*${order.orderNumber}*</div>
        <div style="font-size: 10pt; margin-top: 0.05in;">${order.orderNumber}</div>
      </div>
      
      <div class="ship-to">
        <strong>SHIP TO:</strong>
      </div>
      
      <div class="address">
        <strong>${order.shippingInfo.fullName}</strong><br>
        ${order.shippingInfo.address}<br>
        ${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.postalCode}<br>
        ${order.shippingInfo.country}<br>
        <br>
        Phone: ${order.shippingInfo.phone}
      </div>
      
      <div class="order-info">
        <div><strong>Order:</strong> ${order.orderNumber}</div>
        <div><strong>Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</div>
        <div><strong>Shipping:</strong> ${order.shippingInfo.shippingMethod === 'express' ? 'EXPRESS' : 'STANDARD'}</div>
        <div><strong>Items:</strong> ${order.items.reduce((sum, item) => sum + item.quantity, 0)}</div>
      </div>
      
      <div class="footer">
        This label was generated by Tiffah Thrift Store<br>
        For questions, call: +254 700 000000
      </div>
    </body>
    </html>
  `;
};

// Print shipping label
export const printShippingLabel = async (
  order: Order,
  printerId: string,
  userId: string
): Promise<boolean> => {
  try {
    console.log(`Printing shipping label for order ${order.orderNumber} to printer ${printerId}`);
    
    // Generate shipping label HTML
    const labelHTML = generateShippingLabelHTML(order);
    
    // In a real app, this would send a request to PrintNode API
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Log the print job
    console.log({
      type: 'shippingLabel',
      orderId: order.id,
      printerId,
      userId,
      timestamp: new Date().toISOString()
    });
    
    // Simulate 90% success rate
    const success = Math.random() < 0.9;
    
    if (!success) {
      throw new Error('Print job failed');
    }
    
    return true;
  } catch (error) {
    console.error('Error printing shipping label:', error);
    toast.error('Printing failed. Generating PDF as fallback.');
    
    // Generate PDF as fallback
    try {
      const filename = `shipping-label-${order.orderNumber}.pdf`;
      const blob = new Blob([generateShippingLabelHTML(order)], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      
      URL.revokeObjectURL(url);
    } catch (pdfError) {
      console.error('Error generating PDF fallback:', pdfError);
    }
    
    return false;
  }
};

// Generate product label HTML
export const generateProductLabelHTML = (product: Product): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Product Label: ${product.barcode}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 10pt;
          width: 2.25in;
          height: 1.25in;
          margin: 0;
          padding: 0.1in;
          box-sizing: border-box;
          border: 1px dashed #ccc;
        }
        .header {
          text-align: center;
          margin-bottom: 0.05in;
        }
        .logo {
          max-height: 0.3in;
          margin-bottom: 0.05in;
        }
        .product-name {
          font-weight: bold;
          font-size: 9pt;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0.05in 0;
        }
        .product-details {
          font-size: 8pt;
          margin: 0.05in 0;
        }
        .price {
          font-size: 12pt;
          font-weight: bold;
          margin: 0.05in 0;
        }
        .barcode {
          text-align: center;
          margin: 0.05in 0;
        }
        .barcode-text {
          font-family: monospace;
          font-size: 8pt;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img class="logo" src="https://thrift.lovable.dev/logo-small.png" alt="Tiffah">
      </div>
      
      <div class="product-name">${product.name}</div>
      
      <div class="product-details">
        ${product.category} | ${product.size || 'N/A'} | ${product.condition}
      </div>
      
      <div class="price">${formatPrice(product.price)}</div>
      
      <div class="barcode">
        <!-- In a real app, generate an actual barcode image using a library like jsbarcode -->
        <div style="font-family: monospace; letter-spacing: -1px;">*${product.barcode}*</div>
        <div class="barcode-text">${product.barcode}</div>
      </div>
    </body>
    </html>
  `;
};

// Print product label
export const printProductLabel = async (
  product: Product,
  printerId: string,
  userId: string
): Promise<boolean> => {
  try {
    console.log(`Printing product label for ${product.barcode} to printer ${printerId}`);
    
    // Generate product label HTML
    const labelHTML = generateProductLabelHTML(product);
    
    // In a real app, this would send a request to PrintNode API
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Log the print job
    console.log({
      type: 'productLabel',
      productId: product.id,
      printerId,
      userId,
      timestamp: new Date().toISOString()
    });
    
    // Simulate 95% success rate
    const success = Math.random() < 0.95;
    
    if (!success) {
      throw new Error('Print job failed');
    }
    
    return true;
  } catch (error) {
    console.error('Error printing product label:', error);
    toast.error('Printing failed. Generating PDF as fallback.');
    
    // Generate PDF as fallback
    try {
      const filename = `product-label-${product.barcode}.pdf`;
      const blob = new Blob([generateProductLabelHTML(product)], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      
      URL.revokeObjectURL(url);
    } catch (pdfError) {
      console.error('Error generating PDF fallback:', pdfError);
    }
    
    return false;
  }
};

// Download shipping label as PDF
export const downloadShippingLabel = (order: Order): void => {
  const filename = `shipping-label-${order.orderNumber}.pdf`;
  
  // In a real app, you would use a PDF generation library
  const labelHTML = generateShippingLabelHTML(order);
  const blob = new Blob([labelHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create a link and trigger download
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  
  // Clean up
  URL.revokeObjectURL(url);
};

// Download product label as PDF
export const downloadProductLabel = (product: Product): void => {
  const filename = `product-label-${product.barcode}.pdf`;
  
  // In a real app, you would use a PDF generation library
  const labelHTML = generateProductLabelHTML(product);
  const blob = new Blob([labelHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create a link and trigger download
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  
  // Clean up
  URL.revokeObjectURL(url);
};

// Fetch print job history (mock implementation)
export interface PrintJob {
  id: string;
  type: 'receipt' | 'shippingLabel' | 'productLabel';
  status: 'completed' | 'failed' | 'processing';
  createdAt: Date;
  printerId: string;
  userId: string;
  relatedId: string; // Either orderId or productId
  errorMessage?: string;
}

export const getPrintJobHistory = async (): Promise<PrintJob[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate mock print jobs
  const jobs: PrintJob[] = [];
  
  for (let i = 0; i < 10; i++) {
    const isOdd = i % 2 === 1;
    const type = ['receipt', 'shippingLabel', 'productLabel'][i % 3] as 'receipt' | 'shippingLabel' | 'productLabel';
    
    jobs.push({
      id: `job-${1000 + i}`,
      type,
      status: isOdd ? (Math.random() < 0.8 ? 'completed' : 'failed') : 'processing',
      createdAt: new Date(Date.now() - i * 3600000), // i hours ago
      printerId: PRINTERS[['admin', 'productManager', 'orderPreparer', 'deliveryStaff'][i % 4] as keyof typeof PRINTERS],
      userId: `user-${100 + (i % 4)}`,
      relatedId: type === 'productLabel' ? `prod-${200 + i}` : `order-${300 + i}`,
      errorMessage: isOdd && Math.random() < 0.2 ? 'Connection failed' : undefined
    });
  }
  
  return jobs;
};
