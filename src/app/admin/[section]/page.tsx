import { requireAdmin } from "@/lib/supabase/admin";
import AdminWorkspace from "@/components/AdminWorkspace";

const config = {
  analytics: { table: "orders", title: "Analytics", copy: "Revenue and activity will appear here as paid orders arrive." },
  products: { table: "products", title: "Products", copy: "Published and draft products from your Supabase catalog." },
  orders: { table: "orders", title: "Orders", copy: "Customer orders and fulfillment status from your store." },
  categories: { table: "categories", title: "Categories", copy: "Organize products into collections." },
  customers: { table: "profiles", title: "Customers", copy: "Registered customer profiles from Supabase Auth." },
  wishlists: { table: "wishlists", title: "Wishlists", copy: "Customer saved items synced to database." },
  "mail-club": { table: "mail_club", title: "Mail Club", copy: "Snail mail club subscribers and delivery addresses." },
  feedback: { table: "feedback", title: "Feedback", copy: "Customer love notes, reviews, and website feedback." },
  reviews: { table: "reviews", title: "Reviews", copy: "Customer reviews for products and publish status." },
} as const;

export function generateStaticParams() {
  return Object.keys(config).map((section) => ({ section }));
}

export default async function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const current = config[section as keyof typeof config];
  if (!current) return null;
  const supabase = await requireAdmin();
  let rows: any[] = [];
  try {
    let query = supabase.from(current.table).select("*").limit(100);
    if (section === "reviews" || section === "orders" || section === "products" || section === "wishlists" || section === "mail-club" || section === "feedback") {
      query = query.order("created_at", { ascending: false });
    }
    const { data, error } = await query;
    if (!error && data) {
      rows = data;
    }
  } catch (err) {
    // Graceful fallback for remote databases where table has not yet been migrated
  }

  let categories: { id: string; name: string }[] = [];
  try {
    const { data } = await supabase.from("categories").select("id,name").order("name");
    if (data) categories = data;
  } catch {
    // Graceful fallback
  }

  return <AdminWorkspace section={section as keyof typeof config} rows={rows} categories={categories} />;
}
