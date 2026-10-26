import { createClient } from "@/lib/supabase/server";
import type { Category, Product } from "./types";

export async function getProducts({ page = 1, limit = 12, category } : { page?: number; limit?: number; category?: string } = {}) {
  const supabase = await createClient();
  if (!supabase) return { data: [] as Product[], count: 0, error: "Supabase is not configured." };
  const from = Math.max(0, (page - 1) * limit);
  let query = supabase.from("products").select("id,title,slug,description,price,category,category_id,images,stock,sku,material,dimensions,weight,care_instructions,is_featured,created_at", { count: "exact" }).eq("is_published", true);
  if (category && category !== "All") {
    // Look up category ID if category name matches
    const { data: matchedCat } = await supabase.from("categories").select("id,name").ilike("name", category).maybeSingle();
    if (matchedCat) {
      query = query.or(`category.ilike.%${category}%,category_id.eq.${matchedCat.id}`);
    } else {
      query = query.ilike("category", `%${category}%`);
    }
  }
  const result = await query.order("created_at", { ascending: false }).range(from, from + limit - 1);
  const products = (result.data ?? []) as Product[];
  if (!products.length) return { data: products, count: result.count ?? 0, error: result.error?.message ?? null };
  const reviews = await supabase.from("reviews").select("product_id,rating").in("product_id", products.map((product) => product.id)).eq("is_published", true);
  const ratings = new Map<string, { total: number; count: number }>();
  for (const review of reviews.data ?? []) {
    const current = ratings.get(review.product_id) ?? { total: 0, count: 0 };
    ratings.set(review.product_id, { total: current.total + review.rating, count: current.count + 1 });
  }
  return { data: products.map((product) => ({ ...product, rating: ratings.get(product.id)?.total ? ratings.get(product.id)!.total / ratings.get(product.id)!.count : 0, review_count: ratings.get(product.id)?.count ?? 0 })), count: result.count ?? 0, error: result.error?.message ?? null };
}

export async function getProduct(path: string) {
  const supabase = await createClient();
  if (!supabase) return { data: null as Product | null, error: "Supabase is not configured." };
  const decoded = decodeURIComponent(path);
  const columns = "id,title,slug,description,price,category,category_id,images,stock,sku,material,dimensions,weight,care_instructions,is_featured,created_at";
  const result = await supabase.from("products").select(columns).eq("slug", decoded).eq("is_published", true).maybeSingle();
  if (result.data) return { data: result.data as Product, error: null };
  const suffixMatch = decoded.match(/^(.*)-([0-9a-f]{8})$/i);
  const baseSlug = suffixMatch?.[1] ?? decoded;
  const fallback = await supabase.from("products").select(columns).eq("slug", baseSlug).eq("is_published", true).maybeSingle();
  return { data: fallback.data as Product | null, error: fallback.error?.message ?? null };
}

export async function getCategories() {
  const supabase = await createClient();
  if (!supabase) return { data: [] as Category[], error: "Supabase is not configured." };
  const result = await supabase.from("categories").select("id,name,slug,description,image_url,created_at").order("name");
  return { data: (result.data ?? []) as Category[], error: result.error?.message ?? null };
}

export async function getRelatedProducts(currentProduct: Product, limit: number = 4) {
  const supabase = await createClient();
  if (!supabase) return [];
  const columns = "id,title,slug,description,price,category,category_id,images,stock,sku,material,dimensions,weight,care_instructions,is_featured,created_at";

  // Recommendation algorithm:
  // 1. Same category first
  // 2. Similar price range (+/- 40%)
  // 3. Fallback to featured or newest products
  // 4. Exclude current product
  try {
    let related: Product[] = [];
    if (currentProduct.category) {
      const { data } = await supabase
        .from("products")
        .select(columns)
        .eq("is_published", true)
        .eq("category", currentProduct.category)
        .neq("id", currentProduct.id)
        .limit(limit);
      if (data && data.length > 0) {
        related = data as Product[];
      }
    }

    if (related.length < limit) {
      const needed = limit - related.length;
      const excludeIds = [currentProduct.id, ...related.map((p) => p.id)];
      const { data } = await supabase
        .from("products")
        .select(columns)
        .eq("is_published", true)
        .not("id", "in", `(${excludeIds.join(",")})`)
        .order("created_at", { ascending: false })
        .limit(needed);
      if (data) {
        related = [...related, ...(data as Product[])];
      }
    }

    return related;
  } catch (err) {
    console.error("Related products algorithm error:", err);
    return [];
  }
}

