import { Mail, Heart, Sparkles, Send, Stamp } from "lucide-react";
import { SiteChrome } from "@/components/Storefront";
import MailClubForm from "@/components/MailClubForm";
import { STORE_SETTINGS } from "@/data/store-settings";

export const metadata = {
  title: "Mail Club — Snail Mail, Postcards & Studio Letters",
  description: "Join the Mrittika Snail Mail Club to receive real tangible envelopes filled with handwritten studio letters, art postcards, and tiny handmade surprises.",
};

export default function MailClubPage() {
  const { snailMail } = STORE_SETTINGS;

  return (
    <SiteChrome>
      {/* Page Hero */}
      <section className="page-hero mail-club-hero">
        <div className="hero-ladybug-cluster" aria-hidden="true">
          <span className="hero-cluster-bug bug-1" />
          <span className="hero-cluster-bug bug-2" />
        </div>
        <p className="eyebrow" style={{ justifyContent: "center" }}>
          <Mail size={14} /> real paper, stamps & tactile nostalgia
        </p>
        <h1>{snailMail.heroTitle}</h1>
        <p>{snailMail.heroSubtitle}</p>
      </section>

      {/* Concept Explainers */}
      <section className="mail-club-intro-strip reveal">
        <div className="mail-perk-card">
          <div className="mail-perk-icon">💌</div>
          <h3>Handwritten Letters</h3>
          <p>Personal dispatches penned with ink, wax-sealed, and stamped with studio affection.</p>
        </div>
        <div className="mail-perk-card">
          <div className="mail-perk-icon">🎨</div>
          <h3>Art Cards & Postcards</h3>
          <p>Collectible studio illustrations, test prints, and seasonal poems on textured cardstock.</p>
        </div>
        <div className="mail-perk-card">
          <div className="mail-perk-icon">🐞</div>
          <h3>Tiny Clay Tokens</h3>
          <p>Miniature ladybugs, floral charms, and tactile keepsakes tucked into every envelope.</p>
        </div>
      </section>

      {/* Subscription Form Section */}
      <section className="mail-club-container">
        <div className="mail-club-form-wrap">
          <div className="mail-form-header">
            <span className="stamp-badge">✿ AIR MAIL ✿</span>
            <h2>Subscribe to <i>Snail Mail</i></h2>
            <p>
              Fill out your postal delivery address below to begin receiving monthly ({snailMail.monthlyPriceLabel}) or yearly ({snailMail.yearlyPriceLabel}) packets of tactile happiness.
            </p>
          </div>
          <MailClubForm />
        </div>
      </section>
    </SiteChrome>
  );
}

