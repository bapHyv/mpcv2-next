export type CurrentCategory =
  | "fleurs"
  | "hashs"
  | "moonrocks"
  | "huiles"
  | "infusions"
  | "soins"
  | "vaporisateurs";

export type slugCategories =
  | "fleurs-cbd"
  | "pollens-resines-hash-cbd"
  | "moonrocks-cbd"
  | "huiles-cbd"
  | "infusions-cbd"
  | "soins-cbd"
  | "vaporisateur-cbd";

export interface Category {
  url: string;
  category: keyof Products;
  title: string;
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
  main?: boolean;
}

export interface Rating {
  quantity: string;
  value: string;
}

export interface BaseProduct {
  id: string;
  name: string;
  pricesPer: string;
  prices: Prices;
  stock: string;
  images: Image[];
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
// api.monplancbd.fr/product/id
// api.monplancbd.fr/product/slug (category)
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
