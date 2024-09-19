import {
  createContext,
  ReactNode,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

import {
  Prices,
  IProducts as IProductsFromAPI,
  Flower,
  Moonrock,
  Hash,
  Oil,
  BaseProduct,
} from "@/app/types/productsTypes";
import { formatOptions } from "@/app/utils/productFunctions";

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  pricesPer: string;
  productOptions: Prices;
  image: { url: string; alt: string };
  productUrl: string;
  ratings: { amount: number; value: number };
  relatedProducts: IProductsFromAPI[];
  option: string;
  price: string;
  formatedOptions: ({
    option: string;
    price: string;
  } | null)[];
  stock: string;
}

interface IProducts {
  [productId: string | number]: IProduct;
}

interface ProductsContext {
  products: IProducts;
  setProducts: Dispatch<SetStateAction<IProducts>>;
  updateProduct: (productId: string | number, updates: Partial<IProduct>) => void;
}

const productsContext = createContext({} as ProductsContext);

const baseUrl = "https://api.monplancbd.fr/products";

export function ProductsProvider({ children }: { children: ReactNode }): JSX.Element {
  const [products, setProducts] = useState<IProducts>({});

  const updateProduct = (productId: string | number, updates: Partial<IProduct>) => {
    setProducts((prevProducts) => {
      return {
        ...prevProducts,
        [productId]: {
          ...prevProducts[productId],
          ...updates,
        },
      };
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const categories = [
          "fleurs-cbd",
          "pollens-resines-hash-cbd",
          "moonrocks-cbd",
          "huiles-cbd",
          "infusions-cbd",
          "soins-cbd",
          "vaporisateur",
        ];

        const _products: IProducts = {};

        const set_products = (product: BaseProduct | Oil | Hash | Moonrock | Flower) => {
          _products[product.id] = {
            id: product.id,
            name: product.name,
            slug: product.slug,
            category: product.category,
            pricesPer: product.pricesPer,
            productOptions: product.prices,
            image: {
              url: product.images?.main?.url || "",
              alt: product.images?.main?.alt || "",
            },
            productUrl: product.productUrl,
            ratings: { amount: product.ratings.amount, value: product.ratings.value },
            relatedProducts: product.relatedProducts,
            option: !!Object.entries(product.prices).length
              ? Object.entries(product.prices)[0][0]
              : "",
            price: !!Object.entries(product.prices).length
              ? Object.entries(product.prices)[0][1]
              : "",
            formatedOptions: formatOptions(product.prices, product.stock),
            stock: product.stock,
          };
        };

        for (const category of categories) {
          await fetch(`${baseUrl}/${category}`)
            .then((res) => res.json())
            .then((rawRes: Flower[]) => {
              rawRes.forEach((p) => {
                set_products(p);
              });
            });
        }

        setProducts(_products);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <productsContext.Provider
      value={{
        products,
        setProducts,
        updateProduct,
      }}
    >
      {children}
    </productsContext.Provider>
  );
}

export function useProducts() {
  return useContext(productsContext);
}

export default productsContext;

/**
 *
 * Recuperer tous les produits;
 * Set le state en respectant l'interface IProduct
 *
 * Faire les fonctions suivantes:
 *  -setPrice
 *  -setOption
 *  -setStock
 */
