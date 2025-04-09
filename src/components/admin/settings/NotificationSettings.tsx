
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Mail, 
  MessageSquare, 
  Bell, 
  Send, 
  CheckCircle2, 
  AlarmClock, 
  Clock,
  Users,
  Settings,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  Copy,
  Edit,
  RefreshCw,
  Package
} from 'lucide-react';
import { toast } from 'sonner';

// Notification event types for configuration
const notificationEvents = [
  { id: 'order_placed', name: 'Order Placed', description: 'When a customer places a new order' },
  { id: 'order_payment_confirmed', name: 'Payment Confirmed', description: 'When a payment is successfully processed' },
  { id: 'order_status_change', name: 'Order Status Change', description: 'When an order status is updated' },
  { id: 'shipping_update', name: 'Shipping Update', description: 'When shipping information is updated' },
  { id: 'delivery_confirmation', name: 'Delivery Confirmation', description: 'When an order is successfully delivered' },
  { id: 'low_stock', name: 'Low Stock Alert', description: 'When a product reaches low stock threshold' },
  { id: 'price_change', name: 'Price Change', description: 'When a product price is changed' },
  { id: 'new_account', name: 'New Customer Account', description: 'When a new customer creates an account' },
  { id: 'back_in_stock', name: 'Back In Stock', description: 'When an out-of-stock product is restocked' },
  { id: 'abandoned_cart', name: 'Abandoned Cart', description: 'When a customer abandons their shopping cart' }
];

const NotificationSettings = () => {
  const [activeTab, setActiveTab] = useState('channels');
  const [emailSettings, setEmailSettings] = useState({
    enabled: true,
    fromName: 'Tiffah Thrift Store',
    fromEmail: 'notifications@tiffahthrift.co.ke',
    replyTo: 'support@tiffahthrift.co.ke',
    smtpHost: 'smtp.example.com',
    smtpPort: '587',
    smtpUsername: 'smtp_username',
    smtpPassword: '••••••••••••',
    encryption: 'tls'
  });
  
  const [smsSettings, setSmsSettings] = useState({
    enabled: true,
    provider: 'africas_talking',
    apiKey: '••••••••••••••••••••••••',
    senderId: 'TIFFAH',
    accountSid: '',
    authToken: ''
  });
  
  const [eventNotifications, setEventNotifications] = useState(
    notificationEvents.reduce((acc, event) => {
      acc[event.id] = {
        email: {
          customer: true,
          admin: true,
          staff: event.id === 'order_placed' || event.id === 'low_stock'
        },
        sms: {
          customer: event.id === 'shipping_update' || event.id === 'delivery_confirmation',
          admin: event.id === 'order_placed',
          staff: false
        },
        inApp: {
          customer: true,
          admin: true,
          staff: event.id === 'order_placed' || event.id === 'low_stock'
        }
      };
      return acc;
    }, {} as Record<string, any>)
  );
  
  const handleSaveEmailSettings = () => {
    toast.loading('Saving email settings...');
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Email settings saved successfully');
    }, 1500);
  };
  
  const handleSaveSmsSettings = () => {
    toast.loading('Saving SMS settings...');
    
    // Simulate API call
    setTimeout(() => {
      toast.success('SMS settings saved successfully');
    }, 1500);
  };
  
  const handleTestEmailConnection = () => {
    toast.loading('Testing email connection...');
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Email connection successful! Test email sent to admin.');
    }, 2000);
  };
  
  const handleTestSmsConnection = () => {
    toast.loading('Testing SMS connection...');
    
    // Simulate API call
    setTimeout(() => {
      toast.success('SMS connection successful! Test SMS sent to admin.');
    }, 2000);
  };
  
  const toggleNotification = (eventId: string, channel: string, recipient: string) => {
    setEventNotifications({
      ...eventNotifications,
      [eventId]: {
        ...eventNotifications[eventId],
        [channel]: {
          ...eventNotifications[eventId][channel],
          [recipient]: !eventNotifications[eventId][channel][recipient]
        }
      }
    });
  };
  
  const handleSaveEventSettings = () => {
    toast.loading('Saving notification settings...');
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Notification settings saved successfully');
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="channels">Notification Channels</TabsTrigger>
          <TabsTrigger value="events">Event Configuration</TabsTrigger>
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
          <TabsTrigger value="preferences">User Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <CardTitle>Email Notifications</CardTitle>
              </div>
              <CardDescription>
                Configure email delivery settings and sender information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  <Label htmlFor="email-enabled" className="text-sm font-medium">Email Notifications</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm mr-2">
                    {emailSettings.enabled ? 'Enabled' : 'Disabled'}
                  </Label>
                  <Switch 
                    id="email-enabled"
                    checked={emailSettings.enabled}
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, enabled: checked})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="from-name">Sender Name</Label>
                    <Input 
                      id="from-name"
                      placeholder="e.g., Tiffah Thrift Store" 
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                      disabled={!emailSettings.enabled}
                    />
                    <p className="text-xs text-muted-foreground">
                      Name that will appear in the 'From' field
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="from-email">Sender Email</Label>
                    <Input 
                      id="from-email"
                      type="email" 
                      placeholder="e.g., notifications@yourstore.com" 
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                      disabled={!emailSettings.enabled}
                    />
                    <p className="text-xs text-muted-foreground">
                      Email address that will be used to send notifications
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reply-to">Reply-To Email</Label>
                    <Input 
                      id="reply-to"
                      type="email" 
                      placeholder="e.g., support@yourstore.com" 
                      value={emailSettings.replyTo}
                      onChange={(e) => setEmailSettings({...emailSettings, replyTo: e.target.value})}
                      disabled={!emailSettings.enabled}
                    />
                    <p className="text-xs text-muted-foreground">
                      Email address for customers to reply to
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input 
                      id="smtp-host"
                      placeholder="e.g., smtp.example.com" 
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                      disabled={!emailSettings.enabled}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">SMTP Port</Label>
                      <Input 
                        id="smtp-port"
                        placeholder="e.g., 587" 
                        value={emailSettings.smtpPort}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                        disabled={!emailSettings.enabled}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtp-encryption">Encryption</Label>
                      <Select 
                        value={emailSettings.encryption}
                        onValueChange={(value) => setEmailSettings({...emailSettings, encryption: value})}
                        disabled={!emailSettings.enabled}
                      >
                        <SelectTrigger id="smtp-encryption">
                          <SelectValue placeholder="Select encryption" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tls">TLS</SelectItem>
                          <SelectItem value="ssl">SSL</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtp-username">SMTP Username</Label>
                    <Input 
                      id="smtp-username"
                      placeholder="e.g., username@example.com" 
                      value={emailSettings.smtpUsername}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                      disabled={!emailSettings.enabled}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">SMTP Password</Label>
                    <div className="relative">
                      <Input 
                        id="smtp-password"
                        type="password" 
                        value={emailSettings.smtpPassword}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                        disabled={!emailSettings.enabled}
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-0 top-0 h-full"
                        disabled={!emailSettings.enabled}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex flex-wrap gap-2 justify-between">
              <Button 
                variant="outline" 
                onClick={handleTestEmailConnection}
                disabled={!emailSettings.enabled}
              >
                <Send className="mr-2 h-4 w-4" />
                Test Connection
              </Button>
              <Button 
                onClick={handleSaveEmailSettings}
                disabled={!emailSettings.enabled}
              >
                Save Email Settings
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <CardTitle>SMS Notifications</CardTitle>
              </div>
              <CardDescription>
                Configure SMS delivery settings using Africa's Talking or Twilio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  <Label htmlFor="sms-enabled" className="text-sm font-medium">SMS Notifications</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm mr-2">
                    {smsSettings.enabled ? 'Enabled' : 'Disabled'}
                  </Label>
                  <Switch 
                    id="sms-enabled"
                    checked={smsSettings.enabled}
                    onCheckedChange={(checked) => setSmsSettings({...smsSettings, enabled: checked})}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sms-provider">SMS Provider</Label>
                  <Select 
                    value={smsSettings.provider}
                    onValueChange={(value) => setSmsSettings({...smsSettings, provider: value})}
                    disabled={!smsSettings.enabled}
                  >
                    <SelectTrigger id="sms-provider">
                      <SelectValue placeholder="Select SMS provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="africas_talking">Africa's Talking</SelectItem>
                      <SelectItem value="twilio">Twilio</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Service used to send SMS notifications
                  </p>
                </div>
                
                {smsSettings.provider === 'africas_talking' ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <div className="relative">
                        <Input 
                          id="api-key"
                          type="password" 
                          value={smsSettings.apiKey}
                          onChange={(e) => setSmsSettings({...smsSettings, apiKey: e.target.value})}
                          disabled={!smsSettings.enabled}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-0 top-0 h-full"
                          disabled={!smsSettings.enabled}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sender-id">Sender ID</Label>
                      <Input 
                        id="sender-id"
                        placeholder="e.g., TIFFAH" 
                        value={smsSettings.senderId}
                        onChange={(e) => setSmsSettings({...smsSettings, senderId: e.target.value})}
                        disabled={!smsSettings.enabled}
                      />
                      <p className="text-xs text-muted-foreground">
                        Sender ID that appears on recipient's phone
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="account-sid">Account SID</Label>
                      <Input 
                        id="account-sid"
                        placeholder="e.g., ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
                        value={smsSettings.accountSid}
                        onChange={(e) => setSmsSettings({...smsSettings, accountSid: e.target.value})}
                        disabled={!smsSettings.enabled}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="auth-token">Auth Token</Label>
                      <div className="relative">
                        <Input 
                          id="auth-token"
                          type="password" 
                          value={smsSettings.authToken}
                          onChange={(e) => setSmsSettings({...smsSettings, authToken: e.target.value})}
                          disabled={!smsSettings.enabled}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-0 top-0 h-full"
                          disabled={!smsSettings.enabled}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="sms-character-limit">Character Limit</Label>
                  <Select defaultValue="160" disabled={!smsSettings.enabled}>
                    <SelectTrigger id="sms-character-limit">
                      <SelectValue placeholder="Select character limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="160">160 characters (standard SMS)</SelectItem>
                      <SelectItem value="320">320 characters (concatenated)</SelectItem>
                      <SelectItem value="480">480 characters (3 SMS)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Maximum characters per SMS message
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex flex-wrap gap-2 justify-between">
              <Button 
                variant="outline" 
                onClick={handleTestSmsConnection}
                disabled={!smsSettings.enabled}
              >
                <Send className="mr-2 h-4 w-4" />
                Test Connection
              </Button>
              <Button 
                onClick={handleSaveSmsSettings}
                disabled={!smsSettings.enabled}
              >
                Save SMS Settings
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>In-App Notifications</CardTitle>
              </div>
              <CardDescription>
                Configure notification appearance and behavior within the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-notifications">Enable In-App Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Show notifications within the admin dashboard
                    </p>
                  </div>
                  <Switch id="enable-notifications" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notification-position">Notification Position</Label>
                  <Select defaultValue="top-right">
                    <SelectTrigger id="notification-position">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="top-left">Top Left</SelectItem>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notification-duration">Notification Duration (seconds)</Label>
                  <Input 
                    id="notification-duration"
                    type="number" 
                    defaultValue="5"
                    min="1"
                    max="30"
                  />
                  <p className="text-xs text-muted-foreground">
                    How long notifications stay on screen before auto-dismissing
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-notifications">Maximum Visible Notifications</Label>
                  <Input 
                    id="max-notifications"
                    type="number" 
                    defaultValue="3"
                    min="1"
                    max="10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of notifications shown at once
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notification-sound">Notification Sound</Label>
                  <Select defaultValue="ping">
                    <SelectTrigger id="notification-sound">
                      <SelectValue placeholder="Select sound" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ping">Ping</SelectItem>
                      <SelectItem value="bell">Bell</SelectItem>
                      <SelectItem value="chime">Chime</SelectItem>
                      <SelectItem value="none">No Sound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="group-notifications">Group Similar Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Combine multiple notifications of the same type
                    </p>
                  </div>
                  <Switch id="group-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="desktop-notifications">Enable Desktop Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Show browser notifications when tab is not focused
                    </p>
                  </div>
                  <Switch id="desktop-notifications" defaultChecked={false} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button>
                Save In-App Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event-Based Notifications</CardTitle>
              <CardDescription>
                Configure which notifications are sent for specific events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[260px]">Event</TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>Email</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>SMS</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Bell className="h-4 w-4" />
                          <span>In-App</span>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notificationEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{event.name}</p>
                            <p className="text-xs text-muted-foreground">{event.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2 items-center">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`email-customer-${event.id}`} className="text-xs text-muted-foreground">Customer</Label>
                              <Switch 
                                id={`email-customer-${event.id}`}
                                checked={eventNotifications[event.id]?.email?.customer}
                                onCheckedChange={() => toggleNotification(event.id, 'email', 'customer')}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`email-admin-${event.id}`} className="text-xs text-muted-foreground">Admin</Label>
                              <Switch 
                                id={`email-admin-${event.id}`}
                                checked={eventNotifications[event.id]?.email?.admin}
                                onCheckedChange={() => toggleNotification(event.id, 'email', 'admin')}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`email-staff-${event.id}`} className="text-xs text-muted-foreground">Staff</Label>
                              <Switch 
                                id={`email-staff-${event.id}`}
                                checked={eventNotifications[event.id]?.email?.staff}
                                onCheckedChange={() => toggleNotification(event.id, 'email', 'staff')}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2 items-center">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`sms-customer-${event.id}`} className="text-xs text-muted-foreground">Customer</Label>
                              <Switch 
                                id={`sms-customer-${event.id}`}
                                checked={eventNotifications[event.id]?.sms?.customer}
                                onCheckedChange={() => toggleNotification(event.id, 'sms', 'customer')}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`sms-admin-${event.id}`} className="text-xs text-muted-foreground">Admin</Label>
                              <Switch 
                                id={`sms-admin-${event.id}`}
                                checked={eventNotifications[event.id]?.sms?.admin}
                                onCheckedChange={() => toggleNotification(event.id, 'sms', 'admin')}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`sms-staff-${event.id}`} className="text-xs text-muted-foreground">Staff</Label>
                              <Switch 
                                id={`sms-staff-${event.id}`}
                                checked={eventNotifications[event.id]?.sms?.staff}
                                onCheckedChange={() => toggleNotification(event.id, 'sms', 'staff')}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2 items-center">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`inapp-customer-${event.id}`} className="text-xs text-muted-foreground">Customer</Label>
                              <Switch 
                                id={`inapp-customer-${event.id}`}
                                checked={eventNotifications[event.id]?.inApp?.customer}
                                onCheckedChange={() => toggleNotification(event.id, 'inApp', 'customer')}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`inapp-admin-${event.id}`} className="text-xs text-muted-foreground">Admin</Label>
                              <Switch 
                                id={`inapp-admin-${event.id}`}
                                checked={eventNotifications[event.id]?.inApp?.admin}
                                onCheckedChange={() => toggleNotification(event.id, 'inApp', 'admin')}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`inapp-staff-${event.id}`} className="text-xs text-muted-foreground">Staff</Label>
                              <Switch 
                                id={`inapp-staff-${event.id}`}
                                checked={eventNotifications[event.id]?.inApp?.staff}
                                onCheckedChange={() => toggleNotification(event.id, 'inApp', 'staff')}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button onClick={handleSaveEventSettings}>
                Save Event Settings
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Scheduling</CardTitle>
              <CardDescription>
                Configure when notifications are sent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-2">
                      <AlarmClock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Order Status Updates</p>
                        <p className="text-xs text-muted-foreground">When order status notifications are sent</p>
                      </div>
                    </div>
                    <Select defaultValue="immediately">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select timing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediately">Immediately</SelectItem>
                        <SelectItem value="batched">Batched (hourly)</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Abandoned Cart Reminders</p>
                        <p className="text-xs text-muted-foreground">When cart reminder emails are sent</p>
                      </div>
                    </div>
                    <Select defaultValue="4hours">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select timing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1hour">After 1 hour</SelectItem>
                        <SelectItem value="4hours">After 4 hours</SelectItem>
                        <SelectItem value="24hours">After 24 hours</SelectItem>
                        <SelectItem value="custom">Custom timing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Marketing Notifications</p>
                        <p className="text-xs text-muted-foreground">When promotional emails are sent</p>
                      </div>
                    </div>
                    <Select defaultValue="business-hours">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select timing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any-time">Any time</SelectItem>
                        <SelectItem value="business-hours">Business hours only</SelectItem>
                        <SelectItem value="scheduled">Scheduled time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="quiet-hours-start">Quiet Hours Start</Label>
                    <Input 
                      id="quiet-hours-start"
                      type="time" 
                      defaultValue="22:00"
                    />
                    <p className="text-xs text-muted-foreground">
                      When to stop sending non-critical notifications
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quiet-hours-end">Quiet Hours End</Label>
                    <Input 
                      id="quiet-hours-end"
                      type="time" 
                      defaultValue="08:00"
                    />
                    <p className="text-xs text-muted-foreground">
                      When to resume sending notifications
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="respect-timezone">Respect Customer Timezone</Label>
                      <p className="text-xs text-muted-foreground">
                        Apply quiet hours based on recipient's timezone
                      </p>
                    </div>
                    <Switch id="respect-timezone" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="business-hours-only">Send During Business Hours Only</Label>
                      <p className="text-xs text-muted-foreground">
                        Only send marketing emails during business hours
                      </p>
                    </div>
                    <Switch id="business-hours-only" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button>
                Save Scheduling Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
              <CardDescription>
                Configure templates for different notification types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">
                Template editor coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Notification Preferences</CardTitle>
              <CardDescription>
                Configure default notification preferences for users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">
                User preferences management coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationSettings;
