
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { SalesChart } from '@/components/admin/charts/SalesChart';
import { CategorySalesChart } from '@/components/admin/charts/CategorySalesChart';
import { InventoryChart } from '@/components/admin/charts/InventoryChart';
import { StatsCard } from '@/components/admin/dashboard/StatsCard';
import { InventoryOverview } from '@/components/admin/inventory/InventoryOverview';
import { OrdersTable } from '@/components/admin/orders/OrdersTable';
import { StaffPerformance } from '@/components/admin/staff/StaffPerformance';
import { 
  ShoppingBag, Package, Users, TrendingUp, CreditCard, Clock, BarChart3, Calendar 
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const role = user?.role || 'admin';
  
  // Different dashboard views based on role
  const renderDashboardByRole = () => {
    switch (role) {
      case 'admin':
        return <AdminDashboardView />;
      case 'productManager':
        return <ProductManagerDashboardView />;
      case 'orderPreparer':
        return <OrderPreparerDashboardView />;
      case 'deliveryStaff':
        return <DeliveryStaffDashboardView />;
      default:
        return <AdminDashboardView />;
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the Tiffah Thrift Store {role.replace(/([A-Z])/g, ' $1').trim()} dashboard.
          </p>
        </div>
        
        {renderDashboardByRole()}
      </div>
    </AdminLayout>
  );
};

// Admin Dashboard View (full access)
const AdminDashboardView = () => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Products" 
          value="254" 
          description="+5 added today" 
          icon={Package}
        />
        <StatsCard 
          title="Sales" 
          value="KSh 12,345" 
          description="+12% from last month" 
          icon={ShoppingBag}
          trend={{ value: "12%", positive: true }}
        />
        <StatsCard 
          title="Customers" 
          value="142" 
          description="+3 new customers today" 
          icon={Users}
          trend={{ value: "3", positive: true }}
        />
        <StatsCard 
          title="Inventory Value" 
          value="KSh 42,500" 
          description="120 items in stock" 
          icon={TrendingUp}
        />
      </div>
      
      <SalesChart />
      
      <div className="grid gap-4 md:grid-cols-2">
        <CategorySalesChart />
        <InventoryChart />
      </div>
      
      <OrdersTable />
      
      <StaffPerformance />
    </>
  );
};

// Product Manager Dashboard View
const ProductManagerDashboardView = () => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Your Products" 
          value="86" 
          description="48 added this month" 
          icon={Package}
        />
        <StatsCard 
          title="Processing Time" 
          value="14.2 min" 
          description="-2.1 min from last week" 
          icon={Clock}
          trend={{ value: "2.1 min", positive: true }}
        />
        <StatsCard 
          title="Product Quality" 
          value="4.8/5" 
          description="Based on condition assessment" 
          icon={BarChart3}
          trend={{ value: "0.2", positive: true }}
        />
        <StatsCard 
          title="Scheduled Items" 
          value="12" 
          description="For processing today" 
          icon={Calendar}
        />
      </div>
      
      <InventoryOverview />
      
      <div className="grid gap-4 md:grid-cols-2">
        <CategorySalesChart />
        <InventoryChart />
      </div>
    </>
  );
};

// Order Preparer Dashboard View
const OrderPreparerDashboardView = () => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Pending Orders" 
          value="8" 
          description="Awaiting processing" 
          icon={Clock}
        />
        <StatsCard 
          title="Processed Today" 
          value="15" 
          description="+3 more than yesterday" 
          icon={Package}
          trend={{ value: "3", positive: true }}
        />
        <StatsCard 
          title="Average Time" 
          value="6.4 min" 
          description="Per order preparation" 
          icon={BarChart3}
        />
        <StatsCard 
          title="Customer Satisfaction" 
          value="98%" 
          description="Based on order accuracy" 
          icon={Users}
          trend={{ value: "2%", positive: true }}
        />
      </div>
      
      <OrdersTable />
      
      <InventoryOverview />
    </>
  );
};

// Delivery Staff Dashboard View
const DeliveryStaffDashboardView = () => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Orders to Deliver" 
          value="6" 
          description="Scheduled for today" 
          icon={Package}
        />
        <StatsCard 
          title="Delivered Today" 
          value="4" 
          description="Out of 10 scheduled" 
          icon={CreditCard}
        />
        <StatsCard 
          title="Average Time" 
          value="28 min" 
          description="Per delivery" 
          icon={Clock}
          trend={{ value: "5 min", positive: true }}
        />
        <StatsCard 
          title="Customer Rating" 
          value="4.9/5" 
          description="Based on last 30 deliveries" 
          icon={Users}
          trend={{ value: "0.2", positive: true }}
        />
      </div>
      
      <OrdersTable />
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-full">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127635.66247630147!2d36.752610273193356!3d-1.3028617905594762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f11655c311541%3A0x9dd769ac1c10b897!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1650123456789!5m2!1sen!2sus" 
            width="100%" 
            height="450" 
            style={{ border: 0, borderRadius: 'var(--radius)' }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Delivery Map"
            className="w-full h-[450px]"
          ></iframe>
        </Card>
      </div>
    </>
  );
};

export default AdminDashboard;
