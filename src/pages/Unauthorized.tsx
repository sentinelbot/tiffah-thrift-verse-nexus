
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
      <ShieldAlert className="h-24 w-24 text-primary mb-6" />
      <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        You don't have permission to access this page. If you believe this is an error, please contact your administrator.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link to="/">Go to Homepage</Link>
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
