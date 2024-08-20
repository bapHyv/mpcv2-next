export interface Category {
  url: string;
  category: keyof Products;
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

export interface Product {
  name: string;
  prices: Prices;
  stock: string;
  image: string;
  growingMethod?: string;
  cannabinoids?: Cannabinoids;
  terpenes?: Terpenes;
  grower?: string;
  productUrl: string;
  isPromo: boolean;
}

export interface Products {
  fleurs: Product[];
  hashs: Product[];
  moonrocks: Product[];
  huiles: Product[];
  infusions: Product[];
  soins: Product[];
  vaporisateurs: Product[];
}

export type categories = Category[];
