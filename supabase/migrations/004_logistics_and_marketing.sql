-- ============================================================
-- 004_logistics_and_marketing.sql
-- Logistics, Couriers, SMS, Settings, and Suppliers
-- ============================================================

-- 1. Couriers & Shipments
CREATE TABLE IF NOT EXISTS couriers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  api_base_url TEXT,
  api_key TEXT,
  api_secret TEXT,
  webhook_secret TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS courier_shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  courier_id UUID REFERENCES couriers(id) ON DELETE SET NULL,
  courier_name TEXT NOT NULL,
  consignment_id TEXT,
  tracking_id TEXT,
  booking_status TEXT NOT NULL DEFAULT 'pending' CHECK (booking_status IN ('pending', 'booked', 'failed', 'cancelled')),
  delivery_status TEXT NOT NULL DEFAULT 'in_review',
  cod_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  provider_response JSONB DEFAULT '{}',
  booked_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shipments_order ON courier_shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON courier_shipments(tracking_id);

-- 2. SMS Notifications & Logs
CREATE TABLE IF NOT EXISTS sms_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  event_type TEXT NOT NULL UNIQUE,
  template TEXT NOT NULL,
  variables TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sms_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES sms_templates(id) ON DELETE SET NULL,
  recipient_phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('queued', 'sent', 'delivered', 'failed')),
  provider_response JSONB DEFAULT '{}',
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sms_logs_phone ON sms_logs(recipient_phone);

-- 3. Suppliers & Expenses
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Store Settings (Meta Pixel, Courier Defaults, General Config)
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed Default Couriers
INSERT INTO couriers (name, code, api_base_url, status, config) VALUES
  ('SteadFast Courier', 'steadfast', 'https://portal.steadfast.com.bd/api/v1', 'active', '{"auto_booking": false}'),
  ('Pathao Courier', 'pathao', 'https://api-hermes.pathao.com/aladdin/api/v1', 'active', '{"auto_booking": false}')
ON CONFLICT (code) DO NOTHING;

-- Seed Default SMS Templates
INSERT INTO sms_templates (name, event_type, template, variables, status) VALUES
  ('Order Confirmation', 'order_created', 'Dear {{customer_name}}, your order {{order_number}} of BDT {{total}} has been confirmed! We will dispatch soon. Track: {{tracking_url}}', ARRAY['customer_name', 'order_number', 'total', 'tracking_url'], 'active'),
  ('Order Shipped', 'order_shipped', 'Dear {{customer_name}}, your order {{order_number}} is on the way via {{courier_name}}. Tracking ID: {{tracking_id}}. Track: {{tracking_url}}', ARRAY['customer_name', 'order_number', 'courier_name', 'tracking_id', 'tracking_url'], 'active')
ON CONFLICT (event_type) DO NOTHING;

-- Seed Sample Suppliers
INSERT INTO suppliers (name, company, phone, email, address, status, notes) VALUES
  ('Kim Min-jun', 'Seoul Cosmetics Wholesale Ltd', '+82-2-1234-5678', 'supply@seoulcosmetics.kr', 'Gangnam-gu, Seoul, South Korea', 'active', 'Official importer for COSRX and Beauty of Joseon'),
  ('David Miller', 'Cerave Distribution UK', '+44-20-7946-0912', 'orders@ceravedist.co.uk', 'London, United Kingdom', 'active', 'Authentic European Cerave cleanser batches')
ON CONFLICT DO NOTHING;

-- Seed Default Settings
INSERT INTO store_settings (key, value) VALUES
  ('meta_pixel', '{"pixel_id": "123456789012345", "enabled": true, "test_event_code": ""}')
ON CONFLICT (key) DO NOTHING;
