
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

interface PrintJob {
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
const getPrinterIdByRole = (role: string): string => {
  switch (role.toLowerCase()) {
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
  
  // Store print job in database
  try {
    const { data, error } = await supabase
      .from('print_jobs')
      .insert({
        type: printJob.type,
        content: printJob.content,
        printer_id: printJob.printerId,
        status: 'pending',
        related_id: printJob.relatedId,
        requested_by: printJob.requestedBy
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
    
    const printerToUse = printerId || PRINTERS.productManager;
    
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
    const printerToUse = printerId || PRINTERS.orderPreparer;
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
    // Get the order details
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
      
    if (error) throw error;
    if (!order) throw new Error('Order not found');
    
    const printerToUse = printerId || PRINTERS.deliveryStaff;
    
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
      ^FO50,50^ADN,36,20^FDOrder: ${order.order_number}^FS
      ^FO50,100^ADN,36,20^FDShip To:^FS
      ^FO50,150^ADN,36,20^FD${order.shipping_info.full_name}^FS
      ^FO50,200^ADN,36,20^FD${order.shipping_info.address}^FS
      ^FO50,250^ADN,36,20^FD${order.shipping_info.city}, ${order.shipping_info.state} ${order.shipping_info.postal_code}^FS
      ^FO50,300^ADN,36,20^FD${order.shipping_info.country}^FS
      ^FO50,400^BY3^BCN,100,Y,N,N^FD${order.order_number}^FS
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
export const getPrintHistory = async (userId: string, limit: number = 20): Promise<PrintJob[]> => {
  try {
    const { data, error } = await supabase
      .from('print_jobs')
      .select('*')
      .eq('requested_by', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    
    return data.map(job => ({
      id: job.id,
      type: job.type,
      content: job.content,
      printerId: job.printer_id,
      status: job.status,
      createdAt: new Date(job.created_at),
      processedAt: job.processed_at ? new Date(job.processed_at) : undefined,
      error: job.error,
      relatedId: job.related_id,
      requestedBy: job.requested_by
    })) as PrintJob[];
  } catch (error) {
    console.error('Error getting print history:', error);
    return [];
  }
};

// Check printer status
export const checkPrinterStatus = async (printerId: string): Promise<{ online: boolean; status: string }> => {
  // In a real implementation, this would call the PrintNode API
  // For demo purposes, we'll just return online
  return { online: true, status: 'ready' };
};
