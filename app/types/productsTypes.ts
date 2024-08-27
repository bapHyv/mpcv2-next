export type CurrentCategory =
  | "fleurs"
  | "hashs"
  | "moonrocks"
  | "huiles"
  | "infusions"
  | "soins"
  | "vaporisateurs";

export interface Category {
  url: string;
  category: keyof Products;
  title: string;
}

export interface Prices {
  [key: string]: string; // Les clés sont des chaînes (par exemple "1", "3", "5", "50", "100", etc.), les valeurs sont des prix sous forme de chaîne.
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
  IMAGE_URL: string;
  IMAGE_ALT: string;
}

export interface Rating {
  quantity: string;
  value: string;
}

export interface BaseProduct {
  id: string;
  name: string;
  prices: Prices;
  stock: string;
  image: Image;
  productUrl: string;
  isPromo: boolean;
  rating: Rating;
}

export interface NaturalProduct extends BaseProduct {
  cannabinoids: Cannabinoids;
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
