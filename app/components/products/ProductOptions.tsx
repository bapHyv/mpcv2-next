"use client";

import { useAlerts } from "@/app/alertsContext";
import { ProductCart, useCart } from "@/app/cartContext";
import { useProducts } from "@/app/productsContext";
import { Image, Prices } from "@/app/types/productsTypes";
import { formatOption } from "@/app/utils/productFunctions";
import { Radio, RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

interface Params {
  image: Image;
  pricesPer: string;
  prices: Prices;
  name: string;
  id: string;
  stock: string;
}

export default function ProductOptions({
  prices,
  pricesPer,
  name,
  id,
  image,
  stock,
}: Params) {
  const [formatedOption, setFormatedOption] = useState(
    formatOption(prices, stock)
  );
  const [selectedOption, setSelectedOption] = useState(
    formatOption(prices, stock)[0]?.quantity
  );
  const [productStock, setProductStock] = useState(parseInt(stock));

  const { products, setProducts } = useProducts();
  const { cart, setCart } = useCart();
  const { addAlert } = useAlerts();

  useEffect(() => {
    // This is used to stock all the prices in the productsContext in order to display the right price on the ProductCard.tsx
    // See ProductCard.tsx
    // See ProductPrice.tsx
    setProducts((prevState) => {
      return {
        ...prevState,
        [id]: {
          id,
          name,
          option: selectedOption as string,
          price:
            parseFloat(prices[selectedOption as string]) *
            parseFloat(selectedOption as string),
          image,
        },
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addProductToCart = () => {
    const _product: ProductCart = {
      cartItemId: uuid(),
      id: id,
      name: name,
      quantity: 1,
      option: selectedOption as string,
      per: pricesPer,
      unitPrice: parseFloat(prices[selectedOption as string]),
      totalPrice: 0,
      image,
    };

    // Set the total price before the setCart action to have the _product ready to be inserted in the cart context.
    // It could go in the else statement...
    _product.totalPrice =
      _product.unitPrice *
      _product.quantity *
      parseFloat(selectedOption as string);

    setCart((prevCart) => {
      // Check if the same product and option is already in the cart
      const isSameProductAndOptionInCart = prevCart.some(
        (product) => product.id === id && product.option === _product.option
      );

      if (isSameProductAndOptionInCart) {
        // If it's in the cart, increment the quantity
        return prevCart.map((product) => {
          if (product.id === id && product.option === _product.option) {
            return {
              ...product,
              quantity: product.quantity + 1,
              totalPrice:
                (product.quantity + 1) *
                product.unitPrice *
                parseFloat(selectedOption as string),
            };
          }
          return product;
        });
      } else {
        // If it's not in the cart, add it as a new item
        return [...prevCart, _product];
      }
    });

    // Keep track of the product stock to remove the options (stock quantity available) that are greater than the current stock
    setProductStock((prevStock) => {
      const newStock = prevStock - parseInt(selectedOption as string);

      // Every time a product is added to the cart, the options will be recomputed to make sure no option greater
      // than the stock is displayed
      setFormatedOption(formatOption(prices, newStock.toString()));

      // This is used to prevent the following edge case. Let's say the stock is equal to 15. If the user chooses 10 then add
      // the product to its cart, the stock left is now 5. The option 10 disapear (because it's greater than the stock which has now a value of 5) but is still selected.
      // This line recompute the selected option to make sure that if the selected option is greater than the newStock, the selectedOption will be the next available.
      setSelectedOption((prevSelectedOption) => {
        if (parseInt(prevSelectedOption as string) > newStock) {
          return formatOption(prices, newStock.toString())[
            formatOption(prices, newStock.toString()).length - 1
          ]?.quantity;
        } else {
          return prevSelectedOption;
        }
      });

      return newStock < 0 ? 0 : newStock;
    });

    const alterDescription = `${selectedOption} ${pricesPer} du produit ${name} a bien ete ajoute`;
    addAlert(uuid(), alterDescription, "Ajout de produit", "emerald");
  };

  return !!productStock ? (
    <div>
      {/* Option picker */}
      {
        <fieldset aria-label="Choose a size" className="mt-8">
          {
            <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {pricesPer === "g" ? "Quantité" : "unité"}
            </div>
          }

          <RadioGroup
            value={selectedOption}
            onChange={(arg) => {
              setSelectedOption(arg);
              setProducts((prevState) => {
                return {
                  ...prevState,
                  [id]: {
                    id,
                    name,
                    option: arg,
                    price: parseFloat(prices[arg]) * parseFloat(arg),
                  },
                };
              });
            }}
            className="mt-2 flex gap-2 flex-wrap"
          >
            {formatedOption.map((price) => (
              <Radio
                key={price?.quantity}
                value={price?.quantity}
                className={clsx(
                  `cursor-pointer focus:outline-none flex items-center justify-center rounded-md border 
                  border-gray-200 bg-white p-2 w-10 h-10 text-sm font-medium uppercase text-neutral-900 hover:bg-neutral-200
                  data-[checked]:border-transparent data-[checked]:bg-green data-[checked]:text-white data-[focus]:ring-2 data-[focus]:ring-green data-[focus]:ring-offset-2
                  data-[checked]:hover:bg-dark-green sm:flex-1 relative`
                )}
              >
                {price?.quantity}
              </Radio>
            ))}
          </RadioGroup>
        </fieldset>
      }

      <div className="flex items-center justify-center">
        <button
          onClick={() => addProductToCart()}
          className={`mt-8 flex w-full items-center justify-center rounded-md border border-transparent 2xl:w-2/3
      bg-green px-8 py-3 text-base font-medium text-white hover:bg-dark-green focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2 disabled:bg-neutral-400 disabled:cursor-not-allowed`}
          disabled={!productStock}
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  ) : (
    <p className="mt-8 text-xl text-red-600 uppercase text-center font-medium">
      Rupture de stock
    </p>
  );
}
