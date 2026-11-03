import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase credentials are missing.");
}

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;