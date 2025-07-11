import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabaseStorage() {
  try {
    // Coba akses bucket dan tampilkan daftar file sebagai tes
    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .list(process.env.SUPABASE_BUCKET_PATH);

    if (error) {
      console.error("Error accessing supabase storage :", error);
      return false;
    }

    console.log("Connected to supabase storage.");
    return true;
  } catch (err) {
    console.error("Supabase storage connection check failed :", err);
    return false;
  }
}

checkSupabaseStorage();
