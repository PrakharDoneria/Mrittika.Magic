export type Product = {
  id: string;
  title: string;
  slug?: string | null;
  description: string | null;
  price: number;
  category: string | null;
  category_id?: string | null;
  images: string[];
  stock: number;
  sku?: string | null;
  material?: string | null;
  dimensions?: string | null;
  weight?: number | null;
  care_instructions?: string | null;
  is_featured?: boolean;
  rating?: number;
  review_count?: number;
  created_at: string;
};

export type CartItem = Product & { quantity: number };

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
};

export type ArtPiece = {
  id: string;
  title: string;
  category: string | null;
  year: string | null;
  image: string;
  description: string | null;
  badge: string | null;
  display_order?: number;
  created_at?: string;
};
