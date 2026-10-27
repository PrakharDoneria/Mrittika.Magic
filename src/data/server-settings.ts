import { createClient } from "@/lib/supabase/server";
import { STORE_SETTINGS, type StoreSettings } from "./store-settings";

export async function getStoreSettings(): Promise<StoreSettings | null> {
  try {
    const supabase = await createClient();
    if (!supabase) return null;

    const { data } = await supabase.from("store_settings").select("value").eq("key", "main").maybeSingle();
    if (data && data.value) {
      return data.value as StoreSettings;
    }
  } catch (err) {
    console.error("Error fetching store settings:", err);
  }
  return null;
}
