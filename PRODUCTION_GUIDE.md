
# Tiffah Thrift Store - Production Guide

This guide explains how to prepare your Tiffah Thrift Store application for production deployment.

## 1. Database Setup

Before deploying, set up your Supabase database with the following tables:

### Users and Profiles

```sql
-- Create profiles table to extend auth.users
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT,
  role TEXT DEFAULT 'customer',
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create trigger to create profile when user is created
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'name', 
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_profile_for_user();
```

### Products Table

```sql
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  condition TEXT CHECK (condition IN ('new', 'likeNew', 'good', 'fair')),
  size TEXT,
  color TEXT,
  brand TEXT,
  category TEXT,
  subcategory TEXT,
  images JSONB,
  tags TEXT[],
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Orders Table

```sql
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready', 'outForDelivery', 'delivered', 'cancelled')),
  items JSONB NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  total_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Categories Table

```sql
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Feedback Table

```sql
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  product_id UUID REFERENCES public.products(id),
  order_id UUID REFERENCES public.orders(id),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'under_review', 'responded', 'closed')),
  category TEXT CHECK (category IN ('product', 'service', 'delivery', 'website', 'general')),
  response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## 2. API Key Management

The following API keys need to be configured for production:

### Required API Keys

1. **Supabase Keys**:
   - Already configured in the project
   - No changes needed

2. **Payment Processing**:
   - M-Pesa API Key: Configure in Settings > Payment
   - M-Pesa Secret Key: Configure in Settings > Payment

3. **PrintNode (Cloud Printing)**:
   - PrintNode API Key: Configure in Settings > Printing

4. **Image Processing**:
   - Cloudinary API Key: Configure in Settings > Content
   - Cloudinary Secret: Configure in Settings > Content

### Setting Up Environment Variables

The application looks for these keys in Supabase. To add them:

1. Navigate to your Supabase project
2. Go to Settings > API
3. Add the following secrets:
   - `MPESA_API_KEY`
   - `MPESA_SECRET_KEY`
   - `PRINTNODE_API_KEY`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_SECRET`

## 3. Data Migration for Production

### Step 1: Add Initial Categories

Start by adding your core product categories through the admin interface:

1. Log in as admin
2. Navigate to Categories section
3. Add main categories (Dresses, Shirts, Jeans, Shoes, etc.)
4. Add subcategories as needed

### Step 2: Add Products

Two approaches to add products:

1. **Manual Entry**:
   - Use the Product Form in the admin interface
   - Upload photos for each product
   - Set proper categorization

2. **Bulk Import**:
   - Create a CSV file with product data
   - Use the bulk import tool in the admin interface

## 4. Deployment Steps

### 1. Build the Application

```bash
npm run build
```

This will create a `dist` directory with optimized files.

### 2. Deployment Options

#### Option A: Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy with default settings

#### Option B: DigitalOcean App Platform

1. Create a new App
2. Connect to your GitHub repository
3. Set build command to `npm run build`
4. Set output directory to `dist`
5. Configure environment variables

#### Option C: Traditional VPS

1. Set up a server with Nginx
2. Upload the `dist` directory to your server
3. Configure Nginx to serve the static files
4. Set up SSL with Let's Encrypt

## 5. Post-Deployment Tasks

### 1. Create Admin User

After deployment:

1. Register a new user
2. Access your Supabase directly:
```sql
UPDATE public.profiles 
SET role = 'admin'
WHERE id = '[USER_UUID]';
```

### 2. Performance Testing

Verify these performance metrics:
- Page load time < 3 seconds
- First Contentful Paint < 1.8 seconds
- Time to Interactive < 3.5 seconds

### 3. Security Review

Before going live, perform:
- Authentication flow testing
- Role-based access control verification
- API endpoint security testing

## 6. Maintenance Tasks

### Regular Backups
- Set up automatic backups of Supabase database
- Schedule weekly backups minimum

### Monitoring
- Implement server monitoring
- Set up error tracking (e.g., Sentry)
- Monitor API endpoint performance

### Updates
- Schedule regular dependency updates
- Test updates in staging before production

## 7. Additional Resources

- [Supabase Documentation](https://supabase.io/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [DigitalOcean App Platform Guide](https://docs.digitalocean.com/products/app-platform/)

## Support

For any deployment assistance, contact:
- Email: support@tiffahthrift.co.ke
- Phone: +254 712 345 678
