
import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MessageSquare,
  Users,
  Search,
  Send,
  MoreVertical,
  PlusCircle,
  Info,
  File,
  FileText,
  Download,
  Star,
  Clock,
  AlertCircle,
  Pin,
  Copy,
  Trash2,
  Edit,
  CheckCircle,
  BookOpen,
  FileUp,
  Link,
  UserPlus,
  Filter,
  Bell,
  X,
  Eye,
  RefreshCw,
  Calendar,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Define types
type UserRole = 'admin' | 'productManager' | 'orderPreparer' | 'deliveryStaff' | 'customer';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

interface Message {
  id: string;
  sender: User;
  content: string;
  timestamp: string;
  attachments?: Attachment[];
  isRead: boolean;
  isPinned?: boolean;
}

interface ChatGroup {
  id: string;
  name: string;
  participants: User[];
  messages: Message[];
  unreadCount: number;
  lastMessage?: Message;
  isPrivate: boolean;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

interface KnowledgeCategory {
  id: string;
  name: string;
  count: number;
}

interface KnowledgeArticle {
  id: string;
  title: string;
  category: KnowledgeCategory;
  summary: string;
  content: string;
  author: User;
  created: string;
  updated?: string;
  views: number;
  status: 'published' | 'draft';
  isFeatured?: boolean;
  tags: string[];
}

// Mock data
const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    role: 'admin',
    status: 'online'
  },
  {
    id: 'user2',
    name: 'David Kimani',
    email: 'david.kimani@example.com',
    role: 'productManager',
    status: 'online'
  },
  {
    id: 'user3',
    name: 'John Mwangi',
    email: 'john.mwangi@example.com',
    role: 'orderPreparer',
    status: 'away',
    lastSeen: '2023-04-05T16:30:00Z'
  },
  {
    id: 'user4',
    name: 'Lucy Wanjiku',
    email: 'lucy.wanjiku@example.com',
    role: 'deliveryStaff',
    status: 'offline',
    lastSeen: '2023-04-05T14:15:00Z'
  }
];

const mockGroups: ChatGroup[] = [
  {
    id: 'group1',
    name: 'General',
    participants: mockUsers,
    messages: [
      {
        id: 'msg1',
        sender: mockUsers[0],
        content: 'Good morning team! Any updates on the new product arrivals?',
        timestamp: '2023-04-05T08:30:00Z',
        isRead: true
      },
      {
        id: 'msg2',
        sender: mockUsers[1],
        content: 'Yes, I\'ve processed 15 new products yesterday. They\'re now available in the inventory.',
        timestamp: '2023-04-05T08:35:00Z',
        isRead: true
      },
      {
        id: 'msg3',
        sender: mockUsers[2],
        content: 'Great! I'll start preparing the featured products section.',
        timestamp: '2023-04-05T08:40:00Z',
        isRead: true,
        isPinned: true
      }
    ],
    unreadCount: 0,
    isPrivate: false
  },
  {
    id: 'group2',
    name: 'Product Team',
    participants: [mockUsers[0], mockUsers[1]],
    messages: [
      {
        id: 'msg4',
        sender: mockUsers[0],
        content: 'David, can you please prioritize uploading the vintage leather jackets today?',
        timestamp: '2023-04-05T09:15:00Z',
        isRead: true
      },
      {
        id: 'msg5',
        sender: mockUsers[1],
        content: 'Will do, Sarah. I'll have them uploaded by noon.',
        timestamp: '2023-04-05T09:20:00Z',
        isRead: true
      }
    ],
    unreadCount: 0,
    isPrivate: false
  },
  {
    id: 'dm1',
    name: 'David Kimani',
    participants: [mockUsers[0], mockUsers[1]],
    messages: [
      {
        id: 'msg6',
        sender: mockUsers[0],
        content: 'Hi David, can you send me the inventory report when you have a moment?',
        timestamp: '2023-04-05T10:30:00Z',
        isRead: true
      },
      {
        id: 'msg7',
        sender: mockUsers[1],
        content: 'Sure thing! I'll generate it right away.',
        timestamp: '2023-04-05T10:35:00Z',
        isRead: true
      },
      {
        id: 'msg8',
        sender: mockUsers[1],
        content: 'Here's the inventory report for this week.',
        timestamp: '2023-04-05T10:40:00Z',
        attachments: [
          {
            id: 'attach1',
            name: 'inventory_report_week14.pdf',
            type: 'application/pdf',
            size: 1240000,
            url: '#'
          }
        ],
        isRead: true
      }
    ],
    unreadCount: 0,
    isPrivate: true
  },
  {
    id: 'dm2',
    name: 'John Mwangi',
    participants: [mockUsers[0], mockUsers[2]],
    messages: [
      {
        id: 'msg9',
        sender: mockUsers[2],
        content: 'Sarah, we have 5 orders ready for delivery. Should we schedule them for tomorrow?',
        timestamp: '2023-04-05T11:20:00Z',
        isRead: false
      }
    ],
    unreadCount: 1,
    isPrivate: true
  },
  {
    id: 'dm3',
    name: 'Lucy Wanjiku',
    participants: [mockUsers[0], mockUsers[3]],
    messages: [
      {
        id: 'msg10',
        sender: mockUsers[3],
        content: 'Completed all deliveries for today. Three customers specifically mentioned how happy they were with our packaging!',
        timestamp: '2023-04-05T14:10:00Z',
        isRead: false
      }
    ],
    unreadCount: 1,
    isPrivate: true
  }
];

const mockKnowledgeCategories: KnowledgeCategory[] = [
  { id: 'cat1', name: 'Getting Started', count: 5 },
  { id: 'cat2', name: 'Product Management', count: 8 },
  { id: 'cat3', name: 'Order Processing', count: 6 },
  { id: 'cat4', name: 'Delivery Procedures', count: 4 },
  { id: 'cat5', name: 'Customer Service', count: 7 }
];

const mockKnowledgeArticles: KnowledgeArticle[] = [
  {
    id: 'article1',
    title: 'Staff Onboarding Guide',
    category: mockKnowledgeCategories[0],
    summary: 'Complete guide for new staff members at Tiffah Thrift Store.',
    content: `# Welcome to Tiffah Thrift Store

This comprehensive guide will help you get started with all aspects of your role at Tiffah Thrift Store. 

## First Day Checklist

1. Complete HR paperwork
2. Set up your account credentials
3. Tour the facility
4. Meet your team members
5. Review your role-specific training materials

## Systems Access

You'll need to set up access to the following systems:
- Inventory Management
- Order Processing
- Communication Tools
- Knowledge Base

## Your First Week

During your first week, you'll shadow experienced team members and gradually begin handling tasks independently.

Please don't hesitate to ask questions - we're all here to help you succeed!`,
    author: mockUsers[0],
    created: '2023-03-15T09:00:00Z',
    views: 125,
    status: 'published',
    isFeatured: true,
    tags: ['onboarding', 'getting started', 'training']
  },
  {
    id: 'article2',
    title: 'Product Photography Guidelines',
    category: mockKnowledgeCategories[1],
    summary: 'How to take high-quality product photos for the online store.',
    content: `# Product Photography Guidelines

High-quality product photos are essential for our online store success. Follow these guidelines to ensure consistency.

## Equipment Setup

- Use the lightbox in the photography station
- Camera settings: ISO 200, Aperture f/8, Shutter Speed 1/125
- Place products on the white background

## Required Angles

For each product, capture:
1. Front view
2. Back view
3. Side views
4. Detail shots of any special features
5. Size comparison (with ruler)

## Post-Processing

- Adjust brightness and contrast if needed
- Remove background if necessary
- Save as high-quality JPG
- Name files using product SKU

## Common Issues

- Poor lighting: Use the lightbox properly
- Blurry images: Use the tripod
- Inconsistent color: Use the color calibration card

Contact the photography team lead if you need additional assistance.`,
    author: mockUsers[1],
    created: '2023-03-20T11:30:00Z',
    views: 89,
    status: 'published',
    tags: ['photography', 'products', 'images']
  },
  {
    id: 'article3',
    title: 'Order Packing Process',
    category: mockKnowledgeCategories[2],
    summary: 'Step-by-step guide for preparing customer orders for shipping.',
    content: `# Order Packing Process

Follow this standardized process for all customer orders to ensure consistency and accuracy.

## Materials Needed

- Packing slip
- Branded packaging materials
- Tissue paper
- Thank you cards
- Tape and scissors
- Shipping labels

## Step-by-Step Process

1. Verify the items match the packing slip
2. Scan each barcode to mark as fulfilled
3. Wrap items in tissue paper
4. Place in appropriate size bag or box
5. Include thank you card
6. Seal package securely
7. Affix shipping label
8. Place in the correct outgoing bin

## Quality Checks

- Double-check item quantities and sizes
- Ensure all items are clean and ready for delivery
- Check that all tags are properly attached
- Verify the package is sealed properly

## Common Issues

- Missing items: Check the reserve shelf
- Damaged items: Report to supervisor immediately
- Label printer issues: See troubleshooting guide

Remember to maintain a clean and organized packing station!`,
    author: mockUsers[2],
    created: '2023-03-25T14:45:00Z',
    updated: '2023-04-01T10:00:00Z',
    views: 102,
    status: 'published',
    tags: ['orders', 'packing', 'shipping']
  },
  {
    id: 'article4',
    title: 'Handling Customer Returns',
    category: mockKnowledgeCategories[4],
    summary: 'Policies and procedures for processing customer returns.',
    content: `# Handling Customer Returns

This guide outlines our return process to ensure a positive customer experience while protecting our inventory integrity.

## Return Policy Overview

- 14-day return window
- Items must be unworn with tags attached
- Original receipt or order number required
- Returns can be made in-store or by mail

## Processing Steps

1. Verify return eligibility
2. Inspect item condition thoroughly
3. Scan barcode to process in system
4. Issue refund via original payment method
5. Update inventory status
6. Place item in appropriate processing bin

## Special Situations

- Damaged items: Document with photos and notify supervisor
- Missing receipt: Verify using customer email or phone
- Beyond return window: Escalate to manager
- Exchange requests: Process return then new purchase

## Communication Guidelines

- Be empathetic and understanding
- Explain policy clearly when declining returns
- Offer alternatives when possible
- Thank customer for their business

Remember that good return experiences can create loyal customers!`,
    author: mockUsers[0],
    created: '2023-03-28T13:15:00Z',
    views: 76,
    status: 'published',
    tags: ['returns', 'customer service', 'processing']
  },
  {
    id: 'article5',
    title: 'Delivery Route Optimization',
    category: mockKnowledgeCategories[3],
    summary: 'How to plan efficient delivery routes to save time and fuel.',
    content: `# Delivery Route Optimization

Efficient delivery routes save time, fuel, and improve customer satisfaction. This guide covers best practices.

## Planning Process

1. Group deliveries by geographic zones
2. Arrange stops to minimize backtracking
3. Consider traffic patterns at different times
4. Factor in delivery time windows
5. Allow buffer time between stops

## Using the Route Planner Tool

- Access via the Delivery tablet
- Import daily deliveries before 9 AM
- Review and adjust suggested routes
- Sync with navigation app
- Mark completions in real time

## Special Considerations

- High-traffic areas: Schedule during off-peak hours
- Apartment complexes: Group multiple deliveries
- Business addresses: Note operating hours
- Rural deliveries: Schedule on designated days

## Performance Metrics

- Deliveries per hour
- Fuel consumption
- On-time delivery percentage
- Customer satisfaction scores

Regularly review your performance metrics to identify improvement opportunities.`,
    author: mockUsers[3],
    created: '2023-04-02T09:30:00Z',
    views: 58,
    status: 'published',
    tags: ['delivery', 'routes', 'optimization']
  }
];

const StaffCommunications = () => {
  const [selectedTab, setSelectedTab] = useState('messages');
  const [selectedGroup, setSelectedGroup] = useState<ChatGroup | null>(mockGroups[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>(mockGroups);
  const [knowledgeArticles, setKnowledgeArticles] = useState<KnowledgeArticle[]>(mockKnowledgeArticles);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  
  const filteredGroups = chatGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredArticles = knowledgeArticles.filter(article => {
    const categoryMatch = categoryFilter === 'all' || article.category.id === categoryFilter;
    const searchMatch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return categoryMatch && searchMatch;
  });
  
  const filteredUsers = mockUsers.filter(user => {
    const nameMatch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const onlineMatch = !showOnlineOnly || user.status === 'online';
    return nameMatch && onlineMatch;
  });
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;
    
    const updatedGroups = chatGroups.map(group => {
      if (group.id === selectedGroup.id) {
        const newMsg: Message = {
          id: `msg${Date.now()}`,
          sender: mockUsers[0],
          content: newMessage,
          timestamp: new Date().toISOString(),
          isRead: true
        };
        
        return {
          ...group,
          messages: [...group.messages, newMsg],
          lastMessage: newMsg
        };
      }
      return group;
    });
    
    setChatGroups(updatedGroups);
    setSelectedGroup(updatedGroups.find(g => g.id === selectedGroup.id) || null);
    setNewMessage('');
    
    // Simulate response in group chat
    if (!selectedGroup.isPrivate) {
      setTimeout(() => {
        const respondingUser = mockUsers[Math.floor(Math.random() * (mockUsers.length - 1)) + 1];
        const responseMsg: Message = {
          id: `msg${Date.now() + 1}`,
          sender: respondingUser,
          content: `Thanks for the update, ${mockUsers[0].name}!`,
          timestamp: new Date().toISOString(),
          isRead: true
        };
        
        setChatGroups(prevGroups => 
          prevGroups.map(group => {
            if (group.id === selectedGroup.id) {
              return {
                ...group,
                messages: [...group.messages, responseMsg],
                lastMessage: responseMsg
              };
            }
            return group;
          })
        );
      }, 5000);
    }
  };
  
  const handleCreateGroup = () => {
    const newGroup: ChatGroup = {
      id: `group${Date.now()}`,
      name: 'New Group',
      participants: [mockUsers[0]],
      messages: [],
      unreadCount: 0,
      isPrivate: false
    };
    
    setChatGroups([newGroup, ...chatGroups]);
    setSelectedGroup(newGroup);
    toast.success('New group chat created');
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return format(date, 'h:mm a');
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return format(date, 'EEEE');
    } else {
      return format(date, 'MMM d');
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  const getStatusIndicator = (status: 'online' | 'offline' | 'away') => {
    switch(status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
    }
  };
  
  const handleReadArticle = (article: KnowledgeArticle) => {
    setSelectedArticle(article);
    
    // Increment view count
    setKnowledgeArticles(prevArticles => 
      prevArticles.map(a => 
        a.id === article.id ? { ...a, views: a.views + 1 } : a
      )
    );
  };
  
  const getRoleBadge = (role: UserRole) => {
    switch(role) {
      case 'admin':
        return <Badge variant="secondary" className="bg-purple-500/20 text-purple-500">Admin</Badge>;
      case 'productManager':
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-500">Product Manager</Badge>;
      case 'orderPreparer':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-500">Order Preparer</Badge>;
      case 'deliveryStaff':
        return <Badge variant="secondary" className="bg-orange-500/20 text-orange-500">Delivery Staff</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };
  
  const getTotalUnreadCount = () => {
    return chatGroups.reduce((count, group) => count + group.unreadCount, 0);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Staff Communications</h1>
            <p className="text-muted-foreground">
              Communicate with team members and access knowledge resources
            </p>
          </div>
        </div>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="messages" className="relative">
              Messages
              {getTotalUnreadCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalUnreadCount()}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="team">Team Directory</TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-1 h-[75vh] flex flex-col">
                <CardHeader className="px-4 py-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Conversations</CardTitle>
                    <Button size="icon" variant="ghost" onClick={handleCreateGroup}>
                      <PlusCircle className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search conversations..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="px-2 flex-grow overflow-y-auto">
                  <div className="space-y-1">
                    {filteredGroups.map(group => (
                      <button
                        key={group.id}
                        className={`w-full flex items-center p-3 rounded-md hover:bg-accent text-left ${
                          selectedGroup?.id === group.id ? 'bg-accent' : ''
                        }`}
                        onClick={() => setSelectedGroup(group)}
                      >
                        {group.isPrivate ? (
                          <Avatar className="h-10 w-10 mr-2">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getInitials(group.name)}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-10 w-10 mr-2 bg-primary/10 rounded-md flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        
                        <div className="flex-grow truncate">
                          <div className="flex justify-between items-center">
                            <span className="font-medium truncate">{group.name}</span>
                            {group.lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(group.lastMessage.timestamp)}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground truncate">
                            {group.lastMessage ? (
                              <span>
                                {!group.isPrivate && (
                                  <span className="font-medium">
                                    {group.lastMessage.sender.name.split(' ')[0]}:
                                  </span>
                                )}{' '}
                                {group.lastMessage.content}
                              </span>
                            ) : (
                              <span className="italic">No messages yet</span>
                            )}
                          </div>
                        </div>
                        
                        {group.unreadCount > 0 && (
                          <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full h-5 min-w-[20px] flex items-center justify-center">
                            {group.unreadCount}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2 h-[75vh] flex flex-col">
                {selectedGroup ? (
                  <>
                    <CardHeader className="px-4 py-3 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        {selectedGroup.isPrivate ? (
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getInitials(selectedGroup.name)}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        
                        <div>
                          <CardTitle className="text-lg">{selectedGroup.name}</CardTitle>
                          <CardDescription>
                            {selectedGroup.participants.length} participants
                          </CardDescription>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Participants
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Info className="mr-2 h-4 w-4" />
                            View Info
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pin className="mr-2 h-4 w-4" />
                            Pin Conversation
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Conversation
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    
                    <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
                      {selectedGroup.messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4">
                          <MessageSquare className="h-12 w-12 text-muted-foreground mb-2" />
                          <h3 className="text-lg font-medium">No messages yet</h3>
                          <p className="text-sm text-muted-foreground">
                            Start the conversation by sending a message
                          </p>
                        </div>
                      ) : (
                        selectedGroup.messages.map((message) => {
                          const isCurrentUser = message.sender.id === mockUsers[0].id;
                          
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} group`}
                            >
                              <div className={`flex gap-2 max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                {!isCurrentUser && (
                                  <Avatar className="h-8 w-8 flex-shrink-0">
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                      {getInitials(message.sender.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                
                                <div className={`space-y-1 ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                                  {!isCurrentUser && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium">{message.sender.name}</span>
                                      {getRoleBadge(message.sender.role)}
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center gap-2">
                                    {message.isPinned && (
                                      <Pin className="h-3 w-3 text-muted-foreground" />
                                    )}
                                    
                                    <div
                                      className={`${
                                        isCurrentUser
                                          ? 'bg-primary text-primary-foreground'
                                          : 'bg-muted'
                                      } p-3 rounded-lg`}
                                    >
                                      <p className="text-sm">{message.content}</p>
                                      
                                      {message.attachments && message.attachments.length > 0 && (
                                        <div className="mt-2 space-y-2">
                                          {message.attachments.map(attachment => (
                                            <div
                                              key={attachment.id}
                                              className="flex items-center gap-2 p-2 rounded-md bg-background/40"
                                            >
                                              <File className="h-4 w-4" />
                                              <div className="text-xs truncate">{attachment.name}</div>
                                              <Button size="icon" variant="ghost" className="h-6 w-6 ml-auto">
                                                <Download className="h-3 w-3" />
                                              </Button>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-6 w-6">
                                            <MoreVertical className="h-3 w-3" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align={isCurrentUser ? 'end' : 'start'}>
                                          <DropdownMenuItem>
                                            <Copy className="mr-2 h-4 w-4" />
                                            Copy Text
                                          </DropdownMenuItem>
                                          <DropdownMenuItem>
                                            <Pin className="mr-2 h-4 w-4" />
                                            {message.isPinned ? 'Unpin Message' : 'Pin Message'}
                                          </DropdownMenuItem>
                                          {isCurrentUser && (
                                            <>
                                              <DropdownMenuItem>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit Message
                                              </DropdownMenuItem>
                                              <DropdownMenuItem className="text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete Message
                                              </DropdownMenuItem>
                                            </>
                                          )}
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>
                                  
                                  <span className="text-xs text-muted-foreground">
                                    {formatTimestamp(message.timestamp)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </CardContent>
                    
                    <CardFooter className="p-4 pt-2 border-t">
                      <div className="flex items-center gap-2 w-full">
                        <Button variant="outline" size="icon">
                          <PlusCircle className="h-5 w-5" />
                        </Button>
                        <Textarea
                          placeholder="Type a message..."
                          className="min-h-10 flex-grow"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button 
                          size="icon"
                          disabled={!newMessage.trim()}
                          onClick={handleSendMessage}
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardFooter>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                    <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
                    <p className="text-muted-foreground max-w-md mb-4">
                      Choose a conversation from the sidebar or create a new one to start messaging
                    </p>
                    <Button onClick={handleCreateGroup}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create New Conversation
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="knowledge" className="space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search knowledge base..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Category</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {mockKnowledgeCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button>
                <BookOpen className="mr-2 h-4 w-4" />
                Browse All
              </Button>
              <Button variant="outline">
                <FileUp className="mr-2 h-4 w-4" />
                Create Article
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 space-y-4">
                <Card>
                  <CardHeader className="px-4 py-3">
                    <CardTitle className="text-lg">Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="px-2 py-1">
                    <div className="space-y-1">
                      <button
                        className={`w-full flex items-center justify-between p-2 rounded-md hover:bg-accent text-left ${
                          categoryFilter === 'all' ? 'bg-accent' : ''
                        }`}
                        onClick={() => setCategoryFilter('all')}
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span>All Categories</span>
                        </div>
                        <Badge variant="secondary">{knowledgeArticles.length}</Badge>
                      </button>
                      
                      {mockKnowledgeCategories.map(category => (
                        <button
                          key={category.id}
                          className={`w-full flex items-center justify-between p-2 rounded-md hover:bg-accent text-left ${
                            categoryFilter === category.id ? 'bg-accent' : ''
                          }`}
                          onClick={() => setCategoryFilter(category.id)}
                        >
                          <span>{category.name}</span>
                          <Badge variant="secondary">{category.count}</Badge>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="px-4 py-3">
                    <CardTitle className="text-lg">Featured Articles</CardTitle>
                  </CardHeader>
                  <CardContent className="px-2 py-1">
                    <div className="space-y-1">
                      {knowledgeArticles
                        .filter(article => article.isFeatured)
                        .map(article => (
                          <button
                            key={article.id}
                            className="w-full flex items-center p-2 rounded-md hover:bg-accent text-left"
                            onClick={() => handleReadArticle(article)}
                          >
                            <Star className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                            <span className="truncate">{article.title}</span>
                          </button>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                {selectedArticle ? (
                  <Card className="h-[75vh] flex flex-col">
                    <CardHeader className="px-6 py-4 border-b">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{selectedArticle.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{selectedArticle.category.name}</Badge>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Updated {formatTimestamp(selectedArticle.updated || selectedArticle.created)}</span>
                            </div>
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedArticle(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-y-auto p-6">
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-muted-foreground italic mb-6">
                          {selectedArticle.summary}
                        </p>
                        <div className="whitespace-pre-line">
                          {selectedArticle.content.split('#').map((section, index) => {
                            if (index === 0) return null;
                            
                            const lines = section.split('\n');
                            const heading = lines[0];
                            const content = lines.slice(1).join('\n');
                            
                            return (
                              <div key={index} className="mb-6">
                                <h2 className="text-xl font-bold mb-2">{heading}</h2>
                                {content.split('\n\n').map((paragraph, i) => {
                                  if (paragraph.startsWith('- ')) {
                                    return (
                                      <ul key={i} className="my-4 space-y-1 list-disc pl-5">
                                        {paragraph.split('\n').map((line, j) => (
                                          <li key={j}>{line.replace('- ', '')}</li>
                                        ))}
                                      </ul>
                                    );
                                  } else if (paragraph.match(/^\d\./)) {
                                    return (
                                      <ol key={i} className="my-4 space-y-1 list-decimal pl-5">
                                        {paragraph.split('\n').map((line, j) => {
                                          const lineText = line.replace(/^\d\./, '').trim();
                                          return <li key={j}>{lineText}</li>;
                                        })}
                                      </ol>
                                    );
                                  } else {
                                    return <p key={i} className="my-3">{paragraph}</p>;
                                  }
                                })}
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-6">
                          {selectedArticle.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t p-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(selectedArticle.author.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{selectedArticle.author.name}</div>
                          <div className="text-xs text-muted-foreground">{getRoleBadge(selectedArticle.author.role)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          <span>{selectedArticle.views} views</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Export PDF
                          </Button>
                          <Button size="sm">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Helpful
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="px-6 py-4">
                        <CardTitle>Knowledge Articles</CardTitle>
                        <CardDescription>
                          Browse and search our knowledge base resources
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        {filteredArticles.length === 0 ? (
                          <div className="py-12 text-center">
                            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium">No articles found</h3>
                            <p className="text-muted-foreground">
                              Try adjusting your search or category filter
                            </p>
                          </div>
                        ) : (
                          <div className="divide-y">
                            {filteredArticles.map(article => (
                              <div
                                key={article.id}
                                className="p-4 hover:bg-accent cursor-pointer"
                                onClick={() => handleReadArticle(article)}
                              >
                                <div className="flex justify-between mb-1">
                                  <div className="flex items-center">
                                    <h3 className="font-medium truncate">{article.title}</h3>
                                    {article.isFeatured && (
                                      <Star className="h-4 w-4 text-yellow-500 ml-2 flex-shrink-0" />
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Eye className="h-3 w-3" />
                                    <span>{article.views}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {article.summary}
                                </p>
                                <div className="flex justify-between items-center mt-2">
                                  <div className="flex gap-1">
                                    <Badge variant="outline" className="text-xs">
                                      {article.category.name}
                                    </Badge>
                                    {article.tags.slice(0, 2).map(tag => (
                                      <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                    {article.tags.length > 2 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{article.tags.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Updated {formatTimestamp(article.updated || article.created)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search team members..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <label htmlFor="online-only" className="text-sm cursor-pointer select-none">
                  Show online only
                </label>
                <Checkbox
                  id="online-only"
                  checked={showOnlineOnly}
                  onCheckedChange={(checked) => setShowOnlineOnly(!!checked)}
                />
              </div>
              
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Role
              </Button>
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Status
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredUsers.map(user => (
                <Card key={user.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-end">
                        <Badge variant="outline" className="mb-1">
                          <div className={`h-2 w-2 rounded-full ${getStatusIndicator(user.status)} mr-1`} />
                          {user.status}
                        </Badge>
                        {getRoleBadge(user.role)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h3 className="text-lg font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    
                    <div className="flex flex-col gap-2 pt-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Last Activity</span>
                        <span>{user.status === 'online' ? 'Now' : user.lastSeen ? formatTimestamp(user.lastSeen) : 'Unknown'}</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex flex-col gap-1">
                        <div className="text-sm text-muted-foreground mb-1">Contact Options</div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Mail className="mr-2 h-4 w-4" />
                            Email
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      View Schedule
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default StaffCommunications;
