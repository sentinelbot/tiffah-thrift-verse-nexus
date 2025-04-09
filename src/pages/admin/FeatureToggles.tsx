
import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  BrainCircuit, 
  Printer, 
  Smartphone, 
  Bell, 
  Globe, 
  CreditCard,
  Truck,
  MessageSquare,
  Zap,
  Gauge,
  Save
} from 'lucide-react';

// Mock feature data
const mockFeatureData = {
  ai: [
    { id: 'ai-product-description', name: 'Product Description Generation', enabled: true, cost: 'High' },
    { id: 'ai-image-enhancement', name: 'Image Enhancement', enabled: true, cost: 'Medium' },
    { id: 'ai-recommendations', name: 'Recommendation Engine', enabled: true, cost: 'Medium' },
    { id: 'ai-price-optimization', name: 'Price Optimization', enabled: false, cost: 'Low' },
    { id: 'ai-customer-service', name: 'Customer Service Automation', enabled: false, cost: 'High' },
  ],
  printing: [
    { id: 'print-product-labels', name: 'Product Labels', enabled: true, cost: 'Low' },
    { id: 'print-receipts', name: 'Receipts', enabled: true, cost: 'Low' },
    { id: 'print-shipping-labels', name: 'Shipping Labels', enabled: true, cost: 'Low' },
    { id: 'print-batch-labels', name: 'Batch Printing', enabled: true, cost: 'Low' },
  ],
  notifications: [
    { id: 'notifications-email', name: 'Email Notifications', enabled: true, cost: 'Low' },
    { id: 'notifications-sms', name: 'SMS Notifications', enabled: true, cost: 'Medium' },
    { id: 'notifications-whatsapp', name: 'WhatsApp Notifications', enabled: false, cost: 'Medium' },
    { id: 'notifications-push', name: 'Push Notifications', enabled: true, cost: 'Low' },
  ],
  mobile: [
    { id: 'mobile-pwa', name: 'Progressive Web App', enabled: true, cost: 'Low' },
    { id: 'mobile-offline', name: 'Offline Mode', enabled: true, cost: 'Low' },
    { id: 'mobile-barcode', name: 'Mobile Barcode Scanning', enabled: true, cost: 'Low' },
    { id: 'mobile-location', name: 'Location Services', enabled: true, cost: 'Low' },
  ],
  payment: [
    { id: 'payment-mpesa', name: 'M-Pesa Integration', enabled: true, cost: 'Low' },
    { id: 'payment-cards', name: 'Card Payments', enabled: true, cost: 'Medium' },
    { id: 'payment-paypal', name: 'PayPal Integration', enabled: false, cost: 'Medium' },
    { id: 'payment-cod', name: 'Cash on Delivery', enabled: true, cost: 'Low' },
  ],
  system: [
    { id: 'system-analytics', name: 'Advanced Analytics', enabled: true, cost: 'Medium' },
    { id: 'system-api', name: 'External API Access', enabled: false, cost: 'Low' },
    { id: 'system-backup', name: 'Automated Backups', enabled: true, cost: 'Medium' },
    { id: 'system-monitoring', name: 'System Monitoring', enabled: true, cost: 'Low' },
  ]
};

const FeatureToggles = () => {
  const [features, setFeatures] = useState(mockFeatureData);
  const [activeTab, setActiveTab] = useState('ai');
  const [isSaving, setIsSaving] = useState(false);
  
  const getCostBadge = (cost: string) => {
    switch(cost) {
      case 'Low':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500">Low</Badge>;
      case 'Medium':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500">Medium</Badge>;
      case 'High':
        return <Badge variant="outline" className="bg-red-500/20 text-red-500">High</Badge>;
      default:
        return <Badge variant="outline">{cost}</Badge>;
    }
  };
  
  const handleToggleFeature = (category: string, featureId: string) => {
    setFeatures(prev => {
      const updatedCategory = [...prev[category]].map(feature => 
        feature.id === featureId 
          ? { ...feature, enabled: !feature.enabled } 
          : feature
      );
      
      return {
        ...prev,
        [category]: updatedCategory
      };
    });
  };
  
  const handleSaveChanges = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Feature toggles saved successfully');
    }, 1000);
  };
  
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'ai': return <BrainCircuit className="h-4 w-4" />;
      case 'printing': return <Printer className="h-4 w-4" />;
      case 'notifications': return <Bell className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'payment': return <CreditCard className="h-4 w-4" />;
      case 'system': return <Gauge className="h-4 w-4" />;
      default: return null;
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Feature Toggles</h1>
            <p className="text-muted-foreground">
              Control system features and optimize resource usage
            </p>
          </div>
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>System Status</CardTitle>
            <CardDescription>Overall system feature status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-muted-foreground">AI Features</div>
                <div className="text-2xl font-bold">
                  {features.ai.filter(f => f.enabled).length}/{features.ai.length}
                  <span className="text-sm font-normal text-muted-foreground ml-2">Active</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(features.ai.filter(f => f.enabled).length / features.ai.length) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-muted-foreground">System Resources</div>
                <div className="text-2xl font-bold">
                  68%
                  <span className="text-sm font-normal text-muted-foreground ml-2">Utilization</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full">
                  <div 
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: '68%' }}
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-muted-foreground">Resource Cost</div>
                <div className="text-2xl font-bold">
                  Medium
                  <span className="text-sm font-normal text-muted-foreground ml-2">Level</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full">
                  <div 
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: '65%' }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" />
              <span className="hidden sm:inline">AI Features</span>
              <span className="sm:hidden">AI</span>
            </TabsTrigger>
            <TabsTrigger value="printing" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Printing</span>
              <span className="sm:hidden">Print</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">Notif.</span>
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">Mobile Features</span>
              <span className="sm:hidden">Mobile</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payment Methods</span>
              <span className="sm:hidden">Payment</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              <span className="hidden sm:inline">System Features</span>
              <span className="sm:hidden">System</span>
            </TabsTrigger>
          </TabsList>
          
          {Object.keys(features).map(category => (
            <TabsContent key={category} value={category} className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <span>{
                      category === 'ai' ? 'AI Features' :
                      category === 'printing' ? 'Printing Features' :
                      category === 'notifications' ? 'Notification Features' :
                      category === 'mobile' ? 'Mobile Features' :
                      category === 'payment' ? 'Payment Methods' :
                      category === 'system' ? 'System Features' :
                      category
                    }</span>
                  </CardTitle>
                  <CardDescription>
                    {
                      category === 'ai' ? 'Control AI-powered features and manage resource usage' :
                      category === 'printing' ? 'Manage printing capabilities and outputs' :
                      category === 'notifications' ? 'Configure notification channels and types' :
                      category === 'mobile' ? 'Control mobile-specific features and capabilities' :
                      category === 'payment' ? 'Enable or disable payment methods' :
                      category === 'system' ? 'Configure core system features and capabilities' :
                      'Manage feature toggles'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {features[category].map((feature) => (
                      <div key={feature.id} className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{feature.name}</h3>
                            {getCostBadge(feature.cost)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {feature.enabled ? 'Enabled' : 'Disabled'}
                          </p>
                        </div>
                        <Switch
                          id={feature.id}
                          checked={feature.enabled}
                          onCheckedChange={() => handleToggleFeature(category, feature.id)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    {features[category].filter(f => f.enabled).length} of {features[category].length} features enabled
                  </p>
                  <Button variant="outline" size="sm" onClick={() => {
                    const allEnabled = features[category].every(f => f.enabled);
                    setFeatures(prev => ({
                      ...prev,
                      [category]: prev[category].map(f => ({ ...f, enabled: !allEnabled }))
                    }));
                  }}>
                    {features[category].every(f => f.enabled) ? 'Disable All' : 'Enable All'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default FeatureToggles;
