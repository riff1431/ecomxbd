-- ============================================================
-- ecomXbangladesh — Row Level Security Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attribute_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is admin/moderator
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'moderator')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- PROFILES
-- ============================================================
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "profiles_admin_select" ON profiles FOR SELECT USING (is_admin());
CREATE POLICY "profiles_admin_update" ON profiles FOR UPDATE USING (is_admin());

-- ============================================================
-- ADDRESSES — own data only
-- ============================================================
CREATE POLICY "addresses_select_own" ON addresses FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "addresses_insert_own" ON addresses FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "addresses_update_own" ON addresses FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "addresses_delete_own" ON addresses FOR DELETE USING (user_id = auth.uid());

-- ============================================================
-- MEDIA — admin manage, public read
-- ============================================================
CREATE POLICY "media_public_read" ON media FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "media_admin_insert" ON media FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "media_admin_update" ON media FOR UPDATE USING (is_admin());
CREATE POLICY "media_admin_delete" ON media FOR DELETE USING (is_admin());

-- ============================================================
-- CATALOG — public read for active, admin full access
-- ============================================================
-- Categories
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (status = 'active');
CREATE POLICY "categories_admin_all" ON categories FOR ALL USING (is_admin());

-- Brands
CREATE POLICY "brands_public_read" ON brands FOR SELECT USING (status = 'active');
CREATE POLICY "brands_admin_all" ON brands FOR ALL USING (is_admin());

-- Product Attributes
CREATE POLICY "attrs_public_read" ON product_attributes FOR SELECT USING (TRUE);
CREATE POLICY "attrs_admin_all" ON product_attributes FOR ALL USING (is_admin());

-- Attribute Values
CREATE POLICY "attr_vals_public_read" ON attribute_values FOR SELECT USING (TRUE);
CREATE POLICY "attr_vals_admin_all" ON attribute_values FOR ALL USING (is_admin());

-- Products
CREATE POLICY "products_public_read" ON products FOR SELECT USING (status = 'active' AND deleted_at IS NULL);
CREATE POLICY "products_admin_all" ON products FOR ALL USING (is_admin());

-- Product Variants
CREATE POLICY "variants_public_read" ON product_variants FOR SELECT USING (
  EXISTS (SELECT 1 FROM products WHERE id = product_variants.product_id AND status = 'active')
);
CREATE POLICY "variants_admin_all" ON product_variants FOR ALL USING (is_admin());

-- Product Categories, Tags, Media
CREATE POLICY "product_cats_public_read" ON product_categories FOR SELECT USING (TRUE);
CREATE POLICY "product_cats_admin_all" ON product_categories FOR ALL USING (is_admin());
CREATE POLICY "product_media_public_read" ON product_media FOR SELECT USING (TRUE);
CREATE POLICY "product_media_admin_all" ON product_media FOR ALL USING (is_admin());
CREATE POLICY "tags_public_read" ON tags FOR SELECT USING (TRUE);
CREATE POLICY "tags_admin_all" ON tags FOR ALL USING (is_admin());
CREATE POLICY "product_tags_public_read" ON product_tags FOR SELECT USING (TRUE);
CREATE POLICY "product_tags_admin_all" ON product_tags FOR ALL USING (is_admin());

-- ============================================================
-- INVENTORY — admin only
-- ============================================================
CREATE POLICY "inventory_admin_all" ON inventory FOR ALL USING (is_admin());
CREATE POLICY "inventory_public_read" ON inventory FOR SELECT USING (TRUE);
CREATE POLICY "movements_admin_all" ON inventory_movements FOR ALL USING (is_admin());

-- ============================================================
-- COUPONS — admin manage, public validate
-- ============================================================
CREATE POLICY "coupons_admin_all" ON coupons FOR ALL USING (is_admin());
CREATE POLICY "coupons_public_active" ON coupons FOR SELECT USING (status = 'active');
CREATE POLICY "coupon_usage_admin_all" ON coupon_usage FOR ALL USING (is_admin());

-- ============================================================
-- CARTS — own data
-- ============================================================
CREATE POLICY "carts_own" ON carts FOR ALL USING (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "cart_items_own" ON cart_items FOR ALL USING (
  EXISTS (SELECT 1 FROM carts WHERE id = cart_items.cart_id AND (user_id = auth.uid() OR user_id IS NULL))
);

-- ============================================================
-- ORDERS — customer reads own, admin full
-- ============================================================
CREATE POLICY "orders_customer_read" ON orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "orders_admin_all" ON orders FOR ALL USING (is_admin());
CREATE POLICY "order_items_customer_read" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND user_id = auth.uid())
);
CREATE POLICY "order_items_admin_all" ON order_items FOR ALL USING (is_admin());
CREATE POLICY "order_history_customer_read" ON order_status_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_status_history.order_id AND user_id = auth.uid())
);
CREATE POLICY "order_history_admin_all" ON order_status_history FOR ALL USING (is_admin());
CREATE POLICY "order_notes_admin_all" ON order_notes FOR ALL USING (is_admin());

-- ============================================================
-- PAYMENTS — admin only
-- ============================================================
CREATE POLICY "payments_admin_all" ON payments FOR ALL USING (is_admin());

-- ============================================================
-- SHIPPING METHODS — public read, admin manage
-- ============================================================
CREATE POLICY "shipping_public_read" ON shipping_methods FOR SELECT USING (status = 'active');
CREATE POLICY "shipping_admin_all" ON shipping_methods FOR ALL USING (is_admin());

-- ============================================================
-- REVIEWS — public read approved, own create, admin moderate
-- ============================================================
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "reviews_own_insert" ON reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "reviews_admin_all" ON reviews FOR ALL USING (is_admin());
CREATE POLICY "review_media_public_read" ON review_media FOR SELECT USING (TRUE);
CREATE POLICY "review_media_own_insert" ON review_media FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM reviews WHERE id = review_media.review_id AND user_id = auth.uid())
);

-- Q&A
CREATE POLICY "questions_public_read" ON questions FOR SELECT USING (status = 'published');
CREATE POLICY "questions_own_insert" ON questions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "questions_admin_all" ON questions FOR ALL USING (is_admin());
CREATE POLICY "answers_public_read" ON answers FOR SELECT USING (TRUE);
CREATE POLICY "answers_admin_all" ON answers FOR ALL USING (is_admin());

-- ============================================================
-- WISHLISTS — own data only
-- ============================================================
CREATE POLICY "wishlists_own" ON wishlists FOR ALL USING (user_id = auth.uid());

-- ============================================================
-- HOMEPAGE, PAGES, MENUS — public read, admin manage
-- ============================================================
CREATE POLICY "homepage_public_read" ON homepage_sections FOR SELECT USING (status = 'active');
CREATE POLICY "homepage_admin_all" ON homepage_sections FOR ALL USING (is_admin());
CREATE POLICY "pages_public_read" ON pages FOR SELECT USING (status = 'published');
CREATE POLICY "pages_admin_all" ON pages FOR ALL USING (is_admin());
CREATE POLICY "menus_public_read" ON menus FOR SELECT USING (TRUE);
CREATE POLICY "menus_admin_all" ON menus FOR ALL USING (is_admin());

-- ============================================================
-- SETTINGS — admin only
-- ============================================================
CREATE POLICY "settings_admin_all" ON settings FOR ALL USING (is_admin());

-- ============================================================
-- NOTIFICATIONS — own data
-- ============================================================
CREATE POLICY "notifications_own" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notifications_own_update" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- ============================================================
-- ACTIVITY LOGS — admin read only
-- ============================================================
CREATE POLICY "logs_admin_read" ON activity_logs FOR SELECT USING (is_admin());

-- ============================================================
-- ROLES & PERMISSIONS — admin only
-- ============================================================
CREATE POLICY "roles_admin_all" ON roles FOR ALL USING (is_admin());
CREATE POLICY "permissions_admin_read" ON permissions FOR SELECT USING (is_admin());
CREATE POLICY "role_perms_admin_all" ON role_permissions FOR ALL USING (is_admin());
