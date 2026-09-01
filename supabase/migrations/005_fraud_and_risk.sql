-- Phase 9: Fraud Prevention, Risk Scoring & Blacklist Tables

CREATE TABLE IF NOT EXISTS fraud_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier_type TEXT NOT NULL CHECK (identifier_type IN ('phone', 'email', 'ip', 'address')),
  identifier_value TEXT NOT NULL,
  risk_score INTEGER NOT NULL DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  cancellation_count INTEGER NOT NULL DEFAULT 0,
  rejected_delivery_count INTEGER NOT NULL DEFAULT 0,
  return_abuse_count INTEGER NOT NULL DEFAULT 0,
  is_blacklisted BOOLEAN NOT NULL DEFAULT FALSE,
  blacklist_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_fraud_profiles_val ON fraud_profiles(identifier_type, identifier_value);
CREATE INDEX IF NOT EXISTS idx_fraud_profiles_blacklisted ON fraud_profiles(is_blacklisted) WHERE is_blacklisted = TRUE;

CREATE TABLE IF NOT EXISTS fraud_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  user_id UUID REFERENCES profiles(id),
  event_type TEXT NOT NULL,
  risk_signals JSONB NOT NULL DEFAULT '{}',
  score INTEGER NOT NULL DEFAULT 0,
  action_taken TEXT NOT NULL DEFAULT 'flagged',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fraud_events_order ON fraud_events(order_id);
CREATE INDEX IF NOT EXISTS idx_fraud_events_created ON fraud_events(created_at DESC);

-- Incomplete / Abandoned Checkouts Table
CREATE TABLE IF NOT EXISTS abandoned_checkouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  district TEXT,
  address TEXT,
  cart_items JSONB NOT NULL DEFAULT '[]',
  cart_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  recovery_status TEXT NOT NULL DEFAULT 'abandoned' CHECK (recovery_status IN ('abandoned', 'sms_sent', 'recovered')),
  recovered_order_id UUID REFERENCES orders(id),
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_abandoned_checkouts_phone ON abandoned_checkouts(customer_phone);
CREATE INDEX IF NOT EXISTS idx_abandoned_checkouts_status ON abandoned_checkouts(recovery_status);
