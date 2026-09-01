# ecomXbangladesh

A full-featured, scalable E-Commerce web application built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL, Auth, Storage, RLS)**, tailored for the Bangladesh market.

---

## 🚀 Features

- **Storefront**: High-performance customer-facing catalog, search, filter, product detail pages, and dynamic responsive layouts.
- **Cart & Checkout**: Multi-step checkout with Cash on Delivery (COD) and Bangladesh payment gateways (SSLCommerz, bKash).
- **Courier & Logistics Integration**: Pre-integrated hooks for local courier services (Steadfast, Pathao).
- **User Authentication**: Supabase Auth for customer accounts and role-based admin access with Row-Level Security (RLS).
- **Admin Dashboard**: Product management, inventory tracking, order status workflows, categories, banners, and analytics.
- **Media Storage**: Cloudinary & Supabase Storage for optimized image hosting.
- **SEO & Social Sharing**: Dynamic metadata, OpenGraph cards, JSON-LD structured data, dynamic `sitemap.xml`, and `robots.txt`.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
- **Language**: TypeScript
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL with RLS)
- **Styling**: Tailwind CSS & Lucide Icons
- **Image Management**: Cloudinary
- **State Management**: React Context & Hooks

---

## ⚙️ Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/riff1431/ecomxbd.git
cd ecomxbd
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and add your credentials:

```bash
cp .env.example .env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Cloudinary credentials & other service keys

### 3. Setup Database

Run migrations found in `supabase/migrations/` in your Supabase SQL Editor.

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License

Private / Proprietary. All rights reserved.
