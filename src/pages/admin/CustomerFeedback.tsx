
import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
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
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MessageSquare, 
  Star, 
  Search, 
  Filter, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  XCircle,
  BarChart,
  Users,
  Calendar,
  ShoppingBag,
  Tag,
  MoreHorizontal,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface Feedback {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAvatar: string;
  rating: number;
  comment: string;
  status: 'new' | 'under_review' | 'responded' | 'closed';
  category: 'product' | 'service' | 'delivery' | 'website' | 'general';
  productId?: string;
  productName?: string;
  createdAt: string;
  response?: {
    text: string;
    respondedBy: string;
    respondedAt: string;
  };
  orderNumber?: string;
}

// Mock feedback data
const mockFeedback: Feedback[] = [
  {
    id: '1',
    customerId: 'cust_001',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    customerAvatar: '/placeholder.svg',
    rating: 4,
    comment: 'The dress I ordered arrived quickly and was exactly as described. Very happy with my purchase!',
    status: 'new',
    category: 'product',
    productId: 'prod_123',
    productName: 'Vintage Summer Dress',
    createdAt: '2023-04-08T14:30:00Z',
    orderNumber: 'TTS-20230405-1234'
  },
  {
    id: '2',
    customerId: 'cust_002',
    customerName: 'Michael Johnson',
    customerEmail: 'michael.j@example.com',
    customerAvatar: '/placeholder.svg',
    rating: 2,
    comment: 'The shirt I received had a small stain that wasn\'t mentioned in the description. Disappointed with the quality control.',
    status: 'responded',
    category: 'product',
    productId: 'prod_456',
    productName: 'Men\'s Casual Shirt',
    createdAt: '2023-04-07T09:15:00Z',
    response: {
      text: 'We\'re very sorry about this experience. We\'ve issued a full refund and would like to offer you a 15% discount on your next purchase. Please check your email for details.',
      respondedBy: 'Admin',
      respondedAt: '2023-04-07T11:30:00Z'
    },
    orderNumber: 'TTS-20230403-0987'
  },
  {
    id: '3',
    customerId: 'cust_003',
    customerName: 'Sarah Williams',
    customerEmail: 'sarah.w@example.com',
    customerAvatar: '/placeholder.svg',
    rating: 5,
    comment: 'Amazing customer service! I had a question about sizing and got a response within minutes. The jeans fit perfectly.',
    status: 'under_review',
    category: 'service',
    productId: 'prod_789',
    productName: 'Vintage Denim Jeans',
    createdAt: '2023-04-06T16:45:00Z',
    orderNumber: 'TTS-20230402-5678'
  },
  {
    id: '4',
    customerId: 'cust_004',
    customerName: 'Daniel Brown',
    customerEmail: 'daniel.b@example.com',
    customerAvatar: '/placeholder.svg',
    rating: 3,
    comment: 'Delivery took longer than expected, but the product quality was good. Would appreciate faster shipping next time.',
    status: 'closed',
    category: 'delivery',
    productId: 'prod_321',
    productName: 'Leather Jacket',
    createdAt: '2023-04-05T12:20:00Z',
    response: {
      text: 'Thank you for your feedback. We\'re working on improving our delivery times and will take your comments into consideration.',
      respondedBy: 'Admin',
      respondedAt: '2023-04-05T15:10:00Z'
    },
    orderNumber: 'TTS-20230330-4321'
  },
  {
    id: '5',
    customerId: 'cust_005',
    customerName: 'Emily Wilson',
    customerEmail: 'emily.w@example.com',
    customerAvatar: '/placeholder.svg',
    rating: 5,
    comment: 'The website is so easy to navigate and I love the filter options. Found exactly what I was looking for in minutes!',
    status: 'new',
    category: 'website',
    createdAt: '2023-04-04T10:05:00Z'
  },
  {
    id: '6',
    customerId: 'cust_006',
    customerName: 'Robert Taylor',
    customerEmail: 'robert.t@example.com',
    customerAvatar: '/placeholder.svg',
    rating: 4,
    comment: 'Great selection of vintage items. I particularly like the sustainable fashion section. Would recommend to friends.',
    status: 'new',
    category: 'general',
    createdAt: '2023-04-03T18:30:00Z'
  }
];

const CustomerFeedback = () => {
  const [feedback, setFeedback] = useState<Feedback[]>(mockFeedback);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [responseText, setResponseText] = useState<string>('');
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState<boolean>(false);
  
  // Filter feedback based on active tab, search query, and filters
  const filteredFeedback = feedback.filter(item => {
    // Tab filter
    if (activeTab !== 'all' && item.status !== activeTab) {
      return false;
    }
    
    // Search query
    if (searchQuery && !(
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.productName && item.productName.toLowerCase().includes(searchQuery.toLowerCase()))
    )) {
      return false;
    }
    
    // Status filter
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }
    
    // Category filter
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }
    
    // Rating filter
    if (ratingFilter !== 'all') {
      const ratingNumber = parseInt(ratingFilter, 10);
      if (item.rating !== ratingNumber) {
        return false;
      }
    }
    
    return true;
  });
  
  // Calculate statistics
  const stats = {
    totalFeedback: feedback.length,
    averageRating: feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length,
    newFeedback: feedback.filter(item => item.status === 'new').length,
    respondedFeedback: feedback.filter(item => item.status === 'responded').length,
    categoryBreakdown: {
      product: feedback.filter(item => item.category === 'product').length,
      service: feedback.filter(item => item.category === 'service').length,
      delivery: feedback.filter(item => item.category === 'delivery').length,
      website: feedback.filter(item => item.category === 'website').length,
      general: feedback.filter(item => item.category === 'general').length
    }
  };
  
  // Handle sending a response
  const handleSendResponse = () => {
    if (!selectedFeedback || !responseText.trim()) return;
    
    const updatedFeedback = feedback.map(item => {
      if (item.id === selectedFeedback.id) {
        return {
          ...item,
          status: 'responded' as const,
          response: {
            text: responseText,
            respondedBy: 'Admin',
            respondedAt: new Date().toISOString()
          }
        };
      }
      return item;
    });
    
    setFeedback(updatedFeedback);
    setResponseText('');
    setIsResponseDialogOpen(false);
    toast.success('Response sent successfully');
  };
  
  // Handle changing feedback status
  const handleChangeStatus = (id: string, newStatus: 'new' | 'under_review' | 'responded' | 'closed') => {
    const updatedFeedback = feedback.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus
        };
      }
      return item;
    });
    
    setFeedback(updatedFeedback);
    toast.success(`Feedback status updated to ${newStatus.replace('_', ' ')}`);
  };
  
  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating}/5</span>
      </div>
    );
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="secondary">New</Badge>;
      case 'under_review':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-500">Under Review</Badge>;
      case 'responded':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500">Responded</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-gray-500/20 text-gray-500">Closed</Badge>;
      default:
        return null;
    }
  };
  
  // Get category badge
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'product':
        return <Badge variant="outline" className="bg-purple-500/20 text-purple-500">Product</Badge>;
      case 'service':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-500">Service</Badge>;
      case 'delivery':
        return <Badge variant="outline" className="bg-orange-500/20 text-orange-500">Delivery</Badge>;
      case 'website':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500">Website</Badge>;
      case 'general':
        return <Badge variant="outline" className="bg-gray-500/20 text-gray-500">General</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Customer Feedback</h1>
            <p className="text-muted-foreground">
              Manage and respond to customer feedback and reviews
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <BarChart className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Feedback Analytics</DialogTitle>
                  <DialogDescription>
                    Overview of customer feedback trends and ratings
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">Average Rating</div>
                        <div className="flex justify-center mt-2">
                          {renderStarRating(Math.round(stats.averageRating))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-3xl font-bold">{stats.totalFeedback}</div>
                        <div className="text-sm text-muted-foreground">Total Feedback</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-3xl font-bold">{stats.newFeedback}</div>
                        <div className="text-sm text-muted-foreground">New Feedback</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-3">Feedback by Category</h3>
                  <div className="space-y-3">
                    {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
                      <div key={category} className="flex items-center">
                        <div className="w-32 capitalize">{category}</div>
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                              className="bg-primary h-2.5 rounded-full" 
                              style={{ width: `${(count / stats.totalFeedback) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-12 text-right">{count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Share Report
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <div className="rounded-full p-2 bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{feedback.length}</div>
                  <div className="text-sm text-muted-foreground">Total Feedback</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <div className="rounded-full p-2 bg-yellow-500/10">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <div className="rounded-full p-2 bg-blue-500/10">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{feedback.filter(item => item.status === 'new').length}</div>
                  <div className="text-sm text-muted-foreground">Awaiting Response</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <div className="rounded-full p-2 bg-green-500/10">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{feedback.filter(item => item.status === 'responded' || item.status === 'closed').length}</div>
                  <div className="text-sm text-muted-foreground">Resolved</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-start mb-6">
            <TabsList>
              <TabsTrigger value="all">All Feedback</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="under_review">Under Review</TabsTrigger>
              <TabsTrigger value="responded">Responded</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search feedback..."
                  className="pl-8 w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setSearchQuery('')}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="responded">Responded</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <Tag className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[150px]">
                <Star className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={() => {
              setStatusFilter('all');
              setCategoryFilter('all');
              setRatingFilter('all');
              setSearchQuery('');
            }}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>
          
          <TabsContent value={activeTab} className="m-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Feedback</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeedback.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || ratingFilter !== 'all'
                            ? "No feedback matching your filters"
                            : "No feedback available"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFeedback.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={item.customerAvatar} alt={item.customerName} />
                                <AvatarFallback>{item.customerName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{item.customerName}</div>
                                <div className="text-xs text-muted-foreground">{item.customerEmail}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <div className="text-sm truncate">{item.comment}</div>
                              {item.productName && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  Product: {item.productName}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{renderStarRating(item.rating)}</TableCell>
                          <TableCell>{getCategoryBadge(item.category)}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell>
                            {new Date(item.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedFeedback(item);
                                    setIsResponseDialogOpen(true);
                                  }}
                                >
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Respond
                                </DropdownMenuItem>
                                
                                {item.status !== 'under_review' && (
                                  <DropdownMenuItem
                                    onClick={() => handleChangeStatus(item.id, 'under_review')}
                                  >
                                    <Clock className="mr-2 h-4 w-4" />
                                    Mark as Under Review
                                  </DropdownMenuItem>
                                )}
                                
                                {item.status !== 'closed' && (
                                  <DropdownMenuItem
                                    onClick={() => handleChangeStatus(item.id, 'closed')}
                                  >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Mark as Closed
                                  </DropdownMenuItem>
                                )}
                                
                                {item.orderNumber && (
                                  <DropdownMenuItem>
                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                    View Order: {item.orderNumber}
                                  </DropdownMenuItem>
                                )}
                                
                                {item.productId && (
                                  <DropdownMenuItem>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    View Product
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredFeedback.length} of {feedback.length} total feedback
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Respond to Feedback</DialogTitle>
            <DialogDescription>
              Send a response to the customer's feedback
            </DialogDescription>
          </DialogHeader>
          
          {selectedFeedback && (
            <div className="py-4">
              <div className="rounded-md bg-muted p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedFeedback.customerAvatar} alt={selectedFeedback.customerName} />
                      <AvatarFallback>{selectedFeedback.customerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{selectedFeedback.customerName}</span>
                  </div>
                  {renderStarRating(selectedFeedback.rating)}
                </div>
                <p className="text-sm">{selectedFeedback.comment}</p>
                {selectedFeedback.productName && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Product: {selectedFeedback.productName}
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-1">
                  Submitted on {new Date(selectedFeedback.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              {selectedFeedback.response && (
                <div className="rounded-md bg-primary/10 p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Previous Response</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(selectedFeedback.response.respondedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{selectedFeedback.response.text}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="response">Your Response</Label>
                <Textarea
                  id="response"
                  placeholder="Type your response here..."
                  rows={4}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendResponse}
              disabled={!responseText.trim()}
            >
              <Send className="mr-2 h-4 w-4" />
              Send Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default CustomerFeedback;
