
import { generateBarcodeDataURL } from '@/utils/barcodeUtils';
import { Order } from '@/types/order';
import { generateReceiptHTML } from '@/services/receiptService';
import { toast } from 'sonner';

// Print job type definitions
export type PrintJobType = 'label' | 'receipt' | 'shippingLabel';

export interface PrintJob {
  id: string;
  type: PrintJobType;
  content: string;
  printerId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  processedAt?: Date;
  error?: string;
  relatedId: string; // Product ID or Order ID
  requestedBy: string; // User ID
}

// PrintNode API configuration
const PRINTNODE_API_ENDPOINT = 'https://api.printnode.com/printjobs';

// Get API key from environment variables or Supabase config
const getPrintNodeApiKey = () => {
  return process.env.PRINTNODE_API_KEY || 'test_printnode_api_key';
};

// Role-specific printer IDs (in real app, these would be fetched from database)
const PRINTER_IDS = {
  productManager: 'pm_printer_id',
  orderPreparer: 'op_printer_id',
  deliveryStaff: 'ds_printer_id'
};

// Get printer ID for user role
export const getPrinterIdForRole = (role: string): string => {
  switch (role) {
    case 'productManager':
      return PRINTER_IDS.productManager;
    case 'orderPreparer':
      return PRINTER_IDS.orderPreparer;
    case 'deliveryStaff':
      return PRINTER_IDS.deliveryStaff;
    default:
      throw new Error(`No printer configured for role: ${role}`);
  }
};

// Create print job using PrintNode API
export const createPrintJob = async (
  content: string,
  printerId: string,
  title: string,
  contentType: 'raw_base64' | 'pdf_base64' | 'html'
): Promise<string> => {
  try {
    // In a real implementation, this would make an actual API call to PrintNode
    // For demo purposes, we'll simulate the API call
    console.log(`Creating print job for printer ${printerId}`);
    console.log(`Print job title: ${title}`);
    console.log(`Content type: ${contentType}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate random job ID
    const jobId = Math.floor(Math.random() * 1000000).toString();
    
    // Log success
    console.log(`Print job created with ID: ${jobId}`);
    
    return jobId;
  } catch (error) {
    console.error('Error creating print job:', error);
    throw error;
  }
};

// Print product label
export const printProductLabel = async (
  product: { id: string; name: string; price: number; barcode: string },
  printerId: string,
  requestedBy: string
): Promise<boolean> => {
  try {
    // Generate barcode image
    const barcodeImage = generateBarcodeDataURL(product.barcode);
    
    // Create ZPL format for the label
    const zplTemplate = generateZplLabelTemplate(product, barcodeImage);
    
    // Submit print job
    const jobId = await createPrintJob(
      zplTemplate,
      printerId,
      `Product Label: ${product.name}`,
      'raw_base64'
    );
    
    // Save print job to history
    savePrintJobToHistory({
      id: jobId,
      type: 'label',
      content: zplTemplate,
      printerId,
      status: 'completed',
      createdAt: new Date(),
      processedAt: new Date(),
      relatedId: product.id,
      requestedBy
    });
    
    toast.success('Product label sent to printer');
    return true;
  } catch (error) {
    console.error('Error printing product label:', error);
    
    // Fallback: Generate PDF
    generateLabelPdf(product);
    
    toast.error('Failed to print label. PDF generated as fallback.');
    return false;
  }
};

// Print order receipt
export const printOrderReceipt = async (
  order: Order,
  printerId: string,
  requestedBy: string
): Promise<boolean> => {
  try {
    // Generate receipt HTML
    const receiptHtml = generateReceiptHTML(order);
    
    // Submit print job
    const jobId = await createPrintJob(
      receiptHtml,
      printerId,
      `Receipt: Order #${order.orderNumber}`,
      'html'
    );
    
    // Save print job to history
    savePrintJobToHistory({
      id: jobId,
      type: 'receipt',
      content: receiptHtml,
      printerId,
      status: 'completed',
      createdAt: new Date(),
      processedAt: new Date(),
      relatedId: order.id,
      requestedBy
    });
    
    toast.success('Order receipt sent to printer');
    return true;
  } catch (error) {
    console.error('Error printing order receipt:', error);
    
    // Fallback: Generate PDF
    generateReceiptPdf(order);
    
    toast.error('Failed to print receipt. PDF generated as fallback.');
    return false;
  }
};

// Print shipping label
export const printShippingLabel = async (
  order: Order,
  printerId: string,
  requestedBy: string
): Promise<boolean> => {
  try {
    // Generate shipping label content
    const shippingLabel = generateShippingLabelTemplate(order);
    
    // Submit print job
    const jobId = await createPrintJob(
      shippingLabel,
      printerId,
      `Shipping Label: Order #${order.orderNumber}`,
      'raw_base64'
    );
    
    // Save print job to history
    savePrintJobToHistory({
      id: jobId,
      type: 'shippingLabel',
      content: shippingLabel,
      printerId,
      status: 'completed',
      createdAt: new Date(),
      processedAt: new Date(),
      relatedId: order.id,
      requestedBy
    });
    
    toast.success('Shipping label sent to printer');
    return true;
  } catch (error) {
    console.error('Error printing shipping label:', error);
    
    // Fallback: Generate PDF
    generateShippingLabelPdf(order);
    
    toast.error('Failed to print shipping label. PDF generated as fallback.');
    return false;
  }
};

// Check printer status
export const checkPrinterStatus = async (printerId: string): Promise<boolean> => {
  try {
    // In a real implementation, this would make an API call to PrintNode
    // For demo purposes, we'll simulate the API call and return random status
    console.log(`Checking status for printer ${printerId}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Random status (80% chance of success)
    const isOnline = Math.random() < 0.8;
    
    return isOnline;
  } catch (error) {
    console.error('Error checking printer status:', error);
    return false;
  }
};

// Retry failed print job
export const retryPrintJob = async (printJob: PrintJob): Promise<boolean> => {
  try {
    // Submit print job again
    const jobId = await createPrintJob(
      printJob.content,
      printJob.printerId,
      `Retry: ${printJob.type} for ${printJob.relatedId}`,
      printJob.type === 'receipt' ? 'html' : 'raw_base64'
    );
    
    // Update print job history
    updatePrintJobStatus(printJob.id, 'completed');
    
    toast.success(`${printJob.type} sent to printer`);
    return true;
  } catch (error) {
    console.error('Error retrying print job:', error);
    
    // Update print job history
    updatePrintJobStatus(printJob.id, 'failed', error instanceof Error ? error.message : 'Unknown error');
    
    toast.error(`Failed to retry ${printJob.type} print job`);
    return false;
  }
};

// Generate ZPL label template
const generateZplLabelTemplate = (
  product: { id: string; name: string; price: number; barcode: string },
  barcodeImage: string
): string => {
  // In a real implementation, this would generate actual ZPL code
  // For demo purposes, we'll return a placeholder
  return `
^XA
^FO50,50^A0N,30,30^FD${product.name}^FS
^FO50,100^A0N,30,30^FDPrice: KSh ${product.price.toFixed(2)}^FS
^FO50,150^A0N,30,30^FDSKU: ${product.barcode}^FS
^FO50,200^BY3^BC^FD${product.barcode}^FS
^XZ
  `;
};

// Generate shipping label template
const generateShippingLabelTemplate = (order: Order): string => {
  // In a real implementation, this would generate actual shipping label code
  // For demo purposes, we'll return a placeholder
  return `
^XA
^FO50,50^A0N,30,30^FDOrder: ${order.orderNumber}^FS
^FO50,100^A0N,30,30^FDCustomer: ${order.shippingInfo.fullName}^FS
^FO50,150^A0N,30,30^FDAddress: ${order.shippingInfo.address}^FS
^FO50,200^A0N,30,30^FD${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.postalCode}^FS
^FO50,250^A0N,30,30^FD${order.shippingInfo.country}^FS
^FO50,300^BY3^BC^FD${order.orderNumber}^FS
^XZ
  `;
};

// Save print job to history
const savePrintJobToHistory = (printJob: PrintJob): void => {
  // In a real implementation, this would save to database
  // For demo purposes, we'll just log it
  console.log('Saved print job to history:', printJob);
};

// Update print job status
const updatePrintJobStatus = (
  jobId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed',
  error?: string
): void => {
  // In a real implementation, this would update database
  // For demo purposes, we'll just log it
  console.log(`Updated print job ${jobId} status to ${status}`, error ? `Error: ${error}` : '');
};

// Fallback methods for PDF generation
const generateLabelPdf = (product: { id: string; name: string; price: number; barcode: string }): void => {
  // In a real implementation, this would generate a PDF
  // For demo purposes, we'll just log it
  console.log('Generated label PDF for fallback:', product);
};

const generateReceiptPdf = (order: Order): void => {
  // In a real implementation, this would generate a PDF
  // For demo purposes, we'll just log it
  console.log('Generated receipt PDF for fallback:', order);
};

const generateShippingLabelPdf = (order: Order): void => {
  // In a real implementation, this would generate a PDF
  // For demo purposes, we'll just log it
  console.log('Generated shipping label PDF for fallback:', order);
};
