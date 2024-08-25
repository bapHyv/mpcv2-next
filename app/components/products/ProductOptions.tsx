"use client";

import { useProducts } from "@/app/productsContext";
import { Prices } from "@/app/types/productsTypes";
import { formatOption } from "@/app/utils/productFunctions";
import { Radio, RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";

interface Params {
  prices: Prices;
  name: string;
}

// TODO AJOUTER ID
export default function ProductOptions({ prices, name }: Params) {
  const [selectedOption, setSelectedOption] = useState(
    formatOption(prices)[0]?.quantity
  );

  const { products, setProducts } = useProducts();

  useEffect(() => {
    setProducts((prevState) => {
      return {
        ...prevState,
        [name]: {
          id: Math.random().toString(),
          name,
          option: selectedOption as string,
          price:
            parseFloat(prices[selectedOption as string]) *
            parseFloat(selectedOption as string),
        },
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatedOption = formatOption(prices);

  console.log(products);

  return (
    <form>
      {/* Option picker */}
      {("per" in prices || "unit" in prices) && (
        <fieldset aria-label="Choose a size" className="mt-8">
          <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {prices?.per === "g" ? "Quantité" : "unité"}
          </div>

          <RadioGroup
            value={selectedOption}
            onChange={(arg) => {
              setSelectedOption(arg);
              setProducts((prevState) => {
                return {
                  ...prevState,
                  [name]: {
                    id: Math.random().toString(),
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
                  `cursor-pointer focus:outline-none flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-3 text-sm font-medium uppercase text-neutral-900 hover:bg-neutral-200
                  data-[checked]:border-transparent data-[checked]:bg-green data-[checked]:text-white data-[focus]:ring-2 data-[focus]:ring-green data-[focus]:ring-offset-2
                  data-[checked]:hover:bg-dark-green sm:flex-1`
                )}
              >
                {price?.quantity}
              </Radio>
            ))}
          </RadioGroup>
        </fieldset>
      )}

      <div className="flex items-center justify-center">
        <button
          type="submit"
          className={`mt-8 flex w-full items-center justify-center rounded-md border border-transparent 2xl:w-2/3
      bg-green px-8 py-3 text-base font-medium text-white hover:bg-dark-green focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2`}
        >
          Ajouter au panier
        </button>
      </div>
    </form>
  );
}
