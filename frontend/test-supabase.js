import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ikjcwyjlscrjiohzqqgl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlramN3eWpsc2NyamlvaHpxcWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3Njk2ODUsImV4cCI6MjA4MzM0NTY4NX0.K3XN-tngZS2iCmg1yPNLXhPm8EcYcSsXudeKjRnkamY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  try {
    const { data, error } = await supabase.from('projects').select('count', { count: 'exact', head: true });

    if (error) {
      if (error.message.includes('relation "public.projects" does not exist')) {
        console.log('✅ Connection successful!');
        console.log('⚠️  Database tables not created yet.');
        console.log('\n📝 Next step: Execute the schema.sql in Supabase Dashboard\n');
      } else {
        console.log('❌ Connection error:', error.message);
      }
    } else {
      console.log('✅ Connection successful!');
      console.log('✅ Database tables exist!');
      console.log('📊 Projects count:', data || 0);
    }
  } catch (err) {
    console.log('❌ Error:', err.message);
  }
}

testConnection();
