
import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Users, 
  Send, 
  File, 
  Image, 
  Paperclip,
  Search,
  Clock,
  Book,
  CheckCircle2
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Mock data for conversations and messages
const mockConversations = [
  {
    id: 1,
    name: "General Announcements",
    avatar: "/placeholder.svg",
    lastMessage: "New inventory guidelines are now available",
    timestamp: "1h ago",
    unread: 2,
    isGroup: true,
    participants: ["John", "Sarah", "Michael", "Alice"]
  },
  {
    id: 2,
    name: "Product Team",
    avatar: "/placeholder.svg",
    lastMessage: "When will the new summer items be processed?",
    timestamp: "2h ago",
    unread: 0,
    isGroup: true,
    participants: ["John", "Sarah", "Michael"]
  },
  {
    id: 3,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg",
    lastMessage: "I'll handle the special order that came in today",
    timestamp: "3h ago",
    unread: 0,
    isGroup: false
  },
  {
    id: 4,
    name: "Michael Wong",
    avatar: "/placeholder.svg",
    lastMessage: "Have you checked the delivery schedule?",
    timestamp: "5h ago",
    unread: 1,
    isGroup: false
  },
  {
    id: 5,
    name: "Order Processing",
    avatar: "/placeholder.svg",
    lastMessage: "We have a backlog for the weekend",
    timestamp: "Yesterday",
    unread: 0,
    isGroup: true,
    participants: ["Alice", "Bob", "Charlie", "Diana"]
  }
];

const mockMessages = [
  {
    id: 1,
    sender: "Admin",
    senderAvatar: "/placeholder.svg",
    content: "Good morning team! Just a reminder that we have a new shipment of items coming in tomorrow. Please prepare space in the storage area.",
    timestamp: "9:30 AM",
    status: "read"
  },
  {
    id: 2,
    sender: "Sarah Johnson",
    senderAvatar: "/placeholder.svg",
    content: "I've already cleared section B for the new arrivals.",
    timestamp: "9:32 AM",
    status: "read"
  },
  {
    id: 3,
    sender: "Michael Wong",
    senderAvatar: "/placeholder.svg",
    content: "Do we know what categories will be in this shipment?",
    timestamp: "9:35 AM",
    status: "read"
  },
  {
    id: 4,
    sender: "Admin",
    senderAvatar: "/placeholder.svg",
    content: "It's mostly summer clothing and accessories. Here's the inventory list.",
    timestamp: "9:40 AM",
    status: "read",
    attachment: {
      name: "inventory_list.xlsx",
      size: "1.2 MB",
      type: "spreadsheet"
    }
  },
  {
    id: 5,
    sender: "Sarah Johnson",
    senderAvatar: "/placeholder.svg",
    content: "Perfect, thanks! I'll prepare the tagging stations as well.",
    timestamp: "9:42 AM",
    status: "read"
  }
];

// Mock knowledge base articles
const mockArticles = [
  {
    id: 1,
    title: "Product Photography Guidelines",
    category: "Products",
    excerpt: "Learn how to take high-quality photos of thrift items for our online store",
    createdBy: "Admin",
    updatedAt: "2 days ago",
    readTime: "5 mins"
  },
  {
    id: 2,
    title: "Processing New Inventory",
    category: "Operations",
    excerpt: "Step-by-step guide for receiving, sorting, and pricing new inventory",
    createdBy: "Admin",
    updatedAt: "1 week ago",
    readTime: "10 mins"
  },
  {
    id: 3,
    title: "Customer Service Best Practices",
    category: "Customer Support",
    excerpt: "Guidelines for providing excellent customer service in-store and online",
    createdBy: "Admin",
    updatedAt: "3 days ago",
    readTime: "7 mins"
  },
  {
    id: 4,
    title: "Using the Barcode Scanner",
    category: "Technology",
    excerpt: "Instructions for using our mobile barcode scanning system",
    createdBy: "Admin",
    updatedAt: "5 days ago",
    readTime: "4 mins"
  },
  {
    id: 5,
    title: "Order Fulfillment Process",
    category: "Operations",
    excerpt: "Complete workflow for processing online orders and preparing shipments",
    createdBy: "Admin",
    updatedAt: "2 weeks ago",
    readTime: "12 mins"
  }
];

const StaffCommunications = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("messages");
  const [activeConversation, setActiveConversation] = useState(1);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredConversations = mockConversations.filter(
    conv => conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    toast.success("Message sent successfully");
    setMessageText("");
  };
  
  const renderMessageAttachment = (attachment: any) => {
    if (!attachment) return null;
    
    return (
      <div className="flex items-center p-2 rounded-md bg-muted mt-1 max-w-xs">
        <File className="h-4 w-4 mr-2 flex-shrink-0" />
        <div className="truncate flex-1">
          <p className="text-xs font-medium truncate">{attachment.name}</p>
          <p className="text-xs text-muted-foreground">{attachment.size}</p>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Communications</h1>
          <p className="text-muted-foreground">
            Team messaging and knowledge base
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="messages">
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="knowledge">
              <Book className="h-4 w-4 mr-2" />
              Knowledge Base
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
              {/* Conversations List */}
              <Card className="md:col-span-1 h-full flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span>Conversations</span>
                    <Button size="sm" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      New
                    </Button>
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-8"
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-0 flex-1 overflow-hidden">
                  <ScrollArea className="h-full pr-4">
                    <div className="space-y-2">
                      {filteredConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className={`flex items-start gap-3 p-3 rounded-md cursor-pointer hover:bg-muted ${activeConversation === conversation.id ? "bg-muted" : ""}`}
                          onClick={() => setActiveConversation(conversation.id)}
                        >
                          <Avatar>
                            <AvatarImage src={conversation.avatar} alt={conversation.name} />
                            <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm truncate">{conversation.name}</h4>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">{conversation.timestamp}</span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {conversation.lastMessage}
                            </p>
                            {conversation.isGroup && (
                              <div className="flex items-center mt-1">
                                <Users className="h-3 w-3 text-muted-foreground mr-1" />
                                <span className="text-xs text-muted-foreground">{conversation.participants?.length || 0} members</span>
                              </div>
                            )}
                          </div>
                          {conversation.unread > 0 && (
                            <Badge variant="default" className="rounded-full h-5 w-5 flex items-center justify-center p-0">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              {/* Message Thread */}
              <Card className="md:col-span-2 h-full flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage 
                        src={mockConversations.find(c => c.id === activeConversation)?.avatar} 
                        alt={mockConversations.find(c => c.id === activeConversation)?.name} 
                      />
                      <AvatarFallback>
                        {mockConversations.find(c => c.id === activeConversation)?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{mockConversations.find(c => c.id === activeConversation)?.name}</CardTitle>
                      {mockConversations.find(c => c.id === activeConversation)?.isGroup && (
                        <CardDescription>
                          {mockConversations.find(c => c.id === activeConversation)?.participants?.join(", ")}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4 flex-1 overflow-hidden">
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {mockMessages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex gap-3 ${message.sender === "Admin" ? "justify-end" : ""}`}
                        >
                          {message.sender !== "Admin" && (
                            <Avatar>
                              <AvatarImage src={message.senderAvatar} alt={message.sender} />
                              <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                          <div className={`max-w-[70%] ${message.sender === "Admin" ? "order-1" : "order-2"}`}>
                            <div className="flex items-center gap-2 mb-1">
                              {message.sender !== "Admin" && (
                                <span className="text-sm font-medium">{message.sender}</span>
                              )}
                              <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                            </div>
                            <div 
                              className={`p-3 rounded-lg ${
                                message.sender === "Admin" 
                                  ? "bg-primary text-primary-foreground" 
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              {renderMessageAttachment(message.attachment)}
                            </div>
                            {message.sender === "Admin" && (
                              <div className="flex justify-end mt-1">
                                <span className="text-xs text-muted-foreground flex items-center">
                                  <CheckCircle2 className="h-3 w-3 mr-1" /> {message.status}
                                </span>
                              </div>
                            )}
                          </div>
                          {message.sender === "Admin" && (
                            <Avatar className="order-2">
                              <AvatarImage src={message.senderAvatar} alt={message.sender} />
                              <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Textarea 
                      placeholder="Type your message..." 
                      className="min-h-[60px]"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <div className="flex flex-col gap-2">
                      <Button size="icon" variant="outline">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button size="icon" onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="knowledge" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Knowledge Base</CardTitle>
                  <Button>
                    <File className="h-4 w-4 mr-2" />
                    New Article
                  </Button>
                </div>
                <CardDescription>
                  Access training materials, guides and standard operating procedures
                </CardDescription>
                <div className="relative mt-2">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-8"
                    placeholder="Search knowledge base..."
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockArticles.map((article) => (
                    <Card key={article.id} className="overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{article.category}</Badge>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {article.readTime}
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Updated {article.updatedAt}
                          </span>
                          <Button variant="link" className="p-0 h-auto">Read More</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default StaffCommunications;
