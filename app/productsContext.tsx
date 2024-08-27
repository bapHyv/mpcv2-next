import {
  createContext,
  ReactNode,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

interface IProduct {
  id: string;
  name: string;
  price: number;
  option: string;
}

interface IProducts {
  // The key is the product's id
  [key: string]: IProduct;
}

interface ProductsContext {
  products: IProducts;
  setProducts: Dispatch<SetStateAction<IProducts>>;
}

const productsContext = createContext({} as ProductsContext);

export function ProductsProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [products, setProducts] = useState<IProducts>({});

  return (
    <productsContext.Provider
      value={{
        products,
        setProducts,
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
