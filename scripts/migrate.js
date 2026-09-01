const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local if present
try {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
} catch {
  // dotenv optional
}

const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF || process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF || '';
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';

async function executeSql(query, description) {
  console.log(`\n⏳ Applying: ${description}...`);
  const response = await fetch(`https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to execute SQL for "${description}": ${response.status} ${response.statusText}\n${errorText}`);
  }

  const result = await response.json();
  console.log(`✅ Success: ${description}`);
  return result;
}

async function runMigrations() {
  try {
    const migrations = [
      {
        file: '001_foundation.sql',
        name: '001: Foundation Schema (Tables, Indices, Triggers)',
      },
      {
        file: '002_rls_policies.sql',
        name: '002: Row-Level Security (RLS) Policies',
      },
      {
        file: '003_seed_data.sql',
        name: '003: Initial Seed Data (Roles, Permissions, Settings, Menus)',
      },
    ];

    for (const mig of migrations) {
      const filePath = path.join(__dirname, '..', 'supabase', 'migrations', mig.file);
      const sqlContent = fs.readFileSync(filePath, 'utf8');
      await executeSql(sqlContent, mig.name);
    }

    console.log('\n🎉 ALL 3 MIGRATIONS APPLIED SUCCESSFULLY TO SUPABASE!');
    
    // Verify tables created
    const tables = await executeSql(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;",
      'Verifying created public tables'
    );
    console.log(`\n📊 Total Tables in Database: ${tables.length}`);
    console.log(tables.map(t => t.table_name).join(', '));

  } catch (err) {
    console.error('\n❌ Migration failed:', err.message);
    process.exit(1);
  }
}

runMigrations();
