import type { Product } from "./types";

export function productPath(product: Pick<Product, "id" | "title">) {
  const title = product.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `/shop/${title}-${product.id.slice(0, 8)}`;
}
