"use client";

import { Filter } from "@/app/classes/Filters";
import {
  BaseProduct,
  CurrentCategory,
  Flower,
  Hash,
  Moonrock,
  Oil,
  Products,
} from "@/app/types/productsTypes";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";

type CurrentProducts = BaseProduct[] | Oil[] | Hash[] | Moonrock[] | Flower[];

interface Params {
  products: Products;
  currentCategory: CurrentCategory;
  locale: string;
  setCurrentProducts: Dispatch<SetStateAction<CurrentProducts>>;
  currentProduct: CurrentProducts;
}

function findFilterAttributes(
  products: Products,
  currentCategory: CurrentCategory
) {
  if (
    currentCategory === "infusions" ||
    currentCategory === "soins" ||
    currentCategory === "vaporisateurs"
  )
    return null;

  const filter = new Filter(products, currentCategory);

  filter.generateFilter();

  return filter;
}

// TODO trad dans la classe, default values en fonction de ce qu'il y a dans la classe
// Faire une fonction isEmpty qui passe au travers du watch(). Si tous les tableaux sont vides, afficher tous les produits

interface IFormState {
  cannabinoids?: (string | undefined)[] | undefined;
  growingMethod?: (string | undefined)[] | undefined;
  rate?: (string | undefined)[] | undefined;
  terpenes?: (string | undefined)[] | undefined;
}

const defaultValues: IFormState = {
  cannabinoids: [],
  growingMethod: [],
  rate: [],
  terpenes: [],
};

function isFilterEmpty(formState: IFormState) {
  let isEmpty = true;

  Object.entries(formState).forEach(([key, value]) => {
    if (value.length) isEmpty = false;
  });

  return isEmpty;
}

export default function ProductFilter({
  products,
  currentCategory,
  locale,
  setCurrentProducts,
  currentProduct,
}: Params) {
  const filters = findFilterAttributes(products, currentCategory);

  const { watch, register } = useForm({ defaultValues });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      const filterProducts = () => {
        if (isFilterEmpty(value)) {
          setCurrentProducts(products[currentCategory]);
        } else {
          const newCurrentProducts: CurrentProducts = [];

          currentProduct.forEach((product) => {
            Object.entries(value).forEach(([key, value]) => {
              if (value.length && key in product) {
                console.log({ key, value });
                if (key === "growingMethod") {
                  //@ts-ignore
                  if (value.includes(product.growingMethod as string)) {
                    let isProductAlreadyInside = false;

                    newCurrentProducts.forEach((newProduct) => {
                      if (newProduct.name === product.name) {
                        isProductAlreadyInside = true;
                      }
                    });

                    if (!isProductAlreadyInside) {
                      newCurrentProducts.push(product as any);
                    }
                  }
                } else if (key === "rate") {
                } else {
                  //@ts-ignore
                  Object.entries(product[key as any]).forEach(
                    ([productKey, productValue]) => {
                      console.log({ productKey, productValue });

                      if (value.includes(productKey as string)) {
                        let isProductAlreadyInside = false;

                        newCurrentProducts.forEach((newProduct) => {
                          if (newProduct.name === product.name) {
                            isProductAlreadyInside = true;
                          }
                        });

                        if (!isProductAlreadyInside) {
                          newCurrentProducts.push(product as any);
                        }
                      }
                    }
                  );
                }
              }
            });
          });

          setCurrentProducts(newCurrentProducts);
        }
      };

      filterProducts();
    });

    return () => subscription.unsubscribe();
  });

  return (
    <div className="col-span-2 row-span-12 bg-slate-200">
      {filters && (
        <>
          {!!filters.cannabinoids.values.length && (
            <>
              <p className="text-black mt-5">{filters.cannabinoids.name}</p>
              <fieldset>
                {filters.cannabinoids.values.map((value) => (
                  <div key={value}>
                    <input
                      type="checkbox"
                      id={value}
                      value={value}
                      {...register(filters.cannabinoids.propName as any)}
                    />
                    <label htmlFor={value} className="text-black">
                      {value}
                    </label>
                  </div>
                ))}
              </fieldset>
            </>
          )}

          {!!filters.rate.values.length && (
            <>
              <p className="text-black mt-5">{filters.rate.name}</p>
              <fieldset>
                {filters.rate.values.map((value) => (
                  <div key={value}>
                    <input
                      type="checkbox"
                      id={value}
                      value={value}
                      {...register(filters.rate.propName as any)}
                    />
                    <label htmlFor={value} className="text-black">
                      {value}
                    </label>
                  </div>
                ))}
              </fieldset>
            </>
          )}

          {!!filters.terpenes.values.length && (
            <>
              <p className="text-black mt-5">{filters.terpenes.name}</p>
              <fieldset>
                {filters.terpenes.values.map((value) => (
                  <div key={value}>
                    <input
                      type="checkbox"
                      id={value}
                      value={value}
                      {...register(filters.terpenes.propName as any)}
                    />
                    <label htmlFor={value} className="text-black">
                      {value}
                    </label>
                  </div>
                ))}
              </fieldset>
            </>
          )}

          {!!filters.growingMethod.values.length && (
            <>
              <p className="text-black mt-5">{filters.growingMethod.name}</p>
              <fieldset>
                {filters.growingMethod.values.map((value) => (
                  <div key={value}>
                    <input
                      type="checkbox"
                      id={value}
                      value={value}
                      {...register(filters.growingMethod.propName as any)}
                    />
                    <label htmlFor={value} className="text-black">
                      {value}
                    </label>
                  </div>
                ))}
              </fieldset>
            </>
          )}
        </>
      )}
    </div>
  );
}
