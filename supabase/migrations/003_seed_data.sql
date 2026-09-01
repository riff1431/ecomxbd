-- ============================================================
-- ecomXbangladesh — Seed Data
-- ============================================================

-- Roles
INSERT INTO roles (name, display_name, description, is_system) VALUES
  ('admin', 'Administrator', 'Full system access', TRUE),
  ('moderator', 'Moderator', 'Limited admin access for content and orders', TRUE),
  ('customer', 'Customer', 'Regular customer', TRUE);

-- Permissions
INSERT INTO permissions (key, display_name, "group") VALUES
  ('products.view', 'View Products', 'Products'),
  ('products.create', 'Create Products', 'Products'),
  ('products.update', 'Update Products', 'Products'),
  ('products.delete', 'Delete Products', 'Products'),
  ('orders.view', 'View Orders', 'Orders'),
  ('orders.update', 'Update Orders', 'Orders'),
  ('orders.refund', 'Process Refunds', 'Orders'),
  ('customers.view', 'View Customers', 'Customers'),
  ('customers.update', 'Update Customers', 'Customers'),
  ('customers.block', 'Block Customers', 'Customers'),
  ('reports.sales', 'View Sales Reports', 'Reports'),
  ('reports.profit', 'View Profit Reports', 'Reports'),
  ('reports.customers', 'View Customer Reports', 'Reports'),
  ('media.manage', 'Manage Media', 'Content'),
  ('coupons.manage', 'Manage Coupons', 'Marketing'),
  ('reviews.moderate', 'Moderate Reviews', 'Content'),
  ('settings.manage', 'Manage Settings', 'Settings'),
  ('integrations.manage', 'Manage Integrations', 'Settings'),
  ('roles.manage', 'Manage Roles', 'Settings'),
  ('finance.manage', 'Manage Finances', 'Finance');

-- Assign all permissions to admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'admin';

-- Assign limited permissions to moderator role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'moderator'
AND p.key IN (
  'products.view', 'products.create', 'products.update',
  'orders.view', 'orders.update',
  'customers.view',
  'media.manage',
  'reviews.moderate',
  'reports.sales'
);

-- Default Settings
INSERT INTO settings ("group", key, value, type) VALUES
  ('general', 'store_name', 'ecomXbangladesh', 'string'),
  ('general', 'store_email', '', 'string'),
  ('general', 'store_phone', '', 'string'),
  ('general', 'store_address', '', 'string'),
  ('general', 'currency', 'BDT', 'string'),
  ('general', 'currency_symbol', '৳', 'string'),
  ('general', 'timezone', 'Asia/Dhaka', 'string'),

  ('checkout', 'guest_checkout_enabled', 'true', 'boolean'),
  ('checkout', 'min_order_amount', '0', 'number'),
  ('checkout', 'cod_enabled', 'true', 'boolean'),
  ('checkout', 'cod_max_amount', '20000', 'number'),

  ('shipping', 'default_shipping_charge', '80', 'number'),
  ('shipping', 'free_shipping_threshold', '2000', 'number'),

  ('inventory', 'track_inventory', 'true', 'boolean'),
  ('inventory', 'allow_backorder', 'false', 'boolean'),
  ('inventory', 'low_stock_threshold', '5', 'number'),

  ('seo', 'meta_title', 'ecomXbangladesh — Premium E-Commerce', 'string'),
  ('seo', 'meta_description', 'Shop authentic products with fast delivery across Bangladesh', 'string'),

  ('media', 'max_upload_size_mb', '10', 'number'),
  ('media', 'allowed_image_formats', '["jpg","jpeg","png","webp","gif"]', 'json'),
  ('media', 'allowed_video_formats', '["mp4","webm"]', 'json'),

  ('notifications', 'order_placed_sms', 'true', 'boolean'),
  ('notifications', 'order_shipped_sms', 'true', 'boolean'),
  ('notifications', 'order_delivered_sms', 'true', 'boolean');

-- Default Shipping Methods
INSERT INTO shipping_methods (name, description, charge, min_order_free_shipping, zones, status, sort_order) VALUES
  ('Standard Delivery', 'Delivery within 3-5 business days', 80, 2000, ARRAY['all'], 'active', 1),
  ('Express Delivery', 'Delivery within 1-2 business days', 150, NULL, ARRAY['Dhaka', 'Chattogram'], 'active', 2);

-- Header Menu
INSERT INTO menus (name, location, items) VALUES
  ('header_menu', 'header', '[
    {"label": "Home", "url": "/", "children": []},
    {"label": "Shop", "url": "/shop", "children": []},
    {"label": "Categories", "url": "/categories", "children": []},
    {"label": "Brands", "url": "/brands", "children": []},
    {"label": "Contact", "url": "/page/contact", "children": []}
  ]'),
  ('footer_menu', 'footer', '[
    {"label": "About Us", "url": "/page/about", "children": []},
    {"label": "Privacy Policy", "url": "/page/privacy-policy", "children": []},
    {"label": "Terms & Conditions", "url": "/page/terms", "children": []},
    {"label": "Return Policy", "url": "/page/return-policy", "children": []},
    {"label": "FAQ", "url": "/page/faq", "children": []}
  ]');
