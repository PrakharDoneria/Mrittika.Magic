import Link from "next/link";
import { SiteChrome } from "@/components/Storefront";
import WishlistView from "@/components/WishlistView";

export default function WishlistPage() {
  return (
    <SiteChrome showLadybug={true}>
      <WishlistView />
    </SiteChrome>
  );
}
