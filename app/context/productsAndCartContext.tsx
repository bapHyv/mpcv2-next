import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { Prices, Product, Image } from "@/app/types/productsTypes";
import { useAlerts } from "@/app/context/alertsContext";
import { useSse } from "@/app/context/sseContext";

export interface FormatedProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  pricesPer: string;
  productOptions: Prices;
  image: { url: string; alt: string };
  productUrl: string;
  ratings: { amount: number; value: number };
  relatedProducts: Product[];
  stock: string;
  option: string; // Selected option (see ProductOptions.tsx)
  price: string; // Displayed price (see ProductPrice.tsx);
}

export interface ProductCart {
  cartItemId: string; // uuid generated when adding a product in the cart. It is used to delete it
  id: string; // This is the productId
  name: string;
  quantity: number;
  option: string; // Will be the number of "g" or "unit" choosed.
  per: string; // Will be either "g" or "unit"
  totalPrice: number;
  unitPrice: number;
  image: Image;
}

interface ProductsAPIResponse {
  [productId: string | number]: Product;
}

interface ProductsFromContext {
  [productId: string | number]: FormatedProduct;
}

interface ProductsAndCartContext {
  products: ProductsFromContext;
  setProducts: Dispatch<SetStateAction<ProductsFromContext>>;
  updateProduct: (productId: string | number, updates: Partial<FormatedProduct>) => void;
  cart: { total: number; products: ProductCart[] };
  setCart: Dispatch<
    SetStateAction<{
      total: number;
      products: ProductCart[];
    }>
  >;
}

const productsAndCartContext = createContext({} as ProductsAndCartContext);

const baseUrl = "https://api.monplancbd.fr/products";

export function ProductsAndCartProvider({ children }: { children: ReactNode }): JSX.Element {
  const [products, setProducts] = useState<ProductsFromContext>({});
  const [areProductsReady, setAreProductsReady] = useState(false);
  const [cart, setCart] = useState({ total: 0, products: [] as ProductCart[] });
  const { sseData } = useSse();
  const { addAlert } = useAlerts();

  const updateProduct = (productId: string | number, updates: Partial<FormatedProduct>) => {
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
        const response = await fetch(baseUrl);
        const data: ProductsAPIResponse = await response.json();

        const transformedProducts = Object.values(data).reduce((acc: ProductsFromContext, product: Product) => {
          if (Array.isArray(product) || !Object.entries(product.prices).length) {
            return acc;
          }

          acc[product.id] = {
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
            option: Object.entries(product.prices)[0][0],
            price: Object.entries(product.prices)[0][1],
            stock: product.stock,
          };

          return acc;
        }, {} as ProductsFromContext);

        if (!!localStorage.getItem("cart")) {
          setCart(JSON.parse(localStorage.getItem("cart") as string));
        }

        setProducts(transformedProducts);
        setAreProductsReady(true);
      } catch (error) {
        setAreProductsReady(false);
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tot = cart.total;
    let newTotal = 0;

    cart.products.forEach((product) => {
      newTotal += product.totalPrice;
    });

    if (tot !== newTotal) {
      setCart((prevCart) => ({
        ...prevCart,
        total: newTotal,
      }));

      localStorage.setItem("cart", JSON.stringify({ total: newTotal, products: cart.products }));
    }
  }, [cart]);

  useEffect(() => {
    if (areProductsReady && sseData) {
      const cartProductsQuantity = cart.products.reduce((acc, val) => {
        if (val.id in acc) {
          acc[val.id] += parseInt(val.option) * val.quantity;
        } else {
          acc[val.id] = parseInt(val.option) * val.quantity;
        }
        return acc;
      }, {} as { [key: string]: number });

      const productsDeepCopy = JSON.parse(JSON.stringify(products));

      const productsWithUpdatedStock = Object.entries(cartProductsQuantity).reduce((acc, val) => {
        const productId = val[0];
        const quantity = val[1];
        const stockFromSSE = sseData.stocks[productId];

        acc[productId].stock = (stockFromSSE - quantity).toString();

        return acc;
      }, productsDeepCopy);

      setProducts(productsWithUpdatedStock);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areProductsReady]);

  return (
    <productsAndCartContext.Provider
      value={{
        products,
        setProducts,
        updateProduct,
        cart,
        setCart,
      }}
    >
      {children}
    </productsAndCartContext.Provider>
  );
}

export function useProductsAndCart() {
  return useContext(productsAndCartContext);
}

export default productsAndCartContext;
