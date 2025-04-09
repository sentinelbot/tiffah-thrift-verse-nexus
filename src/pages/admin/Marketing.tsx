
import AdminLayout from '@/components/layout/AdminLayout';
import MarketingCampaigns from '@/components/marketing/MarketingCampaigns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, MessageSquare, Users, FileText, Calendar, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

const AbandonedCartStats = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Abandoned Cart Recovery</CardTitle>
      <CardDescription>Last 30 days performance</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-muted-foreground text-xs">Abandoned</p>
          <p className="text-2xl font-bold">245</p>
          <p className="text-xs text-muted-foreground">Carts</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Notified</p>
          <p className="text-2xl font-bold">189</p>
          <p className="text-xs text-muted-foreground">Customers</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Recovered</p>
          <p className="text-2xl font-bold">62</p>
          <p className="text-xs text-muted-foreground">Carts</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Recovery Rate</p>
          <p className="text-2xl font-bold">32.8%</p>
          <p className="text-xs text-muted-foreground">+5.2% vs prev</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const EmailStats = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Email Performance</CardTitle>
      <CardDescription>Last 30 days metrics</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-muted-foreground text-xs">Sent</p>
          <p className="text-2xl font-bold">5,827</p>
          <p className="text-xs text-muted-foreground">Emails</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Open Rate</p>
          <p className="text-2xl font-bold">34.2%</p>
          <p className="text-xs text-muted-foreground">+2.1% vs prev</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Click Rate</p>
          <p className="text-2xl font-bold">12.5%</p>
          <p className="text-xs text-muted-foreground">+1.8% vs prev</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Conversion</p>
          <p className="text-2xl font-bold">3.2%</p>
          <p className="text-xs text-muted-foreground">+0.3% vs prev</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const SMSStats = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">SMS Performance</CardTitle>
      <CardDescription>Last 30 days metrics</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-muted-foreground text-xs">Sent</p>
          <p className="text-2xl font-bold">1,243</p>
          <p className="text-xs text-muted-foreground">Messages</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Delivery Rate</p>
          <p className="text-2xl font-bold">98.7%</p>
          <p className="text-xs text-muted-foreground">+0.2% vs prev</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Click Rate</p>
          <p className="text-2xl font-bold">15.3%</p>
          <p className="text-xs text-muted-foreground">+2.5% vs prev</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Conversion</p>
          <p className="text-2xl font-bold">4.1%</p>
          <p className="text-xs text-muted-foreground">+0.8% vs prev</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const LoyaltyStats = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Loyalty Program</CardTitle>
      <CardDescription>Program statistics</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-muted-foreground text-xs">Total Members</p>
          <p className="text-2xl font-bold">1,458</p>
          <p className="text-xs text-muted-foreground">+124 this month</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Active Members</p>
          <p className="text-2xl font-bold">876</p>
          <p className="text-xs text-muted-foreground">60.1% active rate</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Points Issued</p>
          <p className="text-2xl font-bold">45,892</p>
          <p className="text-xs text-muted-foreground">Last 30 days</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Points Redeemed</p>
          <p className="text-2xl font-bold">12,456</p>
          <p className="text-xs text-muted-foreground">27.1% redemption</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const CustomerSegments = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Customer Segments</CardTitle>
      <CardDescription>Active customer distribution</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>New Customers (0-30 days)</span>
            <span className="font-medium">326</span>
          </div>
          <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
            <div className="bg-primary h-full rounded-full" style={{ width: '18%' }} />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Active Repeat (31-90 days)</span>
            <span className="font-medium">542</span>
          </div>
          <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
            <div className="bg-primary h-full rounded-full" style={{ width: '30%' }} />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Loyal (91+ days, 3+ orders)</span>
            <span className="font-medium">684</span>
          </div>
          <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
            <div className="bg-primary h-full rounded-full" style={{ width: '38%' }} />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>At Risk (No purchase > 60 days)</span>
            <span className="font-medium">248</span>
          </div>
          <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
            <div className="bg-primary h-full rounded-full" style={{ width: '14%' }} />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const UpcomingCampaigns = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Upcoming Campaigns</CardTitle>
      <CardDescription>Next 7 days</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">Weekend Flash Sale</p>
              <p className="text-sm text-muted-foreground">Apr 12-14, 2025</p>
            </div>
          </div>
          <Button size="sm" variant="ghost">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">New Arrivals Announcement</p>
              <p className="text-sm text-muted-foreground">Apr 15, 2025</p>
            </div>
          </div>
          <Button size="sm" variant="ghost">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">Loyalty Members SMS</p>
              <p className="text-sm text-muted-foreground">Apr 16, 2025</p>
            </div>
          </div>
          <Button size="sm" variant="ghost">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Marketing = () => {
  const [processing, setProcessing] = useState(false);

  const handleProcessAbandonedCarts = async () => {
    setProcessing(true);
    // In a real app, you would call processAbandonedCarts() from notificationService
    await new Promise(resolve => setTimeout(resolve, 1500)); // Mock delay
    setProcessing(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Marketing & Notifications</h1>
          <p className="text-muted-foreground">
            Manage marketing campaigns, notifications, and customer engagement
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={handleProcessAbandonedCarts}
            disabled={processing}
            className="gap-1"
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Process Abandoned Carts
              </>
            )}
          </Button>
          
          <Button variant="outline" className="gap-1">
            <Users className="h-4 w-4" />
            Customer Segments
          </Button>
          
          <Button variant="outline" className="gap-1">
            <FileText className="h-4 w-4" />
            Email Templates
          </Button>
        </div>
        
        <Tabs defaultValue="campaigns">
          <TabsList>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="dashboard">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="campaigns" className="mt-6">
            <MarketingCampaigns />
          </TabsContent>
          
          <TabsContent value="dashboard" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <AbandonedCartStats />
                <EmailStats />
                <LoyaltyStats />
              </div>
              <div className="space-y-6">
                <SMSStats />
                <CustomerSegments />
                <UpcomingCampaigns />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Marketing;
