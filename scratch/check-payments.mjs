import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const dotenv = fs.readFileSync('.env', 'utf8');
const env = {};
dotenv.split('\n').forEach(line => {
  const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (m) env[m[1]] = (m[2] || '').trim().replace(/^["']|["']$/g, '');
});

const s = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  const { data: logs, error } = await s.from('integration_logs').select('*').limit(2);
  console.log('Sample integration_logs:', logs, 'error:', error);
}

main();
