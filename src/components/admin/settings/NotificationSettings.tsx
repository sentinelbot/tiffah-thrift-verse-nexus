
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
  RefreshCw
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
                                onCheckedChange={() => toggleNotification(event.id, 'sms', 'customer')}
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
              <CardTitle>Notification Templates</CardTitle>
              <CardDescription>
                Edit templates for different notification types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="order-confirmation" className="border p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Order Confirmation</h3>
                      <p className="text-sm text-muted-foreground">Sent when a customer places a new order</p>
                    </div>
                    <AccordionTrigger className="py-0"></AccordionTrigger>
                  </div>
                  
                  <AccordionContent className="pt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="order-confirmation-subject">Email Subject</Label>
                          <Input 
                            id="order-confirmation-subject"
                            defaultValue="Your Tiffah Thrift Store order has been confirmed!" 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="template-status">Status</Label>
                          <Select defaultValue="active">
                            <SelectTrigger id="template-status">
                              <SelectValue placeholder="Template status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="disabled">Disabled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="order-confirmation-email">Email Template</Label>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                            <Select defaultValue="variables">
                              <SelectTrigger className="h-8 w-[130px]">
                                <SelectValue placeholder="Variables" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="variables">Variables</SelectItem>
                                <SelectItem value="customer">Customer</SelectItem>
                                <SelectItem value="order">Order</SelectItem>
                                <SelectItem value="store">Store</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="border rounded-md">
                          <div className="border-b bg-muted px-3 py-1.5 flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <Bold className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <Italic className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <Link className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <Image className="h-4 w-4" />
                            </Button>
                          </div>
                          <Textarea 
                            id="order-confirmation-email"
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                            rows={10}
                            defaultValue={`Dear {{customer.first_name}},

Thank you for your order from Tiffah Thrift Store! We're excited to confirm that your order #{{order.number}} has been received and is being processed.

Order Details:
{{#each order.items}}
- {{this.quantity}}x {{this.name}} - KSh {{this.price}}
{{/each}}

Subtotal: KSh {{order.subtotal}}
Shipping: KSh {{order.shipping_cost}}
Total: KSh {{order.total}}

You can track your order status at any time by visiting: {{order.tracking_url}}

If you have any questions about your order, please contact our customer service team at support@tiffahthrift.co.ke or call us at +254712345678.

Thank you for shopping with us!

Best regards,
The Tiffah Thrift Store Team`}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Use double curly braces for variables: {{'{{'}}variable{{'}}'}}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="order-confirmation-sms">SMS Template</Label>
                        <Textarea 
                          id="order-confirmation-sms"
                          rows={3}
                          className="resize-none"
                          defaultValue="Thank you for your order #{{order.number}} from Tiffah Thrift Store! Your order total is KSh {{order.total}}. Track your order at: {{order.short_url}}"
                        />
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Use double curly braces for variables</span>
                          <span>Characters: 156/160</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">
                          Reset to Default
                        </Button>
                        <Button>
                          Save Template
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="shipping-update" className="border p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Shipping Update</h3>
                      <p className="text-sm text-muted-foreground">Sent when an order's shipping status changes</p>
                    </div>
                    <AccordionTrigger className="py-0"></AccordionTrigger>
                  </div>
                  
                  <AccordionContent className="pt-4">
                    <div className="flex items-center justify-center py-6">
                      <div className="text-center">
                        <p className="text-muted-foreground">Edit shipping update template</p>
                        <Button className="mt-4">
                          Edit Template
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="delivery-confirmation" className="border p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Delivery Confirmation</h3>
                      <p className="text-sm text-muted-foreground">Sent when an order is successfully delivered</p>
                    </div>
                    <AccordionTrigger className="py-0"></AccordionTrigger>
                  </div>
                  
                  <AccordionContent className="pt-4">
                    <div className="flex items-center justify-center py-6">
                      <div className="text-center">
                        <p className="text-muted-foreground">Edit delivery confirmation template</p>
                        <Button className="mt-4">
                          Edit Template
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="abandoned-cart" className="border p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Abandoned Cart Reminder</h3>
                      <p className="text-sm text-muted-foreground">Sent when a customer abandons their shopping cart</p>
                    </div>
                    <AccordionTrigger className="py-0"></AccordionTrigger>
                  </div>
                  
                  <AccordionContent className="pt-4">
                    <div className="flex items-center justify-center py-6">
                      <div className="text-center">
                        <p className="text-muted-foreground">Edit abandoned cart reminder template</p>
                        <Button className="mt-4">
                          Edit Template
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Staff Notification Preferences</CardTitle>
              <CardDescription>
                Configure notification settings for staff members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Role</TableHead>
                        <TableHead>Order Notifications</TableHead>
                        <TableHead>Inventory Alerts</TableHead>
                        <TableHead>Customer Issues</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Administrators</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select defaultValue="critical">
                            <SelectTrigger className="w-[160px]">
                              <SelectValue placeholder="Order notifications" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="critical">Critical Only</SelectItem>
                              <SelectItem value="summary">Daily Summary</SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select defaultValue="low-stock">
                            <SelectTrigger className="w-[160px]">
                              <SelectValue placeholder="Inventory alerts" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Changes</SelectItem>
                              <SelectItem value="low-stock">Low Stock Only</SelectItem>
                              <SelectItem value="summary">Weekly Summary</SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select defaultValue="all">
                            <SelectTrigger className="w-[160px]">
                              <SelectValue placeholder="Customer issues" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Issues</SelectItem>
                              <SelectItem value="high-priority">High Priority</SelectItem>
                              <SelectItem value="summary">Daily Summary</SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                            <span className="sr-only">Settings</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Product Managers</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select defaultValue="none">
                            <SelectTrigger className="w-[160px]">
                              <SelectValue placeholder="Order notifications" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="critical">Critical Only</SelectItem>
                              <SelectItem value="summary">Daily Summary</SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select defaultValue="all">
                            <SelectTrigger className="w-[160px]">
                              <SelectValue placeholder="Inventory alerts" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Changes</SelectItem>
                              <SelectItem value="low-stock">Low Stock Only</SelectItem>
                              <SelectItem value="summary">Weekly Summary</SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select defaultValue="product-related">
                            <SelectTrigger className="w-[160px]">
                              <SelectValue placeholder="Customer issues" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Issues</SelectItem>
                              <SelectItem value="product-related">Product Related</SelectItem>
                              <SelectItem value="summary">Daily Summary</SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                            <span className="sr-only">Settings</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Order Preparers</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select defaultValue="all">
                            <SelectTrigger className="w-[160px]">
                              <SelectValue placeholder="Order notifications" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="critical">Critical Only</SelectItem>
                              <SelectItem value="summary">Daily Summary</SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select defaultValue="summary">
                            <SelectTrigger className="w-[160px]">
                              <SelectValue placeholder="Inventory alerts" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Changes</SelectItem>
                              <SelectItem value="low-stock">Low Stock Only</SelectItem>
                              <SelectItem value="summary">Daily Summary</SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select defaultValue="order-related">
                            <SelectTrigger className="w-[160px]">
                              <SelectValue placeholder="Customer issues" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Issues</SelectItem>
                              <SelectItem value="order-related">Order Related</SelectItem>
                              <SelectItem value="summary">Daily Summary</SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                            <span className="sr-only">Settings</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Delivery Staff</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select defaultValue="ready-for-delivery">
                            <SelectTrigger className="w-[160px]">
                              <SelectValue placeholder="Order notifications" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="ready-for-delivery">Ready for Delivery</SelectItem>
                              <SelectItem value="summary">Daily Summary</SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select defaultValue="none">
                            <SelectTrigger className="w-[160px]">
                              <SelectValue placeholder="Inventory alerts" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Changes</SelectItem>
                              <SelectItem value="low-stock">Low Stock Only</SelectItem>
                              <SelectItem value="summary">Weekly Summary</SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select defaultValue="delivery-related">
                            <SelectTrigger className="w-[160px]">
                              <SelectValue placeholder="Customer issues" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Issues</SelectItem>
                              <SelectItem value="delivery-related">Delivery Related</SelectItem>
                              <SelectItem value="summary">Daily Summary</SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                            <span className="sr-only">Settings</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="override-individual">Allow Individual Overrides</Label>
                    <p className="text-xs text-muted-foreground">
                      Let staff members override role-based notification settings
                    </p>
                  </div>
                  <Switch id="override-individual" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button>
                Save Staff Notification Preferences
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Customer Notification Preferences</CardTitle>
              <CardDescription>
                Default settings for customer notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="order-updates">Order Updates</Label>
                    <p className="text-xs text-muted-foreground">
                      Notifications about order status changes
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button 
                      size="sm" 
                      variant={true ? "default" : "outline"}
                      className="rounded-full h-8 px-3"
                    >
                      <Mail className="mr-1 h-3.5 w-3.5" />
                      Email
                    </Button>
                    <Button 
                      size="sm" 
                      variant={true ? "default" : "outline"}
                      className="rounded-full h-8 px-3"
                    >
                      <MessageSquare className="mr-1 h-3.5 w-3.5" />
                      SMS
                    </Button>
                    <Button 
                      size="sm" 
                      variant={true ? "default" : "outline"}
                      className="rounded-full h-8 px-3"
                    >
                      <Bell className="mr-1 h-3.5 w-3.5" />
                      In-App
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="promotional-content">Promotional Content</Label>
                    <p className="text-xs text-muted-foreground">
                      Marketing messages and special offers
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button 
                      size="sm" 
                      variant={true ? "default" : "outline"}
                      className="rounded-full h-8 px-3"
                    >
                      <Mail className="mr-1 h-3.5 w-3.5" />
                      Email
                    </Button>
                    <Button 
                      size="sm" 
                      variant={false ? "default" : "outline"}
                      className="rounded-full h-8 px-3"
                    >
                      <MessageSquare className="mr-1 h-3.5 w-3.5" />
                      SMS
                    </Button>
                    <Button 
                      size="sm" 
                      variant={true ? "default" : "outline"}
                      className="rounded-full h-8 px-3"
                    >
                      <Bell className="mr-1 h-3.5 w-3.5" />
                      In-App
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="back-in-stock">Back in Stock</Label>
                    <p className="text-xs text-muted-foreground">
                      Notifications when wishlist items are restocked
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button 
                      size="sm" 
                      variant={true ? "default" : "outline"}
                      className="rounded-full h-8 px-3"
                    >
                      <Mail className="mr-1 h-3.5 w-3.5" />
                      Email
                    </Button>
                    <Button 
                      size="sm" 
                      variant={false ? "default" : "outline"}
                      className="rounded-full h-8 px-3"
                    >
                      <MessageSquare className="mr-1 h-3.5 w-3.5" />
                      SMS
                    </Button>
                    <Button 
                      size="sm" 
                      variant={true ? "default" : "outline"}
                      className="rounded-full h-8 px-3"
                    >
                      <Bell className="mr-1 h-3.5 w-3.5" />
                      In-App
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="account-updates">Account Updates</Label>
                    <p className="text-xs text-muted-foreground">
                      Information about account changes and security
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button 
                      size="sm" 
                      variant={true ? "default" : "outline"}
                      className="rounded-full h-8 px-3"
                    >
                      <Mail className="mr-1 h-3.5 w-3.5" />
                      Email
                    </Button>
                    <Button 
                      size="sm" 
                      variant={true ? "default" : "outline"}
                      className="rounded-full h-8 px-3"
                    >
                      <MessageSquare className="mr-1 h-3.5 w-3.5" />
                      SMS
                    </Button>
                    <Button 
                      size="sm" 
                      variant={true ? "default" : "outline"}
                      className="rounded-full h-8 px-3"
                    >
                      <Bell className="mr-1 h-3.5 w-3.5" />
                      In-App
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allow-customer-opt-out">Allow Customer Opt-Out</Label>
                    <p className="text-xs text-muted-foreground">
                      Let customers choose which notifications they receive
                    </p>
                  </div>
                  <Switch id="allow-customer-opt-out" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="one-click-unsubscribe">One-Click Unsubscribe</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow customers to unsubscribe with a single click
                    </p>
                  </div>
                  <Switch id="one-click-unsubscribe" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="consolidated-emails">Consolidate Daily Emails</Label>
                    <p className="text-xs text-muted-foreground">
                      Combine multiple notifications into a single daily email
                    </p>
                  </div>
                  <Switch id="consolidated-emails" defaultChecked={false} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button>
                Save Customer Notification Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Components for the icon buttons
const Bold = ({ className }: { className?: string }) => (
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
    <path d="M14 12a4 4 0 0 0 0-8H6v8" />
    <path d="M15 20a4 4 0 0 0 0-8H6v8Z" />
  </svg>
);

const Italic = ({ className }: { className?: string }) => (
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
    <path d="M19 4h-9" />
    <path d="M14 20H5" />
    <path d="M15 4 9 20" />
  </svg>
);

const Link = ({ className }: { className?: string }) => (
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
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const Image = ({ className }: { className?: string }) => (
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
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="m21 15-5-5L5 21" />
  </svg>
);

const Truck = ({ className }: { className?: string }) => (
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
    <path d="M10 17h4V5H2v12h3" />
    <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
    <path d="M14 17h1" />
    <circle cx="7.5" cy="17.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </svg>
);

const ShoppingBag = ({ className }: { className?: string }) => (
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
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

export default NotificationSettings;
