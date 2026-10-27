import { requireAdmin } from "@/lib/supabase/admin";
import AdminWorkspace from "@/components/AdminWorkspace";
import { getStoreSettings } from "@/data/server-settings";

const config = {
  analytics: { table: "analytics_events", title: "Analytics", copy: "Real-time traffic, searches, top clicked products and revenue." },
  products: { table: "products", title: "Products", copy: "Published and draft products from your Supabase catalog." },
  orders: { table: "orders", title: "Orders", copy: "Customer orders and fulfillment status from your store." },
  categories: { table: "categories", title: "Categories", copy: "Organize products into collections." },
  "my-arts": { table: "my_arts", title: "My Arts", copy: "Studio artwork and handmade sculptures displayed on /my-arts." },
  settings: { table: "store_settings", title: "Settings & Policies", copy: "Edit Privacy Policy, Return Guidelines and store rules." },
  customers: { table: "profiles", title: "Customers", copy: "Registered customer profiles from Supabase Auth." },
  wishlists: { table: "wishlists", title: "Wishlists", copy: "Customer saved items synced to database." },
  "mail-club": { table: "mail_club", title: "Mail Club", copy: "Active Snail Mail Club subscribers with verified delivery addresses and recurring plans." },
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
    let query = supabase.from(current.table).select("*").limit(200);
    if (section === "mail-club") {
      // Show only customers who have an active subscription
      query = query.or("subscription_status.eq.active,payment_status.eq.Paid,payment_status.eq.active,subscription_status.is.null");
    }
    if (section === "reviews" || section === "orders" || section === "products" || section === "wishlists" || section === "mail-club" || section === "feedback" || section === "analytics" || section === "my-arts") {
      query = query.order("created_at", { ascending: false });
    }
    const { data, error } = await query;
    if (!error && data) {
      if (section === "mail-club") {
        // Enforce active subscription filter client-side as well
        rows = data.filter((row: any) => {
          const subStatus = (row.subscription_status ?? "active").toLowerCase();
          const payStatus = (row.payment_status ?? "paid").toLowerCase();
          return subStatus !== "cancelled" && subStatus !== "expired" && payStatus !== "failed" && payStatus !== "cancelled";
        });
      } else {
        rows = data;
      }
    }
  } catch (err) {
    // Graceful fallback for remote databases
  }

  let categories: { id: string; name: string }[] = [];
  try {
    const { data } = await supabase.from("categories").select("id,name").order("name");
    if (data) categories = data;
  } catch {
    // Graceful fallback
  }

  let ordersForAnalytics: any[] = [];
  if (section === "analytics") {
    try {
      const { data } = await supabase.from("orders").select("total_amount,payment_status,created_at").limit(300);
      if (data) ordersForAnalytics = data;
    } catch {}
  }

  const storeSettings = await getStoreSettings();

  return (
    <AdminWorkspace
      section={section as keyof typeof config}
      rows={rows}
      categories={categories}
      ordersForAnalytics={ordersForAnalytics}
      storeSettings={storeSettings}
    />
  );
}
