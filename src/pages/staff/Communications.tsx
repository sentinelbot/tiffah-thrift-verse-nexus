
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MessageSquare,
  Bell,
  Send,
  FileText,
  User,
  Plus,
  Search,
  MoreVertical,
  CheckCircle2,
  Clock,
  Users,
  Phone,
  Video,
  Paperclip,
  Info,
  Settings,
  Smile,
  ChevronLeft,
  UserPlus,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock notifications
const mockNotifications = [
  {
    id: 'notif-001',
    title: 'New Order Assigned',
    message: 'Order #TTS-20250410-0001 has been assigned to you for preparation.',
    timestamp: new Date(Date.now() - 60000 * 5).toISOString(),
    read: false,
    type: 'order',
  },
  {
    id: 'notif-002',
    title: 'Staff Meeting Reminder',
    message: 'Weekly staff meeting tomorrow at 9:00 AM in the conference room.',
    timestamp: new Date(Date.now() - 60000 * 60).toISOString(),
    read: false,
    type: 'announcement',
  },
  {
    id: 'notif-003',
    title: 'New Inventory Alert',
    message: '15 new products have been added to inventory and need processing.',
    timestamp: new Date(Date.now() - 60000 * 120).toISOString(),
    read: true,
    type: 'inventory',
  },
  {
    id: 'notif-004',
    title: 'Delivery Confirmation',
    message: 'Order #TTS-20250409-0004 was successfully delivered to the customer.',
    timestamp: new Date(Date.now() - 60000 * 180).toISOString(),
    read: true,
    type: 'delivery',
  },
];

// Mock messages
const mockMessages = [
  {
    id: 'chat-001',
    name: 'Jane Doe',
    role: 'Manager',
    avatar: '/placeholder.svg',
    lastMessage: 'Please check the new inventory items when you have a moment.',
    timestamp: new Date(Date.now() - 60000 * 15).toISOString(),
    unread: 2,
    online: true,
  },
  {
    id: 'chat-002',
    name: 'John Smith',
    role: 'Order Preparer',
    avatar: '/placeholder.svg',
    lastMessage: 'Do you know where the packing materials are stored?',
    timestamp: new Date(Date.now() - 60000 * 60).toISOString(),
    unread: 0,
    online: false,
  },
  {
    id: 'chat-003',
    name: 'Support Group',
    role: 'Team Chat',
    avatar: '/placeholder.svg',
    lastMessage: 'Alex: We need more shipping labels for today.',
    timestamp: new Date(Date.now() - 60000 * 120).toISOString(),
    unread: 5,
    online: true,
    isGroup: true,
  },
];

// Mock conversation
const mockConversation = [
  {
    id: 'msg-001',
    sender: 'Jane Doe',
    senderId: 'user-002',
    content: 'Hi there! How are you doing today?',
    timestamp: new Date(Date.now() - 60000 * 60).toISOString(),
  },
  {
    id: 'msg-002',
    sender: 'Me',
    senderId: 'current-user',
    content: 'I\'m doing well, thanks for asking! Just finishing up some order processing.',
    timestamp: new Date(Date.now() - 60000 * 58).toISOString(),
  },
  {
    id: 'msg-003',
    sender: 'Jane Doe',
    senderId: 'user-002',
    content: 'Great! When you have a moment, please check the new inventory items that came in this morning.',
    timestamp: new Date(Date.now() - 60000 * 45).toISOString(),
  },
  {
    id: 'msg-004',
    sender: 'Jane Doe',
    senderId: 'user-002',
    content: 'We received a batch of vintage denim jackets that need to be processed and labeled.',
    timestamp: new Date(Date.now() - 60000 * 44).toISOString(),
  },
  {
    id: 'msg-005',
    sender: 'Me',
    senderId: 'current-user',
    content: 'Sure thing! I\'ll check them out as soon as I finish the current order batch.',
    timestamp: new Date(Date.now() - 60000 * 30).toISOString(),
  },
  {
    id: 'msg-006',
    sender: 'Jane Doe',
    senderId: 'user-002',
    content: 'Perfect, thank you. Let me know if you have any questions about the pricing or categorization.',
    timestamp: new Date(Date.now() - 60000 * 15).toISOString(),
  },
];

// Mock documents
const mockDocuments = [
  {
    id: 'doc-001',
    title: 'Employee Handbook',
    category: 'HR',
    updatedAt: new Date(Date.now() - 60000 * 60 * 24 * 5).toISOString(),
    size: '2.4 MB',
    type: 'PDF',
  },
  {
    id: 'doc-002',
    title: 'Product Processing Guide',
    category: 'Operations',
    updatedAt: new Date(Date.now() - 60000 * 60 * 24 * 2).toISOString(),
    size: '1.8 MB',
    type: 'PDF',
  },
  {
    id: 'doc-003',
    title: 'Delivery Protocol',
    category: 'Operations',
    updatedAt: new Date(Date.now() - 60000 * 60 * 24 * 7).toISOString(),
    size: '1.2 MB',
    type: 'PDF',
  },
  {
    id: 'doc-004',
    title: 'Return Processing Checklist',
    category: 'Customer Service',
    updatedAt: new Date(Date.now() - 60000 * 60 * 24 * 10).toISOString(),
    size: '0.5 MB',
    type: 'PDF',
  },
];

const StaffCommunications = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('messages');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState<any>(null);
  
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    toast.success('Message sent!');
    setNewMessage('');
  };
  
  const handleSelectChat = (chat: any) => {
    setSelectedChat(chat);
  };
  
  const handleBackToChats = () => {
    setSelectedChat(null);
  };
  
  const handleMarkAsRead = (notificationId: string) => {
    toast.success('Notification marked as read');
  };
  
  const handleDownloadDocument = (documentId: string) => {
    toast.success('Document download started');
  };
  
  const filteredNotifications = mockNotifications
    .filter(notification => 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  const filteredMessages = mockMessages
    .filter(message => 
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  const filteredDocuments = mockDocuments
    .filter(document => 
      document.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      document.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Communications</h1>
          <p className="text-muted-foreground">Messages, notifications, and documents</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className={`lg:col-span-1 ${selectedChat ? 'hidden lg:block' : ''}`}>
          <Card className="h-[calc(100vh-12rem)]">
            <CardHeader className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <CardTitle>Communications</CardTitle>
                <Button variant="ghost" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="messages">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline-block">Messages</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications">
                    <Bell className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline-block">Alerts</span>
                  </TabsTrigger>
                  <TabsTrigger value="documents">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline-block">Docs</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0 overflow-auto h-[calc(100%-8rem)]">
              <TabsContent value="messages" className="m-0">
                <div className="divide-y">
                  {filteredMessages.length === 0 ? (
                    <div className="p-6 text-center">
                      <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No messages found</p>
                    </div>
                  ) : (
                    filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 cursor-pointer transition-colors hover:bg-muted/50 ${
                          message.unread ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => handleSelectChat(message)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={message.avatar} alt={message.name} />
                              <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {message.online && (
                              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium truncate">
                                {message.name}
                                {message.isGroup && (
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    Group
                                  </Badge>
                                )}
                              </h4>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatTimeAgo(message.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {message.lastMessage}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-muted-foreground">
                                {message.role}
                              </span>
                              {message.unread > 0 && (
                                <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                  {message.unread}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              <TabsContent value="notifications" className="m-0">
                <div className="divide-y">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-6 text-center">
                      <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No notifications found</p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 transition-colors ${
                          notification.read ? '' : 'bg-primary/5'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 text-primary rounded-full p-2">
                            {notification.type === 'order' && <ShoppingBag className="h-4 w-4" />}
                            {notification.type === 'announcement' && <Bell className="h-4 w-4" />}
                            {notification.type === 'inventory' && <Package className="h-4 w-4" />}
                            {notification.type === 'delivery' && <Truck className="h-4 w-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{notification.title}</h4>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Mark as {notification.read ? 'unread' : 'read'}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Clock className="mr-2 h-4 w-4" />
                                    Snooze
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                              {!notification.read && (
                                <span className="ml-2 h-2 w-2 rounded-full bg-primary"></span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              <TabsContent value="documents" className="m-0">
                <div className="divide-y">
                  {filteredDocuments.length === 0 ? (
                    <div className="p-6 text-center">
                      <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No documents found</p>
                    </div>
                  ) : (
                    filteredDocuments.map((document) => (
                      <div
                        key={document.id}
                        className="p-3 cursor-pointer transition-colors hover:bg-muted/50"
                        onClick={() => handleDownloadDocument(document.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 text-primary rounded-lg p-2">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium truncate">{document.title}</h4>
                              <Badge variant="outline">{document.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {document.category}
                            </p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-muted-foreground">
                                Updated {formatTimeAgo(document.updatedAt)}
                              </span>
                              <span className="mx-1 text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">
                                {document.size}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </CardContent>
            <CardFooter className="p-4 border-t">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/placeholder.svg" alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user?.role || 'Staff'}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {/* Chat Area */}
        <div className={`lg:col-span-2 ${!selectedChat ? 'hidden lg:block' : ''}`}>
          {selectedChat ? (
            <Card className="h-[calc(100vh-12rem)]">
              <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 border-b">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="lg:hidden" onClick={handleBackToChats}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedChat.avatar} alt={selectedChat.name} />
                    <AvatarFallback>{selectedChat.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      {selectedChat.name}
                      {selectedChat.online && (
                        <span className="ml-2 h-2 w-2 rounded-full bg-green-500"></span>
                      )}
                    </CardTitle>
                    <CardDescription>{selectedChat.role}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-auto h-[calc(100%-10rem)] flex flex-col-reverse">
                <div className="p-4 space-y-4">
                  {mockConversation.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] flex ${
                          message.senderId === 'current-user' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        {message.senderId !== 'current-user' && (
                          <Avatar className="h-8 w-8 mr-2 mt-1">
                            <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <div 
                            className={`rounded-lg px-4 py-2 ${
                              message.senderId === 'current-user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 px-1">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 w-full">
                  <Button type="button" variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="relative flex-1">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="pr-10"
                    />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          ) : (
            <Card className="h-[calc(100vh-12rem)] flex flex-col items-center justify-center">
              <div className="text-center p-6">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Your Messages</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Select a conversation to start chatting or create a new message to connect with your team.
                </p>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Start New Conversation
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffCommunications;
