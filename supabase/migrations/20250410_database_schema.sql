
-- User Roles Table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Pending Scans Table
CREATE TABLE IF NOT EXISTS public.pending_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  scan_type TEXT NOT NULL,
  barcode TEXT NOT NULL,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Scan History Table
CREATE TABLE IF NOT EXISTS public.scan_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  scan_type TEXT NOT NULL,
  barcode TEXT NOT NULL,
  result JSONB,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT,
  description TEXT,
  price DECIMAL NOT NULL,
  original_price DECIMAL,
  category TEXT NOT NULL,
  sub_category TEXT,
  tags TEXT[],
  size TEXT,
  color TEXT,
  brand TEXT,
  condition TEXT NOT NULL,
  barcode TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'available',
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  measurements JSONB,
  inventory_tracking JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Product Images Table
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  is_main BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES auth.users(id),
  total_amount DECIMAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_info JSONB,
  shipping_info JSONB,
  delivery_info JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_by UUID REFERENCES auth.users(id)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Order History Table
CREATE TABLE IF NOT EXISTS public.order_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Print Jobs Table
CREATE TABLE IF NOT EXISTS public.print_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  printer_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  error TEXT,
  related_id UUID,
  requested_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Create views for analytics
CREATE OR REPLACE VIEW public.sales_data AS
SELECT
  DATE_TRUNC('day', o.created_at)::DATE AS date,
  SUM(o.total_amount) AS revenue,
  COUNT(o.id) AS orders,
  SUM(o.total_amount) / COUNT(o.id) AS average_order_value
FROM public.orders o
WHERE o.status != 'cancelled'
GROUP BY DATE_TRUNC('day', o.created_at)::DATE
ORDER BY date;

CREATE OR REPLACE VIEW public.sales_by_category AS
SELECT
  p.category,
  SUM(oi.price * oi.quantity) AS revenue,
  SUM(oi.quantity) AS units,
  (SUM(oi.price * oi.quantity) / (SELECT SUM(total_amount) FROM orders WHERE status != 'cancelled')) * 100 AS percentage
FROM public.order_items oi
JOIN public.products p ON oi.product_id = p.id
JOIN public.orders o ON oi.order_id = o.id
WHERE o.status != 'cancelled'
GROUP BY p.category;

CREATE OR REPLACE VIEW public.inventory_status AS
SELECT
  p.category,
  COUNT(*) FILTER (WHERE p.status = 'available') AS in_stock,
  COUNT(*) FILTER (WHERE p.status = 'available' AND p.price < 20) AS low_stock,
  COUNT(*) FILTER (WHERE p.status != 'available') AS out_of_stock,
  SUM(p.price) FILTER (WHERE p.status = 'available') AS total_value
FROM public.products p
GROUP BY p.category;

CREATE OR REPLACE VIEW public.staff_performance AS
SELECT
  o.processed_by AS staff_id,
  u.name,
  COUNT(o.id) AS orders_processed,
  SUM((SELECT COUNT(*) FROM order_items WHERE order_id = o.id)) AS items_processed,
  AVG(EXTRACT(EPOCH FROM (o.updated_at - o.created_at)) / 3600) AS average_time_hours
FROM public.orders o
JOIN auth.users u ON o.processed_by = u.id
WHERE o.status != 'cancelled'
GROUP BY o.processed_by, u.name;

-- Add RLS policies
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.print_jobs ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (would be expanded in a real application)
CREATE POLICY "Users can view their own data" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all data" ON public.user_roles
  FOR ALL USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Everyone can view available products" ON public.products
  FOR SELECT USING (status = 'available' OR status = 'reserved');

CREATE POLICY "Staff can edit products" ON public.products
  FOR ALL USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND (role = 'admin' OR role = 'productManager')
  ));

CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Staff can view all orders" ON public.orders
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND (
      role = 'admin' OR 
      role = 'orderPreparer' OR 
      role = 'deliveryStaff'
    )
  ));
