
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Mail, MessageSquare, BarChart, Users, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sendPromotionalNotification } from '@/services/notificationService';

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  audience: string;
  channel: string;
  scheduledDate?: Date;
  content: string;
  subject?: string;
  statistics?: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  };
}

const mockCampaigns: Campaign[] = [
  {
    id: 'camp1',
    name: 'Summer Collection Launch',
    type: 'product_announcement',
    status: 'active',
    audience: 'all_customers',
    channel: 'email',
    scheduledDate: new Date('2025-04-10'),
    subject: 'New Summer Collection Has Arrived!',
    content: 'Check out our latest summer collection with pieces perfect for the season!',
    statistics: {
      sent: 1250,
      opened: 875,
      clicked: 320,
      converted: 48,
    },
  },
  {
    id: 'camp2',
    name: 'Easter Sale',
    type: 'promotion',
    status: 'scheduled',
    audience: 'repeat_customers',
    channel: 'email_sms',
    scheduledDate: new Date('2025-04-15'),
    subject: 'Exclusive: 30% Off Easter Weekend Sale',
    content: 'Enjoy 30% off all items this Easter weekend. Use code EASTER30 at checkout.',
  },
  {
    id: 'camp3',
    name: 'Abandoned Cart Recovery',
    type: 'abandoned_cart',
    status: 'completed',
    audience: 'cart_abandoners',
    channel: 'email',
    scheduledDate: new Date('2025-04-01'),
    subject: 'Don\'t Miss Out: Items Still in Your Cart',
    content: 'You left some great items in your cart. Complete your purchase before they\'re gone!',
    statistics: {
      sent: 387,
      opened: 210,
      clicked: 105,
      converted: 32,
    },
  },
];

const MarketingCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({
    name: '',
    type: 'promotion',
    audience: 'all_customers',
    channel: 'email',
    subject: '',
    content: '',
  });
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCampaign = async () => {
    if (!newCampaign.name || !newCampaign.subject || !newCampaign.content || !date) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsCreating(true);
    try {
      // In a real app, you would save the campaign to the database
      // const { data, error } = await supabase
      //   .from('marketing_campaigns')
      //   .insert([
      //     {
      //       ...newCampaign,
      //       status: 'scheduled',
      //       scheduled_date: date.toISOString()
      //     }
      //   ])
      //   .select();
      //
      // if (error) throw error;

      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo: create a new campaign and add it to state
      const newId = `camp${campaigns.length + 1}`;
      setCampaigns([
        {
          id: newId,
          name: newCampaign.name!,
          type: newCampaign.type!,
          status: 'scheduled',
          audience: newCampaign.audience!,
          channel: newCampaign.channel!,
          scheduledDate: date,
          subject: newCampaign.subject,
          content: newCampaign.content!,
        },
        ...campaigns,
      ]);

      // Reset form
      setNewCampaign({
        name: '',
        type: 'promotion',
        audience: 'all_customers',
        channel: 'email',
        subject: '',
        content: '',
      });
      setDate(undefined);
      
      toast.success('Campaign created successfully');
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendTestCampaign = async () => {
    if (!newCampaign.subject || !newCampaign.content) {
      toast.error('Please add content before sending a test');
      return;
    }

    try {
      // In a real app, you would send a test notification to yourself
      toast.success('Test sent to your email');
    } catch (error) {
      console.error('Error sending test:', error);
      toast.error('Failed to send test');
    }
  };

  const getStatusBadgeClass = (status: Campaign['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-400';
      case 'scheduled':
        return 'bg-blue-400';
      case 'active':
        return 'bg-green-400';
      case 'completed':
        return 'bg-purple-400';
      default:
        return 'bg-gray-400';
    }
  };

  const formatAudience = (audience: string) => {
    return audience
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Tabs defaultValue="all">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="all">All Campaigns</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="all" className="space-y-4">
        <div className="grid gap-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{campaign.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <span className={`inline-block w-2 h-2 rounded-full ${getStatusBadgeClass(campaign.status)}`} />
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </CardDescription>
                  </div>
                  {campaign.scheduledDate && (
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(campaign.scheduledDate), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Channel: </span>
                    <span>{campaign.channel === 'email_sms' ? 'Email + SMS' : campaign.channel}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Audience: </span>
                    <span>{formatAudience(campaign.audience)}</span>
                  </div>
                </div>
                {campaign.subject && (
                  <p className="text-sm font-medium mt-3">{campaign.subject}</p>
                )}
                <p className="text-sm text-muted-foreground mt-1">{campaign.content}</p>
              </CardContent>
              {campaign.statistics && (
                <CardFooter className="pt-0">
                  <div className="w-full grid grid-cols-4 gap-2 mt-2 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Sent</p>
                      <p className="text-sm font-medium">{campaign.statistics.sent}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Opened</p>
                      <p className="text-sm font-medium">
                        {((campaign.statistics.opened / campaign.statistics.sent) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Clicked</p>
                      <p className="text-sm font-medium">
                        {((campaign.statistics.clicked / campaign.statistics.sent) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Converted</p>
                      <p className="text-sm font-medium">
                        {((campaign.statistics.converted / campaign.statistics.sent) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="active">
        <div className="grid gap-4">
          {campaigns
            .filter(campaign => campaign.status === 'active')
            .map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <CardTitle>{campaign.name}</CardTitle>
                </CardHeader>
                <CardContent>{campaign.content}</CardContent>
              </Card>
            ))}
        </div>
      </TabsContent>

      <TabsContent value="scheduled">
        <div className="grid gap-4">
          {campaigns
            .filter(campaign => campaign.status === 'scheduled')
            .map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <CardTitle>{campaign.name}</CardTitle>
                </CardHeader>
                <CardContent>{campaign.content}</CardContent>
              </Card>
            ))}
        </div>
      </TabsContent>

      <TabsContent value="create">
        <Card>
          <CardHeader>
            <CardTitle>Create New Campaign</CardTitle>
            <CardDescription>
              Set up a new marketing campaign to engage with your customers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  placeholder="e.g., Summer Sale 2025"
                  value={newCampaign.name}
                  onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaign-type">Campaign Type</Label>
                <Select
                  value={newCampaign.type}
                  onValueChange={value => setNewCampaign({ ...newCampaign, type: value })}
                >
                  <SelectTrigger id="campaign-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="promotion">Promotion</SelectItem>
                    <SelectItem value="product_announcement">Product Announcement</SelectItem>
                    <SelectItem value="abandoned_cart">Abandoned Cart</SelectItem>
                    <SelectItem value="loyalty_program">Loyalty Program</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaign-audience">Target Audience</Label>
                <Select
                  value={newCampaign.audience}
                  onValueChange={value => setNewCampaign({ ...newCampaign, audience: value })}
                >
                  <SelectTrigger id="campaign-audience">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_customers">All Customers</SelectItem>
                    <SelectItem value="new_customers">New Customers</SelectItem>
                    <SelectItem value="repeat_customers">Repeat Customers</SelectItem>
                    <SelectItem value="cart_abandoners">Cart Abandoners</SelectItem>
                    <SelectItem value="high_value">High Value Customers</SelectItem>
                    <SelectItem value="inactive">Inactive Customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaign-channel">Channel</Label>
                <Select
                  value={newCampaign.channel}
                  onValueChange={value => setNewCampaign({ ...newCampaign, channel: value })}
                >
                  <SelectTrigger id="campaign-channel">
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="email_sms">Email + SMS</SelectItem>
                    <SelectItem value="all">All Channels</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-subject">Subject Line</Label>
                <Input
                  id="campaign-subject"
                  placeholder="Enter subject line"
                  value={newCampaign.subject}
                  onChange={e => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Schedule Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaign-content">Campaign Content</Label>
              <Textarea
                id="campaign-content"
                placeholder="Enter your campaign message here..."
                rows={6}
                value={newCampaign.content}
                onChange={e => setNewCampaign({ ...newCampaign, content: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleSendTestCampaign}>
              Send Test
            </Button>
            <Button 
              onClick={handleCreateCampaign} 
              disabled={isCreating}
              className="gap-1"
            >
              {isCreating ? (
                <>Creating...</>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Create Campaign
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default MarketingCampaigns;
