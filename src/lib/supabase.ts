import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Use the publishable key for client-side. Secret key is server-only.
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);
