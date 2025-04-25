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
  urlTitle: string;
  category: keyof Products;
  title: string;
  slug: slugCategories;
}

export interface Price {
  id: number;
  price: "string";
}

export interface Prices {
  [option: string]: Price;
}

export interface Cannabinoids {
  CBD?: string;
  CBG?: string;
  CBN?: string;
}

export interface Terpenes {
  caryophyllene?: string; // bois
  limonene?: string; // agrumes
  myrcene?: string; // sylvestre
  linalol?: string; // floral
  terpinolene?: string; // terrestre
  piperine?: string; // piment
  pinene?: string; // sapin
  humulene?: string; // terrestre
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
  id: number;
  name: string;
  category: string;
  categoryId: number;
  images: { main: Image; others: Image[] };
  isPromo: boolean;
  longDescription: string;
  prices: Prices;
  pricesPer: string;
  productUrl: string;
  ratings: Rating;
  relatedProducts: Product[];
  shortDescription: string;
  slug: string;
  stock: string;
  VATRate: number;
  metadescription?: string;
}

export interface NaturalProduct extends BaseProduct {
  cannabinoids: Cannabinoids;
  analyzes: Analyse;
  country: "af" | "ch" | "en" | "es" | "fr" | "it" | "lb" | "ma" | "np" | "usa";
}

export interface EndProduct extends NaturalProduct {
  terpenes: Terpenes;
  grower: string;
}

export interface Oil extends NaturalProduct {}

export interface Hash extends EndProduct {}

export interface Moonrock extends EndProduct {}

export interface Flower extends EndProduct {
  growingMethod: "Extérieur" | "Sous-serre" | "Intérieur";
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

export interface VariationTable {
  [variationId: string]: number;
}

export interface APIResponse<k> {
  products: { [productId: string]: k };
  variationTable: VariationTable;
}
