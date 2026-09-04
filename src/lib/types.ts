export type Category = {
  slug: string;
  name: string;
  image: string;
};

export type ProductColor = {
  name: string;
  hex: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  images: [string, string];
  gallery: string[];
  sizes: string[];
  colors: ProductColor[];
  isNew?: boolean;
  inStock: boolean;
  fabricCare: string;
  deliveryInfo: string;
  modelInfo?: string;
  description: string;
  /** Real purchase happens on Shopier — Sepete Ekle / Hemen Al deep-link here. */
  shopierUrl: string;
};
