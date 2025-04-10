
import { toast } from 'sonner';
import { Order } from '@/types';
import { formatPrice } from '@/utils/formatters';
import { supabase } from '@/integrations/supabase/client';

// This would typically come from an environment variable or settings
const PRINT_NODE_API_KEY = 'YOUR_PRINT_NODE_API_KEY';

// Printer IDs would be set up in the admin panel
// Here we're using placeholders
const PRINTERS = {
  productManager: 'product-manager-printer-id',
  orderPreparer: 'order-preparer-printer-id',
  deliveryStaff: 'delivery-staff-printer-id',
  admin: 'admin-printer-id',
  default: 'default-printer-id'
};

export interface PrintJob {
  id: string;
  type: 'receipt' | 'label' | 'shipping';
  content: string;
  printerId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  processedAt?: Date;
  error?: string;
  relatedId?: string;
  requestedBy: string;
}

// Get printer ID based on user role
export const getPrinterIdForRole = (role: string): string => {
  switch (role?.toLowerCase()) {
    case 'productmanager':
      return PRINTERS.productManager;
    case 'orderpreparer':
      return PRINTERS.orderPreparer;
    case 'deliverystaff':
      return PRINTERS.deliveryStaff;
    case 'admin':
      return PRINTERS.admin;
    default:
      return PRINTERS.default;
  }
};

// Check if PrintNode is available
const isPrintNodeAvailable = async (): Promise<boolean> => {
  // In a real implementation, this would check if PrintNode API is accessible
  // For demo purposes, we'll just return true
  return true;
};

// Submit a print job to PrintNode
const submitPrintJob = async (printJob: Omit<PrintJob, 'id' | 'status' | 'createdAt'>): Promise<boolean> => {
  // In a real implementation, this would call the PrintNode API
  // For demo purposes, we'll just log and return success
  console.log('Print job submitted:', printJob);
  
  // Store print job in database - simulated for our demo
  try {
    const { data, error } = await supabase
      .from('products') // Using products table as fallback since print_jobs doesn't exist yet
      .insert({
        name: `Print Job: ${printJob.type}`,
        price: 0,
        category: 'print-job',
        condition: 'new',
        barcode: `PRINT-${Date.now()}`,
        status: 'available'
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error storing print job:', error);
    return false;
  }
};

// Print a product label
export const printProductLabel = async (productId: string, userId: string, printerId?: string): Promise<boolean> => {
  try {
    // Get the product details
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
      
    if (error) throw error;
    if (!product) throw new Error('Product not found');
    
    const printerToUse = printerId || getPrinterIdForRole('productManager');
    
    // Check if PrintNode is available
    const isPrintAvailable = await isPrintNodeAvailable();
    if (!isPrintAvailable) {
      toast.error('Printing service not available');
      return false;
    }
    
    // Generate ZPL code for the label
    // This is a simplified example - real implementation would depend on the printer
    const labelContent = `
      ^XA
      ^FO50,50^ADN,36,20^FD${product.name}^FS
      ^FO50,100^ADN,36,20^FDPrice: ${formatPrice(product.price)}^FS
      ^FO50,150^ADN,36,20^FDCategory: ${product.category}^FS
      ^FO50,200^ADN,36,20^FDCondition: ${product.condition}^FS
      ^FO50,300^BY3^BCN,100,Y,N,N^FD${product.barcode}^FS
      ^XZ
    `;
    
    // Submit the print job
    const success = await submitPrintJob({
      type: 'label',
      content: labelContent,
      printerId: printerToUse,
      relatedId: productId,
      requestedBy: userId
    });
    
    if (success) {
      toast.success('Product label sent to printer');
      return true;
    } else {
      throw new Error('Failed to submit print job');
    }
  } catch (error) {
    console.error('Error printing product label:', error);
    toast.error('Failed to print product label');
    return false;
  }
};

// Print an order receipt
export const printOrderReceipt = async (order: Order, printerId?: string, userId?: string): Promise<boolean> => {
  try {
    const printerToUse = printerId || getPrinterIdForRole('orderPreparer');
    const userIdToUse = userId || 'system';
    
    // Check if PrintNode is available
    const isPrintAvailable = await isPrintNodeAvailable();
    if (!isPrintAvailable) {
      toast.error('Printing service not available');
      return false;
    }
    
    // Generate receipt content
    const receiptContent = `
      ORDER RECEIPT
      ==================
      Order: ${order.orderNumber}
      Date: ${new Date(order.orderDate).toLocaleDateString()}
      
      Customer: ${order.customer.name}
      Email: ${order.customer.email}
      
      Items:
      ${order.items.map(item => `${item.quantity}x ${item.product.name} - ${formatPrice(item.price * item.quantity)}`).join('\n')}
      
      Total: ${formatPrice(order.totalAmount)}
      
      Payment Method: ${order.paymentInfo.method}
      Payment Status: ${order.paymentInfo.status}
      
      Shipping Address:
      ${order.shippingInfo.fullName}
      ${order.shippingInfo.address}
      ${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.postalCode}
      ${order.shippingInfo.country}
      
      Thank you for shopping with Tiffah Thrift Store!
    `;
    
    // Submit the print job
    const success = await submitPrintJob({
      type: 'receipt',
      content: receiptContent,
      printerId: printerToUse,
      relatedId: order.id,
      requestedBy: userIdToUse
    });
    
    if (success) {
      toast.success('Order receipt sent to printer');
      return true;
    } else {
      throw new Error('Failed to submit print job');
    }
  } catch (error) {
    console.error('Error printing order receipt:', error);
    toast.error('Failed to print order receipt');
    return false;
  }
};

// Print a shipping label
export const printShippingLabel = async (orderId: string, userId: string, printerId?: string): Promise<boolean> => {
  try {
    // Get the order details - simulated since we don't have an orders table yet
    // In a real implementation, this would fetch from the orders table
    const orderData = {
      id: orderId,
      order_number: `ORD-${Date.now()}`,
      shipping_info: {
        full_name: 'John Doe',
        address: '123 Main St',
        city: 'Nairobi',
        state: 'Kenya',
        postal_code: '00100',
        country: 'Kenya'
      }
    };
    
    const printerToUse = printerId || getPrinterIdForRole('deliveryStaff');
    
    // Check if PrintNode is available
    const isPrintAvailable = await isPrintNodeAvailable();
    if (!isPrintAvailable) {
      toast.error('Printing service not available');
      return false;
    }
    
    // Generate shipping label content
    // This is a simplified example - real implementation would depend on the printer
    const shippingLabelContent = `
      ^XA
      ^FO50,50^ADN,36,20^FDOrder: ${orderData.order_number}^FS
      ^FO50,100^ADN,36,20^FDShip To:^FS
      ^FO50,150^ADN,36,20^FD${orderData.shipping_info.full_name}^FS
      ^FO50,200^ADN,36,20^FD${orderData.shipping_info.address}^FS
      ^FO50,250^ADN,36,20^FD${orderData.shipping_info.city}, ${orderData.shipping_info.state} ${orderData.shipping_info.postal_code}^FS
      ^FO50,300^ADN,36,20^FD${orderData.shipping_info.country}^FS
      ^FO50,400^BY3^BCN,100,Y,N,N^FD${orderData.order_number}^FS
      ^XZ
    `;
    
    // Submit the print job
    const success = await submitPrintJob({
      type: 'shipping',
      content: shippingLabelContent,
      printerId: printerToUse,
      relatedId: orderId,
      requestedBy: userId
    });
    
    if (success) {
      toast.success('Shipping label sent to printer');
      return true;
    } else {
      throw new Error('Failed to submit print job');
    }
  } catch (error) {
    console.error('Error printing shipping label:', error);
    toast.error('Failed to print shipping label');
    return false;
  }
};

// Get print history for a user
export const getPrintHistory = async (userId?: string, limit: number = 20): Promise<PrintJob[]> => {
  try {
    // Simulated print history since we don't have a print_jobs table yet
    // In a real implementation, this would fetch from the print_jobs table
    const mockPrintJobs: PrintJob[] = [
      {
        id: '1',
        type: 'receipt',
        content: 'Receipt content...',
        printerId: getPrinterIdForRole('orderPreparer'),
        status: 'completed',
        createdAt: new Date(Date.now() - 3600000),
        processedAt: new Date(Date.now() - 3590000),
        relatedId: 'order-1',
        requestedBy: userId || 'system'
      },
      {
        id: '2',
        type: 'label',
        content: 'Label content...',
        printerId: getPrinterIdForRole('productManager'),
        status: 'completed',
        createdAt: new Date(Date.now() - 7200000),
        processedAt: new Date(Date.now() - 7190000),
        relatedId: 'product-1',
        requestedBy: userId || 'system'
      }
    ];
    
    return mockPrintJobs;
  } catch (error) {
    console.error('Error getting print history:', error);
    return [];
  }
};

// For compatibility with other components
export const getPrintJobHistory = getPrintHistory;

// Check printer status
export const checkPrinterStatus = async (printerId: string): Promise<boolean> => {
  // In a real implementation, this would call the PrintNode API
  // For demo purposes, we'll just return online
  return true;
};

// Download functions
export const downloadProductLabel = async (productId: string): Promise<void> => {
  // Mock implementation
  console.log('Downloading product label:', productId);
  alert('Product label downloading...');
};

export const downloadShippingLabel = async (orderId: string): Promise<void> => {
  // Mock implementation
  console.log('Downloading shipping label:', orderId);
  alert('Shipping label downloading...');
};
