
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState({
    email: {
      orderUpdates: true,
      promotions: true,
      newArrivals: false,
    },
    sms: {
      orderUpdates: true,
      promotions: false,
      newArrivals: false,
    },
    whatsapp: {
      orderUpdates: false,
      promotions: false,
      newArrivals: false,
    }
  });
  
  const handleToggle = (channel: 'email' | 'sms' | 'whatsapp', type: 'orderUpdates' | 'promotions' | 'newArrivals') => {
    setPreferences(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [type]: !prev[channel][type]
      }
    }));
    
    // In a real app, this would save to a database
    toast.success('Notification preferences updated');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Manage how you receive updates from us</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Email Notifications</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-order-updates" className="flex-1 text-sm">Order updates</Label>
              <Switch 
                id="email-order-updates"
                checked={preferences.email.orderUpdates}
                onCheckedChange={() => handleToggle('email', 'orderUpdates')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-promotions" className="flex-1 text-sm">Promotions and sales</Label>
              <Switch 
                id="email-promotions"
                checked={preferences.email.promotions}
                onCheckedChange={() => handleToggle('email', 'promotions')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-new-arrivals" className="flex-1 text-sm">New arrivals</Label>
              <Switch 
                id="email-new-arrivals"
                checked={preferences.email.newArrivals}
                onCheckedChange={() => handleToggle('email', 'newArrivals')}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">SMS Notifications</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-order-updates" className="flex-1 text-sm">Order updates</Label>
              <Switch 
                id="sms-order-updates"
                checked={preferences.sms.orderUpdates}
                onCheckedChange={() => handleToggle('sms', 'orderUpdates')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-promotions" className="flex-1 text-sm">Promotions and sales</Label>
              <Switch 
                id="sms-promotions"
                checked={preferences.sms.promotions}
                onCheckedChange={() => handleToggle('sms', 'promotions')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-new-arrivals" className="flex-1 text-sm">New arrivals</Label>
              <Switch 
                id="sms-new-arrivals"
                checked={preferences.sms.newArrivals}
                onCheckedChange={() => handleToggle('sms', 'newArrivals')}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">WhatsApp Notifications</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="whatsapp-order-updates" className="flex-1 text-sm">Order updates</Label>
              <Switch 
                id="whatsapp-order-updates"
                checked={preferences.whatsapp.orderUpdates}
                onCheckedChange={() => handleToggle('whatsapp', 'orderUpdates')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="whatsapp-promotions" className="flex-1 text-sm">Promotions and sales</Label>
              <Switch 
                id="whatsapp-promotions"
                checked={preferences.whatsapp.promotions}
                onCheckedChange={() => handleToggle('whatsapp', 'promotions')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="whatsapp-new-arrivals" className="flex-1 text-sm">New arrivals</Label>
              <Switch 
                id="whatsapp-new-arrivals"
                checked={preferences.whatsapp.newArrivals}
                onCheckedChange={() => handleToggle('whatsapp', 'newArrivals')}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
