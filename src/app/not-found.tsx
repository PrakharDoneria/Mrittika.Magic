import Link from "next/link";
import { ArrowLeft, Flower2 } from "lucide-react";
import { SiteChrome } from "@/components/Storefront";

export default function NotFound() {
  return (
    <SiteChrome>
      <main className="not-found-page">
        <div className="not-found-art">
          <span className="not-found-star star-one">✦</span>
          <span className="not-found-star star-two">✧</span>
          <span className="not-found-number">404</span>
          <span className="not-found-sticker">oopsie daisy!</span>
        </div>
        <div className="not-found-copy">
          <Flower2 size={22} />
          <p className="eyebrow">a tiny wrong turn</p>
          <h1>This page took<br /><i>a little detour.</i></h1>
          <p>Nothing is broken in your corner of the internet. The page you are looking for has simply wandered off for a snack.</p>
          <Link href="/" className="solid-button"><ArrowLeft size={15} /> Take me home</Link>
        </div>
      </main>
    </SiteChrome>
  );
}
