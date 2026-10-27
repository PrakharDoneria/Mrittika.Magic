import Link from "next/link";
import { BarChart3, Box, FolderKanban, Heart, Mail, MessageSquareHeart, Palette, Settings, ShoppingBag, Star, Users } from "lucide-react";
import { SiteChrome } from "@/components/Storefront";
import { requireAdmin } from "@/lib/supabase/admin";

export default async function AdminPage() {
  const supabase = await requireAdmin();
  const [{ count: orders }, { count: customers }, { count: lowStock }, { count: wishlists }, { count: feedbackCount }] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }).in("fulfillment_status", ["Order Placed", "Packed", "Shipped", "Out for Delivery"]),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).lte("stock", 3),
    supabase.from("wishlists").select("*", { count: "exact", head: true }),
    supabase.from("feedback").select("*", { count: "exact", head: true }),
  ]);
  const { data: paidOrders } = await supabase.from("orders").select("total_amount").eq("payment_status", "Paid");
  const revenue = (paidOrders ?? []).reduce((total, order) => total + Number(order.total_amount ?? 0), 0);

  const tools = [
    [BarChart3, "Analytics", "analytics"],
    [Box, "Products", "products"],
    [ShoppingBag, "Orders", "orders"],
    [FolderKanban, "Categories", "categories"],
    [Palette, "My Arts", "my-arts"],
    [Settings, "Settings & Policies", "settings"],
    [Heart, "Wishlists", "wishlists"],
    [Mail, "Mail Club", "mail-club"],
    [MessageSquareHeart, "Feedback", "feedback"],
    [Users, "Customers", "customers"],
    [Star, "Reviews", "reviews"],
  ];

  return (
    <SiteChrome>
      <section className="admin-page">
        <div className="admin-heading">
          <div>
            <p className="eyebrow">control center</p>
            <h1>Good morning, <i>maker.</i></h1>
          </div>
          <Link href="/shop" className="outline-button">View storefront →</Link>
        </div>
        <div className="admin-stats">
          <div><span>Total revenue</span><strong>₹{revenue.toLocaleString("en-IN")}</strong><small>{revenue ? "From paid orders" : "No paid orders yet"}</small></div>
          <div><span>Active orders</span><strong>{orders ?? 0}</strong><small>{orders ? "Need attention" : "No active orders yet"}</small></div>
          <div><span>Customers</span><strong>{customers ?? 0}</strong><small>{customers ? "Registered profiles" : "No customer records yet"}</small></div>
          <div><span>Wishlist saves</span><strong>{wishlists ?? 0}</strong><small>{wishlists ? "Saved customer items" : "No items saved yet"}</small></div>
          <div><span>Feedback</span><strong>{feedbackCount ?? 0}</strong><small>{feedbackCount ? "Community notes" : "No feedback yet"}</small></div>
          <div><span>Inventory alerts</span><strong>{lowStock ?? 0}</strong><small>{lowStock ? "Products need restocking" : "No low stock records yet"}</small></div>
        </div>
        <div className="admin-tools">
          {tools.map(([Icon, label, slug]) => {
            const ToolIcon = Icon as typeof BarChart3;
            return (
              <Link href={`/admin/${slug}`} key={label as string}>
                <ToolIcon size={24} />
                <span>{label as string}</span>
                <small>Open workspace →</small>
              </Link>
            );
          })}
        </div>
      </section>
    </SiteChrome>
  );
}

