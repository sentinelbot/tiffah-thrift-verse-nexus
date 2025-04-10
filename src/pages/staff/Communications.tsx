
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
  Search,
  Send,
  MessageSquare,
  User,
  Phone,
  Mail,
  FileText,
  PackageCheck,
  ShoppingBag,
  Truck,
  Package,
  Calendar,
  ChevronRight,
  AlertCircle,
  Check,
  X,
  XCircle,
  Filter,
  Bell,
  RefreshCw,
} from 'lucide-react';

const Communications = () => {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Mock customer support chats
  const mockChats = [
    {
      id: '1',
      customer: {
        id: 'c1',
        name: 'Sarah Johnson',
        avatar: null,
        email: 'sarah.j@example.com',
        phone: '+254712345678',
      },
      lastMessage: {
        text: 'I still haven\'t received my order #TTS-20250405-1234. It\'s been 5 days now.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        sender: 'customer',
      },
      orderId: 'TTS-20250405-1234',
      status: 'active',
      priority: 'high',
      unread: 3,
    },
    {
      id: '2',
      customer: {
        id: 'c2',
        name: 'Michael Kimani',
        avatar: null,
        email: 'michael.k@example.com',
        phone: '+254723456789',
      },
      lastMessage: {
        text: 'Thanks for the quick response. I'll check with my bank.',
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        sender: 'customer',
      },
      orderId: 'TTS-20250403-5678',
      status: 'active',
      priority: 'medium',
      unread: 0,
    },
    {
      id: '3',
      customer: {
        id: 'c3',
        name: 'Amina Wanjiku',
        avatar: null,
        email: 'amina.w@example.com',
        phone: '+254734567890',
      },
      lastMessage: {
        text: 'Do you have this dress in size M?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        sender: 'staff',
      },
      orderId: null,
      status: 'active',
      priority: 'low',
      unread: 0,
    },
    {
      id: '4',
      customer: {
        id: 'c4',
        name: 'David Omondi',
        avatar: null,
        email: 'david.o@example.com',
        phone: '+254745678901',
      },
      lastMessage: {
        text: 'Issue resolved. Thank you for your help.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        sender: 'customer',
      },
      orderId: 'TTS-20250401-9012',
      status: 'resolved',
      priority: 'low',
      unread: 0,
    },
  ];

  // Mock messages for the selected chat
  const mockMessages = [
    {
      id: 'm1',
      text: 'I still haven\'t received my order #TTS-20250405-1234. It\'s been 5 days now.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      sender: 'customer',
    },
    {
      id: 'm2',
      text: 'I'm sorry to hear that. Let me check the status for you right away.',
      timestamp: new Date(Date.now() - 1000 * 60 * 28),
      sender: 'staff',
    },
    {
      id: 'm3',
      text: 'I've checked and it looks like your order is currently with our delivery team. There was a slight delay due to high volume.',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      sender: 'staff',
    },
    {
      id: 'm4',
      text: 'When can I expect to receive it? I need it for an event this weekend.',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      sender: 'customer',
    },
    {
      id: 'm5',
      text: 'I understand your concern. I've flagged your order for priority delivery. You should receive it by tomorrow. I'll send you the tracking details in a moment.',
      timestamp: new Date(Date.now() - 1000 * 60 * 18),
      sender: 'staff',
    },
    {
      id: 'm6',
      text: 'Thank you! I appreciate the quick response.',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      sender: 'customer',
    },
    {
      id: 'm7',
      text: 'Here is your tracking number: TRK-123456. You can use this to follow your delivery in real-time.',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      sender: 'staff',
    },
    {
      id: 'm8',
      text: 'Perfect, thank you!',
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      sender: 'customer',
    },
    {
      id: 'm9',
      text: 'Actually, I just realized I might not be home tomorrow. Is it possible to have it delivered on Saturday instead?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      sender: 'customer',
    },
    {
      id: 'm10',
      text: 'Of course! I've updated your delivery preference for Saturday. The driver will call you before arriving.',
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
      sender: 'staff',
    },
  ];

  // Format timestamp for display
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(date);
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    toast.success('Message sent');
    setMessageText('');
  };

  // Filter chats based on search and active tab
  const filteredChats = mockChats.filter((chat) => {
    // Apply search filter
    const matchesSearch =
      searchQuery === '' ||
      chat.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chat.orderId && chat.orderId.toLowerCase().includes(searchQuery.toLowerCase()));

    // Apply tab filter
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'unread' && chat.unread > 0) ||
      (activeTab === 'active' && chat.status === 'active') ||
      (activeTab === 'resolved' && chat.status === 'resolved');

    return matchesSearch && matchesTab;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Customer Communications</h1>
          <Button variant="outline" onClick={() => toast.info('Refreshing messages...')}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Chat list */}
          <Card className="lg:col-span-1">
            <CardHeader className="space-y-4 pb-3">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or order number"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1">
                    Unread
                    <Badge className="ml-2 bg-primary">{mockChats.filter(c => c.unread > 0).length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="active" className="flex-1">
                    Active
                  </TabsTrigger>
                  <TabsTrigger value="resolved" className="flex-1">
                    Resolved
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-320px)]">
                {filteredChats.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center px-4">
                    <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No conversations found</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredChats.map((chat) => (
                      <div
                        key={chat.id}
                        className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
                          selectedChat?.id === chat.id ? 'bg-accent' : ''
                        }`}
                        onClick={() => setSelectedChat(chat)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={chat.customer.avatar || ''} alt={chat.customer.name} />
                            <AvatarFallback>{chat.customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="font-medium truncate">{chat.customer.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatTime(chat.lastMessage.timestamp)}
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <div className="text-sm text-muted-foreground truncate max-w-[160px]">
                                {chat.lastMessage.text}
                              </div>
                              {chat.unread > 0 && (
                                <Badge className="bg-primary">{chat.unread}</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {chat.orderId && (
                                <Badge variant="outline" className="text-xs">
                                  {chat.orderId}
                                </Badge>
                              )}
                              <Badge
                                variant={
                                  chat.priority === 'high'
                                    ? 'destructive'
                                    : chat.priority === 'medium'
                                    ? 'secondary'
                                    : 'outline'
                                }
                                className="text-xs"
                              >
                                {chat.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Right side - Chat and Customer Info */}
          <Card className="lg:col-span-2">
            {selectedChat ? (
              <div className="grid grid-cols-1 md:grid-cols-3 h-full divide-x">
                {/* Chat area */}
                <div className="md:col-span-2 flex flex-col h-[calc(100vh-160px)]">
                  <CardHeader className="pb-3 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={selectedChat.customer.avatar || ''} alt={selectedChat.customer.name} />
                          <AvatarFallback>
                            {selectedChat.customer.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{selectedChat.customer.name}</h3>
                          {selectedChat.orderId && (
                            <div className="text-xs text-muted-foreground">
                              Order: {selectedChat.orderId}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Mail className="h-4 w-4" />
                        </Button>
                        {selectedChat.status === 'active' ? (
                          <Button
                            variant="outline"
                            className="text-xs"
                            onClick={() => toast.success('Conversation marked as resolved')}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Resolve
                          </Button>
                        ) : (
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Resolved
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <ScrollArea className="flex-1 p-4">
                    {/* Messages */}
                    <div className="space-y-4">
                      {mockMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender === 'staff' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.sender === 'staff'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <div className="text-sm">{message.text}</div>
                            <div
                              className={`text-xs mt-1 ${
                                message.sender === 'staff'
                                  ? 'text-primary-foreground/80'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <CardFooter className="p-3 border-t">
                    <div className="flex w-full items-center gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </CardFooter>
                </div>

                {/* Customer info sidebar */}
                <div className="hidden md:block md:col-span-1">
                  <ScrollArea className="h-[calc(100vh-160px)]">
                    <div className="p-4">
                      <h3 className="font-medium mb-4">Customer Information</h3>

                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Customer ID</div>
                          <div>{selectedChat.customer.id}</div>
                        </div>

                        <div>
                          <div className="text-sm text-muted-foreground">Contact</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{selectedChat.customer.email}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{selectedChat.customer.phone}</span>
                          </div>
                        </div>

                        <Separator />

                        {selectedChat.orderId ? (
                          <div>
                            <div className="text-sm text-muted-foreground">Related Order</div>
                            <div className="mt-2 p-3 border rounded-md">
                              <div className="flex items-center justify-between">
                                <Badge variant="outline">{selectedChat.orderId}</Badge>
                                <Badge variant="secondary">Processing</Badge>
                              </div>

                              <div className="mt-3 space-y-2">
                                <div className="flex items-center gap-2">
                                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">2 items</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">Ordered on Apr 5, 2025</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">Packed, awaiting delivery</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Truck className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">Est. delivery: Apr 12, 2025</span>
                                </div>
                              </div>

                              <Button variant="ghost" size="sm" className="w-full mt-3">
                                <FileText className="h-4 w-4 mr-1" />
                                View Full Order
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-sm text-muted-foreground">No related order</div>
                            <p className="text-sm mt-1">
                              This is a general inquiry not linked to a specific order.
                            </p>
                          </div>
                        )}

                        <Separator />

                        <div>
                          <div className="text-sm text-muted-foreground">Quick Responses</div>
                          <div className="mt-2 space-y-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start"
                              onClick={() =>
                                setMessageText(
                                  "Thank you for contacting us. I'll look into this right away and get back to you as soon as possible."
                                )
                              }
                            >
                              Initial Response
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start"
                              onClick={() =>
                                setMessageText(
                                  "I've checked your order status and it's currently being processed. You should receive it within the next 2-3 business days."
                                )
                              }
                            >
                              Order Status
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start"
                              onClick={() =>
                                setMessageText(
                                  "I apologize for the inconvenience. I'd be happy to help resolve this issue. Could you please provide more details?"
                                )
                              }
                            >
                              Issue Response
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start"
                              onClick={() =>
                                setMessageText(
                                  "Is there anything else I can help you with today? Please don't hesitate to ask."
                                )
                              }
                            >
                              Follow-up
                            </Button>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <div className="text-sm text-muted-foreground">Notes</div>
                          <Textarea
                            placeholder="Add notes about this customer (only visible to staff)"
                            className="mt-2"
                          />
                          <Button className="w-full mt-2" variant="outline" size="sm">
                            Save Notes
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-160px)] text-center px-4">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Conversation Selected</h3>
                <p className="text-muted-foreground max-w-md mb-4">
                  Select a conversation from the list to view messages and customer details.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Staff Communication Templates */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Staff Communication Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Template 1 */}
            <Card>
              <CardHeader>
                <CardTitle>Order Delivery Update</CardTitle>
                <CardDescription>Use this template for delivery status updates</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Template preview:</p>
                <div className="p-3 bg-muted rounded-md text-sm">
                  Hello [Customer Name], <br /><br />
                  We're pleased to inform you that your order #[Order Number] has been [Status]. <br /><br />
                  [Additional Details] <br /><br />
                  If you have any questions, please reply to this message. <br /><br />
                  Thank you for shopping with Tiffah Thrift Store!
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => toast.success('Template copied')}>
                  Use Template
                </Button>
              </CardFooter>
            </Card>

            {/* Template 2 */}
            <Card>
              <CardHeader>
                <CardTitle>Order Delay Notification</CardTitle>
                <CardDescription>Use this template for delayed deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Template preview:</p>
                <div className="p-3 bg-muted rounded-md text-sm">
                  Hello [Customer Name], <br /><br />
                  We regret to inform you that your order #[Order Number] has been delayed due to [Reason]. <br /><br />
                  The new estimated delivery date is [New Date]. <br /><br />
                  We sincerely apologize for any inconvenience this may cause. <br /><br />
                  Thank you for your understanding.
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => toast.success('Template copied')}>
                  Use Template
                </Button>
              </CardFooter>
            </Card>

            {/* Template 3 */}
            <Card>
              <CardHeader>
                <CardTitle>Product Availability</CardTitle>
                <CardDescription>Use this template for product inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Template preview:</p>
                <div className="p-3 bg-muted rounded-md text-sm">
                  Hello [Customer Name], <br /><br />
                  Thank you for your interest in [Product Name]. <br /><br />
                  We're happy to inform you that this item is [Available/Not Available] in [Size/Color]. <br /><br />
                  [Additional Information] <br /><br />
                  Please let me know if you would like to proceed with purchasing this item.
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => toast.success('Template copied')}>
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Communication Guidelines</CardTitle>
              <CardDescription>
                Follow these guidelines when communicating with customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Do's</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Respond to all messages within 2 hours during business hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Use the customer's name in all communications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Provide specific details about order status when available</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Apologize for any delays or issues</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Follow up after resolving an issue</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Don'ts</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <span>Make promises you cannot keep about delivery times</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <span>Share internal information or blame other departments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <span>Use technical jargon that customers may not understand</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <span>Ignore customer inquiries for more than 24 hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <span>Respond with one-word answers or unclear information</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Communications;
