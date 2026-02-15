-- Create tables if they don't exist

-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  category TEXT NOT NULL CHECK (category IN ('saas_starter', 'prompt', 'ui_kit', 'cursor_rule')),
  price_cents INTEGER NOT NULL DEFAULT 0,
  compare_price_cents INTEGER,
  image_url TEXT,
  gallery_urls TEXT[],
  tags TEXT[],
  features TEXT[],
  tech_stack TEXT[],
  demo_url TEXT,
  preview_content TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  downloads_count INTEGER DEFAULT 0,
  rating_average FLOAT DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  seller_id UUID, -- References profiles(id)
  lemon_squeezy_product_id TEXT,
  lemon_squeezy_variant_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles Table (Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  username TEXT UNIQUE,
  bio TEXT,
  website TEXT,
  github_username TEXT,
  is_seller BOOLEAN DEFAULT false,
  stripe_customer_id TEXT,
  lemon_squeezy_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Allow public read access to products
CREATE POLICY "Allow public read access to products" ON public.products
  FOR SELECT USING (is_published = true);

-- Allow authenticated users to insert/update their own products (if seller) - simplified for now
CREATE POLICY "Allow admins to manage products" ON public.products
  USING (auth.role() = 'service_role');

-- Allow public read access to profiles
CREATE POLICY "Allow public read access to profiles" ON public.profiles
  FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Allow users to update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Enable RLS