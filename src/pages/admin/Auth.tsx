
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Form schema for login
const adminLoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

// Types based on schema
type AdminLoginValues = z.infer<typeof adminLoginSchema>;

const AdminAuth: React.FC = () => {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Get the return URL from query params
  const searchParams = new URLSearchParams(location.search);
  const fromPath = searchParams.get('from') || '/admin';
  
  // If user is already logged in and is admin, redirect to admin dashboard
  useEffect(() => {
    if (user) {
      console.log("User is logged in:", user);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        // If user is not admin, redirect to unauthorized page
        toast.error("You don't have permission to access the admin panel");
        navigate('/unauthorized');
      }
    }
  }, [user, navigate]);

  // Admin login form
  const adminLoginForm = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onAdminLoginSubmit = async (values: AdminLoginValues) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      console.log("Attempting admin sign in with:", values.email);
      await signIn(values.email, values.password);
      
      // Auth context will handle the role checking and redirection
    } catch (error: any) {
      console.error('Admin login error:', error);
      setLoginError('Login failed. Please check your credentials and try again.');
      toast.error('Admin login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Admin demo account
  const adminDemoAccount = { 
    email: 'tiffahthriftstore@gmail.com', 
    password: 'kinaro@15' 
  };

  const loginWithAdminAccount = (email: string, password: string) => {
    adminLoginForm.setValue('email', email);
    adminLoginForm.setValue('password', password);
    onAdminLoginSubmit({ email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Tiffah Admin Portal</CardTitle>
          <CardDescription>Sign in to manage your thrift store</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {loginError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          <Form {...adminLoginForm}>
            <form onSubmit={adminLoginForm.handleSubmit(onAdminLoginSubmit)} className="space-y-4">
              <FormField
                control={adminLoginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@tiffahthrift.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={adminLoginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> 
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" /> Admin Sign In
                  </span>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Admin Account
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs justify-start"
                onClick={() => loginWithAdminAccount(adminDemoAccount.email, adminDemoAccount.password)}
              >
                <span className="font-medium">Admin:</span>
                <span className="ml-2 text-muted-foreground">{adminDemoAccount.email}</span>
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Click on the account button to login immediately
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 border-t p-4">
          <p className="text-center text-sm text-muted-foreground">
            This portal is for admin access only. <br />
            <a href="/auth" className="text-primary hover:underline">
              Customer portal →
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminAuth;
