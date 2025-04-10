
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mail, MessageSquare, Phone, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface NotificationPreferencesState {
  email: {
    orderUpdates: boolean;
    promotions: boolean;
    priceDrops: boolean;
    backInStock: boolean;
    loyaltyUpdates: boolean;
  };
  sms: {
    orderUpdates: boolean;
    promotions: boolean;
  };
  whatsapp: {
    orderUpdates: boolean;
    promotions: boolean;
  };
  inApp: {
    orderUpdates: boolean;
    promotions: boolean;
    priceDrops: boolean;
    backInStock: boolean;
    loyaltyUpdates: boolean;
  };
}

const NotificationPreferences = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferencesState>({
    email: {
      orderUpdates: true,
      promotions: true,
      priceDrops: true,
      backInStock: true,
      loyaltyUpdates: true,
    },
    sms: {
      orderUpdates: false,
      promotions: false,
    },
    whatsapp: {
      orderUpdates: false,
      promotions: false,
    },
    inApp: {
      orderUpdates: true,
      promotions: true,
      priceDrops: true,
      backInStock: true,
      loyaltyUpdates: true,
    },
  });

  useEffect(() => {
    if (!user) return;

    // In a real app, you would fetch the user's notification preferences from the database
    const fetchPreferences = async () => {
      setLoading(true);
      try {
        // This is mock data - in production you would fetch from a database
        // const { data, error } = await supabase
        //   .from('notification_preferences')
        //   .select('*')
        //   .eq('user_id', user.id)
        //   .single();
        //
        // if (error) throw error;
        // if (data) setPreferences(data.preferences);

        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notification preferences:', error);
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [user]);

  const updatePreference = (
    channel: keyof NotificationPreferencesState,
    type: string,
    value: boolean
  ) => {
    setPreferences(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [type]: value,
      },
    }));
  };

  const savePreferences = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // In a real app, you would save the preferences to the database
      // const { error } = await supabase
      //   .from('notification_preferences')
      //   .upsert({
      //     user_id: user.id,
      //     preferences: preferences,
      //     updated_at: new Date()
      //   });
      //
      // if (error) throw error;

      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Notification preferences saved');
      setLoading(false);
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast.error('Failed to save preferences');
      setLoading(false);
    }
  };

  const PreferenceSection = ({
    title,
    icon,
    channel,
  }: {
    title: string;
    icon: React.ReactNode;
    channel: keyof NotificationPreferencesState;
  }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="grid gap-3">
        {Object.entries(preferences[channel]).map(([type, enabled]) => (
          <div key={`${channel}-${type}`} className="flex items-center justify-between">
            <Label htmlFor={`${channel}-${type}`} className="text-sm">
              {type === 'orderUpdates'
                ? 'Order Updates'
                : type === 'priceDrops'
                ? 'Price Drop Alerts'
                : type === 'backInStock'
                ? 'Back in Stock Alerts'
                : type === 'loyaltyUpdates'
                ? 'Loyalty Program Updates'
                : 'Promotions & Sales'}
            </Label>
            <Switch
              id={`${channel}-${type}`}
              checked={enabled}
              onCheckedChange={(value) => updatePreference(channel, type, value)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose how and when you'd like to be notified
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <PreferenceSection
          title="Email Notifications"
          icon={<Mail className="h-5 w-5" />}
          channel="email"
        />
        
        <PreferenceSection
          title="SMS Notifications"
          icon={<Phone className="h-5 w-5" />}
          channel="sms"
        />
        
        <PreferenceSection
          title="WhatsApp Notifications"
          icon={<MessageSquare className="h-5 w-5" />}
          channel="whatsapp"
        />
        
        <PreferenceSection
          title="In-App Notifications"
          icon={<Bell className="h-5 w-5" />}
          channel="inApp"
        />
        
        <Button 
          className="w-full mt-4" 
          onClick={savePreferences}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
