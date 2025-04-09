
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Users, 
  PlusCircle, 
  Send, 
  Search, 
  MessageSquare, 
  Bell, 
  FileText,
  Image,
  Paperclip,
  Smile,
  AtSign
} from 'lucide-react';

// Mock messages
const mockChats = [
  {
    id: 'chat1',
    name: 'General',
    type: 'group',
    participants: ['user1', 'user2', 'user3', 'user4', 'user5'],
    lastMessage: {
      sender: 'Jane Smith',
      content: 'I just processed the new arrivals. 15 items added to inventory.',
      timestamp: '2023-04-09T10:30:00Z',
      read: true
    },
    unread: 0
  },
  {
    id: 'chat2',
    name: 'Product Team',
    type: 'group',
    participants: ['user1', 'user2', 'user3'],
    lastMessage: {
      sender: 'John Doe',
      content: 'The new vintage collection is ready for review.',
      timestamp: '2023-04-09T09:45:00Z',
      read: false
    },
    unread: 3
  },
  {
    id: 'chat3',
    name: 'Order #TTS-20250408-1234',
    type: 'order',
    participants: ['user1', 'user4'],
    lastMessage: {
      sender: 'Bob Johnson',
      content: 'Customer requested special packaging for this order.',
      timestamp: '2023-04-08T16:20:00Z',
      read: true
    },
    unread: 0
  },
  {
    id: 'chat4',
    name: 'Jane Smith',
    type: 'direct',
    participants: ['user1', 'user2'],
    lastMessage: {
      sender: 'Jane Smith',
      content: 'Can you help me with the inventory count tomorrow?',
      timestamp: '2023-04-08T15:10:00Z',
      read: true
    },
    unread: 0
  },
  {
    id: 'chat5',
    name: 'Delivery Team',
    type: 'group',
    participants: ['user1', 'user4', 'user5'],
    lastMessage: {
      sender: 'Alice Williams',
      content: 'All deliveries completed for today. 8 orders successfully delivered.',
      timestamp: '2023-04-08T18:05:00Z',
      read: false
    },
    unread: 2
  }
];

const mockMessages = {
  'chat1': [
    {
      id: 'm1',
      sender: {
        id: 'user2',
        name: 'Jane Smith',
        avatar: '/placeholder.svg'
      },
      content: 'Good morning team! Hope everyone had a great weekend.',
      timestamp: '2023-04-09T08:30:00Z',
      read: true
    },
    {
      id: 'm2',
      sender: {
        id: 'user3',
        name: 'Bob Johnson',
        avatar: '/placeholder.svg'
      },
      content: 'Morning! Yes, it was good. Ready for the new week!',
      timestamp: '2023-04-09T08:32:00Z',
      read: true
    },
    {
      id: 'm3',
      sender: {
        id: 'user1',
        name: 'John Doe',
        avatar: '/placeholder.svg'
      },
      content: 'We have a lot of new arrivals to process today. Can someone help with the photos?',
      timestamp: '2023-04-09T08:35:00Z',
      read: true
    },
    {
      id: 'm4',
      sender: {
        id: 'user2',
        name: 'Jane Smith',
        avatar: '/placeholder.svg'
      },
      content: 'I can help with that. I\'ll be in the photo studio after lunch.',
      timestamp: '2023-04-09T08:40:00Z',
      read: true
    },
    {
      id: 'm5',
      sender: {
        id: 'user4',
        name: 'Alice Williams',
        avatar: '/placeholder.svg'
      },
      content: 'Don\'t forget we have a team meeting at 2pm today.',
      timestamp: '2023-04-09T09:15:00Z',
      read: true
    },
    {
      id: 'm6',
      sender: {
        id: 'user2',
        name: 'Jane Smith',
        avatar: '/placeholder.svg'
      },
      content: 'I just processed the new arrivals. 15 items added to inventory.',
      timestamp: '2023-04-09T10:30:00Z',
      read: true
    }
  ],
  'chat2': [
    {
      id: 'm1',
      sender: {
        id: 'user1',
        name: 'John Doe',
        avatar: '/placeholder.svg'
      },
      content: 'Team, I\'ve just received the new vintage collection from our supplier.',
      timestamp: '2023-04-09T09:00:00Z',
      read: true
    },
    {
      id: 'm2',
      sender: {
        id: 'user1',
        name: 'John Doe',
        avatar: '/placeholder.svg'
      },
      content: 'There are about 30 pieces that need to be processed and photographed.',
      timestamp: '2023-04-09T09:01:00Z',
      read: true
    },
    {
      id: 'm3',
      sender: {
        id: 'user3',
        name: 'Bob Johnson',
        avatar: '/placeholder.svg'
      },
      content: 'Sounds great! When do you need them ready by?',
      timestamp: '2023-04-09T09:10:00Z',
      read: false
    },
    {
      id: 'm4',
      sender: {
        id: 'user1',
        name: 'John Doe',
        avatar: '/placeholder.svg'
      },
      content: 'Ideally by Thursday so we can feature them in the weekend newsletter.',
      timestamp: '2023-04-09T09:15:00Z',
      read: false
    },
    {
      id: 'm5',
      sender: {
        id: 'user2',
        name: 'Jane Smith',
        avatar: '/placeholder.svg'
      },
      content: 'I can start processing them today. Can you share some preview photos?',
      timestamp: '2023-04-09T09:30:00Z',
      read: false
    },
    {
      id: 'm6',
      sender: {
        id: 'user1',
        name: 'John Doe',
        avatar: '/placeholder.svg'
      },
      content: 'The new vintage collection is ready for review.',
      timestamp: '2023-04-09T09:45:00Z',
      read: false
    }
  ]
};

// Mock announcements
const mockAnnouncements = [
  {
    id: 'a1',
    title: 'System Maintenance',
    content: 'The system will be down for maintenance on Sunday, April 12th from 2am to 5am. Please plan your work accordingly.',
    sender: 'John Doe',
    role: 'Admin',
    timestamp: '2023-04-08T14:30:00Z',
    priority: 'high',
    readBy: ['user1', 'user2']
  },
  {
    id: 'a2',
    title: 'New Feature: Enhanced AI Product Descriptions',
    content: 'We\'ve upgraded our AI product description generator. It now provides more detailed and SEO-friendly descriptions. Try it out!',
    sender: 'Jane Smith',
    role: 'Product Manager',
    timestamp: '2023-04-07T10:15:00Z',
    priority: 'medium',
    readBy: ['user1', 'user2', 'user3', 'user4']
  },
  {
    id: 'a3',
    title: 'Holiday Schedule',
    content: 'The store will be closed on April 20th for the national holiday. All deliveries will resume on April 21st.',
    sender: 'John Doe',
    role: 'Admin',
    timestamp: '2023-04-05T16:45:00Z',
    priority: 'medium',
    readBy: ['user1', 'user3']
  }
];

const Communications = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [chats, setChats] = useState(mockChats);
  const [messages, setMessages] = useState(mockMessages);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium'
  });
  
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentChat) return;
    
    const newMsg = {
      id: `m${Date.now()}`,
      sender: {
        id: 'user1',
        name: 'John Doe',
        avatar: '/placeholder.svg'
      },
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: true
    };
    
    // Update messages
    setMessages(prev => ({
      ...prev,
      [currentChat]: [...(prev[currentChat] || []), newMsg]
    }));
    
    // Update last message in chat list
    setChats(prev => prev.map(chat => 
      chat.id === currentChat 
        ? {
            ...chat,
            lastMessage: {
              sender: 'John Doe',
              content: newMessage,
              timestamp: new Date().toISOString(),
              read: true
            }
          }
        : chat
    ));
    
    setNewMessage('');
    toast.success('Message sent');
  };
  
  const handleCreateAnnouncement = () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) return;
    
    const announcement = {
      id: `a${Date.now()}`,
      ...newAnnouncement,
      sender: 'John Doe',
      role: 'Admin',
      timestamp: new Date().toISOString(),
      readBy: ['user1']
    };
    
    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({
      title: '',
      content: '',
      priority: 'medium'
    });
    
    toast.success('Announcement published');
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  useEffect(() => {
    // Mark messages as read when chat is opened
    if (currentChat) {
      setChats(prev => prev.map(chat => 
        chat.id === currentChat 
          ? { ...chat, unread: 0 }
          : chat
      ));
    }
  }, [currentChat]);
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Communications</h1>
          <p className="text-muted-foreground">
            Team messaging, announcements, and order collaboration
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-3">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Announcements
            </TabsTrigger>
            <TabsTrigger value="knowledgebase" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Knowledge Base
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-250px)]">
              {/* Chat list */}
              <Card className="md:col-span-1 flex flex-col h-full max-h-full">
                <CardHeader className="px-4 py-3 pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Conversations</CardTitle>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search chats..." 
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-2">
                      {filteredChats.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">No chats found</p>
                      ) : (
                        filteredChats.map((chat) => (
                          <div 
                            key={chat.id}
                            className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                              currentChat === chat.id 
                                ? 'bg-secondary' 
                                : 'hover:bg-secondary/50'
                            }`}
                            onClick={() => setCurrentChat(chat.id)}
                          >
                            {chat.type === 'group' ? (
                              <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-primary/20 text-primary">
                                <Users className="h-5 w-5" />
                                {chat.unread > 0 && (
                                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary text-white text-xs font-medium rounded-full">
                                    {chat.unread}
                                  </span>
                                )}
                              </div>
                            ) : chat.type === 'order' ? (
                              <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500">
                                <FileText className="h-5 w-5" />
                                {chat.unread > 0 && (
                                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary text-white text-xs font-medium rounded-full">
                                    {chat.unread}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="relative">
                                <Avatar>
                                  <AvatarImage src="/placeholder.svg" />
                                  <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {chat.unread > 0 && (
                                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary text-white text-xs font-medium rounded-full">
                                    {chat.unread}
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between">
                                <h3 className="font-medium truncate">{chat.name}</h3>
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(chat.lastMessage.timestamp)}
                                </span>
                              </div>
                              <div className="flex items-start">
                                <p className="text-sm text-muted-foreground truncate">
                                  {chat.type !== 'direct' && (
                                    <span className="font-medium">{chat.lastMessage.sender}: </span>
                                  )}
                                  {chat.lastMessage.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              {/* Chat window */}
              <Card className="md:col-span-2 flex flex-col h-full max-h-full">
                {currentChat ? (
                  <>
                    <CardHeader className="px-6 py-4 flex-row items-center gap-4 border-b">
                      {chats.find(c => c.id === currentChat)?.type === 'group' ? (
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/20 text-primary">
                          <Users className="h-5 w-5" />
                        </div>
                      ) : chats.find(c => c.id === currentChat)?.type === 'order' ? (
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500">
                          <FileText className="h-5 w-5" />
                        </div>
                      ) : (
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>
                            {chats.find(c => c.id === currentChat)?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <CardTitle>{chats.find(c => c.id === currentChat)?.name}</CardTitle>
                        <CardDescription>
                          {chats.find(c => c.id === currentChat)?.type === 'group' 
                            ? `${chats.find(c => c.id === currentChat)?.participants.length} members`
                            : chats.find(c => c.id === currentChat)?.type === 'order'
                              ? 'Order collaboration'
                              : 'Direct message'
                          }
                        </CardDescription>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 overflow-hidden p-0">
                      <ScrollArea className="h-full p-6">
                        <div className="space-y-4">
                          {messages[currentChat]?.map((message, i) => {
                            const isFirstMessage = i === 0 || formatDate(messages[currentChat][i-1].timestamp) !== formatDate(message.timestamp);
                            
                            return (
                              <div key={message.id}>
                                {isFirstMessage && (
                                  <div className="flex justify-center my-4">
                                    <Badge variant="outline" className="text-xs text-muted-foreground">
                                      {formatDate(message.timestamp)}
                                    </Badge>
                                  </div>
                                )}
                                
                                <div className={`flex items-start gap-3 ${
                                  message.sender.id === 'user1' ? 'flex-row-reverse' : ''
                                }`}>
                                  <Avatar className="mt-0.5">
                                    <AvatarImage src={message.sender.avatar} />
                                    <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className={`max-w-[70%] ${
                                    message.sender.id === 'user1' ? 'text-right' : ''
                                  }`}>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className={`text-sm font-medium ${
                                        message.sender.id === 'user1' ? 'order-last' : ''
                                      }`}>
                                        {message.sender.name}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {formatTime(message.timestamp)}
                                      </span>
                                    </div>
                                    <div className={`p-3 rounded-lg ${
                                      message.sender.id === 'user1'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-secondary'
                                    }`}>
                                      <p className="text-sm">{message.content}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </CardContent>
                    
                    <CardFooter className="p-4 border-t">
                      <div className="flex items-center gap-2 w-full">
                        <Button variant="outline" size="icon" className="shrink-0">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="shrink-0">
                          <Image className="h-4 w-4" />
                        </Button>
                        <div className="relative flex-1">
                          <Input 
                            placeholder="Type a message..." 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                            className="pr-20"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Smile className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <AtSign className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Button onClick={handleSendMessage} className="shrink-0">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <MessageSquare className="h-12 w-12 mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
                    <p className="text-muted-foreground">
                      Choose a conversation from the list or start a new one.
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="announcements" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-250px)]">
              {/* Create announcement */}
              <Card className="md:col-span-1 flex flex-col h-full">
                <CardHeader>
                  <CardTitle>Create Announcement</CardTitle>
                  <CardDescription>
                    Post an announcement to all staff or specific teams
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      placeholder="Announcement title"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea 
                      id="content" 
                      placeholder="Announcement content"
                      className="flex-1 min-h-[200px]"
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={newAnnouncement.priority}
                      onValueChange={(value) => setNewAnnouncement(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="audience">Audience</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Staff</SelectItem>
                        <SelectItem value="admin">Admins</SelectItem>
                        <SelectItem value="product">Product Team</SelectItem>
                        <SelectItem value="order">Order Preparers</SelectItem>
                        <SelectItem value="delivery">Delivery Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={handleCreateAnnouncement}
                    disabled={!newAnnouncement.title.trim() || !newAnnouncement.content.trim()}
                  >
                    Publish Announcement
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Announcements list */}
              <Card className="md:col-span-2 flex flex-col h-full">
                <CardHeader>
                  <CardTitle>Announcements</CardTitle>
                  <CardDescription>
                    Recent announcements for your team
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                  <ScrollArea className="h-full p-6">
                    <div className="space-y-6">
                      {announcements.map((announcement) => (
                        <div key={announcement.id} className="border rounded-lg overflow-hidden">
                          <div className={`px-4 py-3 flex justify-between items-center ${
                            announcement.priority === 'high' 
                              ? 'bg-red-500/10 border-b border-red-500/20' 
                              : announcement.priority === 'medium'
                                ? 'bg-yellow-500/10 border-b border-yellow-500/20'
                                : 'bg-green-500/10 border-b border-green-500/20'
                          }`}>
                            <h3 className="font-medium">
                              {announcement.title}
                            </h3>
                            <Badge variant="outline" className={`${
                              announcement.priority === 'high' 
                                ? 'bg-red-500/20 text-red-500' 
                                : announcement.priority === 'medium'
                                  ? 'bg-yellow-500/20 text-yellow-500'
                                  : 'bg-green-500/20 text-green-500'
                            }`}>
                              {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                            </Badge>
                          </div>
                          <div className="p-4">
                            <p className="text-sm mb-4">{announcement.content}</p>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src="/placeholder.svg" />
                                  <AvatarFallback>{announcement.sender.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{announcement.sender} ({announcement.role})</span>
                              </div>
                              <span>{formatDate(announcement.timestamp)} at {formatTime(announcement.timestamp)}</span>
                            </div>
                            <div className="mt-3 text-xs text-muted-foreground">
                              Read by {announcement.readBy.length} team members
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="knowledgebase" className="m-0">
            <Card className="h-[calc(100vh-250px)]">
              <CardHeader>
                <CardTitle>Knowledge Base</CardTitle>
                <CardDescription>
                  Centralized resource library for your team
                </CardDescription>
              </CardHeader>
              <CardContent className="h-full flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-medium mb-2">Knowledge Base is coming soon</h3>
                  <p className="text-muted-foreground mb-4">
                    We're working on building a comprehensive knowledge base for your team.
                  </p>
                  <Button variant="outline">Request Early Access</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Communications;
