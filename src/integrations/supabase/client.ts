import { createClient } from "@supabase/supabase-js";

//const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
//const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY!;

const SUPABASE_URL = "https://tpwafkhuetbrdlykyegy.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwd2Fma2h1ZXRicmRseWt5ZWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MDU4MzEsImV4cCI6MjA3NTM4MTgzMX0.I77tVOy-2PC0C33-yQ11QO_pwuQZHr9oJFLcjlDIesE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
