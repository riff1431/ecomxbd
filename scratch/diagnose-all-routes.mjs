import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Parse .env manually handling wrapped lines
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
let currentKey = null;
let currentValue = '';

for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  if (trimmed.includes('=')) {
    if (currentKey) env[currentKey] = currentValue.trim();
    const idx = trimmed.indexOf('=');
    currentKey = trimmed.substring(0, idx).trim();
    currentValue = trimmed.substring(idx + 1).trim();
  } else if (currentKey) {
    currentValue += trimmed;
  }
}
if (currentKey) env[currentKey] = currentValue.trim();

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(url, anonKey);
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@ecomxbangladesh.com',
  password: 'AdminPassword123!'
});

if (error) {
  console.error('Login error:', error);
  process.exit(1);
}

const token = data.session.access_token;
const refreshToken = data.session.refresh_token;
const projectRef = url.split('//')[1].split('.')[0];
const cookieName = 'sb-' + projectRef + '-auth-token';
const cookieVal = encodeURIComponent(JSON.stringify([token, refreshToken, null, null, null]));

const allAdminRoutes = [
  // 1. Dashboard
  '/admin',
  // 2. Orders
  '/admin/orders',
  '/admin/settings/invoice',
  '/admin/orders/incomplete',
  '/admin/orders/fraud',
  '/admin/orders/tracking',
  '/admin/returns',
  '/admin/orders/settings',
  // 3. Products
  '/admin/products',
  '/admin/products/create',
  '/admin/categories',
  '/admin/brands',
  '/admin/attributes',
  '/admin/inventory',
  '/admin/reviews',
  '/admin/qa',
  '/admin/products/settings',
  // 4. Blog & Editorial
  '/admin/blog',
  '/admin/blog/create',
  '/admin/blog/authors',
  '/admin/blog/categories',
  // 5. Customers
  '/admin/customers',
  '/admin/fraud',
  '/admin/customers/settings',
  // 6. Marketing
  '/admin/marketing/homepage',
  '/admin/coupons',
  '/admin/marketing/sms',
  '/admin/marketing/meta',
  '/admin/marketing/catalog',
  '/admin/marketing/search',
  '/admin/marketing/settings',
  // 7. Shipping & Courier
  '/admin/shipping',
  '/admin/shipping/steadfast',
  '/admin/shipping/pathao',
  '/admin/shipping/zones',
  // 8. Payments
  '/admin/payments',
  '/admin/payments/cod',
  '/admin/payments/bkash',
  '/admin/payments/nagad',
  '/admin/payments/sslcommerz',
  '/admin/payments/stripe',
  '/admin/payments/paypal',
  '/admin/payments/custom',
  '/admin/payments/logs',
  // 9. Communication
  '/admin/communication/sms',
  '/admin/communication/sms/templates',
  '/admin/communication/email',
  '/admin/communication/notifications',
  // 10. Media
  '/admin/media',
  '/admin/media/cloudinary',
  '/admin/media/settings',
  // 11. Finance
  '/admin/finance/sales',
  '/admin/finance/pnl',
  '/admin/finance/costs',
  '/admin/finance/accounting',
  '/admin/finance/suppliers',
  '/admin/finance/dues',
  '/admin/finance/investors',
  // 12. Content
  '/admin/pages',
  '/admin/settings/theme',
  // 13. Users & Access
  '/admin/users',
  '/admin/activity',
  // 14. System
  '/admin/settings/modules',
  '/admin/settings/features',
  '/admin/settings/store',
  '/admin/settings/checkout',
  '/admin/settings/seo',
  '/admin/settings/system-health',
  '/admin/settings/maintenance'
];

console.log('Testing', allAdminRoutes.length, 'admin routes...');

const results = [];
for (const r of allAdminRoutes) {
  try {
    const res = await fetch('http://localhost:3000' + r, {
      headers: {
        'Cookie': cookieName + '=' + cookieVal + '; ' + cookieName + '.0=' + encodeURIComponent(JSON.stringify([token, refreshToken]))
      }
    });
    const text = await res.text();
    const hasError = text.includes('Application error: a client-side exception has occurred') || text.includes('Internal Server Error') || (res.status !== 200 && res.status !== 307);
    results.push({
      route: r,
      status: res.status,
      ok: res.status === 200 && !hasError,
      hasError,
      length: text.length
    });
    console.log(`[${res.status}] ${r} (${text.length} bytes) - OK: ${!hasError}`);
  } catch (e) {
    results.push({ route: r, status: 'ERROR', ok: false, error: e.message });
    console.log(`[ERR] ${r} - ${e.message}`);
  }
}

const failed = results.filter(r => !r.ok);
console.log('\n--- DIAGNOSIS SUMMARY ---');
console.log('Total routes:', results.length);
console.log('Healthy routes (200 OK):', results.length - failed.length);
console.log('Failed / Errored routes:', failed.length);
if (failed.length > 0) {
  console.log('FAILURES:', JSON.stringify(failed, null, 2));
}
