import { supabase } from './lib/supabase';

/**
 * Diagnostic utility to test Supabase connection
 * Use this in browser console or as a test component
 */
export async function testSupabaseConnection() {
  console.group('🔍 Supabase Connection Diagnostics');
  
  // 1. Check environment variables
  console.log('1️⃣ Environment Variables:');
  console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Present' : '❌ Missing');
  
  // 2. Test basic connectivity
  console.log('\n2️⃣ Testing Supabase Connection...');
  try {
    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('is_published', true)
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase Query Error:', error);
      return { success: false, error };
    }
    
    console.log('✅ Connection successful!');
    console.log('Total published products:', count);
    console.log('Sample product:', data?.[0]);
    
    return { success: true, data, count };
  } catch (err) {
    console.error('❌ Network Error:', err);
    console.error('This might be a CORS, network, or configuration issue');
    
    // Additional diagnostics
    console.log('\n3️⃣ Troubleshooting Steps:');
    console.log('- Check if Supabase project is paused (free tier auto-pauses after inactivity)');
    console.log('- Verify API URL is correct');
    console.log('- Check browser network tab for CORS errors');
    console.log('- Ensure RLS policies allow public read access');
    
    return { success: false, error: err };
  } finally {
    console.groupEnd();
  }
}

/**
 * Test if environment variables are loaded
 */
export function checkEnvVars() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.group('🔑 Environment Variables Check');
  console.log('VITE_SUPABASE_URL:', url || '❌ MISSING');
  console.log('VITE_SUPABASE_ANON_KEY:', key ? '✅ Present (length: ' + key.length + ')' : '❌ MISSING');
  
  if (!url || !key) {
    console.error('❌ Environment variables are missing!');
    console.log('\n📝 Solution:');
    console.log('1. Check that .env file exists in project root');
    console.log('2. Ensure variables start with VITE_ prefix');
    console.log('3. Restart the dev server: npm run dev');
  } else {
    console.log('✅ Environment variables loaded correctly');
  }
  console.groupEnd();
  
  return { url, key: key ? '***' : null };
}

// Auto-run diagnostics in development
if (import.meta.env.DEV) {
  console.log('🚀 Running Supabase diagnostics...');
  checkEnvVars();
  testSupabaseConnection();
}
