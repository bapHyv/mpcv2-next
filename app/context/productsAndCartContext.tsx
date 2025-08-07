import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";

import Modale from "@/app/components/Modale";
import CartProductCard from "@/app/components/cart/CartProductCard";
import ClientProductCard from "@/app/components/products/ClientProductCard";
import { useSse } from "@/app/context/sseContext";
import { Prices, Product, Image, VariationTable, APIResponse } from "@/app/types/productsTypes";

export interface FormatedProduct {
  id: number;
  name: string;
  slug: string;
  category: string;
  categoryId: number;
  pricesPer: string;
  productOptions: Prices;
  image: { url: string; alt: string };
  isPromo: boolean;
  prices: Prices;
  productUrl: string;
  ratings: { amount: number; value: number };
  relatedProducts: Product[];
  stock: string;
  option: string; // Selected option (see ProductOptions.tsx)
  price: string; // Displayed price (see ProductPrice.tsx);
  VATRate: number;
}

export interface ProductCart {
  cartItemId: string; // uuid generated when adding a product in the cart. It is used to delete it
  id: number; // This is the productId
  name: string;
  quantity: number;
  option: string; // Will be the number of "g" or "unit" choosed.
  per: string; // Will be either "g" or "unit"
  totalPrice: number;
  unitPrice: number;
  category: string; // Product category, used in Modale when product is removed from cart on SSE updates
  VATRate: number;
  image: Image;
  isPromo: boolean;
  categoryId: number;
}

interface ProductsFromContext {
  [productId: number]: FormatedProduct;
}

interface ProductsAndCartContext {
  products: ProductsFromContext;
  setProducts: Dispatch<SetStateAction<ProductsFromContext>>;
  updateProduct: (productId: number, updates: Partial<FormatedProduct>) => void;
  cart: { total: number; products: ProductCart[] };
  setCart: Dispatch<
    SetStateAction<{
      total: number;
      products: ProductCart[];
    }>
  >;
  variationTable: VariationTable | null;
}

const productsAndCartContext = createContext({} as ProductsAndCartContext);

const baseUrl = "https://api.monplancbd.fr/products";

export function ProductsAndCartProvider({ children }: { children: ReactNode }): JSX.Element {
  const [products, setProducts] = useState<ProductsFromContext>({});
  const [areProductsReady, setAreProductsReady] = useState(false);
  const [cart, setCart] = useState({ total: 0, products: [] as ProductCart[] });
  const [isModaleVisible, setIsModaleVisible] = useState(false);
  const [removedProducts, setRemovedProducts] = useState<ProductCart[]>([]);
  const [variationTable, setVariationTable] = useState<null | VariationTable>(null);

  const { sseData } = useSse();

  const updateProduct = (productId: number, updates: Partial<FormatedProduct>) => {
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

  const handleCloseModale = () => {
    setIsModaleVisible(false);
    setRemovedProducts([]);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(baseUrl);
        const data: APIResponse<Product> = await response.json();

        const variationTable: VariationTable = JSON.parse(JSON.stringify(data.variationTable));

        const formatedProducts = Object.values(data.products)
          .filter(Boolean)
          .filter((product) => !Array.isArray(product))
          .filter((product) => Object.entries(product.prices).length)
          .reduce((acc: ProductsFromContext, product: Product) => {
            acc[product.id] = {
              ...product,
              image: {
                url: product.images?.main?.url || "",
                alt: product.images?.main?.alt || "",
              },
              productOptions: product.prices,
              option: Object.entries(product.prices)[0][0],
              price: Object.entries(product.prices)[0][1].price,
            };

            return acc;
          }, {} as ProductsFromContext);

        setProducts(formatedProducts);
        setVariationTable(variationTable);
        setAreProductsReady(true);
      } catch (error) {
        setAreProductsReady(false);
        console.error("Failed to fetch products:", error);
      }
    };

    if (!!localStorage.getItem("cart")) {
      setCart(JSON.parse(localStorage.getItem("cart") as string));
    }

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
    }
    localStorage.setItem("cart", JSON.stringify({ total: newTotal, products: cart.products }));
  }, [cart]);

  // This useEffect check if the cart has products that don't exist or has product with quantity over availability
  useEffect(() => {
    if (!cart.products.length || !sseData) return;

    const cartProductsQuantity = cart.products.reduce((acc, val) => {
      if (val.id in acc) {
        acc[val.id] += parseInt(val.option) * val.quantity;
      } else {
        acc[val.id] = parseInt(val.option) * val.quantity;
      }
      return acc;
    }, {} as { [key: string]: number });

    setCart((prevCart) => {
      const idsToRemove = new Set<string>();

      const updatedProducts = prevCart.products.filter((product) => {
        const stockAvailable = sseData.stocks[product.id] ?? 0;
        const totalCartQuantity = cartProductsQuantity[product.id] ?? 0;
        const computedStock = stockAvailable - totalCartQuantity;
        const isOverStocked = computedStock < 0;

        if (isOverStocked) {
          let delta = Math.abs(computedStock);

          const prods = prevCart.products.filter((prod) => prod.id === product.id).sort((a, b) => parseInt(b.option) - parseInt(a.option));

          for (const prod of prods) {
            if (delta <= 0) break;
            idsToRemove.add(prod.cartItemId);
            delta -= parseInt(prod.option) * prod.quantity;
          }
        }

        const removedProducts = prevCart.products.filter((product) => idsToRemove.has(product.cartItemId));

        setRemovedProducts(removedProducts);

        return product.id in sseData.stocks && !idsToRemove.has(product.cartItemId);
      });

      return { ...prevCart, products: updatedProducts };
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areProductsReady, sseData]);

  // This useEffect remove the quantity from the cart to the products display in the UI to prevent the user from overbuying.
  useEffect(() => {
    if (!sseData) return;

    const cartProductsQuantity = cart.products.reduce((acc, val) => {
      if (val.id in acc) {
        acc[val.id] += parseInt(val.option) * val.quantity;
      } else {
        acc[val.id] = parseInt(val.option) * val.quantity;
      }
      return acc;
    }, {} as { [key: string]: number });

    setProducts((prevProducts) => {
      return Object.fromEntries(
        Object.entries(prevProducts).map(([productId, product]: [string, FormatedProduct]) => {
          const stockFromSSE = sseData.stocks[productId] ?? 0;
          const quantity = cartProductsQuantity[productId] ?? 0;
          const computedStock = stockFromSSE - quantity;
          const partialUpdate = {
            stock: (computedStock < 0 ? 0 : computedStock).toString(),
            option: product.option,
            price: product.price,
          };

          if (computedStock < parseInt(product.option)) {
            const options = Object.keys(product.productOptions)
              .map((e) => parseInt(e))
              .sort((a, b) => a - b);

            const closestOption = options.reduce((acc, val) => (val <= computedStock ? val : acc), options[0]);
            const price = product.productOptions[closestOption];

            partialUpdate.option = closestOption.toString();
            partialUpdate.price = price.price;
          }

          return [
            productId,
            {
              ...product,
              ...partialUpdate,
            },
          ];
        })
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areProductsReady, cart.products, sseData]);

  useEffect(() => {
    if (removedProducts.length) {
      setIsModaleVisible(true);
    }
  }, [removedProducts]);

  return (
    <productsAndCartContext.Provider
      value={{
        products,
        setProducts,
        updateProduct,
        cart,
        setCart,
        variationTable,
      }}
    >
      {isModaleVisible && (
        <Modale
          handleCloseModale={handleCloseModale}
          removedProducts={removedProducts.map((product) => (
            <div key={product.cartItemId} className="col-span-6 md:col-span-3 xl:col-span-2">
              <CartProductCard {...product} isInModale />
            </div>
          ))}
          relatedProducts={(() => {
            const categories = new Set<string>();

            removedProducts.forEach((product) => {
              if (!categories.has(product.category)) {
                categories.add(product.category);
              }
            });

            const filteredProducts = Object.values(products).filter((product) => categories.has(product.category) && parseInt(product.stock));
            // @ts-ignore
            const relatedProducts = filteredProducts.map((product) => <ClientProductCard key={product.id} {...product} />);

            return relatedProducts;
          })()}
        />
      )}
      {children}
    </productsAndCartContext.Provider>
  );
}

export function useProductsAndCart() {
  return useContext(productsAndCartContext);
}

export default productsAndCartContext;
