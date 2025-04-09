
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Mail, Send, Users } from "lucide-react";
import { format } from "date-fns";
import { sendPromotionalNotification } from "@/services/notificationService";

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
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
            <TabsTrigger value="create">Create Campaign</TabsTrigger>
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
            <Card>
              <CardHeader>
                <CardTitle>Create New Marketing Campaign</CardTitle>
                <CardDescription>Design and schedule your email marketing campaign.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Campaign Name</label>
                  <Input 
                    name="name"
                    placeholder="Summer Sale 2025" 
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Subject</label>
                  <Input 
                    name="subject"
                    placeholder="Don't miss our biggest sale of the year!" 
                    value={formData.subject}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Audience</label>
                  <Select value={formData.targetSegment} onValueChange={handleSegmentChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience segment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      <SelectItem value="new">New Customers ({"<"}30 days)</SelectItem>
                      <SelectItem value="loyal">Loyal Customers (2+ orders)</SelectItem>
                      <SelectItem value="inactive">Inactive Customers ({">"} 60 days)</SelectItem>
                      <SelectItem value="highValue">High Value (Avg order {">"} 5000 KSh)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Scheduled Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {campaignDate ? format(campaignDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={campaignDate}
                        onSelect={setCampaignDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Discount Code (Optional)</label>
                  <Input 
                    name="discountCode"
                    placeholder="SUMMER25" 
                    value={formData.discountCode}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Discount Amount (Optional)</label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      name="discountAmount"
                      type="number" 
                      placeholder="25" 
                      value={formData.discountAmount}
                      onChange={handleInputChange}
                    />
                    <Select defaultValue="percentage">
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
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Content</label>
                  <Textarea 
                    name="content"
                    placeholder="Write your email content here..." 
                    className="min-h-[200px]"
                    value={formData.content}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Preview</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button><Send className="mr-2 h-4 w-4" /> Create Campaign</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will create a campaign that will be sent to {formData.targetSegment === 'all' ? 'all customers' : 'selected customers'}.
                        {campaignDate && ` The campaign is scheduled for ${format(campaignDate, "PPP")}.`}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCreateCampaign}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Marketing;
