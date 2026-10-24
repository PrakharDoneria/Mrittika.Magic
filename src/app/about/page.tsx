import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { SiteChrome } from "@/components/Storefront";

export default function AboutPage() {
  return (
    <SiteChrome>
      {/* ── STORY SPLIT ───────────────────────────────────── */}
      <section className="story-page">
        <div className="story-image" style={{ backgroundImage: "url('/media/desk.jpeg')" }} />
        <div className="story-copy">
          <p className="eyebrow" style={{ color: "var(--cream)" }}>for those who believe in magic</p>
          <h1>A little weird,<br /><i>a little wonderful.</i></h1>
          <p>Mrittika is a playful little universe of handmade jewellery, where clay, beads, bold colours, and curious shapes come together to create wearable art.</p>
          <p>Born out of a love for art, experimentation, and everything a little out of the ordinary, every piece celebrates happy imperfections and the beauty of being unapologetically yourself.</p>
          <Link href="/shop" className="outline-button">
            Find something lovely <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── STUDIO NOTE SECTION ───────────────────────────── */}
      <section style={{ maxWidth: 960, margin: "90px auto 30px", padding: "0 24px", textAlign: "center" }}>
        <p className="eyebrow" style={{ justifyContent: "center" }}>our story</p>
        <h2 style={{ fontFamily: "var(--font-display), serif", fontSize: "clamp(34px,5vw,58px)", lineHeight: 1.05, margin: "14px 0 24px" }}>
          For those who believe in magic and are made of it <Sparkles size={34} strokeWidth={1.5} />
        </h2>
        <p style={{ lineHeight: 1.9, opacity: .78, maxWidth: 760, margin: "0 auto 16px" }}>
          From wonky flowers and whimsical creatures to unexpected shapes and playful colour clashes, every piece is lovingly handcrafted using clay, beads, and a whole lot of curiosity. No two creations are quite alike, and that&apos;s exactly how we like it.
        </p>
        <p style={{ lineHeight: 1.9, opacity: .78, maxWidth: 760, margin: "0 auto" }}>
          We believe jewellery doesn&apos;t always have to be delicate, symmetrical, or make perfect sense. Sometimes it can be a little strange, a little loud, a little nostalgic, or simply something that makes you smile.
        </p>
      </section>

      {/* ── VISUAL STUDIO SNAPSHOTS ──────────────────────── */}
      <section style={{ maxWidth: 1160, margin: "50px auto 90px", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          <div style={{
            position: "relative",
            aspectRatio: "1.2",
            border: "2px solid var(--ink)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            boxShadow: "var(--shadow-pop)",
          }}>
            <img src="/media/necklace.jpeg" alt="Handcrafted necklace closeup" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <span style={{
              position: "absolute", bottom: 14, left: 14,
              padding: "6px 14px", background: "var(--cream)", border: "1.5px solid var(--ink)",
              borderRadius: "var(--radius-pill)", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em",
            }}>Curious forms ✦</span>
          </div>

          <div style={{
            position: "relative",
            aspectRatio: "1.2",
            border: "2px solid var(--ink)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            boxShadow: "var(--shadow-pop)",
          }}>
            <img src="/media/buttons.jpeg" alt="Small details and clay components" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <span style={{
              position: "absolute", bottom: 14, left: 14,
              padding: "6px 14px", background: "var(--cream)", border: "1.5px solid var(--ink)",
              borderRadius: "var(--radius-pill)", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em",
            }}>Hand-molded ✿</span>
          </div>

          <div style={{
            position: "relative",
            aspectRatio: "1.2",
            border: "2px solid var(--ink)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            boxShadow: "var(--shadow-pop)",
          }}>
            <img src="/background/flower.jpeg" alt="Colors and flowers" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <span style={{
              position: "absolute", bottom: 14, left: 14,
              padding: "6px 14px", background: "var(--cream)", border: "1.5px solid var(--ink)",
              borderRadius: "var(--radius-pill)", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em",
            }}>Joyful Palette ❀</span>
          </div>
        </div>
      </section>

      {/* ── VALUES STRIP ──────────────────────────────────── */}
      <div className="values-strip">
        <div className="value-card reveal">
          <div className="value-card-num">01</div>
          <h3>Made with intention</h3>
          <p>Every product in our shop is selected slowly and deliberately. Nothing mass-produced, nothing thoughtless.</p>
        </div>
        <div className="value-card reveal" style={{ animationDelay: ".12s", background: "var(--lavender)" }}>
          <div className="value-card-num">02</div>
          <h3>Packed by hand</h3>
          <p>Each order is wrapped with care, tissue paper, and a personal note because you deserve a little ceremony.</p>
        </div>
        <div className="value-card reveal" style={{ animationDelay: ".24s", background: "var(--yellow)" }}>
          <div className="value-card-num">03</div>
          <h3>For everyday magic</h3>
          <p>We believe the right object can transform the mundane into a ritual. That&apos;s our whole ethos.</p>
        </div>
      </div>

      {/* ── MARQUEE ───────────────────────────────────────── */}
      <div className="checker marquee">
        <span>✦ handpicked with love &nbsp;&nbsp;&nbsp; ✦ packed by hand &nbsp;&nbsp;&nbsp; ✦ tiny rituals, big joy &nbsp;&nbsp;&nbsp; ✦ handpicked with love &nbsp;&nbsp;&nbsp; ✦ packed by hand &nbsp;&nbsp;&nbsp; ✦ tiny rituals, big joy &nbsp;&nbsp;&nbsp;</span>
      </div>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section style={{ maxWidth: 680, margin: "100px auto 130px", padding: "0 24px", textAlign: "center" }}>
        <p className="eyebrow" style={{ justifyContent: "center" }}>come on in</p>
        <h2 style={{ fontFamily: "var(--font-display), serif", fontSize: "clamp(38px,5vw,58px)", letterSpacing: "-.05em", lineHeight: ".95", margin: "16px 0 20px" }}>
          Find your next <i style={{ color: "var(--coral)", fontWeight: 400 }}>tiny joy.</i>
        </h2>
        <p style={{ opacity: .7, lineHeight: 1.8, marginBottom: 0 }}>
          Whether you&apos;re treating yourself or gifting a friend, there&apos;s something in the shop for every happy occasion.
        </p>
        <Link href="/shop" className="solid-button" style={{ margin: "24px auto 0" }}>
          Shop the collection <ArrowRight size={15} />
        </Link>
      </section>
    </SiteChrome>
  );
}
