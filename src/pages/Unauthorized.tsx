
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert, Home, LogIn, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };
  
  const goBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 p-4">
            <ShieldAlert className="h-16 w-16 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page. This area is restricted to authorized personnel only.
        </p>
        
        <div className="space-y-2">
          <Button variant="outline" className="w-full" onClick={goBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          
          <Button className="w-full" onClick={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" />
            Go to Homepage
          </Button>
          
          {user ? (
            <Button variant="ghost" className="w-full" onClick={handleSignOut}>
              <LogIn className="mr-2 h-4 w-4" />
              Sign Out and Log In as Different User
            </Button>
          ) : (
            <Button variant="ghost" className="w-full" onClick={() => navigate('/auth')}>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground mt-8">
          If you believe this is an error, please contact your administrator for assistance.
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
