
import { useParams } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import ProductFormComponent from '@/components/admin/products/ProductFormComponent';

const ProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">Update product information in your inventory</p>
        </div>
        
        {id && <ProductFormComponent productId={id} />}
      </div>
    </AdminLayout>
  );
};

export default ProductEdit;
