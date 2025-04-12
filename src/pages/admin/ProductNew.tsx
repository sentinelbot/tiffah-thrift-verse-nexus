
import AdminLayout from '@/components/layout/AdminLayout';
import ProductFormComponent from '@/components/admin/products/ProductFormComponent';

const ProductNew = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">Create a new product in your inventory</p>
        </div>
        
        <ProductFormComponent />
      </div>
    </AdminLayout>
  );
};

export default ProductNew;
