import { Mail, Sparkles, Heart } from "lucide-react";
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
        <h1>The Mail <i>Club.</i></h1>
        <p className="mail-hero-tagline">
          <em>A little letter, a little art, and a little happiness travelling from my world to yours.</em>
        </p>
      </section>

      {/* Story / Invitation Letter Block */}
      <section className="mail-club-story-section reveal">
        <div className="mail-story-letter">
          <div className="mail-story-stamp" aria-hidden="true">✿ POSTAGE PAID ✿</div>
          <p className="mail-story-lead">
            In a world of instant messages and endless scrolling, here&apos;s a little invitation to slow down and rediscover the joy of receiving something in the mail.
          </p>
          <p>
            Every Snail Mail envelope carries a printed letter from me, filled with little thoughts and stories, along with an art print made with love.
          </p>
          <div className="mail-story-highlight">
            <p className="highlight-lead">
              <Sparkles size={16} /> But there&apos;s a little surprise tucked into this journey.
            </p>
            <p>
              One lucky envelope will also carry an original oil pastel painting, drawn by my own hands and sent to a randomly chosen recipient. A tiny, one-of-a-kind piece of my imagination, finding its way to a new home.
            </p>
          </div>
          <p>
            Whether it&apos;s a letter to read on a quiet afternoon or a piece of art to keep close, I hope this little envelope brings a moment of warmth, wonder, and joy to your day.
          </p>
          <p className="mail-story-closing">
            <strong>Made for the dreamers, the art lovers, and everyone who still finds magic in receiving something in the mail.</strong>
          </p>
        </div>
      </section>

      {/* 3 Concept Explainers Boxes */}
      <section className="mail-club-intro-strip reveal">
        <div className="mail-perk-card">
          <div className="mail-perk-icon">💌</div>
          <h3>Letters From My Studio</h3>
          <p>Little stories, thoughts, and moments from my world, thoughtfully written and printed for you.</p>
        </div>
        <div className="mail-perk-card">
          <div className="mail-perk-icon">🎨</div>
          <h3>Art Prints to Treasure</h3>
          <p>A little piece of my imagination on paper, made to be collected, displayed, or tucked between the pages of your favourite book.</p>
        </div>
        <div className="mail-perk-card">
          <div className="mail-perk-icon">🖍️</div>
          <h3>One Lucky Art Surprise</h3>
          <p>One randomly selected recipient will receive an original, hand-drawn oil pastel painting from me. A one-of-a-kind little surprise, made with love.</p>
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
