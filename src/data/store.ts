import { createClient } from "@/lib/supabase/server";
import type { Category, Product } from "./types";

export async function getProducts() {
  const supabase = await createClient();
  if (!supabase) return { data: [] as Product[], error: "Supabase is not configured." };
  const result = await supabase.from("products").select("id,title,description,price,category,category_id,images,stock,created_at").eq("is_published", true).order("created_at", { ascending: false });
  return { data: (result.data ?? []) as Product[], error: result.error?.message ?? null };
}

export async function getProduct(id: string) {
  const supabase = await createClient();
  if (!supabase) return { data: null as Product | null, error: "Supabase is not configured." };
  const result = await supabase.from("products").select("id,title,description,price,category,category_id,images,stock,created_at").eq("id", id).eq("is_published", true).maybeSingle();
  return { data: result.data as Product | null, error: result.error?.message ?? null };
}

export async function getCategories() {
  const supabase = await createClient();
  if (!supabase) return { data: [] as Category[], error: "Supabase is not configured." };
  const result = await supabase.from("categories").select("id,name,slug,description,image_url,created_at").order("name");
  return { data: (result.data ?? []) as Category[], error: result.error?.message ?? null };
}
