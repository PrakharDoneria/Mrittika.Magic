import { SiteChrome } from "@/components/Storefront";
import ShopView from "@/components/ShopView";
import { getProducts } from "@/data/store";
export default async function ShopPage() { const { data } = await getProducts(); return <SiteChrome><ShopView products={data} /></SiteChrome>; }
