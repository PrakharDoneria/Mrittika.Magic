export type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  category_id?: string | null;
  images: string[];
  stock: number;
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
