
import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MarketingCampaigns from '@/components/marketing/MarketingCampaigns';
import { LineChart, BarChart, PieChart } from 'recharts';
import { 
  BadgeDollarSign, Users, Mail, MessageSquare, ShoppingBag, 
  TrendingUp, BarChart3, PieChart as PieChartIcon 
} from 'lucide-react';

// Mock data for charts
const campaignPerformanceData = [
  { name: 'Email', conversion: 4.3, engagement: 25, cost: 250 },
  { name: 'SMS', conversion: 3.1, engagement: 22, cost: 320 },
  { name: 'WhatsApp', conversion: 4.8, engagement: 30, cost: 280 },
  { name: 'Social', conversion: 5.2, engagement: 32, cost: 350 },
];

const channelPerformanceData = [
  { channel: 'Email', revenue: 15000 },
  { channel: 'SMS', revenue: 8000 },
  { channel: 'WhatsApp', revenue: 12000 },
  { channel: 'Social', revenue: 18000 },
];

const audienceSegmentData = [
  { name: 'New Customers', value: 30 },
  { name: 'Repeat Customers', value: 45 },
  { name: 'Inactive', value: 15 },
  { name: 'High Value', value: 10 },
];

const Marketing = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Marketing</h1>
          <p className="text-muted-foreground">
            Create and manage marketing campaigns, analyze performance
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campaign Conversion</CardTitle>
              <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2%</div>
              <p className="text-xs text-muted-foreground">+0.5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Audience Growth</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12.5%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Email Open Rate</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28.3%</div>
              <p className="text-xs text-muted-foreground">+3.7% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SMS Response Rate</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.1%</div>
              <p className="text-xs text-muted-foreground">-0.8% from last month</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="campaigns" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="campaigns" className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="audience" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Audience
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="campaigns">
            <MarketingCampaigns />
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Campaign Performance
                  </CardTitle>
                  <CardDescription>Conversion rate, engagement and cost by channel</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <p className="text-center text-muted-foreground py-8">
                    Chart would appear here showing campaign performance metrics
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Revenue by Channel
                  </CardTitle>
                  <CardDescription>Revenue generated by marketing channel</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <p className="text-center text-muted-foreground py-8">
                    Chart would appear here showing revenue by channel
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="audience">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Audience Segments
                  </CardTitle>
                  <CardDescription>Distribution of customer segments</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <p className="text-center text-muted-foreground py-8">
                    Chart would appear here showing audience segments
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Purchase Behavior
                  </CardTitle>
                  <CardDescription>Customer purchase patterns over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <p className="text-center text-muted-foreground py-8">
                    Chart would appear here showing purchase behavior
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Marketing;
