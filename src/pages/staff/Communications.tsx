
import React, { useState } from 'react';
import StaffLayout from '@/components/layout/StaffLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Search, Bell, Pin, Paperclip, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Communications: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('messages');
  const [newMessage, setNewMessage] = useState('');
  
  // Mock data for communications
  const conversations = [
    { 
      id: '1', 
      name: 'Admin Team', 
      avatar: '', 
      lastMessage: 'New inventory received today', 
      time: '10:23 AM', 
      unread: 2,
      isGroup: true,
      members: ['Jane', 'John', 'Sarah', 'Michael']
    },
    { 
      id: '2', 
      name: 'Sarah Johnson', 
      avatar: '', 
      lastMessage: 'The new labels are ready for printing', 
      time: 'Yesterday', 
      unread: 0,
      isGroup: false
    },
    { 
      id: '3', 
      name: 'Delivery Team', 
      avatar: '', 
      lastMessage: 'Routes for tomorrow are set', 
      time: 'Yesterday', 
      unread: 3,
      isGroup: true,
      members: ['David', 'Grace', 'Robert', 'Emma']
    },
    { 
      id: '4', 
      name: 'Michael Brown', 
      avatar: '', 
      lastMessage: 'I\'ve prepared the monthly inventory report', 
      time: 'Monday', 
      unread: 0,
      isGroup: false
    },
  ];
  
  const announcements = [
    {
      id: '1',
      title: 'System Maintenance',
      content: 'The system will be under maintenance this Saturday from 11 PM to 2 AM. Please complete all pending tasks before this time.',
      date: '2025-04-08T10:00:00',
      author: 'System Admin',
      priority: 'high'
    },
    {
      id: '2',
      title: 'New Shipping Partner',
      content: 'We are pleased to announce our partnership with FastShip for rural area deliveries. Training session will be held next Tuesday.',
      date: '2025-04-07T14:30:00',
      author: 'Operations Manager',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Updated Return Policy',
      content: 'Please note that our return policy has been updated. All staff should review the new guidelines in the knowledge base.',
      date: '2025-04-05T09:15:00',
      author: 'Customer Service Lead',
      priority: 'medium'
    },
  ];
  
  const knowledgeBase = [
    {
      id: '1',
      title: 'Product Quality Assessment Guide',
      category: 'Inventory',
      lastUpdated: '2025-04-01',
      views: 156
    },
    {
      id: '2',
      title: 'Shipping and Delivery SOP',
      category: 'Logistics',
      lastUpdated: '2025-03-25',
      views: 98
    },
    {
      id: '3',
      title: 'Customer Service Guidelines',
      category: 'Support',
      lastUpdated: '2025-03-20',
      views: 143
    },
    {
      id: '4',
      title: 'Barcode Scanning Instructions',
      category: 'Operations',
      lastUpdated: '2025-03-15',
      views: 87
    },
    {
      id: '5',
      title: 'Product Pricing Strategy',
      category: 'Sales',
      lastUpdated: '2025-03-10',
      views: 112
    },
  ];
  
  const selectedConversation = {
    id: '1',
    name: 'Admin Team',
    avatar: '',
    isGroup: true,
    members: ['Jane', 'John', 'Sarah', 'Michael'],
    messages: [
      {
        id: 'm1',
        sender: 'Jane',
        avatar: '',
        content: 'Good morning team! We have a new shipment arriving today.',
        time: '9:45 AM',
        isCurrentUser: false
      },
      {
        id: 'm2',
        sender: 'John',
        avatar: '',
        content: 'What time should we expect it?',
        time: '9:47 AM',
        isCurrentUser: false
      },
      {
        id: 'm3',
        sender: 'Sarah',
        avatar: '',
        content: 'Around 11 AM. I\'ll need help with inventory processing.',
        time: '9:50 AM',
        isCurrentUser: false
      },
      {
        id: 'm4',
        sender: user?.name || 'You',
        avatar: '',
        content: 'I can help with that. I\'ll be available after my current task.',
        time: '10:15 AM',
        isCurrentUser: true
      },
      {
        id: 'm5',
        sender: 'Jane',
        avatar: '',
        content: 'Thank you! Also, remember we have a team meeting at 2 PM today.',
        time: '10:23 AM',
        isCurrentUser: false
      },
    ]
  };
  
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    // In a real app, this would send the message to the backend
    toast.success('Message sent successfully');
    setNewMessage('');
  };
  
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return <Badge className="bg-red-500">High</Badge>;
      case 'medium':
        return <Badge className="bg-orange-500">Medium</Badge>;
      default:
        return <Badge>Low</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  return (
    <StaffLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Communications Hub</h1>
            <p className="text-muted-foreground">Stay connected with your team and access important information</p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="messages">
              <MessageCircle className="mr-2 h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="announcements">
              <Bell className="mr-2 h-4 w-4" />
              Announcements
            </TabsTrigger>
            <TabsTrigger value="knowledge">
              <Users className="mr-2 h-4 w-4" />
              Knowledge Base
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-280px)]">
              {/* Conversations list */}
              <Card className="col-span-1 overflow-hidden">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search messages..." className="pl-8" />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[calc(100vh-380px)]">
                    <div className="space-y-0 divide-y">
                      {conversations.map((conversation) => (
                        <div 
                          key={conversation.id} 
                          className={`p-3 hover:bg-muted/50 cursor-pointer ${conversation.id === '1' ? 'bg-muted' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={conversation.avatar} />
                              <AvatarFallback>
                                {conversation.isGroup ? 
                                  <Users className="h-4 w-4" /> : 
                                  conversation.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <p className="font-medium truncate">{conversation.name}</p>
                                <span className="text-xs text-muted-foreground">{conversation.time}</span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                            </div>
                            {conversation.unread > 0 && (
                              <Badge className="ml-auto">{conversation.unread}</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              {/* Chat area */}
              <Card className="col-span-2 flex flex-col overflow-hidden">
                <CardHeader className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedConversation.avatar} />
                        <AvatarFallback>
                          {selectedConversation.isGroup ? 
                            <Users className="h-4 w-4" /> : 
                            selectedConversation.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{selectedConversation.name}</CardTitle>
                        {selectedConversation.isGroup && (
                          <CardDescription>
                            {selectedConversation.members.join(', ')}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 470px)' }}>
                  <ScrollArea className="h-full pr-4">
                    <div className="space-y-4">
                      {selectedConversation.messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-2 max-w-[80%] ${message.isCurrentUser ? 'flex-row-reverse' : ''}`}>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={message.avatar} />
                              <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className={`rounded-lg px-3 py-2 ${message.isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                {!message.isCurrentUser && (
                                  <p className="text-xs font-medium mb-1">{message.sender}</p>
                                )}
                                <p>{message.content}</p>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{message.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="p-4 border-t">
                  <div className="flex items-center gap-2 w-full">
                    <Button variant="outline" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="announcements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Announcements</CardTitle>
                <CardDescription>Important updates and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="space-y-2 border-b pb-4 last:border-0">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{announcement.title}</h3>
                          {getPriorityBadge(announcement.priority)}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <time dateTime={announcement.date}>{formatDate(announcement.date)}</time>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Pin className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{announcement.content}</p>
                      <p className="text-sm text-muted-foreground">Posted by: {announcement.author}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="knowledge" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base</CardTitle>
                <CardDescription>Access training materials and standard operating procedures</CardDescription>
                <div className="relative mt-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search knowledge base..." className="pl-8" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {knowledgeBase.map((item) => (
                    <Card key={item.id} className="cursor-pointer hover:bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{item.category}</Badge>
                              <p className="text-xs text-muted-foreground">
                                Updated: {item.lastUpdated} • {item.views} views
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Browse All Resources</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StaffLayout>
  );
};

export default Communications;
