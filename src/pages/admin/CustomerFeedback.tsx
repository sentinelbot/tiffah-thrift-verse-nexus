
import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Star, 
  MessageSquare, 
  Send, 
  ChevronLeft, 
  ChevronRight,
  User,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  BarChart2,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  MessageCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type FeedbackStatus = 'new' | 'reviewed' | 'responded' | 'resolved';

interface CustomerFeedback {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  rating: number;
  message: string;
  category: string;
  status: FeedbackStatus;
  created_at: string;
  product_id?: string;
  product_name?: string;
  order_id?: string;
  responded_at?: string;
  staff_notes?: string;
}

const mockFeedback: CustomerFeedback[] = [
  {
    id: '1',
    customer_id: 'cust1',
    customer_name: 'Jane Smith',
    customer_email: 'jane.smith@example.com',
    rating: 5,
    message: 'I love the vintage dress I purchased! The quality exceeded my expectations and it fits perfectly.',
    category: 'product_quality',
    status: 'new',
    created_at: '2023-04-05T10:20:30Z',
    product_id: 'prod123',
    product_name: 'Vintage Floral Dress',
    order_id: 'order456'
  },
  {
    id: '2',
    customer_id: 'cust2',
    customer_name: 'Michael Johnson',
    customer_email: 'michael.j@example.com',
    rating: 2,
    message: 'The delivery took much longer than expected. I waited almost two weeks for my order to arrive.',
    category: 'delivery',
    status: 'reviewed',
    created_at: '2023-04-03T14:15:10Z',
    order_id: 'order457'
  },
  {
    id: '3',
    customer_id: 'cust3',
    customer_name: 'Sarah Williams',
    customer_email: 'sarah.w@example.com',
    rating: 4,
    message: 'The leather jacket is amazing, but one button was loose when it arrived. Easy fix though!',
    category: 'product_quality',
    status: 'responded',
    created_at: '2023-04-02T09:45:20Z',
    product_id: 'prod124',
    product_name: 'Vintage Leather Jacket',
    order_id: 'order458',
    responded_at: '2023-04-02T11:30:00Z',
    staff_notes: 'Offered partial refund or replacement. Customer chose refund.'
  },
  {
    id: '4',
    customer_id: 'cust4',
    customer_name: 'David Brown',
    customer_email: 'david.b@example.com',
    rating: 5,
    message: 'Your customer service team was extremely helpful when I needed to change my shipping address. Thank you!',
    category: 'customer_service',
    status: 'resolved',
    created_at: '2023-04-01T16:50:00Z',
    order_id: 'order459',
    responded_at: '2023-04-01T17:30:00Z',
    staff_notes: 'Address was updated successfully. Customer was very appreciative.'
  },
  {
    id: '5',
    customer_id: 'cust5',
    customer_name: 'Emily Davis',
    customer_email: 'emily.d@example.com',
    rating: 3,
    message: 'The website is a bit confusing to navigate, especially the filtering options in the shop section.',
    category: 'website',
    status: 'new',
    created_at: '2023-03-30T11:20:40Z'
  }
];

const CustomerFeedbackPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<CustomerFeedback | null>(null);
  const [responseText, setResponseText] = useState('');
  const [feedback, setFeedback] = useState<CustomerFeedback[]>(mockFeedback);
  const [isResponding, setIsResponding] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const filteredFeedback = feedback.filter(item => {
    // Search filter
    const searchMatch = 
      item.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.product_name && item.product_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter
    const statusMatch = statusFilter === 'all' || item.status === statusFilter;
    
    // Category filter
    const categoryMatch = categoryFilter === 'all' || item.category === categoryFilter;
    
    // Rating filter
    const ratingMatch = ratingFilter === 'all' || item.rating === parseInt(ratingFilter);
    
    return searchMatch && statusMatch && categoryMatch && ratingMatch;
  });
  
  // Get counts for status tabs
  const getCounts = () => {
    const all = feedback.length;
    const newCount = feedback.filter(item => item.status === 'new').length;
    const reviewedCount = feedback.filter(item => item.status === 'reviewed').length;
    const respondedCount = feedback.filter(item => item.status === 'responded').length;
    const resolvedCount = feedback.filter(item => item.status === 'resolved').length;
    
    return { all, newCount, reviewedCount, respondedCount, resolvedCount };
  };
  
  const counts = getCounts();
  
  const handleSendResponse = () => {
    if (!selectedFeedback) return;
    if (!responseText.trim()) {
      toast.error('Please enter a response message');
      return;
    }
    
    setIsResponding(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update the feedback item
      const updatedFeedback = feedback.map(item => {
        if (item.id === selectedFeedback.id) {
          return {
            ...item,
            status: 'responded',
            responded_at: new Date().toISOString(),
            staff_notes: (item.staff_notes ? item.staff_notes + '\n\n' : '') + 
              `Response sent (${new Date().toLocaleString()}):\n${responseText}`
          };
        }
        return item;
      });
      
      setFeedback(updatedFeedback);
      setResponseText('');
      setIsResponding(false);
      toast.success('Response sent successfully');
      
      // Update the selected feedback
      const updated = updatedFeedback.find(item => item.id === selectedFeedback.id);
      if (updated) setSelectedFeedback(updated);
    }, 1500);
  };
  
  const markAsReviewed = (id: string) => {
    const updatedFeedback = feedback.map(item => {
      if (item.id === id && item.status === 'new') {
        return { ...item, status: 'reviewed' };
      }
      return item;
    });
    
    setFeedback(updatedFeedback);
    
    // Update selected feedback if it's the one being marked
    if (selectedFeedback && selectedFeedback.id === id) {
      const updated = updatedFeedback.find(item => item.id === id);
      if (updated) setSelectedFeedback(updated);
    }
    
    toast.success('Feedback marked as reviewed');
  };
  
  const markAsResolved = (id: string) => {
    const updatedFeedback = feedback.map(item => {
      if (item.id === id && (item.status === 'responded' || item.status === 'reviewed')) {
        return { ...item, status: 'resolved' };
      }
      return item;
    });
    
    setFeedback(updatedFeedback);
    
    // Update selected feedback if it's the one being marked
    if (selectedFeedback && selectedFeedback.id === id) {
      const updated = updatedFeedback.find(item => item.id === id);
      if (updated) setSelectedFeedback(updated);
    }
    
    toast.success('Feedback marked as resolved');
  };
  
  const getFeedbackStatusBadge = (status: FeedbackStatus) => {
    switch(status) {
      case 'new':
        return <Badge className="bg-blue-500">New</Badge>;
      case 'reviewed':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Reviewed</Badge>;
      case 'responded':
        return <Badge variant="outline" className="border-green-500 text-green-500">Responded</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="border-green-700 text-green-700">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${
              index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Customer Feedback</h1>
            <p className="text-muted-foreground">
              Manage and respond to customer feedback and ratings
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <BarChart2 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:w-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by customer, product, or keyword..." 
              className="pl-10 w-full sm:w-[300px] md:w-[400px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <Filter className="mr-2 h-4 w-4" />
                <span>Status</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="responded">Responded</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[130px]">
                <span>Category</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="product_quality">Product Quality</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="customer_service">Customer Service</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[130px]">
                <span>Rating</span>
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
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="relative">
              All
              <Badge variant="secondary" className="ml-2">{counts.all}</Badge>
            </TabsTrigger>
            <TabsTrigger value="new" className="relative">
              New
              <Badge variant="secondary" className="ml-2">{counts.newCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="reviewed" className="relative">
              Reviewed
              <Badge variant="secondary" className="ml-2">{counts.reviewedCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="responded" className="relative">
              Responded
              <Badge variant="secondary" className="ml-2">{counts.respondedCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="resolved" className="relative">
              Resolved
              <Badge variant="secondary" className="ml-2">{counts.resolvedCount}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeedback.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">No feedback found</TableCell>
                    </TableRow>
                  ) : (
                    filteredFeedback.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{item.customer_name}</span>
                            <span className="text-sm text-muted-foreground">{item.customer_email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{renderStars(item.rating)}</TableCell>
                        <TableCell className="hidden md:table-cell capitalize">
                          {item.category.replace('_', ' ')}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(item.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{getFeedbackStatusBadge(item.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog onOpenChange={(open) => {
                              if (open) setSelectedFeedback(item);
                            }}>
                              <DialogTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Customer Feedback</DialogTitle>
                                  <DialogDescription>
                                    Review and respond to customer feedback
                                  </DialogDescription>
                                </DialogHeader>
                                
                                {selectedFeedback && (
                                  <div className="space-y-6 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Customer</p>
                                        <div className="flex items-center gap-2">
                                          <User className="h-4 w-4 text-muted-foreground" />
                                          <p className="font-medium">{selectedFeedback.customer_name}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{selectedFeedback.customer_email}</p>
                                      </div>
                                      
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Date Submitted</p>
                                        <div className="flex items-center gap-2">
                                          <Calendar className="h-4 w-4 text-muted-foreground" />
                                          <p className="font-medium">
                                            {new Date(selectedFeedback.created_at).toLocaleDateString()}
                                          </p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                          {new Date(selectedFeedback.created_at).toLocaleTimeString()}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium text-muted-foreground">Rating</p>
                                      <div className="flex items-center gap-2">
                                        {renderStars(selectedFeedback.rating)}
                                        <p className="font-medium">{selectedFeedback.rating}/5</p>
                                      </div>
                                    </div>
                                    
                                    {selectedFeedback.product_name && (
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Product</p>
                                        <p className="font-medium">{selectedFeedback.product_name}</p>
                                      </div>
                                    )}
                                    
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium text-muted-foreground">Feedback</p>
                                      <p className="p-3 border rounded-md bg-muted/50">{selectedFeedback.message}</p>
                                    </div>
                                    
                                    {selectedFeedback.staff_notes && (
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Staff Notes</p>
                                        <p className="p-3 border rounded-md bg-muted/50 whitespace-pre-line">{selectedFeedback.staff_notes}</p>
                                      </div>
                                    )}
                                    
                                    {(selectedFeedback.status === 'new' || selectedFeedback.status === 'reviewed') && (
                                      <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Respond to Customer</p>
                                        <Textarea 
                                          placeholder="Enter your response to the customer..."
                                          value={responseText}
                                          onChange={(e) => setResponseText(e.target.value)}
                                          className="min-h-[120px]"
                                        />
                                        
                                        <div className="flex gap-2">
                                          <Button 
                                            variant="outline" 
                                            className="flex-1"
                                            onClick={() => setResponseText("Thank you for your feedback! We appreciate you taking the time to share your thoughts with us.")}
                                          >
                                            Insert Template
                                          </Button>
                                          <Button 
                                            className="flex-1"
                                            onClick={handleSendResponse}
                                            disabled={isResponding || !responseText.trim()}
                                          >
                                            <Send className="mr-2 h-4 w-4" />
                                            {isResponding ? 'Sending...' : 'Send Response'}
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                <DialogFooter className="flex-col sm:flex-row gap-2">
                                  {selectedFeedback && selectedFeedback.status === 'new' && (
                                    <Button 
                                      variant="outline" 
                                      onClick={() => markAsReviewed(selectedFeedback.id)}
                                      className="flex-1"
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Mark as Reviewed
                                    </Button>
                                  )}
                                  
                                  {selectedFeedback && (selectedFeedback.status === 'responded' || selectedFeedback.status === 'reviewed') && (
                                    <Button 
                                      variant="outline" 
                                      onClick={() => markAsResolved(selectedFeedback.id)}
                                      className="flex-1"
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Mark as Resolved
                                    </Button>
                                  )}
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              
              {filteredFeedback.length > 0 && (
                <div className="flex items-center justify-between px-4 py-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing <strong>1-{filteredFeedback.length}</strong> of <strong>{filteredFeedback.length}</strong> items
                  </p>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="outline" disabled>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" disabled>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          {['new', 'reviewed', 'responded', 'resolved'].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="hidden md:table-cell">Category</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeedback.filter(item => item.status === tab).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">No feedback found</TableCell>
                      </TableRow>
                    ) : (
                      filteredFeedback
                        .filter(item => item.status === tab)
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{item.customer_name}</span>
                                <span className="text-sm text-muted-foreground">{item.customer_email}</span>
                              </div>
                            </TableCell>
                            <TableCell>{renderStars(item.rating)}</TableCell>
                            <TableCell className="hidden md:table-cell capitalize">
                              {item.category.replace('_', ' ')}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {new Date(item.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{getFeedbackStatusBadge(item.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Dialog onOpenChange={(open) => {
                                  if (open) setSelectedFeedback(item);
                                }}>
                                  <DialogTrigger asChild>
                                    <Button size="icon" variant="ghost">
                                      <MessageSquare className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                      <DialogTitle>Customer Feedback</DialogTitle>
                                      <DialogDescription>
                                        Review and respond to customer feedback
                                      </DialogDescription>
                                    </DialogHeader>
                                    
                                    {selectedFeedback && (
                                      <div className="space-y-6 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">Customer</p>
                                            <div className="flex items-center gap-2">
                                              <User className="h-4 w-4 text-muted-foreground" />
                                              <p className="font-medium">{selectedFeedback.customer_name}</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{selectedFeedback.customer_email}</p>
                                          </div>
                                          
                                          <div className="space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">Date Submitted</p>
                                            <div className="flex items-center gap-2">
                                              <Calendar className="h-4 w-4 text-muted-foreground" />
                                              <p className="font-medium">
                                                {new Date(selectedFeedback.created_at).toLocaleDateString()}
                                              </p>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                              {new Date(selectedFeedback.created_at).toLocaleTimeString()}
                                            </p>
                                          </div>
                                        </div>
                                        
                                        <div className="space-y-1">
                                          <p className="text-sm font-medium text-muted-foreground">Rating</p>
                                          <div className="flex items-center gap-2">
                                            {renderStars(selectedFeedback.rating)}
                                            <p className="font-medium">{selectedFeedback.rating}/5</p>
                                          </div>
                                        </div>
                                        
                                        {selectedFeedback.product_name && (
                                          <div className="space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">Product</p>
                                            <p className="font-medium">{selectedFeedback.product_name}</p>
                                          </div>
                                        )}
                                        
                                        <div className="space-y-1">
                                          <p className="text-sm font-medium text-muted-foreground">Feedback</p>
                                          <p className="p-3 border rounded-md bg-muted/50">{selectedFeedback.message}</p>
                                        </div>
                                        
                                        {selectedFeedback.staff_notes && (
                                          <div className="space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">Staff Notes</p>
                                            <p className="p-3 border rounded-md bg-muted/50 whitespace-pre-line">{selectedFeedback.staff_notes}</p>
                                          </div>
                                        )}
                                        
                                        {(selectedFeedback.status === 'new' || selectedFeedback.status === 'reviewed') && (
                                          <div className="space-y-2">
                                            <p className="text-sm font-medium text-muted-foreground">Respond to Customer</p>
                                            <Textarea 
                                              placeholder="Enter your response to the customer..."
                                              value={responseText}
                                              onChange={(e) => setResponseText(e.target.value)}
                                              className="min-h-[120px]"
                                            />
                                            
                                            <div className="flex gap-2">
                                              <Button 
                                                variant="outline" 
                                                className="flex-1"
                                                onClick={() => setResponseText("Thank you for your feedback! We appreciate you taking the time to share your thoughts with us.")}
                                              >
                                                Insert Template
                                              </Button>
                                              <Button 
                                                className="flex-1"
                                                onClick={handleSendResponse}
                                                disabled={isResponding || !responseText.trim()}
                                              >
                                                <Send className="mr-2 h-4 w-4" />
                                                {isResponding ? 'Sending...' : 'Send Response'}
                                              </Button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    
                                    <DialogFooter className="flex-col sm:flex-row gap-2">
                                      {selectedFeedback && selectedFeedback.status === 'new' && (
                                        <Button 
                                          variant="outline" 
                                          onClick={() => markAsReviewed(selectedFeedback.id)}
                                          className="flex-1"
                                        >
                                          <CheckCircle className="mr-2 h-4 w-4" />
                                          Mark as Reviewed
                                        </Button>
                                      )}
                                      
                                      {selectedFeedback && (selectedFeedback.status === 'responded' || selectedFeedback.status === 'reviewed') && (
                                        <Button 
                                          variant="outline" 
                                          onClick={() => markAsResolved(selectedFeedback.id)}
                                          className="flex-1"
                                        >
                                          <CheckCircle className="mr-2 h-4 w-4" />
                                          Mark as Resolved
                                        </Button>
                                      )}
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
                
                {filteredFeedback.filter(item => item.status === tab).length > 0 && (
                  <div className="flex items-center justify-between px-4 py-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      Showing <strong>1-{filteredFeedback.filter(item => item.status === tab).length}</strong> of <strong>{filteredFeedback.filter(item => item.status === tab).length}</strong> items
                    </p>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="outline" disabled>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" disabled>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Analytics</CardTitle>
              <CardDescription>Overall customer satisfaction and feedback trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-lg font-medium">Overall Rating</p>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-primary">4.3</div>
                    <div className="flex flex-col">
                      {renderStars(4)}
                      <p className="text-sm text-muted-foreground mt-1">Based on {feedback.length} reviews</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-lg font-medium">Rating Distribution</p>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = feedback.filter(item => item.rating === rating).length;
                      const percentage = Math.round((count / feedback.length) * 100) || 0;
                      
                      return (
                        <div key={rating} className="flex items-center gap-2">
                          <div className="w-10 text-right">{rating} ★</div>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="w-10 text-sm text-muted-foreground">{percentage}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-lg font-medium">Top Feedback Categories</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4 text-green-500" />
                        <span>Product Quality</span>
                      </div>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <ThumbsDown className="h-4 w-4 text-red-500" />
                        <span>Delivery Speed</span>
                      </div>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                        <span>Customer Service</span>
                      </div>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Response Performance</CardTitle>
              <CardDescription>How quickly we're responding to feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-muted-foreground">Average Response Time</p>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold">3.2 hours</p>
                    <p className="text-xs text-green-500">↓ 12% from last month</p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold">94%</p>
                    <p className="text-xs text-green-500">↑ 5% from last month</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-lg font-medium">Customer Satisfaction</p>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>After Responding</span>
                        <span className="font-medium">87%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: '87%' }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Issue Resolution Rate</span>
                        <span className="font-medium">92%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: '92%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-lg font-medium">Most Common Feedback Sources</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Post-Purchase Emails</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Website Feedback Form</span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Support Tickets</span>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CustomerFeedbackPage;
