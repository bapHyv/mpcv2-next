"use client";

import {
  createContext,
  ReactNode,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { Image } from "./types/productsTypes";

export interface ProductCart {
  cartItemId: string; // uuid generated when adding a product in the cart. It is used to delete
  id: string;
  name: string;
  quantity: number;
  option: string; // Will the number of "g" or "unit" choosed
  per: string; // Will be either "g" or "unit"
  totalPrice: number;
  unitPrice: number;
  image: Image;
}

interface CartContext {
  cart: ProductCart[];
  setCart: Dispatch<SetStateAction<ProductCart[]>>;
}

const cartContext = createContext({} as CartContext);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [isMounted, setIsMounted] = useState(false);
  const [cart, setCart] = useState<ProductCart[]>([]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }

    return () => setIsMounted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isMounted) {
      setCart(
        (JSON.parse(
          localStorage.getItem("cart") || ""
        ) as unknown as ProductCart[]) || []
      );
    }
  }, [isMounted]);

  return (
    <cartContext.Provider
      value={{
        cart,
        setCart,
      }}
    >
      {children}
    </cartContext.Provider>
  );
}

export function useCart() {
  return useContext(cartContext);
}

export default cartContext;
