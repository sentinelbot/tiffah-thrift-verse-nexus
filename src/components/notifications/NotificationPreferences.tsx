
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Bell, Mail, ShoppingBag, Percent, Tag, Save } from 'lucide-react';

const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState({
    emailMarketing: false,
    emailPromotions: false,
    emailOrderUpdates: true,
    smsOrderUpdates: false,
    smsDelivery: true,
    emailNewsletter: false,
    smsPromotions: false,
    emailProductAlerts: false,
  });
  
  const [saving, setSaving] = useState(false);
  
  const handleChange = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSave = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast.success('Notification preferences saved');
    }, 1000);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Customize how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4" />
              Email Notifications
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="email-marketing" className="text-sm flex items-center gap-2">
                  <ShoppingBag className="h-3 w-3 text-muted-foreground" />
                  Marketing emails
                </label>
                <Switch
                  id="email-marketing"
                  checked={preferences.emailMarketing}
                  onCheckedChange={(checked) => handleChange('emailMarketing', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="email-promotions" className="text-sm flex items-center gap-2">
                  <Percent className="h-3 w-3 text-muted-foreground" />
                  Promotions and discounts
                </label>
                <Switch
                  id="email-promotions"
                  checked={preferences.emailPromotions}
                  onCheckedChange={(checked) => handleChange('emailPromotions', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="email-order-updates" className="text-sm flex items-center gap-2">
                  <ShoppingBag className="h-3 w-3 text-muted-foreground" />
                  Order status updates
                </label>
                <Switch
                  id="email-order-updates"
                  checked={preferences.emailOrderUpdates}
                  onCheckedChange={(checked) => handleChange('emailOrderUpdates', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="email-newsletter" className="text-sm flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  Weekly newsletter
                </label>
                <Switch
                  id="email-newsletter"
                  checked={preferences.emailNewsletter}
                  onCheckedChange={(checked) => handleChange('emailNewsletter', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="email-product-alerts" className="text-sm flex items-center gap-2">
                  <Tag className="h-3 w-3 text-muted-foreground" />
                  Price drop alerts
                </label>
                <Switch
                  id="email-product-alerts"
                  checked={preferences.emailProductAlerts}
                  onCheckedChange={(checked) => handleChange('emailProductAlerts', checked)}
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
              <Bell className="h-4 w-4" />
              SMS Notifications
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="sms-order-updates" className="text-sm flex items-center gap-2">
                  <ShoppingBag className="h-3 w-3 text-muted-foreground" />
                  Order status updates
                </label>
                <Switch
                  id="sms-order-updates"
                  checked={preferences.smsOrderUpdates}
                  onCheckedChange={(checked) => handleChange('smsOrderUpdates', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="sms-delivery" className="text-sm flex items-center gap-2">
                  <ShoppingBag className="h-3 w-3 text-muted-foreground" />
                  Delivery notifications
                </label>
                <Switch
                  id="sms-delivery"
                  checked={preferences.smsDelivery}
                  onCheckedChange={(checked) => handleChange('smsDelivery', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="sms-promotions" className="text-sm flex items-center gap-2">
                  <Percent className="h-3 w-3 text-muted-foreground" />
                  Promotions and discounts
                </label>
                <Switch
                  id="sms-promotions"
                  checked={preferences.smsPromotions}
                  onCheckedChange={(checked) => handleChange('smsPromotions', checked)}
                />
              </div>
            </div>
          </div>
        </div>
        
        <Button className="w-full" onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
