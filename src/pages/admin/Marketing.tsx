
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import AdminLayout from "@/components/layout/AdminLayout";
import MarketingCampaigns from "@/components/marketing/MarketingCampaigns";
import LoyaltyPointsCard from "@/components/marketing/LoyaltyPointsCard";
import CampaignCreator from "@/components/marketing/CampaignCreator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Mail, Send, Users, Megaphone, BarChart, Activity } from "lucide-react";
import { format } from "date-fns";
import { sendPromotionalNotification } from "@/services/notificationService";

// Analytics data (mocked)
const CAMPAIGN_ANALYTICS = {
  emailOpen: [65, 72, 81, 78, 85, 90],
  clickRate: [12, 18, 15, 20, 22, 25],
  conversion: [3.2, 4.5, 3.8, 5.1, 5.5, 6.2],
  revenue: [25000, 35000, 30000, 42000, 45000, 55000],
  months: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
};

const Marketing = () => {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [campaignDate, setCampaignDate] = useState<Date>();
  const [targetSegment, setTargetSegment] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    content: "",
    targetSegment: "all",
    discountCode: "",
    discountAmount: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSegmentChange = (value: string) => {
    setFormData({
      ...formData,
      targetSegment: value,
    });
  };

  const handleCreateCampaign = async () => {
    try {
      // In a real implementation, this would send the campaign data to a backend service
      console.log("Creating campaign with data:", { ...formData, scheduledDate: campaignDate });
      
      // Simulate sending to a segment of users
      const mockUserIds = ["user1", "user2", "user3"];
      const mockUserEmails = ["user1@example.com", "user2@example.com", "user3@example.com"];
      
      await sendPromotionalNotification(
        mockUserIds,
        mockUserEmails,
        {
          promotionDetails: formData.content,
          expiryDate: campaignDate ? format(campaignDate, "yyyy-MM-dd") : "2025-12-31",
          targetSegment: formData.targetSegment
        }
      );
      
      toast.success("Campaign created successfully!");
      
      // Reset form after successful creation
      setFormData({
        name: "",
        subject: "",
        content: "",
        targetSegment: "all",
        discountCode: "",
        discountAmount: "",
      });
      setCampaignDate(undefined);
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign. Please try again.");
    }
  };

  const handleCampaignCreated = (campaignData: any) => {
    toast.success(`Campaign "${campaignData.name}" created successfully!`);
    setActiveTab("campaigns");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing</h1>
          <p className="text-muted-foreground">
            Create and manage marketing campaigns, promotions, and customer loyalty.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-4">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
            <TabsTrigger value="create">Create Campaign</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="campaigns" className="space-y-4">
            <MarketingCampaigns />
          </TabsContent>
          
          <TabsContent value="loyalty" className="space-y-4">
            <LoyaltyPointsCard />
            
            <Card>
              <CardHeader>
                <CardTitle>Loyalty Program Settings</CardTitle>
                <CardDescription>Configure how customers earn and redeem loyalty points.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Points per KSh spent</label>
                    <Input type="number" defaultValue="1" />
                    <p className="text-xs text-muted-foreground">Number of points earned for every 10 KSh spent</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Points Value (KSh)</label>
                    <Input type="number" defaultValue="1" />
                    <p className="text-xs text-muted-foreground">Value in KSh for each point when redeemed</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Points for Redemption</label>
                  <Input type="number" defaultValue="100" />
                  <p className="text-xs text-muted-foreground">Minimum points required before customers can redeem</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Special Earning Events</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Input type="number" defaultValue="50" className="max-w-[100px]" />
                      <span>points for account creation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input type="number" defaultValue="100" className="max-w-[100px]" />
                      <span>points on birthday</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="create" className="space-y-4">
            <CampaignCreator onCampaignCreated={handleCampaignCreated} />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Mail className="mr-2 h-5 w-5 text-primary" />
                    Email Open Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">85%</div>
                  <p className="text-xs text-muted-foreground">+7% from last month</p>
                  <div className="mt-4 h-8 w-full">
                    <div className="flex items-end justify-between h-full w-full">
                      {CAMPAIGN_ANALYTICS.emailOpen.map((val, i) => (
                        <div 
                          key={i} 
                          className="w-[8px] bg-primary rounded-sm" 
                          style={{ height: `${val}%` }}
                          title={`${CAMPAIGN_ANALYTICS.months[i]}: ${val}%`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-primary" />
                    Click Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">25%</div>
                  <p className="text-xs text-muted-foreground">+3% from last month</p>
                  <div className="mt-4 h-8 w-full">
                    <div className="flex items-end justify-between h-full w-full">
                      {CAMPAIGN_ANALYTICS.clickRate.map((val, i) => (
                        <div 
                          key={i} 
                          className="w-[8px] bg-primary rounded-sm" 
                          style={{ height: `${val * 4}%` }}
                          title={`${CAMPAIGN_ANALYTICS.months[i]}: ${val}%`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <BarChart className="mr-2 h-5 w-5 text-primary" />
                    Conversion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">6.2%</div>
                  <p className="text-xs text-muted-foreground">+0.7% from last month</p>
                  <div className="mt-4 h-8 w-full">
                    <div className="flex items-end justify-between h-full w-full">
                      {CAMPAIGN_ANALYTICS.conversion.map((val, i) => (
                        <div 
                          key={i} 
                          className="w-[8px] bg-primary rounded-sm" 
                          style={{ height: `${val * 16}%` }}
                          title={`${CAMPAIGN_ANALYTICS.months[i]}: ${val}%`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Megaphone className="mr-2 h-5 w-5 text-primary" />
                    Campaign Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">KSh 55K</div>
                  <p className="text-xs text-muted-foreground">+10K from last month</p>
                  <div className="mt-4 h-8 w-full">
                    <div className="flex items-end justify-between h-full w-full">
                      {CAMPAIGN_ANALYTICS.revenue.map((val, i) => (
                        <div 
                          key={i} 
                          className="w-[8px] bg-primary rounded-sm" 
                          style={{ height: `${val / 550}%` }}
                          title={`${CAMPAIGN_ANALYTICS.months[i]}: KSh ${val / 1000}K`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Analysis of your marketing campaign performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Top Performing Campaigns</h3>
                    <div className="space-y-4">
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">Easter Weekend Sale</h4>
                            <p className="text-sm text-muted-foreground">Email + SMS</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">KSh 18,500</div>
                            <p className="text-xs text-muted-foreground">Revenue</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center mt-4">
                          <div>
                            <div className="text-sm font-medium">92%</div>
                            <p className="text-xs text-muted-foreground">Open Rate</p>
                          </div>
                          <div>
                            <div className="text-sm font-medium">34%</div>
                            <p className="text-xs text-muted-foreground">Click Rate</p>
                          </div>
                          <div>
                            <div className="text-sm font-medium">8.7%</div>
                            <p className="text-xs text-muted-foreground">Conversion</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">Summer Collection Launch</h4>
                            <p className="text-sm text-muted-foreground">Email</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">KSh 15,200</div>
                            <p className="text-xs text-muted-foreground">Revenue</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center mt-4">
                          <div>
                            <div className="text-sm font-medium">85%</div>
                            <p className="text-xs text-muted-foreground">Open Rate</p>
                          </div>
                          <div>
                            <div className="text-sm font-medium">28%</div>
                            <p className="text-xs text-muted-foreground">Click Rate</p>
                          </div>
                          <div>
                            <div className="text-sm font-medium">6.2%</div>
                            <p className="text-xs text-muted-foreground">Conversion</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Audience Segments Performance</h3>
                    <div className="space-y-4">
                      <div className="relative pt-1">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="text-sm font-medium">Loyal Customers</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">9.8%</span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-primary/20">
                          <div style={{ width: "98%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                        </div>
                      </div>
                      
                      <div className="relative pt-1">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="text-sm font-medium">High Value Customers</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">8.2%</span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-primary/20">
                          <div style={{ width: "82%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                        </div>
                      </div>
                      
                      <div className="relative pt-1">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="text-sm font-medium">New Customers</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">5.4%</span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-primary/20">
                          <div style={{ width: "54%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                        </div>
                      </div>
                      
                      <div className="relative pt-1">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="text-sm font-medium">Inactive Customers</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">3.6%</span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-primary/20">
                          <div style={{ width: "36%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Marketing;
