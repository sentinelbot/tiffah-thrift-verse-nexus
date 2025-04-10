
-- Function to check if a user has a specific role
CREATE OR REPLACE FUNCTION has_role(user_id UUID, role_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = $1 
    AND role = $2
  );
END;
$$;

-- Function to get all roles for a user
CREATE OR REPLACE FUNCTION get_user_roles(user_id UUID)
RETURNS TEXT[]
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  roles TEXT[];
BEGIN
  SELECT array_agg(role) INTO roles
  FROM user_roles
  WHERE user_id = $1;
  
  RETURN roles;
END;
$$;

-- Function to add a role to a user
CREATE OR REPLACE FUNCTION add_user_role(user_id UUID, role_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if role already exists for user
  IF EXISTS (SELECT 1 FROM user_roles WHERE user_id = $1 AND role = $2) THEN
    RETURN true;
  END IF;
  
  -- Insert new role
  INSERT INTO user_roles (user_id, role)
  VALUES ($1, $2);
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;

-- Function to remove a role from a user
CREATE OR REPLACE FUNCTION remove_user_role(user_id UUID, role_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM user_roles
  WHERE user_id = $1
  AND role = $2;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;

-- Function to get all delivery staff
CREATE OR REPLACE FUNCTION get_delivery_staff()
RETURNS SETOF auth.users
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT u.*
  FROM auth.users u
  JOIN user_roles ur ON u.id = ur.user_id
  WHERE ur.role = 'deliveryStaff';
END;
$$;

-- Function to process pending scans
CREATE OR REPLACE FUNCTION process_pending_scans(user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  processed_count INTEGER := 0;
BEGIN
  -- In a real implementation, this would process scans from a pending_scans table
  -- For this example, we'll just return a count
  
  -- Get count of pending scans for user
  SELECT COUNT(*) INTO processed_count
  FROM pending_scans
  WHERE user_id = $1;
  
  -- Mark scans as processed
  UPDATE pending_scans
  SET processed = true,
      processed_at = NOW()
  WHERE user_id = $1
  AND processed = false;
  
  result := jsonb_build_object('processed', processed_count);
  RETURN result;
END;
$$;

-- Function to get scan history for a user
CREATE OR REPLACE FUNCTION get_user_scan_history(user_id UUID)
RETURNS SETOF JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT to_jsonb(s)
  FROM scan_history s
  WHERE s.user_id = $1
  ORDER BY s.scanned_at DESC;
END;
$$;

-- Function to get sales data
CREATE OR REPLACE FUNCTION get_sales_data(start_date DATE, end_date DATE)
RETURNS SETOF JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT to_jsonb(s)
  FROM sales_data s
  WHERE s.date >= start_date
  AND s.date <= end_date
  ORDER BY s.date;
END;
$$;

-- Function to get sales by category
CREATE OR REPLACE FUNCTION get_sales_by_category(start_date DATE, end_date DATE)
RETURNS SETOF JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT to_jsonb(s)
  FROM sales_by_category s
  WHERE s.date >= start_date
  AND s.date <= end_date;
END;
$$;

-- Function to get inventory status
CREATE OR REPLACE FUNCTION get_inventory_status()
RETURNS SETOF JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT to_jsonb(i)
  FROM inventory_status i;
END;
$$;

-- Function to get staff performance
CREATE OR REPLACE FUNCTION get_staff_performance(staff_id UUID, start_date DATE, end_date DATE)
RETURNS SETOF JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT to_jsonb(p)
  FROM staff_performance p
  WHERE p.staff_id = staff_id
  AND p.date >= start_date
  AND p.date <= end_date;
END;
$$;
