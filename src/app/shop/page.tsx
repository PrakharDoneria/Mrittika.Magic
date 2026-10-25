import { SiteChrome } from "@/components/Storefront";
import ShopView from "@/components/ShopView";
import { getCategories, getProducts } from "@/data/store";
export default async function ShopPage({ searchParams }: { searchParams: Promise<{ page?: string; category?: string }> }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const [{ data, count }, { data: categories }] = await Promise.all([getProducts({ page, category: params.category }), getCategories()]);
  return <SiteChrome categories={categories}><ShopView products={data} categories={categories} page={page} total={count} selectedCategory={params.category} /></SiteChrome>;
}
