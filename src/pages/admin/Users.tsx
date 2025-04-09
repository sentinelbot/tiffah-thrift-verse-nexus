
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Schema for creating a new staff account
const createUserSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  role: z.enum(['admin', 'productManager', 'orderPreparer', 'deliveryStaff', 'customer'], {
    required_error: 'Please select a role',
  }),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

// Schema for the quick admin setup
const quickSetupSchema = z.object({
  adminEmail: z.string().email({ message: 'Please enter a valid email address' }),
  adminPassword: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

type QuickSetupFormValues = z.infer<typeof quickSetupSchema>;

const Users = () => {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [quickSetupDone, setQuickSetupDone] = useState(false);

  // Form for creating individual staff accounts
  const createUserForm = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'customer',
    },
  });

  // Form for quick setup of admin and staff accounts
  const quickSetupForm = useForm<QuickSetupFormValues>({
    resolver: zodResolver(quickSetupSchema),
    defaultValues: {
      adminEmail: '',
      adminPassword: '',
    },
  });

  // Create a single user with a specific role
  const handleCreateUser = async (values: CreateUserFormValues) => {
    setIsLoading(true);
    try {
      await signUp(values.email, values.password, values.role);
      createUserForm.reset();
      toast.success(`User with role "${values.role}" created successfully!`);
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick setup for creating admin and all staff roles
  const handleQuickSetup = async (values: QuickSetupFormValues) => {
    setIsLoading(true);
    try {
      // Create admin account
      await signUp(values.adminEmail, values.adminPassword, 'admin');
      
      // Create staff accounts with different roles (using the same password for simplicity)
      const staffRoles = [
        { email: 'product.manager@tiffahthrift.com', role: 'productManager' },
        { email: 'order.preparer@tiffahthrift.com', role: 'orderPreparer' },
        { email: 'delivery.staff@tiffahthrift.com', role: 'deliveryStaff' }
      ];
      
      for (const staff of staffRoles) {
        await signUp(staff.email, values.adminPassword, staff.role);
      }
      
      toast.success('Quick setup completed! Admin and staff accounts created');
      setQuickSetupDone(true);
      
      // List the created accounts
      console.info('Created accounts:', [
        { email: values.adminEmail, role: 'admin', password: values.adminPassword },
        ...staffRoles.map(staff => ({ ...staff, password: values.adminPassword }))
      ]);
      
    } catch (error: any) {
      console.error('Error during quick setup:', error);
      toast.error(error.message || 'Failed to complete quick setup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Create and manage user accounts</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Setup Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Setup</CardTitle>
              <CardDescription>
                Create admin and staff accounts with a single setup
              </CardDescription>
            </CardHeader>
            <CardContent>
              {quickSetupDone ? (
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-md border border-primary/20">
                    <h3 className="font-medium text-primary">Setup Complete!</h3>
                    <p className="text-sm mt-1">The following accounts have been created:</p>
                    <ul className="text-sm mt-2 space-y-2">
                      <li>Admin: {quickSetupForm.getValues('adminEmail')}</li>
                      <li>Product Manager: product.manager@tiffahthrift.com</li>
                      <li>Order Preparer: order.preparer@tiffahthrift.com</li>
                      <li>Delivery Staff: delivery.staff@tiffahthrift.com</li>
                    </ul>
                    <p className="text-sm font-medium mt-2">
                      All accounts have the same password you provided.
                    </p>
                  </div>
                  <Button onClick={() => setQuickSetupDone(false)} variant="outline" className="w-full">
                    Create Different Accounts
                  </Button>
                </div>
              ) : (
                <Form {...quickSetupForm}>
                  <form onSubmit={quickSetupForm.handleSubmit(handleQuickSetup)} className="space-y-4">
                    <FormField
                      control={quickSetupForm.control}
                      name="adminEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admin Email</FormLabel>
                          <FormControl>
                            <Input placeholder="admin@tiffahthrift.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={quickSetupForm.control}
                      name="adminPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password (for all accounts)</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormDescription>
                            This password will be used for all created accounts
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Creating Accounts...' : 'Create Admin & Staff Accounts'}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
          
          {/* Individual User Creation Card */}
          <Card>
            <CardHeader>
              <CardTitle>Create Single User</CardTitle>
              <CardDescription>
                Create an individual user with a specific role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...createUserForm}>
                <form onSubmit={createUserForm.handleSubmit(handleCreateUser)} className="space-y-4">
                  <FormField
                    control={createUserForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="user@example.com" {...field} />
                        </FormControl>
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
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
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
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="productManager">Product Manager</SelectItem>
                            <SelectItem value="orderPreparer">Order Preparer</SelectItem>
                            <SelectItem value="deliveryStaff">Delivery Staff</SelectItem>
                            <SelectItem value="customer">Customer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating User...' : 'Create User'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Users;
