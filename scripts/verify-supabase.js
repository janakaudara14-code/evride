const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verify() {
  console.log('🔍 Testing Supabase Connection to:', supabaseUrl);

  const { data: categories, error: catError } = await supabase.from('categories').select('*');
  if (catError) {
    console.error('❌ Categories query failed:', catError.message);
    console.log('💡 Tip: Please run the SQL schema from supabase_schema.sql in your Supabase SQL Editor.');
    return;
  }
  console.log(`✅ Categories table connected! Found ${categories.length} categories.`);

  const { data: products, error: prodError } = await supabase.from('products').select('*');
  if (prodError) {
    console.error('❌ Products query failed:', prodError.message);
    return;
  }
  console.log(`✅ Products table connected! Found ${products.length} products (including Pre-Orders).`);
  console.log('🎉 Supabase database is 100% active and connected to your app!');
}

verify();
