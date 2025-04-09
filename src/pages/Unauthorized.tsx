
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Unauthorized = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
      <ShieldAlert className="h-24 w-24 text-primary mb-6" />
      <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        You don't have permission to access this page. If you believe this is an error, please contact your administrator.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link to="/">Go to Homepage</Link>
        </Button>
        
        {user ? (
          <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Sign Out & Go to Admin Login
          </Button>
        ) : (
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/admin/auth">
              <LogIn className="h-4 w-4 mr-2" />
              Go to Admin Login
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Unauthorized;
