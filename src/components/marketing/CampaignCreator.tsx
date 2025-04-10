
import { useState } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Send } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CampaignCreatorProps {
  onCampaignCreated?: (campaign: any) => void;
}

const CampaignCreator = ({ onCampaignCreated }: CampaignCreatorProps) => {
  const [campaignName, setCampaignName] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [targetSegment, setTargetSegment] = useState('all_customers');
  const [channel, setChannel] = useState('email');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [isCreating, setIsCreating] = useState(false);
  
  const handleCreateCampaign = async () => {
    if (!campaignName || !subject || !content || !date) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setIsCreating(true);
    
    try {
      // In a real app, this would send data to the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const campaignData = {
        id: `camp-${Date.now()}`,
        name: campaignName,
        subject,
        content,
        targetSegment,
        channel,
        scheduledDate: date,
        discountCode: discountCode || undefined,
        discountAmount: discountAmount ? parseFloat(discountAmount) : undefined,
        discountType,
        status: 'scheduled',
        createdAt: new Date()
      };
      
      if (onCampaignCreated) {
        onCampaignCreated(campaignData);
      }
      
      // Reset form
      setCampaignName('');
      setSubject('');
      setContent('');
      setTargetSegment('all_customers');
      setChannel('email');
      setDate(undefined);
      setDiscountCode('');
      setDiscountAmount('');
      setDiscountType('percentage');
      
      toast.success('Campaign created successfully!');
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign');
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Campaign</CardTitle>
        <CardDescription>Design and schedule your marketing campaign</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="campaign-name">Campaign Name</Label>
            <Input
              id="campaign-name"
              placeholder="Summer Sale 2025"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="target-segment">Target Audience</Label>
            <Select value={targetSegment} onValueChange={setTargetSegment}>
              <SelectTrigger id="target-segment">
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_customers">All Customers</SelectItem>
                <SelectItem value="new_customers">New Customers ({"<"}30 days)</SelectItem>
                <SelectItem value="loyal_customers">Loyal Customers (2+ orders)</SelectItem>
                <SelectItem value="inactive_customers">Inactive Customers ({">"} 60 days)</SelectItem>
                <SelectItem value="high_value">High Value (Avg order {">"} 5000 KSh)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="campaign-subject">Email Subject</Label>
            <Input
              id="campaign-subject"
              placeholder="Don't miss our biggest sale of the year!"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="campaign-channel">Channel</Label>
            <Select value={channel} onValueChange={setChannel}>
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
            <Label>Scheduled Date</Label>
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
          
          <div className="space-y-2">
            <Label htmlFor="discount-code">Discount Code (Optional)</Label>
            <Input
              id="discount-code"
              placeholder="SUMMER25"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="discount-amount">Discount Amount (Optional)</Label>
            <div className="flex space-x-2">
              <Input
                id="discount-amount"
                type="number"
                placeholder="25"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                className="flex-1"
              />
              <Select value={discountType} onValueChange={setDiscountType}>
                <SelectTrigger className="w-[110px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">KSh (Fixed)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="campaign-content">Email Content</Label>
          <Textarea
            id="campaign-content"
            placeholder="Write your email content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Preview</Button>
        <Button 
          onClick={handleCreateCampaign} 
          disabled={isCreating}
        >
          <Send className="mr-2 h-4 w-4" />
          {isCreating ? "Creating..." : "Create Campaign"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CampaignCreator;
