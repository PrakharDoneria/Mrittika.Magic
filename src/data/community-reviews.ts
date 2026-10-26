export interface CommunityReview {
  id: string;
  name: string;
  city: string;
  rating: number;
  quote: string;
  date: string;
  favoritePiece: string;
  isBest?: boolean;
}

export const COMMUNITY_REVIEWS: CommunityReview[] = [
  {
    id: "rev-1",
    name: "Aanya Verma",
    city: "Bengaluru",
    rating: 5,
    quote:
      "Opening my Mrittika parcel felt like receiving a hug from an old friend! The clay beads have this earthy, tactile feel that mass-produced jewellery can never capture. I get compliments whenever I wear it.",
    date: "October 2026",
    favoritePiece: "Floral Daisy Clay Drop Choker",
    isBest: true,
  },
  {
    id: "rev-2",
    name: "Sneha Nair",
    city: "Kochi",
    rating: 5,
    quote:
      "The handwritten wax-sealed postcard that came with the package brought tears to my eyes. You can feel the intention and love behind every single twist of wire and sculpted bead.",
    date: "October 2026",
    favoritePiece: "Pastel Dream Clay Studs",
  },
  {
    id: "rev-3",
    name: "Roshni Roy",
    city: "Kolkata",
    rating: 5,
    quote:
      "The colors are so vibrant and cheery! The Snail Mail Club concept is pure nostalgia. I love waiting for my mailbox to have something real inside instead of just utility bills.",
    date: "September 2026",
    favoritePiece: "Snail Mail Subscription & Tiny Ladybug Brooch",
  },
  {
    id: "rev-4",
    name: "Pooja Deshmukh",
    city: "Pune",
    rating: 5,
    quote:
      "Lightweight, durable, and so unique. Every piece from Mrittika feels like wearable storytelling. Truly one-of-a-kind art.",
    date: "September 2026",
    favoritePiece: "Sunburst Terracotta Earrings",
  },
  {
    id: "rev-5",
    name: "Meera Kulkarni",
    city: "Mumbai",
    rating: 5,
    quote:
      "I ordered 3 custom sets for my bridesmaids and everyone was utterly charmed. The packaging is eco-conscious and beautiful.",
    date: "August 2026",
    favoritePiece: "Curated Clay Pearl Set",
  },
];
