import { requireAdmin } from "@/lib/supabase/admin";
import AdminWorkspace from "@/components/AdminWorkspace";

const config = {
  analytics: { table: "orders", title: "Analytics", copy: "Revenue and activity will appear here as paid orders arrive." },
  products: { table: "products", title: "Products", copy: "Published and draft products from your Supabase catalog." },
  orders: { table: "orders", title: "Orders", copy: "Customer orders and fulfillment status from your store." },
  categories: { table: "categories", title: "Categories", copy: "Organize products into collections." },
  customers: { table: "profiles", title: "Customers", copy: "Registered customer profiles from Supabase Auth." },
} as const;

export function generateStaticParams() {
  return Object.keys(config).map((section) => ({ section }));
}

export default async function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const current = config[section as keyof typeof config];
  if (!current) return null;
  const supabase = await requireAdmin();
  const [{ data, error }, { data: categories }] = await Promise.all([
    supabase.from(current.table).select("*").limit(100),
    supabase.from("categories").select("id,name").order("name"),
  ]);
  return <AdminWorkspace section={section as keyof typeof config} rows={error ? [] : (data ?? [])} categories={categories ?? []} />;
}
