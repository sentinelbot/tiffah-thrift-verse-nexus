import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
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
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Ban, 
  Key,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  UserCircle,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  FileTextIcon,
} from 'lucide-react';

// Define a schema for the staff form
const staffFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  role: z.enum(['admin', 'productManager', 'orderPreparer', 'deliveryStaff'], {
    required_error: "Please select a role.",
  }),
  phone: z.string().optional(),
  status: z.enum(['active', 'inactive'], {
    required_error: "Please select a status."
  }),
});

// Define the StaffMember interface
interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
  phone: string;
  performanceRating: number;
}

// Mock staff data
const mockStaffData: StaffMember[] = [
  { 
    id: '1', 
    name: 'John Doe', 
    email: 'john@tiffahthrift.co.ke', 
    role: 'admin', 
    status: 'active',
    lastActive: '2023-04-09T08:30:00Z',
    phone: '+254712345678',
    performanceRating: 4.8
  },
  { 
    id: '2', 
    name: 'Jane Smith', 
    email: 'jane@tiffahthrift.co.ke', 
    role: 'productManager', 
    status: 'active',
    lastActive: '2023-04-09T09:15:00Z',
    phone: '+254723456789',
    performanceRating: 4.5
  },
  { 
    id: '3', 
    name: 'Bob Johnson', 
    email: 'bob@tiffahthrift.co.ke', 
    role: 'orderPreparer', 
    status: 'active',
    lastActive: '2023-04-08T16:45:00Z',
    phone: '+254734567890',
    performanceRating: 4.2
  },
  { 
    id: '4', 
    name: 'Alice Williams', 
    email: 'alice@tiffahthrift.co.ke', 
    role: 'deliveryStaff', 
    status: 'inactive',
    lastActive: '2023-04-05T11:20:00Z',
    phone: '+254745678901',
    performanceRating: 3.9
  },
];

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [staffData, setStaffData] = useState<StaffMember[]>(mockStaffData);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const form = useForm<z.infer<typeof staffFormSchema>>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'productManager',
      phone: '',
      status: 'active',
    },
  });
  
  const handleAddStaff = (data: z.infer<typeof staffFormSchema>) => {
    const newStaff: StaffMember = {
      id: Math.random().toString(36).substring(7),
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      phone: data.phone || '',
      lastActive: new Date().toISOString(),
      performanceRating: 4.0
    };
    
    setStaffData([...staffData, newStaff]);
    setIsAddingStaff(false);
    form.reset();
    toast.success(`${data.name} has been added to staff!`);
  };
  
  const handleDeleteStaff = (staffId: string) => {
    setStaffData(staffData.filter(staff => staff.id !== staffId));
    toast.success('Staff member removed successfully');
  };
  
  const handleSuspendStaff = (staffId: string) => {
    setStaffData(staffData.map(staff => 
      staff.id === staffId 
        ? { ...staff, status: staff.status === 'active' ? 'inactive' : 'active' } 
        : staff
    ));
    const staffMember = staffData.find(staff => staff.id === staffId);
    toast.success(`${staffMember?.name} has been ${staffMember?.status === 'active' ? 'suspended' : 'reactivated'}`);
  };
  
  const handleResetPassword = (staffId: string) => {
    const staffMember = staffData.find(staff => staff.id === staffId);
    toast.success(`Password reset email sent to ${staffMember?.email}`);
  };
  
  const filteredStaff = staffData
    .filter(staff => 
      activeTab === 'all' || 
      (activeTab === 'active' && staff.status === 'active') ||
      (activeTab === 'inactive' && staff.status === 'inactive')
    )
    .filter(staff => 
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge variant="outline" className="bg-green-500/20 text-green-500">Active</Badge>
      : <Badge variant="outline" className="bg-gray-500/20 text-gray-400">Inactive</Badge>;
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">
              Manage customer accounts and view customer information
            </p>
          </div>
          
          <Dialog open={isAddingStaff} onOpenChange={setIsAddingStaff}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new customer account. They'll receive an email with login instructions.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddStaff)} className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
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
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          This will be their username for login
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+254712345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="customer">Customer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddingStaff(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add User</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            
            <div className="w-full sm:w-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search users..." 
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <TabsContent value={activeTab} className="m-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStaff.map((staff) => (
                        <TableRow key={staff.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <UserCircle className="h-5 w-5 text-primary" />
                              </div>
                              <span className="font-medium">{staff.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MailIcon className="h-4 w-4 text-muted-foreground" />
                              <span>{staff.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                              <span>{staff.phone}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(staff.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span>{new Date(staff.lastActive).toLocaleDateString()}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                              5 Orders
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="icon" variant="ghost" onClick={() => handleResetPassword(staff.id)}>
                                <Key className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost">
                                <FileTextIcon className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => handleSuspendStaff(staff.id)}
                              >
                                {staff.status === 'active' ? (
                                  <Ban className="h-4 w-4" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
