
import AdminLayout from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/card';

const Categories = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage product categories</p>
        </div>
        
        <Card className="p-6">
          <p className="text-center text-muted-foreground">Categories management coming soon</p>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Categories;
