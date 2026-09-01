# ecomXbangladesh — Production Deployment & Runbook

## Overview
This runbook provides complete operational guidance for hosting, deploying, and maintaining the **ecomXbangladesh** platform.

---

## 1. System Requirements & Architecture

- **Runtime**: Node.js 20.x or 22.x LTS
- **Framework**: Next.js 16 (App Router + Turbopack)
- **Database**: Supabase PostgreSQL (Connected to project `pdeooqamevjpkcnaokac`)
- **Media CDN**: Cloudinary (Cloud: `dyvma4kfc`)
- **Logistics**: SteadFast Courier & Pathao Merchant APIs
- **SMS Gateway**: BulkSMSBD Masked Transactional Gateway

---

## 2. Environment Variables Configuration

Ensure the following variables are present in your production environment (e.g. Vercel, VPS `.env` or Docker secrets):

```env
# Application Host
NEXT_PUBLIC_APP_URL="https://ecomxbangladesh.com"

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL="https://pdeooqamevjpkcnaokac.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Cloudinary Storage & Uploads
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dyvma4kfc"
CLOUDINARY_API_KEY="682948826151423"
CLOUDINARY_API_SECRET="0YNV6h006D2mCo2HIWpGpqBjiLM"

# Courier Logistics
STEADFAST_API_KEY="sf_live_api_key_bangladesh_2026"
STEADFAST_SECRET_KEY="sf_secret_prod_secure_hash"
PATHAO_CLIENT_ID="pathao_client_id_live_2026"
PATHAO_CLIENT_SECRET="pathao_secret_key_prod"

# SMS Gateway
BULKSMSBD_API_KEY="bsms_live_key_dhaka_2026"
BULKSMSBD_SENDER_ID="ecomXbd"

# Meta Pixel & Conversions API (CAPI)
NEXT_PUBLIC_META_PIXEL_ID="123456789012345"
META_CAPI_ACCESS_TOKEN="EAAB..."
```

---

## 3. Database Migrations

Apply migrations in sequence using the Supabase CLI or SQL editor:
1. `supabase/migrations/001_foundation.sql` (40 Core PostgreSQL tables, indexes & RLS policies)
2. `supabase/migrations/002_fix_rls.sql` (Public catalog read policies)
3. `supabase/migrations/003_social_and_customer.sql` (Product reviews, Q&A, and saved address book)
4. `supabase/migrations/004_logistics_and_marketing.sql` (Courier shipments, SMS templates & finance)
5. `supabase/migrations/005_fraud_and_risk.sql` (Fraud profiles, risk scoring & abandoned carts)

---

## 4. Build & Production Commands

```bash
# Install dependencies
npm install

# Build optimized production bundle
npm run build

# Start production server on port 3000
npm start
```

---

## 5. Live Health Monitoring Endpoint

- **URL**: `https://ecomxbangladesh.com/api/health`
- **Output**: JSON health report checking App, Database connectivity, and Storage configuration.

---

## 6. Seed Credentials

- **Master Admin Email**: `admin@ecomxbangladesh.com`
- **Admin Portal**: `/admin`
