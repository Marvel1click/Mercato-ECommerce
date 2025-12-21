/*
  # Fix Security and Performance Issues

  This migration addresses the security and performance issues identified by Supabase:

  ## 1. Missing Foreign Key Indexes
  - Add indexes for foreign keys to improve query performance:
    - `addresses.user_id`
    - `categories.parent_id`
    - `order_items.product_id`
    - `reviews.user_id`
    - `wishlists.product_id`

  ## 2. Optimize RLS Policies
  - Replace `auth.uid()` with `(select auth.uid())` in all RLS policies
  - This prevents re-evaluation of auth functions for each row
  - Improves query performance at scale
  - Affects policies on: profiles, addresses, orders, order_items, reviews, wishlists

  ## 3. Fix Function Search Paths
  - Set stable search_path for functions to prevent security issues:
    - `update_product_rating`
    - `handle_new_user`
*/

-- ============================================================================
-- 1. ADD MISSING FOREIGN KEY INDEXES
-- ============================================================================

-- Index for addresses.user_id foreign key
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- Index for categories.parent_id foreign key
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- Index for order_items.product_id foreign key
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Index for reviews.user_id foreign key
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- Index for wishlists.product_id foreign key
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON wishlists(product_id);

-- ============================================================================
-- 2. OPTIMIZE RLS POLICIES - DROP AND RECREATE WITH OPTIMIZED AUTH CHECKS
-- ============================================================================

-- Profiles table policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- Addresses table policies
DROP POLICY IF EXISTS "Users can view their own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can insert their own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON addresses;

CREATE POLICY "Users can view their own addresses"
  ON addresses FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert their own addresses"
  ON addresses FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own addresses"
  ON addresses FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own addresses"
  ON addresses FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Orders table policies
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;

CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert their own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- Order items table policies
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert order items for their orders" ON order_items;

CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can insert order items for their orders"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = (select auth.uid())
    )
  );

-- Reviews table policies
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;

CREATE POLICY "Authenticated users can insert reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Wishlists table policies
DROP POLICY IF EXISTS "Users can view their own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can add to their own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can remove from their own wishlist" ON wishlists;

CREATE POLICY "Users can view their own wishlist"
  ON wishlists FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can add to their own wishlist"
  ON wishlists FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can remove from their own wishlist"
  ON wishlists FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================================================
-- 3. FIX FUNCTION SEARCH PATHS
-- ============================================================================

-- Recreate update_product_rating function with stable search_path
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE products
  SET
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    )
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Recreate handle_new_user function with stable search_path
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;