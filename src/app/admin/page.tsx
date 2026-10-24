import Link from "next/link";
import { BarChart3, Box, FolderKanban, ShoppingBag, Users } from "lucide-react";
import { SiteChrome } from "@/components/Storefront";
import { requireAdmin } from "@/lib/supabase/admin";
export default async function AdminPage() {
  const supabase = await requireAdmin();
  const [{ count: orders }, { count: customers }, { count: lowStock }] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }).in("fulfillment_status", ["Order Placed", "Packed", "Shipped", "Out for Delivery"]),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).lte("stock", 3),
  ]);
  const { data: paidOrders } = await supabase.from("orders").select("total_amount").eq("payment_status", "Paid");
  const revenue = (paidOrders ?? []).reduce((total, order) => total + Number(order.total_amount ?? 0), 0);
  return <SiteChrome><section className="admin-page"><div className="admin-heading"><div><p className="eyebrow">control center</p><h1>Good morning, <i>maker.</i></h1></div><Link href="/shop" className="outline-button">View storefront →</Link></div><div className="admin-stats"><div><span>Total revenue</span><strong>₹{revenue.toLocaleString("en-IN")}</strong><small>{revenue ? "From paid orders" : "No paid orders yet"}</small></div><div><span>Active orders</span><strong>{orders ?? 0}</strong><small>{orders ? "Need attention" : "No active orders yet"}</small></div><div><span>Customers</span><strong>{customers ?? 0}</strong><small>{customers ? "Registered profiles" : "No customer records yet"}</small></div><div><span>Inventory alerts</span><strong>{lowStock ?? 0}</strong><small>{lowStock ? "Products need restocking" : "No low stock records yet"}</small></div></div><div className="admin-tools">{[[BarChart3, "Analytics", "analytics"], [Box, "Products", "products"], [ShoppingBag, "Orders", "orders"], [FolderKanban, "Categories", "categories"], [Users, "Customers", "customers"]].map(([Icon, label, slug]) => { const ToolIcon = Icon as typeof BarChart3; return <Link href={`/admin/${slug}`} key={label as string}><ToolIcon size={24} /><span>{label as string}</span><small>Open workspace →</small></Link>; })}</div></section></SiteChrome>;
}
