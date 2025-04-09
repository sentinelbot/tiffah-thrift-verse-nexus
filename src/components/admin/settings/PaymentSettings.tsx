
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  CreditCard, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Phone,
  DollarSign,
  RefreshCw,
  Lock,
  Shield,
  ChevronsUpDown
} from 'lucide-react';
import { toast } from 'sonner';

const PaymentSettings = () => {
  const [activeTab, setActiveTab] = useState('methods');
  const [paymentMethods, setPaymentMethods] = useState({
    mpesa: { enabled: true, production: false },
    card: { enabled: true, production: false },
    paypal: { enabled: false, production: false },
    cash: { enabled: true }
  });
  
  const [mpesaSettings, setMpesaSettings] = useState({
    consumerKey: '•••••••••••••••••••••••••••••••',
    consumerSecret: '•••••••••••••••••••••••••••••••',
    shortcode: '174379',
    passkey: '•••••••••••••••••••••••••••••••',
    callbackUrl: 'https://tiffahthrift.co.ke/api/mpesa/callback'
  });
  
  const [cardSettings, setCardSettings] = useState({
    apiKey: '•••••••••••••••••••••••••••••••',
    publishableKey: 'pk_test_AbCdEfGhIjKlMnOpQrStUvWx',
    webhookSecret: '•••••••••••••••••••••••••••••••'
  });
  
  const [transactionSettings, setTransactionSettings] = useState({
    currency: 'KES',
    minOrderAmount: 100,
    maxOrderAmount: 100000,
    transactionFeePercent: 0,
    transactionFeeFixed: 0,
    paymentTimeout: 15 // minutes
  });
  
  const handleTogglePaymentMethod = (method: keyof typeof paymentMethods, field: string, value: boolean) => {
    setPaymentMethods({
      ...paymentMethods,
      [method]: { 
        ...paymentMethods[method as keyof typeof paymentMethods],
        [field]: value 
      }
    });
    
    toast.success(`${method.toUpperCase()} payment ${field === 'enabled' ? (value ? 'enabled' : 'disabled') : (value ? 'switched to production' : 'switched to sandbox')}`);
  };
  
  const handleTestConnection = (method: string) => {
    toast.loading(`Testing ${method} connection...`);
    
    // Simulate API call
    setTimeout(() => {
      if (method === 'mpesa' || method === 'card') {
        toast.success(`${method.toUpperCase()} connection successful!`);
      } else {
        toast.error(`${method.toUpperCase()} connection failed. Please check your credentials.`);
      }
    }, 2000);
  };
  
  const handleSaveApiSettings = (method: string) => {
    toast.loading(`Saving ${method} settings...`);
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`${method.toUpperCase()} settings saved successfully!`);
    }, 1500);
  };
  
  const handleSaveTransactionSettings = () => {
    toast.loading(`Saving transaction settings...`);
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`Transaction settings saved successfully!`);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="transaction">Transaction Settings</TabsTrigger>
          <TabsTrigger value="security">Security & Compliance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="methods" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Configure payment methods available to your customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Accordion type="single" collapsible className="w-full">
                {/* Mpesa Payment Method */}
                <AccordionItem value="mpesa" className="border p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Phone className="h-10 w-10 p-2 bg-green-100 text-green-600 rounded-lg" />
                      <div>
                        <h3 className="text-lg font-medium">M-Pesa</h3>
                        <p className="text-sm text-muted-foreground">Mobile money payments (Safaricom)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="mpesa-enabled" className="text-sm font-medium">
                          {paymentMethods.mpesa.enabled ? 'Enabled' : 'Disabled'}
                        </Label>
                        <Switch 
                          id="mpesa-enabled"
                          checked={paymentMethods.mpesa.enabled}
                          onCheckedChange={(checked) => handleTogglePaymentMethod('mpesa', 'enabled', checked)}
                        />
                      </div>
                      <AccordionTrigger className="py-0"></AccordionTrigger>
                    </div>
                  </div>
                  
                  <AccordionContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-md">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="mpesa-environment" className="text-sm">Environment</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm mr-2">
                            {paymentMethods.mpesa.production ? 'Production' : 'Sandbox'}
                          </Label>
                          <Switch 
                            id="mpesa-environment"
                            checked={paymentMethods.mpesa.production}
                            onCheckedChange={(checked) => handleTogglePaymentMethod('mpesa', 'production', checked)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="mpesa-consumer-key">Consumer Key</Label>
                            <div className="relative">
                              <Input 
                                id="mpesa-consumer-key"
                                type="password" 
                                value={mpesaSettings.consumerKey}
                                onChange={(e) => setMpesaSettings({...mpesaSettings, consumerKey: e.target.value})}
                              />
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute right-0 top-0 h-full"
                                onClick={() => alert('Show/hide key')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="mpesa-consumer-secret">Consumer Secret</Label>
                            <div className="relative">
                              <Input 
                                id="mpesa-consumer-secret"
                                type="password" 
                                value={mpesaSettings.consumerSecret}
                                onChange={(e) => setMpesaSettings({...mpesaSettings, consumerSecret: e.target.value})}
                              />
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute right-0 top-0 h-full"
                                onClick={() => alert('Show/hide secret')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="mpesa-shortcode">Shortcode (Paybill/Till)</Label>
                            <Input 
                              id="mpesa-shortcode"
                              value={mpesaSettings.shortcode}
                              onChange={(e) => setMpesaSettings({...mpesaSettings, shortcode: e.target.value})}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="mpesa-passkey">Passkey</Label>
                            <div className="relative">
                              <Input 
                                id="mpesa-passkey"
                                type="password" 
                                value={mpesaSettings.passkey}
                                onChange={(e) => setMpesaSettings({...mpesaSettings, passkey: e.target.value})}
                              />
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute right-0 top-0 h-full"
                                onClick={() => alert('Show/hide passkey')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="mpesa-callback-url">Callback URL</Label>
                          <Input 
                            id="mpesa-callback-url"
                            value={mpesaSettings.callbackUrl}
                            onChange={(e) => setMpesaSettings({...mpesaSettings, callbackUrl: e.target.value})}
                          />
                          <p className="text-xs text-muted-foreground">
                            Must be a public URL that can receive M-Pesa callbacks
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => handleTestConnection('mpesa')}
                          disabled={!paymentMethods.mpesa.enabled}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Test Connection
                        </Button>
                        <Button 
                          onClick={() => handleSaveApiSettings('mpesa')}
                          disabled={!paymentMethods.mpesa.enabled}
                        >
                          Save Settings
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Card Payment Method */}
                <AccordionItem value="card" className="border p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <CreditCard className="h-10 w-10 p-2 bg-blue-100 text-blue-600 rounded-lg" />
                      <div>
                        <h3 className="text-lg font-medium">Card Payments</h3>
                        <p className="text-sm text-muted-foreground">Credit/Debit card payments (Stripe)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="card-enabled" className="text-sm font-medium">
                          {paymentMethods.card.enabled ? 'Enabled' : 'Disabled'}
                        </Label>
                        <Switch 
                          id="card-enabled"
                          checked={paymentMethods.card.enabled}
                          onCheckedChange={(checked) => handleTogglePaymentMethod('card', 'enabled', checked)}
                        />
                      </div>
                      <AccordionTrigger className="py-0"></AccordionTrigger>
                    </div>
                  </div>
                  
                  <AccordionContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-md">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="card-environment" className="text-sm">Environment</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm mr-2">
                            {paymentMethods.card.production ? 'Production' : 'Test Mode'}
                          </Label>
                          <Switch 
                            id="card-environment"
                            checked={paymentMethods.card.production}
                            onCheckedChange={(checked) => handleTogglePaymentMethod('card', 'production', checked)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-api-key">Secret API Key</Label>
                          <div className="relative">
                            <Input 
                              id="card-api-key"
                              type="password" 
                              value={cardSettings.apiKey}
                              onChange={(e) => setCardSettings({...cardSettings, apiKey: e.target.value})}
                            />
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute right-0 top-0 h-full"
                              onClick={() => alert('Show/hide key')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {paymentMethods.card.production ? 'Starts with sk_live_' : 'Starts with sk_test_'}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="card-publishable-key">Publishable Key</Label>
                          <Input 
                            id="card-publishable-key"
                            value={cardSettings.publishableKey}
                            onChange={(e) => setCardSettings({...cardSettings, publishableKey: e.target.value})}
                          />
                          <p className="text-xs text-muted-foreground">
                            {paymentMethods.card.production ? 'Starts with pk_live_' : 'Starts with pk_test_'}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="card-webhook-secret">Webhook Signing Secret</Label>
                          <div className="relative">
                            <Input 
                              id="card-webhook-secret"
                              type="password" 
                              value={cardSettings.webhookSecret}
                              onChange={(e) => setCardSettings({...cardSettings, webhookSecret: e.target.value})}
                            />
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute right-0 top-0 h-full"
                              onClick={() => alert('Show/hide secret')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {paymentMethods.card.production ? 'Starts with whsec_' : 'Starts with whsec_test_'}
                          </p>
                        </div>
                      </div>
                      
                      <Alert variant="info" className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertTitle>Webhook URL</AlertTitle>
                        <AlertDescription className="mt-1">
                          <p className="text-sm">Configure your Stripe webhook to point to:</p>
                          <code className="block mt-1 px-2 py-1 bg-background rounded text-xs font-mono break-all">
                            https://tiffahthrift.co.ke/api/payments/webhook/stripe
                          </code>
                        </AlertDescription>
                      </Alert>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => handleTestConnection('card')}
                          disabled={!paymentMethods.card.enabled}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Test Connection
                        </Button>
                        <Button 
                          onClick={() => handleSaveApiSettings('card')}
                          disabled={!paymentMethods.card.enabled}
                        >
                          Save Settings
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* PayPal Payment Method */}
                <AccordionItem value="paypal" className="border p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <DollarSign className="h-10 w-10 p-2 bg-blue-100 text-blue-600 rounded-lg" />
                      <div>
                        <h3 className="text-lg font-medium">PayPal</h3>
                        <p className="text-sm text-muted-foreground">PayPal account payments</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="paypal-enabled" className="text-sm font-medium">
                          {paymentMethods.paypal.enabled ? 'Enabled' : 'Disabled'}
                        </Label>
                        <Switch 
                          id="paypal-enabled"
                          checked={paymentMethods.paypal.enabled}
                          onCheckedChange={(checked) => handleTogglePaymentMethod('paypal', 'enabled', checked)}
                        />
                      </div>
                      <AccordionTrigger className="py-0"></AccordionTrigger>
                    </div>
                  </div>
                  
                  <AccordionContent className="pt-4">
                    <div className="flex items-center justify-center py-6">
                      <div className="text-center">
                        <p className="text-muted-foreground">PayPal integration coming soon</p>
                        <Button className="mt-4" disabled>Configure PayPal</Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Cash Payment Method */}
                <AccordionItem value="cash" className="border p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <DollarSign className="h-10 w-10 p-2 bg-gray-100 text-gray-600 rounded-lg" />
                      <div>
                        <h3 className="text-lg font-medium">Cash on Delivery</h3>
                        <p className="text-sm text-muted-foreground">Pay with cash when order is delivered</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="cash-enabled" className="text-sm font-medium">
                          {paymentMethods.cash.enabled ? 'Enabled' : 'Disabled'}
                        </Label>
                        <Switch 
                          id="cash-enabled"
                          checked={paymentMethods.cash.enabled}
                          onCheckedChange={(checked) => handleTogglePaymentMethod('cash', 'enabled', checked)}
                        />
                      </div>
                      <AccordionTrigger className="py-0"></AccordionTrigger>
                    </div>
                  </div>
                  
                  <AccordionContent className="pt-4">
                    <div className="space-y-4">
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No Configuration Required</AlertTitle>
                        <AlertDescription>
                          Cash on delivery requires no external API integration. Simply enable or disable as needed.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Recommendations</p>
                        <ul className="text-sm text-muted-foreground space-y-2">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500" />
                            <span>Verify customer phone number before accepting cash orders</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500" />
                            <span>Consider minimum order amounts for cash payments</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500" />
                            <span>Train delivery staff on cash handling procedures</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transaction" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Settings</CardTitle>
              <CardDescription>
                Configure how payments are processed and displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select 
                      value={transactionSettings.currency}
                      onValueChange={(value) => setTransactionSettings({...transactionSettings, currency: value})}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KES">Kenya Shillings (KES)</SelectItem>
                        <SelectItem value="USD">US Dollars (USD)</SelectItem>
                        <SelectItem value="EUR">Euros (EUR)</SelectItem>
                        <SelectItem value="GBP">British Pounds (GBP)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Default display currency for all transactions
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-timeout">Payment Timeout (minutes)</Label>
                    <Input 
                      id="payment-timeout"
                      type="number" 
                      value={transactionSettings.paymentTimeout}
                      onChange={(e) => setTransactionSettings({
                        ...transactionSettings, 
                        paymentTimeout: Number(e.target.value)
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Time until pending payment is cancelled
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-order-amount">Minimum Order Amount</Label>
                      <Input 
                        id="min-order-amount"
                        type="number" 
                        value={transactionSettings.minOrderAmount}
                        onChange={(e) => setTransactionSettings({
                          ...transactionSettings, 
                          minOrderAmount: Number(e.target.value)
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="max-order-amount">Maximum Order Amount</Label>
                      <Input 
                        id="max-order-amount"
                        type="number" 
                        value={transactionSettings.maxOrderAmount}
                        onChange={(e) => setTransactionSettings({
                          ...transactionSettings, 
                          maxOrderAmount: Number(e.target.value)
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="transaction-fee-percent">Transaction Fee (%)</Label>
                      <Input 
                        id="transaction-fee-percent"
                        type="number" 
                        value={transactionSettings.transactionFeePercent}
                        onChange={(e) => setTransactionSettings({
                          ...transactionSettings, 
                          transactionFeePercent: Number(e.target.value)
                        })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Percentage fee applied to transactions
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="transaction-fee-fixed">Fixed Fee (KES)</Label>
                      <Input 
                        id="transaction-fee-fixed"
                        type="number" 
                        value={transactionSettings.transactionFeeFixed}
                        onChange={(e) => setTransactionSettings({
                          ...transactionSettings, 
                          transactionFeeFixed: Number(e.target.value)
                        })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Fixed fee applied to each transaction
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveTransactionSettings}>
                Save Transaction Settings
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Receipt Customization</CardTitle>
              <CardDescription>
                Configure how receipts are displayed and delivered
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="receipt-logo">Receipt Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 border-2 border-dashed rounded-lg flex items-center justify-center">
                    <Button variant="ghost" size="sm">Upload</Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Upload your store logo to display on receipts</p>
                    <p>Recommended size: 200x100px</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="receipt-footer">Receipt Footer Text</Label>
                <Textarea 
                  id="receipt-footer"
                  placeholder="Enter text to appear at the bottom of receipts"
                  rows={3}
                  defaultValue="Thank you for shopping at Tiffah Thrift Store! All returns must be made within 7 days with receipt."
                />
                <p className="text-xs text-muted-foreground">
                  Add return policy, contact information, or thank you message
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="include-tax-details">Include Tax Details</Label>
                <Switch id="include-tax-details" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="include-terms">Include Terms & Conditions</Label>
                <Switch id="include-terms" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Receipt Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security options for payment processing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="require-auth">Require Admin Authentication</Label>
                    <p className="text-xs text-muted-foreground">
                      Require password confirmation for payment setting changes
                    </p>
                  </div>
                  <Switch id="require-auth" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="ip-restriction">IP Restriction</Label>
                    <p className="text-xs text-muted-foreground">
                      Limit payment settings access to specific IP addresses
                    </p>
                  </div>
                  <Switch id="ip-restriction" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="audit-logging">Audit Logging</Label>
                    <p className="text-xs text-muted-foreground">
                      Log all changes to payment settings
                    </p>
                  </div>
                  <Switch id="audit-logging" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="api-key-rotation">API Key Rotation Reminder</Label>
                    <p className="text-xs text-muted-foreground">
                      Get reminded to rotate API keys every 90 days
                    </p>
                  </div>
                  <Switch id="api-key-rotation" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Security Status: Strong</span>
              </div>
              <Button>
                <Lock className="mr-2 h-4 w-4" />
                Save Security Settings
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>PCI Compliance</CardTitle>
              <CardDescription>
                Payment Card Industry Data Security Standard compliance checklist
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Using a PCI-compliant payment processor</p>
                    <p className="text-sm text-muted-foreground">Stripe and other integrated providers handle card data securely</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Not storing card details locally</p>
                    <p className="text-sm text-muted-foreground">Card data is never stored on your servers</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Using HTTPS for all pages</p>
                    <p className="text-sm text-muted-foreground">All web traffic is encrypted via TLS</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 mt-0.5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Quarterly security scans</p>
                    <p className="text-sm text-muted-foreground">Regular vulnerability scanning not configured</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Access control measures</p>
                    <p className="text-sm text-muted-foreground">Restricted access to payment system information</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-end">
              <Button variant="outline">
                View Full Compliance Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Component for the eye icon
const Eye = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default PaymentSettings;
