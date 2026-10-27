"use client";

import { useMemo, useState } from "react";
import { BarChart3, TrendingUp, Search, Eye, ShoppingBag, ArrowUpRight, Clock, Smartphone, Globe } from "lucide-react";

interface AnalyticsDashboardProps {
  events: any[];
  orders: any[];
}

export default function AnalyticsDashboard({ events = [], orders = [] }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<"all" | "7d" | "30d">("all");

  const filteredEvents = useMemo(() => {
    if (timeRange === "all") return events;
    const now = Date.now();
    const days = timeRange === "7d" ? 7 : 30;
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    return events.filter((e) => new Date(e.created_at).getTime() >= cutoff);
  }, [events, timeRange]);

  // Aggregate metrics
  const metrics = useMemo(() => {
    let pageViews = 0;
    let searches = 0;
    let productViews = 0;
    let cartAdds = 0;

    const searchCounts: Record<string, number> = {};
    const productViewCounts: Record<string, { count: number; title: string }> = {};
    const pageCounts: Record<string, number> = {};

    filteredEvents.forEach((ev) => {
      if (ev.event_type === "page_view") {
        pageViews++;
        const p = ev.path || "/";
        pageCounts[p] = (pageCounts[p] || 0) + 1;
      } else if (ev.event_type === "product_search") {
        searches++;
        const q = String(ev.search_query || "").trim();
        if (q) searchCounts[q] = (searchCounts[q] || 0) + 1;
      } else if (ev.event_type === "product_view") {
        productViews++;
        const pid = ev.product_id || ev.product_title || "unknown";
        const title = ev.product_title || "Unnamed Product";
        if (!productViewCounts[pid]) productViewCounts[pid] = { count: 0, title };
        productViewCounts[pid].count++;
      } else if (ev.event_type === "cart_add") {
        cartAdds++;
      }
    });

    const topSearches = Object.entries(searchCounts)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topProducts = Object.values(productViewCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const paidOrders = orders.filter((o) => o.payment_status === "Paid");
    const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    const avgOrderValue = paidOrders.length ? Math.round(totalRevenue / paidOrders.length) : 0;

    return {
      pageViews,
      searches,
      productViews,
      cartAdds,
      topSearches,
      topProducts,
      topPages,
      totalRevenue,
      paidOrdersCount: paidOrders.length,
      avgOrderValue,
    };
  }, [filteredEvents, orders]);

  return (
    <div className="analytics-dashboard">
      {/* Time filter selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: 28, fontFamily: "var(--font-display), serif" }}>
            Performance & Insights
          </h2>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.75 }}>
            Real-time activity across visits, searches, and cart additions.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, background: "var(--cream)", padding: 4, borderRadius: 99, border: "1.5px solid var(--ink)" }}>
          <button
            type="button"
            onClick={() => setTimeRange("7d")}
            className={`admin-nav-chip ${timeRange === "7d" ? "active" : ""}`}
            style={{ padding: "6px 14px", borderRadius: 99, fontSize: 11, fontWeight: 800, border: "none", cursor: "pointer", background: timeRange === "7d" ? "var(--ink)" : "transparent", color: timeRange === "7d" ? "#fff" : "var(--ink)" }}
          >
            7 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeRange("30d")}
            className={`admin-nav-chip ${timeRange === "30d" ? "active" : ""}`}
            style={{ padding: "6px 14px", borderRadius: 99, fontSize: 11, fontWeight: 800, border: "none", cursor: "pointer", background: timeRange === "30d" ? "var(--ink)" : "transparent", color: timeRange === "30d" ? "#fff" : "var(--ink)" }}
          >
            30 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeRange("all")}
            className={`admin-nav-chip ${timeRange === "all" ? "active" : ""}`}
            style={{ padding: "6px 14px", borderRadius: 99, fontSize: 11, fontWeight: 800, border: "none", cursor: "pointer", background: timeRange === "all" ? "var(--ink)" : "transparent", color: timeRange === "all" ? "#fff" : "var(--ink)" }}
          >
            All Time
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="analytics-kpi-grid">
        <div className="analytics-kpi-card" style={{ background: "var(--yellow)" }}>
          <div className="kpi-icon-wrap"><Eye size={22} /></div>
          <span>Total Pageviews</span>
          <strong>{metrics.pageViews.toLocaleString()}</strong>
          <small>Storefront visits</small>
        </div>

        <div className="analytics-kpi-card" style={{ background: "var(--lavender)" }}>
          <div className="kpi-icon-wrap"><Search size={22} /></div>
          <span>Product Searches</span>
          <strong>{metrics.searches.toLocaleString()}</strong>
          <small>Searches conducted</small>
        </div>

        <div className="analytics-kpi-card" style={{ background: "#ffd8e2" }}>
          <div className="kpi-icon-wrap"><ShoppingBag size={22} /></div>
          <span>Cart Additions</span>
          <strong>{metrics.cartAdds.toLocaleString()}</strong>
          <small>Items added to bag</small>
        </div>

        <div className="analytics-kpi-card" style={{ background: "#cbf3f0" }}>
          <div className="kpi-icon-wrap"><TrendingUp size={22} /></div>
          <span>Paid Revenue</span>
          <strong>₹{metrics.totalRevenue.toLocaleString("en-IN")}</strong>
          <small>{metrics.paidOrdersCount} completed orders (avg ₹{metrics.avgOrderValue})</small>
        </div>
      </div>

      {/* Analytics Breakdowns Grid */}
      <div className="analytics-breakdowns-grid">
        {/* Top Product Searches */}
        <div className="admin-panel analytics-panel">
          <h3><Search size={18} color="var(--coral)" /> Top Product Searches</h3>
          <p className="panel-desc">What shoppers are typing into the search bar:</p>
          {metrics.topSearches.length > 0 ? (
            <div className="analytics-list">
              {metrics.topSearches.map((item, idx) => (
                <div key={item.query} className="analytics-list-row">
                  <div className="analytics-rank-badge">{idx + 1}</div>
                  <span className="analytics-keyword">“{item.query}”</span>
                  <span className="analytics-count-pill">{item.count} searches</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="analytics-empty-state">
              <Search size={28} />
              <span>No product searches recorded in this window yet.</span>
            </div>
          )}
        </div>

        {/* Most Viewed Products */}
        <div className="admin-panel analytics-panel">
          <h3><Eye size={18} color="var(--coral)" /> Most Viewed Products</h3>
          <p className="panel-desc">Items with highest customer clicks & interest:</p>
          {metrics.topProducts.length > 0 ? (
            <div className="analytics-list">
              {metrics.topProducts.map((item, idx) => (
                <div key={item.title} className="analytics-list-row">
                  <div className="analytics-rank-badge">{idx + 1}</div>
                  <span className="analytics-keyword">{item.title}</span>
                  <span className="analytics-count-pill">{item.count} views</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="analytics-empty-state">
              <ShoppingBag size={28} />
              <span>No product views recorded in this window yet.</span>
            </div>
          )}
        </div>

        {/* Most Visited Pages */}
        <div className="admin-panel analytics-panel" style={{ gridColumn: "1 / -1" }}>
          <h3><Globe size={18} color="var(--coral)" /> Most Visited Pages</h3>
          <p className="panel-desc">Storefront routes ranked by traffic:</p>
          {metrics.topPages.length > 0 ? (
            <div className="analytics-pages-table">
              {metrics.topPages.map((item, idx) => (
                <div key={item.path} className="analytics-page-row">
                  <span className="page-path-name"><strong>{idx + 1}.</strong> {item.path}</span>
                  <div className="page-bar-wrap">
                    <div
                      className="page-bar-fill"
                      style={{
                        width: `${Math.max(8, Math.min(100, (item.count / (metrics.pageViews || 1)) * 100))}%`
                      }}
                    />
                  </div>
                  <span className="page-views-badge">{item.count} views</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="analytics-empty-state">
              <Globe size={28} />
              <span>No page visits recorded in this window yet.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
