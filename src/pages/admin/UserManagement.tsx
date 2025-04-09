
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  Settings,
  User,
  Edit,
  Lock,
  Send,
  Trash2,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Key,
  Copy,
  AlertCircle,
  FileText,
  BarChart2,
  Map,
  CheckCircle2,
  Info,
  Eye,
  EyeOff,
  Clipboard,
  UserCog,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

type UserRole = 'admin' | 'productManager' | 'orderPreparer' | 'deliveryStaff' | 'customer';
type UserStatus = 'active' | 'inactive' | 'suspended';

interface UserAddress {
  id: string;
  type: string;
  street: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
}

interface UserOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
}

interface UserNote {
  id: string;
  createdBy: string;
  createdAt: string;
  text: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  status: UserStatus;
  registrationDate: string;
  lastLogin?: string;
  orderCount: number;
  totalSpend: number;
  addresses: UserAddress[];
  orders: UserOrder[];
  notes: UserNote[];
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '+254712345678',
    role: 'customer',
    status: 'active',
    registrationDate: '2023-01-15T10:30:00Z',
    lastLogin: '2023-04-05T08:12:34Z',
    orderCount: 5,
    totalSpend: 12500,
    addresses: [
      {
        id: 'addr1',
        type: 'Home',
        street: '123 Main St',
        city: 'Nairobi',
        zipCode: '00100',
        isDefault: true
      }
    ],
    orders: [
      {
        id: 'ord1',
        orderNumber: 'TTS-20230405-1234',
        date: '2023-04-05T14:30:00Z',
        status: 'delivered',
        total: 3500
      },
      {
        id: 'ord2',
        orderNumber: 'TTS-20230320-9876',
        date: '2023-03-20T11:15:00Z',
        status: 'delivered',
        total: 4000
      }
    ],
    notes: [
      {
        id: 'note1',
        createdBy: 'Admin User',
        createdAt: '2023-02-10T09:45:00Z',
        text: 'Customer requested size exchange for order TTS-20230220-5678.'
      }
    ]
  },
  {
    id: '2',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    phoneNumber: '+254723456789',
    role: 'customer',
    status: 'active',
    registrationDate: '2023-02-20T14:45:00Z',
    lastLogin: '2023-04-04T16:30:00Z',
    orderCount: 3,
    totalSpend: 8500,
    addresses: [
      {
        id: 'addr2',
        type: 'Home',
        street: '456 Oak Avenue',
        city: 'Mombasa',
        zipCode: '80100',
        isDefault: true
      }
    ],
    orders: [
      {
        id: 'ord3',
        orderNumber: 'TTS-20230404-5678',
        date: '2023-04-04T16:00:00Z',
        status: 'processing',
        total: 2500
      }
    ],
    notes: []
  },
  {
    id: '3',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    role: 'admin',
    status: 'active',
    registrationDate: '2022-12-10T09:15:00Z',
    lastLogin: '2023-04-05T10:45:00Z',
    orderCount: 0,
    totalSpend: 0,
    addresses: [],
    orders: [],
    notes: []
  },
  {
    id: '4',
    name: 'David Kimani',
    email: 'david.kimani@example.com',
    phoneNumber: '+254734567890',
    role: 'productManager',
    status: 'active',
    registrationDate: '2023-01-05T11:30:00Z',
    lastLogin: '2023-04-05T09:30:00Z',
    orderCount: 0,
    totalSpend: 0,
    addresses: [],
    orders: [],
    notes: []
  },
  {
    id: '5',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phoneNumber: '+254745678901',
    role: 'customer',
    status: 'inactive',
    registrationDate: '2023-01-25T13:20:00Z',
    lastLogin: '2023-02-15T14:10:00Z',
    orderCount: 1,
    totalSpend: 1500,
    addresses: [
      {
        id: 'addr3',
        type: 'Home',
        street: '789 Pine Lane',
        city: 'Nakuru',
        zipCode: '20100',
        isDefault: true
      }
    ],
    orders: [
      {
        id: 'ord4',
        orderNumber: 'TTS-20230215-4321',
        date: '2023-02-15T14:00:00Z',
        status: 'delivered',
        total: 1500
      }
    ],
    notes: []
  },
  {
    id: '6',
    name: 'John Mwangi',
    email: 'john.mwangi@example.com',
    phoneNumber: '+254756789012',
    role: 'orderPreparer',
    status: 'active',
    registrationDate: '2023-01-10T10:00:00Z',
    lastLogin: '2023-04-05T08:45:00Z',
    orderCount: 0,
    totalSpend: 0,
    addresses: [],
    orders: [],
    notes: []
  },
  {
    id: '7',
    name: 'Lucy Wanjiku',
    email: 'lucy.wanjiku@example.com',
    phoneNumber: '+254767890123',
    role: 'deliveryStaff',
    status: 'active',
    registrationDate: '2023-01-15T09:30:00Z',
    lastLogin: '2023-04-05T07:30:00Z',
    orderCount: 0,
    totalSpend: 0,
    addresses: [],
    orders: [],
    notes: []
  },
  {
    id: '8',
    name: 'Robert Brown',
    email: 'robert.brown@example.com',
    role: 'customer',
    status: 'suspended',
    registrationDate: '2023-02-05T15:45:00Z',
    lastLogin: '2023-02-28T11:20:00Z',
    orderCount: 2,
    totalSpend: 6000,
    addresses: [
      {
        id: 'addr4',
        type: 'Home',
        street: '101 Cedar Road',
        city: 'Kisumu',
        zipCode: '40100',
        isDefault: true
      }
    ],
    orders: [
      {
        id: 'ord5',
        orderNumber: 'TTS-20230228-8765',
        date: '2023-02-28T11:00:00Z',
        status: 'delivered',
        total: 3500
      },
      {
        id: 'ord6',
        orderNumber: 'TTS-20230210-2468',
        date: '2023-02-10T13:30:00Z',
        status: 'delivered',
        total: 2500
      }
    ],
    notes: [
      {
        id: 'note2',
        createdBy: 'Admin User',
        createdAt: '2023-02-28T16:00:00Z',
        text: 'Account suspended due to payment disputes on multiple orders.'
      }
    ]
  }
];

const createUserSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phoneNumber: z.string().optional(),
  role: z.enum(['admin', 'productManager', 'orderPreparer', 'deliveryStaff', 'customer'], {
    required_error: 'Please select a role',
  }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string(),
  sendWelcomeEmail: z.boolean().default(true),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const addNoteSchema = z.object({
  note: z.string().min(1, { message: 'Note cannot be empty' }),
});

type CreateUserValues = z.infer<typeof createUserSchema>;
type AddNoteValues = z.infer<typeof addNoteSchema>;

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isShowingPassword, setIsShowingPassword] = useState(false);
  
  const createUserForm = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      role: 'customer',
      password: '',
      confirmPassword: '',
      sendWelcomeEmail: true,
    }
  });
  
  const addNoteForm = useForm<AddNoteValues>({
    resolver: zodResolver(addNoteSchema),
    defaultValues: {
      note: '',
    }
  });
  
  const filteredUsers = users.filter(user => {
    // Search filter
    const searchMatch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phoneNumber && user.phoneNumber.includes(searchQuery));
    
    // Role filter
    const roleMatch = roleFilter === 'all' || user.role === roleFilter;
    
    // Status filter
    const statusMatch = statusFilter === 'all' || user.status === statusFilter;
    
    return searchMatch && roleMatch && statusMatch;
  });
  
  // Get counts for tabs
  const getCounts = () => {
    const all = users.length;
    const customers = users.filter(user => user.role === 'customer').length;
    const staff = users.filter(user => user.role !== 'customer').length;
    const active = users.filter(user => user.status === 'active').length;
    const inactive = users.filter(user => user.status === 'inactive').length;
    
    return { all, customers, staff, active, inactive };
  };
  
  const counts = getCounts();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  const getStatusBadge = (status: UserStatus) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="border-red-500 text-red-500">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
      case 'customer':
        return <Badge variant="secondary">Customer</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };
  
  const handleCreateUser = (values: CreateUserValues) => {
    setIsCreatingUser(true);
    
    // Simulate API call
    setTimeout(() => {
      const newUser: User = {
        id: `user${users.length + 1}`,
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        role: values.role,
        status: 'active',
        registrationDate: new Date().toISOString(),
        orderCount: 0,
        totalSpend: 0,
        addresses: [],
        orders: [],
        notes: []
      };
      
      setUsers([...users, newUser]);
      setIsCreatingUser(false);
      createUserForm.reset();
      toast.success(`User ${values.name} created successfully!`);
      
      if (values.sendWelcomeEmail) {
        toast.success(`Welcome email sent to ${values.email}`);
      }
    }, 1500);
  };
  
  const handleAddNote = (values: AddNoteValues) => {
    if (!selectedUser) return;
    
    setIsAddingNote(true);
    
    // Simulate API call
    setTimeout(() => {
      const newNote: UserNote = {
        id: `note${Date.now()}`,
        createdBy: 'Admin User',
        createdAt: new Date().toISOString(),
        text: values.note
      };
      
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          return {
            ...user,
            notes: [...user.notes, newNote]
          };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      
      // Update the selected user
      const updatedUser = updatedUsers.find(user => user.id === selectedUser.id);
      if (updatedUser) setSelectedUser(updatedUser);
      
      setIsAddingNote(false);
      addNoteForm.reset();
      toast.success('Note added successfully');
    }, 1000);
  };
  
  const handleUpdateStatus = (userId: string, newStatus: UserStatus) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: newStatus
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    
    // Update the selected user if it's the one being updated
    if (selectedUser && selectedUser.id === userId) {
      const updatedUser = updatedUsers.find(user => user.id === userId);
      if (updatedUser) setSelectedUser(updatedUser);
    }
    
    toast.success(`User status updated to ${newStatus}`);
  };
  
  const handleDeleteUser = (userId: string) => {
    // In a real application, you'd probably want a confirmation dialog here
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    
    // If the deleted user is selected, deselect it
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(null);
    }
    
    toast.success('User deleted successfully');
  };
  
  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard`);
    });
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">
              Manage customers and staff accounts
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account for customer or staff
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...createUserForm}>
                  <form onSubmit={createUserForm.handleSubmit(handleCreateUser)} className="space-y-4 py-4">
                    <FormField
                      control={createUserForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={createUserForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={createUserForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+254700000000" {...field} />
                          </FormControl>
                          <FormDescription>
                            Include country code (e.g., +254 for Kenya)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={createUserForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select user role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="customer">Customer</SelectItem>
                              <SelectItem value="productManager">Product Manager</SelectItem>
                              <SelectItem value="orderPreparer">Order Preparer</SelectItem>
                              <SelectItem value="deliveryStaff">Delivery Staff</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={createUserForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={isShowingPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                {...field} 
                              />
                              <Button 
                                type="button"
                                variant="ghost" 
                                size="icon" 
                                className="absolute right-0 top-0 h-full"
                                onClick={() => setIsShowingPassword(!isShowingPassword)}
                              >
                                {isShowingPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Must be at least 8 characters with uppercase, lowercase, and numbers
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={createUserForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={createUserForm.control}
                      name="sendWelcomeEmail"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Send welcome email</FormLabel>
                            <FormDescription>
                              Send an email with login instructions to the user
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter className="pt-4">
                      <Button
                        type="submit"
                        disabled={isCreatingUser}
                      >
                        {isCreatingUser ? 'Creating...' : 'Create User'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Export Users
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:w-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search users by name, email, or phone..." 
              className="pl-10 w-full sm:w-[300px] md:w-[400px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[130px]">
                <UserCog className="mr-2 h-4 w-4" />
                <span>Role</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="productManager">Product Manager</SelectItem>
                <SelectItem value="orderPreparer">Order Preparer</SelectItem>
                <SelectItem value="deliveryStaff">Delivery Staff</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <Filter className="mr-2 h-4 w-4" />
                <span>Status</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="relative">
              All Users
              <Badge variant="secondary" className="ml-2">{counts.all}</Badge>
            </TabsTrigger>
            <TabsTrigger value="customers" className="relative">
              Customers
              <Badge variant="secondary" className="ml-2">{counts.customers}</Badge>
            </TabsTrigger>
            <TabsTrigger value="staff" className="relative">
              Staff
              <Badge variant="secondary" className="ml-2">{counts.staff}</Badge>
            </TabsTrigger>
            <TabsTrigger value="active" className="relative">
              Active
              <Badge variant="secondary" className="ml-2">{counts.active}</Badge>
            </TabsTrigger>
            <TabsTrigger value="inactive" className="relative">
              Inactive
              <Badge variant="secondary" className="ml-2">{counts.inactive}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">User</TableHead>
                    <TableHead className="hidden md:table-cell">Role</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Registered</TableHead>
                    <TableHead className="hidden lg:table-cell">Last Login</TableHead>
                    <TableHead className="hidden md:table-cell text-right">Orders</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">No users found</TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers
                      .filter(user => {
                        if (activeTab === 'all') return true;
                        if (activeTab === 'customers') return user.role === 'customer';
                        if (activeTab === 'staff') return user.role !== 'customer';
                        if (activeTab === 'active') return user.status === 'active';
                        if (activeTab === 'inactive') return user.status === 'inactive' || user.status === 'suspended';
                        return true;
                      })
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                                {getInitials(user.name)}
                              </div>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {getRoleBadge(user.role)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {getStatusBadge(user.status)}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {formatDate(user.registrationDate)}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {formatDate(user.lastLogin)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-right">
                            {user.role === 'customer' ? (
                              <div>
                                <div>{user.orderCount} orders</div>
                                <div className="text-sm text-muted-foreground">
                                  {formatCurrency(user.totalSpend)}
                                </div>
                              </div>
                            ) : (
                              <div className="text-muted-foreground">N/A</div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Dialog onOpenChange={(open) => {
                              if (open) setSelectedUser(user);
                            }}>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Info className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                                {selectedUser && (
                                  <>
                                    <DialogHeader>
                                      <DialogTitle>User Details</DialogTitle>
                                      <DialogDescription>
                                        View and manage user information
                                      </DialogDescription>
                                    </DialogHeader>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                                      <Card className="col-span-1">
                                        <CardHeader className="pb-0">
                                          <div className="flex flex-col items-center">
                                            <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl">
                                              {getInitials(selectedUser.name)}
                                            </div>
                                            <CardTitle className="mt-4">{selectedUser.name}</CardTitle>
                                            <CardDescription>{getRoleBadge(selectedUser.role)}</CardDescription>
                                          </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4 pt-4">
                                          <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground">Email</div>
                                            <div className="flex items-center justify-between">
                                              <div className="font-medium break-all">{selectedUser.email}</div>
                                              <Button 
                                                variant="ghost" 
                                                size="icon"
                                                onClick={() => handleCopyToClipboard(selectedUser.email, 'Email')}
                                              >
                                                <Copy className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </div>
                                          
                                          {selectedUser.phoneNumber && (
                                            <div className="space-y-1">
                                              <div className="text-sm text-muted-foreground">Phone</div>
                                              <div className="flex items-center justify-between">
                                                <div className="font-medium">{selectedUser.phoneNumber}</div>
                                                <Button 
                                                  variant="ghost" 
                                                  size="icon"
                                                  onClick={() => handleCopyToClipboard(selectedUser.phoneNumber || '', 'Phone')}
                                                >
                                                  <Copy className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            </div>
                                          )}
                                          
                                          <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground">Status</div>
                                            <div>{getStatusBadge(selectedUser.status)}</div>
                                          </div>
                                          
                                          <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground">Registration Date</div>
                                            <div className="font-medium">{formatDate(selectedUser.registrationDate)}</div>
                                          </div>
                                          
                                          <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground">Last Login</div>
                                            <div className="font-medium">{formatDate(selectedUser.lastLogin)}</div>
                                          </div>
                                          
                                          {selectedUser.role === 'customer' && (
                                            <>
                                              <div className="space-y-1">
                                                <div className="text-sm text-muted-foreground">Total Orders</div>
                                                <div className="font-medium">{selectedUser.orderCount} orders</div>
                                              </div>
                                              
                                              <div className="space-y-1">
                                                <div className="text-sm text-muted-foreground">Total Spend</div>
                                                <div className="font-medium">{formatCurrency(selectedUser.totalSpend)}</div>
                                              </div>
                                            </>
                                          )}
                                        </CardContent>
                                        <CardFooter className="flex-col gap-2 border-t pt-4">
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button variant="outline" className="w-full">
                                                <Settings className="mr-2 h-4 w-4" />
                                                Manage Account
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                              <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
                                              <DropdownMenuSeparator />
                                              <DropdownMenuItem onClick={() => { /* This would open an edit form */ }}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit Details
                                              </DropdownMenuItem>
                                              <DropdownMenuItem onClick={() => { /* This would trigger a password reset */ }}>
                                                <Lock className="mr-2 h-4 w-4" />
                                                Reset Password
                                              </DropdownMenuItem>
                                              <DropdownMenuItem onClick={() => { /* This would open a send message form */ }}>
                                                <Send className="mr-2 h-4 w-4" />
                                                Send Message
                                              </DropdownMenuItem>
                                              <DropdownMenuSeparator />
                                              {selectedUser.status === 'active' ? (
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(selectedUser.id, 'inactive')}>
                                                  <XCircle className="mr-2 h-4 w-4" />
                                                  Deactivate Account
                                                </DropdownMenuItem>
                                              ) : selectedUser.status === 'inactive' ? (
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(selectedUser.id, 'active')}>
                                                  <CheckCircle className="mr-2 h-4 w-4" />
                                                  Activate Account
                                                </DropdownMenuItem>
                                              ) : (
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(selectedUser.id, 'active')}>
                                                  <CheckCircle className="mr-2 h-4 w-4" />
                                                  Unsuspend Account
                                                </DropdownMenuItem>
                                              )}
                                              {selectedUser.status !== 'suspended' && (
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(selectedUser.id, 'suspended')}>
                                                  <ShieldAlert className="mr-2 h-4 w-4" />
                                                  Suspend Account
                                                </DropdownMenuItem>
                                              )}
                                              <DropdownMenuSeparator />
                                              <DropdownMenuItem onClick={() => handleDeleteUser(selectedUser.id)} className="text-red-500">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete Account
                                              </DropdownMenuItem>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </CardFooter>
                                      </Card>
                                      
                                      <div className="col-span-1 md:col-span-2 space-y-6">
                                        <Tabs defaultValue="orders">
                                          <TabsList className="w-full">
                                            <TabsTrigger value="orders" className="flex-1">Orders</TabsTrigger>
                                            <TabsTrigger value="addresses" className="flex-1">Addresses</TabsTrigger>
                                            <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
                                          </TabsList>
                                          
                                          <TabsContent value="orders" className="border rounded-md mt-4">
                                            {selectedUser.role !== 'customer' ? (
                                              <div className="p-6 text-center">
                                                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                                                <h3 className="text-lg font-medium">No Order History</h3>
                                                <p className="text-muted-foreground">
                                                  Staff accounts don't have order history.
                                                </p>
                                              </div>
                                            ) : selectedUser.orders.length === 0 ? (
                                              <div className="p-6 text-center">
                                                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                                                <h3 className="text-lg font-medium">No Orders Yet</h3>
                                                <p className="text-muted-foreground">
                                                  This customer hasn't placed any orders yet.
                                                </p>
                                              </div>
                                            ) : (
                                              <Table>
                                                <TableHeader>
                                                  <TableRow>
                                                    <TableHead>Order Number</TableHead>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Total</TableHead>
                                                  </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                  {selectedUser.orders.map(order => (
                                                    <TableRow key={order.id}>
                                                      <TableCell>
                                                        <div className="font-medium">{order.orderNumber}</div>
                                                      </TableCell>
                                                      <TableCell>
                                                        {formatDate(order.date)}
                                                      </TableCell>
                                                      <TableCell>
                                                        <Badge variant="outline" className="capitalize">{order.status}</Badge>
                                                      </TableCell>
                                                      <TableCell className="text-right">
                                                        {formatCurrency(order.total)}
                                                      </TableCell>
                                                    </TableRow>
                                                  ))}
                                                </TableBody>
                                              </Table>
                                            )}
                                          </TabsContent>
                                          
                                          <TabsContent value="addresses" className="border rounded-md mt-4">
                                            {selectedUser.addresses.length === 0 ? (
                                              <div className="p-6 text-center">
                                                <Map className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                                                <h3 className="text-lg font-medium">No Addresses</h3>
                                                <p className="text-muted-foreground">
                                                  This user doesn't have any saved addresses.
                                                </p>
                                              </div>
                                            ) : (
                                              <div className="p-4 space-y-4">
                                                {selectedUser.addresses.map(address => (
                                                  <div key={address.id} className="border rounded-md p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                      <div className="flex items-center gap-2">
                                                        <div className="font-medium">{address.type}</div>
                                                        {address.isDefault && (
                                                          <Badge variant="outline" className="border-primary text-primary">Default</Badge>
                                                        )}
                                                      </div>
                                                      <Button variant="ghost" size="icon">
                                                        <Edit className="h-4 w-4" />
                                                      </Button>
                                                    </div>
                                                    <div className="text-muted-foreground">
                                                      <div>{address.street}</div>
                                                      <div>{address.city}, {address.zipCode}</div>
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </TabsContent>
                                          
                                          <TabsContent value="notes" className="border rounded-md mt-4">
                                            <div className="p-4">
                                              <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-medium">Staff Notes</h3>
                                                <Button size="sm" onClick={() => addNoteForm.reset()}>
                                                  <Plus className="mr-2 h-4 w-4" />
                                                  Add Note
                                                </Button>
                                              </div>
                                              
                                              <Form {...addNoteForm}>
                                                <form onSubmit={addNoteForm.handleSubmit(handleAddNote)} className="space-y-2 mb-6">
                                                  <FormField
                                                    control={addNoteForm.control}
                                                    name="note"
                                                    render={({ field }) => (
                                                      <FormItem>
                                                        <FormControl>
                                                          <Textarea
                                                            placeholder="Add a note about this user..."
                                                            className="min-h-[100px]"
                                                            {...field}
                                                          />
                                                        </FormControl>
                                                        <FormMessage />
                                                      </FormItem>
                                                    )}
                                                  />
                                                  <div className="flex justify-end">
                                                    <Button 
                                                      type="submit"
                                                      size="sm"
                                                      disabled={isAddingNote}
                                                    >
                                                      {isAddingNote ? 'Saving...' : 'Save Note'}
                                                    </Button>
                                                  </div>
                                                </form>
                                              </Form>
                                              
                                              {selectedUser.notes.length === 0 ? (
                                                <div className="p-6 text-center">
                                                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                                                  <h3 className="text-lg font-medium">No Notes</h3>
                                                  <p className="text-muted-foreground">
                                                    There are no staff notes for this user yet.
                                                  </p>
                                                </div>
                                              ) : (
                                                <div className="space-y-4">
                                                  {selectedUser.notes.map(note => (
                                                    <div key={note.id} className="border rounded-md p-4">
                                                      <div className="flex justify-between items-center mb-2">
                                                        <div className="font-medium">{note.createdBy}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                          {formatDate(note.createdAt)}
                                                        </div>
                                                      </div>
                                                      <p className="text-sm whitespace-pre-line">{note.text}</p>
                                                    </div>
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                          </TabsContent>
                                        </Tabs>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </DialogContent>
                            </Dialog>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => { /* This would open an edit form */ }}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { /* This would trigger a password reset */ }}>
                                  <Lock className="mr-2 h-4 w-4" />
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { /* This would open a send message form */ }}>
                                  <Send className="mr-2 h-4 w-4" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.status === 'active' ? (
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(user.id, 'inactive')}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </DropdownMenuItem>
                                ) : user.status === 'inactive' ? (
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(user.id, 'active')}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Activate
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(user.id, 'active')}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Unsuspend
                                  </DropdownMenuItem>
                                )}
                                {user.status !== 'suspended' && (
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(user.id, 'suspended')}>
                                    <ShieldAlert className="mr-2 h-4 w-4" />
                                    Suspend
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-red-500">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
              
              {filteredUsers.length > 0 && (
                <div className="flex items-center justify-between px-4 py-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing <strong>1-{filteredUsers.length}</strong> of <strong>{filteredUsers.length}</strong> users
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
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
