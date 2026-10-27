"use client";

export function trackEvent(eventType: string, data: {
  path?: string;
  search_query?: string;
  product_id?: string;
  product_title?: string;
  metadata?: Record<string, unknown>;
} = {}) {
  try {
    const payload = {
      event_type: eventType,
      path: data.path || (typeof window !== "undefined" ? window.location.pathname : undefined),
      search_query: data.search_query,
      product_id: data.product_id,
      product_title: data.product_title,
      metadata: data.metadata,
    };

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/track", blob);
    } else {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Ignore tracking errors
  }
}
