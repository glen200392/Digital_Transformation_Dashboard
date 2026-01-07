/**
 * Supabase Client Configuration
 * Initializes and exports the Supabase client for database operations
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validation
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
  throw new Error('Supabase configuration is incomplete');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'digital-transformation-dashboard-v3',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Type helper for database tables
export type Database = {
  public: {
    Tables: {
      projects: any;
      phases: any;
      tasks: any;
      subtasks: any;
      users: any;
      risks: any;
      alerts: any;
      ai_providers: any;
      ai_usage_logs: any;
      audit_logs: any;
      comments: any;
      attachments: any;
      notifications: any;
    };
  };
};

// Health check function
export const checkConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('projects').select('count', { count: 'exact', head: true });
    return !error;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
};

export default supabase;
