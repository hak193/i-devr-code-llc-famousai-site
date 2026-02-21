-- Checkout System Database Schema
-- Add these tables to support orders, payments, and licenses

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'refunded', 'failed')) DEFAULT 'pending',
  total_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  
  -- Payment processor fields
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  lemon_squeezy_order_id TEXT,
  lemon_squeezy_subscription_id TEXT,
  
  receipt_url TEXT,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  
  quantity INTEGER NOT NULL DEFAULT 1,
  price_cents INTEGER NOT NULL,
  license_type TEXT NOT NULL CHECK (license_type IN ('personal', 'team', 'enterprise')),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Licenses Table
CREATE TABLE IF NOT EXISTS public.licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  order_item_id UUID REFERENCES public.order_items(id) ON DELETE SET NULL,
  
  license_key TEXT UNIQUE NOT NULL,
  license_type TEXT NOT NULL CHECK (license_type IN ('personal', 'team', 'enterprise')),
  
  seats_allowed INTEGER NOT NULL,
  seats_used INTEGER NOT NULL DEFAULT 0,
  
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  activated_at TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_licenses_user_id ON public.licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_product_id ON public.licenses(product_id);
CREATE INDEX IF NOT EXISTS idx_licenses_license_key ON public.licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_licenses_is_active ON public.licenses(is_active);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Orders
CREATE POLICY "Users can view own orders" 
  ON public.orders FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all orders" 
  ON public.orders FOR ALL 
  USING (auth.role() = 'service_role');

-- RLS Policies for Order Items
CREATE POLICY "Users can view own order items" 
  ON public.order_items FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage all order items" 
  ON public.order_items FOR ALL 
  USING (auth.role() = 'service_role');

-- RLS Policies for Licenses
CREATE POLICY "Users can view own licenses" 
  ON public.licenses FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all licenses" 
  ON public.licenses FOR ALL 
  USING (auth.role() = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON public.orders 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_licenses_updated_at 
  BEFORE UPDATE ON public.licenses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate license keys
CREATE OR REPLACE FUNCTION generate_license_key()
RETURNS TEXT AS $$
DECLARE
  key TEXT;
  exists_key BOOLEAN;
BEGIN
  LOOP
    -- Generate format: IDEVR-XXXX-XXXX-XXXX-XXXX
    key := 'IDEVR-' || 
           UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4)) || '-' ||
           UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4)) || '-' ||
           UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4)) || '-' ||
           UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
    
    -- Check if key already exists
    SELECT EXISTS(SELECT 1 FROM public.licenses WHERE license_key = key) INTO exists_key;
    
    -- Exit loop if key is unique
    EXIT WHEN NOT exists_key;
  END LOOP;
  
  RETURN key;
END;
$$ LANGUAGE plpgsql;

-- View for order summaries (useful for admin dashboard)
CREATE OR REPLACE VIEW order_summaries AS
SELECT 
  o.id,
  o.user_id,
  o.status,
  o.total_cents,
  o.currency,
  o.customer_email,
  o.customer_name,
  o.created_at,
  COUNT(oi.id) as item_count,
  ARRAY_AGG(
    JSON_BUILD_OBJECT(
      'product_id', oi.product_id,
      'product_name', p.name,
      'license_type', oi.license_type,
      'price_cents', oi.price_cents
    )
  ) as items
FROM public.orders o
LEFT JOIN public.order_items oi ON o.id = oi.order_id
LEFT JOIN public.products p ON oi.product_id = p.id
GROUP BY o.id;

-- Grant access to authenticated users
GRANT SELECT ON order_summaries TO authenticated;

-- Comments for documentation
COMMENT ON TABLE public.orders IS 'Customer orders with payment information';
COMMENT ON TABLE public.order_items IS 'Individual items in each order';
COMMENT ON TABLE public.licenses IS 'License keys generated for purchased products';
COMMENT ON FUNCTION generate_license_key() IS 'Generates unique license keys in format IDEVR-XXXX-XXXX-XXXX-XXXX';
