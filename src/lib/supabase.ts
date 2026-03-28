import { createClient } from "@supabase/supabase-js";

// Use the publishable key for client-side. Secret key is server-only.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);
