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
import { Cannabinoids, Image } from "./types/productsTypes";

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
  const [cart, setCart] = useState<ProductCart[]>(
    (JSON.parse(
      localStorage.getItem("cart") || ""
    ) as unknown as ProductCart[]) || []
  );

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

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
