export type CurrentCategory = "fleurs" | "hashs" | "moonrocks" | "huiles" | "infusions" | "soins" | "vaporisateurs";

export type slugCategories =
  | "fleurs-cbd"
  | "pollens-resines-hash-cbd"
  | "moonrocks-cbd"
  | "huiles-cbd"
  | "infusions-cbd"
  | "soins-cbd"
  | "vaporisateur";

export interface Category {
  url: string;
  category: keyof Products;
  title: string;
  slug: slugCategories;
}

export interface Prices {
  [key: string]: string;
}

export interface Cannabinoids {
  CBD?: string;
  CBG?: string;
  CBN?: string;
}

export interface Terpenes {
  Linalol?: string;
  Myrcene?: string;
  Pinene?: string;
  Limonen?: string;
}

export interface Image {
  url: string;
  alt: string;
}

export interface Review {
  author: string;
  content: string;
  date: string;
  rating: string;
}

export interface Rating {
  amount: number;
  value: number;
  reviews: Review[];
}

export interface Analyse {
  [key: string]: string;
}

export interface BaseProduct {
  category: string;
  id: string;
  images: { main: Image; others: Image[] };
  isPromo: boolean;
  longDescription: string;
  name: string;
  prices: Prices;
  pricesPer: string;
  productUrl: string;
  ratings: Rating;
  relatedProducts: Product[];
  shortDescription: string;
  slug: string;
  stock: string;
  VATRate: number;
}

export interface NaturalProduct extends BaseProduct {
  cannabinoids: Cannabinoids;
  analyses: Analyse;
}

export interface EndProduct extends NaturalProduct {
  terpenes: Terpenes;
  grower: string;
}

export interface Oil extends NaturalProduct {}

export interface Hash extends EndProduct {}

export interface Moonrock extends EndProduct {}

export interface Flower extends EndProduct {
  growingMethod: string;
}

export type Product = BaseProduct | Oil | Hash | Moonrock | Flower;

export interface Products {
  fleurs: Flower[];
  hashs: Hash[];
  moonrocks: Moonrock[];
  huiles: Oil[];
  infusions: BaseProduct[];
  soins: BaseProduct[];
  vaporisateurs: BaseProduct[];
}

export type categories = Category[];
