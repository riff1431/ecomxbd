const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pdeooqamevjpkcnaokac.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZW9vcWFtZXZqcGtjbmFva2FjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODE3NDQxMiwiZXhwIjoyMTAzNzUwNDEyfQ.QH1LdHfsvzujL5S6blcW4bAUqim5vy5FbJhJk2XDVfE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('group', 'marketing')
    .eq('key', 'homepage_layout_config')
    .single();

  console.log('Marketing homepage settings in DB:', data ? 'Found' : 'Default');
}

testSettings().catch(console.error);
