import { getCategories, getProducts } from "@/data/store";
import HomePageClient from "@/components/HomePageClient";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const [{ data: products }, { data: categories }, reviewsRes, feedbackRes] = await Promise.all([
    getProducts({ limit: 12 }),
    getCategories(),
    supabase
      ? supabase.from("reviews").select("id,name,rating,body,created_at").gte("rating", 4).eq("is_published", true).limit(10)
      : Promise.resolve({ data: [] }),
    supabase
      ? supabase.from("feedback").select("id,name,rating,message,created_at").gte("rating", 4).limit(10)
      : Promise.resolve({ data: [] }),
  ]);

  // Combine positive reviews & community feedback notes
  const combinedReviews: { id: string; name: string; rating: number; text: string }[] = [];

  if (reviewsRes.data && reviewsRes.data.length > 0) {
    reviewsRes.data.forEach((r: any) => {
      combinedReviews.push({
        id: `rev-${r.id}`,
        name: r.name || "Happy Collector",
        rating: r.rating || 5,
        text: r.body,
      });
    });
  }

  if (feedbackRes.data && feedbackRes.data.length > 0) {
    feedbackRes.data.forEach((f: any) => {
      combinedReviews.push({
        id: `fb-${f.id}`,
        name: f.name || "A Mrittika Friend",
        rating: f.rating || 5,
        text: f.message,
      });
    });
  }

  const fallbackReviews = [
    {
      id: "fallback-1",
      name: "Ananya S.",
      rating: 5,
      text: "The little earrings arrived wrapped like a gift to myself. The textures and handmade clay feel are so charming!",
    },
    {
      id: "fallback-2",
      name: "Roshni M.",
      rating: 5,
      text: "Every time I wear the necklace, someone asks where I got it. It feels completely unique and made with love.",
    },
    {
      id: "fallback-3",
      name: "Diya K.",
      rating: 5,
      text: "Such sweet attention to detail. Mrittika pieces bring a burst of happy color to the plainest outfits.",
    },
  ];

  const displayReviews = combinedReviews.length > 0 ? combinedReviews : fallbackReviews;

  return (
    <HomePageClient
      categories={categories}
      products={products}
      displayReviews={displayReviews}
    />
  );
}
