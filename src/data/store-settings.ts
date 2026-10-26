export interface StoreSettings {
  brandName: string;
  tagline: string;
  announcement: string;
  snailMail: {
    heroTitle: string;
    heroSubtitle: string;
    monthlyPrice: number;
    monthlyPriceLabel: string;
    monthlyPerks: string[];
    yearlyPrice: number;
    yearlyPriceLabel: string;
    yearlyPerks: string[];
  };
  policies: {
    privacyPolicyLastUpdated: string;
    privacyPolicySummary: string;
    privacySections: { title: string; content: string }[];
    returnPolicySummary: string;
    returnDaysLimit: number;
    returnEmail: string;
  };
}

export const STORE_SETTINGS: StoreSettings = {
  brandName: "Mrittika Magic",
  tagline: "tiny joys, thoughtfully made",
  announcement: "✦ handpicked with love ✦ good things for good days ✦ tiny joys, thoughtfully made ✦",
  snailMail: {
    heroTitle: "The Mail Club.",
    heroSubtitle: "Remember the joy of opening your real mailbox and finding something magical just for you?",
    monthlyPrice: 499,
    monthlyPriceLabel: "₹499 / month",
    monthlyPerks: [
      "1 Monthly handwritten letter penned with wax seal",
      "Surprise miniature clay trinket, stamp or sticker sheet",
      "Flexible schedule — pause or cancel anytime",
    ],
    yearlyPrice: 4999,
    yearlyPriceLabel: "₹4,999 / year",
    yearlyPerks: [
      "12 Curated seasonal envelopes delivered to your doorstep",
      "Exclusive collector ceramic/clay brooch keepsake",
      "Complimentary priority domestic postal dispatch",
    ],
  },
  policies: {
    privacyPolicyLastUpdated: "October 2026",
    privacyPolicySummary:
      "At Mrittika Magic, your privacy and trust are sacred to us. We only collect the minimal personal information required to safely craft, pack, and ship your handmade orders and snail mail club dispatches.",
    privacySections: [
      {
        title: "1. Information We Collect",
        content:
          "When you place an order, subscribe to the Snail Mail Club, or save pieces to your wishlist, we collect your name, email address, phone number, and postal delivery address. We do not store or process complete credit card details on our servers; payments are processed securely through certified gateway partners.",
      },
      {
        title: "2. How We Use Your Information",
        content:
          "Your data is used solely to fulfill your handmade orders, coordinate delivery logistics, send tracking updates, and dispatch your monthly or annual snail mail packets. With your consent, we may send occasional dispatches about new collection drops.",
      },
      {
        title: "3. Data Protection & Sharing",
        content:
          "We never sell, rent, or trade your personal details to any third-party advertisers. Information is only shared with trusted courier partners and cloud database providers (such as Supabase) strictly to complete delivery.",
      },
      {
        title: "4. Your Rights & Contact",
        content:
          "You can request to view, update, or permanently delete your customer profile and delivery address at any time by contacting our studio team at hello@mrittikamagic.com.",
      },
    ],
    returnPolicySummary:
      "Because Mrittika pieces are handmade and often produced in small batches, please contact us within 7 days of delivery if your item arrives damaged or with a defect.",
    returnDaysLimit: 7,
    returnEmail: "hello@mrittikamagic.com",
  },
};
