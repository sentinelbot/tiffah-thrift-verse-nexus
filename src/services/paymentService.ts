
import { PaymentMethod, PaymentStatus } from '@/types/order';
import { toast } from 'sonner';

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  status: PaymentStatus;
  message: string;
}

// Mpesa STK Push payment
export const processMpesaPayment = async (
  phone: string,
  amount: number,
  orderNumber: string
): Promise<PaymentResult> => {
  // This would be an actual API call to your backend in production
  // which would then call the Mpesa API for STK push
  console.log(`Processing Mpesa payment of ${amount} to ${phone} for order ${orderNumber}`);
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For testing, simulate successful payment 80% of the time
    const success = Math.random() < 0.8;
    
    if (success) {
      return {
        success: true,
        transactionId: `MPESA${Math.floor(Math.random() * 10000000)}`,
        status: 'completed',
        message: 'Payment completed successfully'
      };
    } else {
      // Simulate payment failure for testing
      return {
        success: false,
        status: 'failed',
        message: 'Payment failed. Please try again or use another payment method.'
      };
    }
  } catch (error) {
    console.error('Mpesa payment error:', error);
    return {
      success: false,
      status: 'failed',
      message: 'An error occurred while processing your payment. Please try again.'
    };
  }
};

// Card payment processing
export const processCardPayment = async (
  cardDetails: {
    cardName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  },
  amount: number,
  orderNumber: string
): Promise<PaymentResult> => {
  // In production, this would call your PCI-compliant payment processor
  // Never store actual card details, only tokenized versions
  console.log(`Processing card payment of ${amount} for order ${orderNumber}`);
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For testing, simulate successful payment 90% of the time
    const success = Math.random() < 0.9;
    
    if (success) {
      return {
        success: true,
        transactionId: `CARD${Math.floor(Math.random() * 10000000)}`,
        status: 'completed',
        message: 'Payment completed successfully'
      };
    } else {
      return {
        success: false,
        status: 'failed',
        message: 'Card payment failed. Please check your card details and try again.'
      };
    }
  } catch (error) {
    console.error('Card payment error:', error);
    return {
      success: false,
      status: 'failed',
      message: 'An error occurred while processing your card payment. Please try again.'
    };
  }
};

// PayPal payment processing (mocked)
export const processPayPalPayment = async (
  amount: number,
  orderNumber: string
): Promise<PaymentResult> => {
  // In production, would redirect to PayPal and handle callback
  console.log(`Processing PayPal payment of ${amount} for order ${orderNumber}`);
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    // For testing, simulate successful payment 95% of the time
    const success = Math.random() < 0.95;
    
    if (success) {
      return {
        success: true,
        transactionId: `PAYPAL${Math.floor(Math.random() * 10000000)}`,
        status: 'completed',
        message: 'PayPal payment completed successfully'
      };
    } else {
      return {
        success: false,
        status: 'failed',
        message: 'PayPal payment failed. Please try again.'
      };
    }
  } catch (error) {
    console.error('PayPal payment error:', error);
    return {
      success: false,
      status: 'failed',
      message: 'An error occurred while processing your PayPal payment. Please try again.'
    };
  }
};

// Cash on delivery (always succeeds in test mode)
export const processCashPayment = async (
  amount: number,
  orderNumber: string
): Promise<PaymentResult> => {
  console.log(`Processing Cash payment of ${amount} for order ${orderNumber}`);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    status: 'pending', // Cash payments are marked as pending until delivery
    message: 'Cash on delivery payment method confirmed'
  };
};

// Unified payment processor function
export const processPayment = async (
  method: PaymentMethod,
  amount: number,
  orderNumber: string,
  paymentDetails: any
): Promise<PaymentResult> => {
  // Show toast notification
  const toastId = toast.loading(`Processing ${method} payment...`);
  
  try {
    let result: PaymentResult;
    
    switch (method) {
      case 'mpesa':
        result = await processMpesaPayment(
          paymentDetails.mpesaPhone,
          amount,
          orderNumber
        );
        break;
        
      case 'card':
        result = await processCardPayment(
          {
            cardName: paymentDetails.cardName,
            cardNumber: paymentDetails.cardNumber,
            expiryDate: paymentDetails.expiryDate,
            cvv: paymentDetails.cvv
          },
          amount,
          orderNumber
        );
        break;
        
      case 'paypal':
        result = await processPayPalPayment(amount, orderNumber);
        break;
        
      case 'cash':
        result = await processCashPayment(amount, orderNumber);
        break;
        
      default:
        result = {
          success: false,
          status: 'failed',
          message: 'Invalid payment method'
        };
    }
    
    // Update toast based on result
    if (result.success) {
      toast.success(result.message, { id: toastId });
    } else {
      toast.error(result.message, { id: toastId });
    }
    
    return result;
  } catch (error) {
    // Handle unexpected errors
    console.error('Payment processing error:', error);
    toast.error('An unexpected error occurred during payment processing', { id: toastId });
    
    return {
      success: false,
      status: 'failed',
      message: 'An unexpected error occurred during payment processing'
    };
  }
};
