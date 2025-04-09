
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Form schema for login
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

// Form schema for registration
const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Types based on schema
type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

const Auth: React.FC = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('login');
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Get the return URL from query params
  const searchParams = new URLSearchParams(location.search);
  const fromPath = searchParams.get('from') || '/';
  
  // If user is already logged in, redirect to the appropriate dashboard or homepage
  useEffect(() => {
    if (user) {
      console.log("User is logged in:", user);
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (['productManager', 'orderPreparer', 'deliveryStaff'].includes(user.role)) {
        navigate('/staff');
      } else {
        // Redirect to the original requested page or default to home
        navigate(fromPath);
      }
    }
  }, [user, navigate, fromPath]);

  // Login form
  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Register form
  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onLoginSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      console.log("Attempting to sign in with:", values.email);
      await signIn(values.email, values.password);
      toast.success('Login successful');
      // The redirect will be handled by the useEffect
    } catch (error: any) {
      console.error('Login error:', error);
      // More user-friendly error message
      setLoginError('Login failed. Please check your credentials and try again.');
      toast.error('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (values: RegisterValues) => {
    setIsLoading(true);
    try {
      await signUp(values.email, values.password, values.name);
      toast.success('Registration successful! Please check your email for verification.');
      setActiveTab('login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // This adds some sample account details to help with testing
  const demoAccounts = [
    { email: 'admin@tiffahthrift.com', password: 'Admin123!', role: 'Admin' },
    { email: 'product@tiffahthrift.com', password: 'Staff123!', role: 'Product Manager' },
    { email: 'order@tiffahthrift.com', password: 'Staff123!', role: 'Order Preparer' },
    { email: 'delivery@tiffahthrift.com', password: 'Staff123!', role: 'Delivery Staff' }
  ];

  const fillDemoAccount = (email: string, password: string) => {
    loginForm.setValue('email', email);
    loginForm.setValue('password', password);
  };

  const loginWithDemoAccount = (email: string, password: string) => {
    fillDemoAccount(email, password);
    onLoginSubmit({ email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Tiffah Thrift Store</CardTitle>
          <CardDescription>Sign in to your account or create a new one</CardDescription>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <CardContent className="space-y-4 pt-4">
              {loginError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
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
                        <LogIn className="h-4 w-4" /> Sign In
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
                      Demo Accounts
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {demoAccounts.map((account, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs justify-start"
                      onClick={() => loginWithDemoAccount(account.email, account.password)}
                    >
                      <span className="font-medium">{account.role}:</span>
                      <span className="ml-2 text-muted-foreground">{account.email}</span>
                    </Button>
                  ))}
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  Click on an account button to login immediately
                </p>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="register">
            <CardContent className="space-y-4 pt-4">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
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

                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
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
                        Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" /> Create Account
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </TabsContent>
        </Tabs>

        <CardFooter className="flex flex-col space-y-4 border-t p-4">
          <p className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
