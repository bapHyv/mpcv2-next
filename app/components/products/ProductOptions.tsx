"use client";

import clsx from "clsx";
import { v4 as uuid } from "uuid";
import { useTranslations } from "next-intl";
import { Fragment, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { Radio, RadioGroup } from "@headlessui/react";

import FidelityPointsEarned from "@/app/components/products/FidelityPointsEarned";
import { useAlerts } from "@/app/context/alertsContext";
import { ProductCart, useProductsAndCart } from "@/app/context/productsAndCartContext";
import { Image as ImageType, Prices } from "@/app/types/productsTypes";
import { buttonClassname } from "@/app/staticData/cartPageClasses";

interface Params {
  image: ImageType;
  pricesPer: string;
  prices: Prices;
  name: string;
  id: number;
  stock: string;
  slug: string;
  category: string;
  isInModale: boolean;
}

export default function ProductOptions({ pricesPer, name, id, image, category, isInModale }: Params) {
  const t = useTranslations("");
  const { products, updateProduct, setCart } = useProductsAndCart();
  const { addAlert } = useAlerts();

  const productData = products ? products[id] : null;
  const price = productData ? parseFloat(productData.price) : 0;
  const currentStock = productData ? parseInt(productData.stock, 10) : 0;
  const firstOption = productData ? parseInt(Object.keys(productData.prices)[0]) : 0;

  const hasStockAvailable = useMemo(() => {
    return !isNaN(currentStock) && currentStock > firstOption;
  }, [currentStock, firstOption]);

  const addProductToCart = () => {
    if (!productData) return;

    const selectedOption = productData.option;
    const optionPrice = parseFloat(productData.productOptions[selectedOption]?.price || "0");
    const optionQuantity = parseInt(selectedOption, 10);

    if (isNaN(optionQuantity) || optionQuantity > currentStock) {
      addAlert(
        uuid(),
        t("alerts.cart.insufficientStock.text", { option: selectedOption, per: pricesPer }),
        t("alerts.cart.insufficientStock.title"),
        "yellow"
      );
      return;
    }

    const newProduct: ProductCart = {
      cartItemId: uuid(),
      id: id,
      name: productData.name,
      quantity: 1,
      option: selectedOption,
      per: productData.pricesPer,
      unitPrice: optionPrice,
      totalPrice: 0,
      image,
      category,
      VATRate: productData.VATRate,
      isPromo: productData.isPromo,
      categoryId: productData.categoryId,
    };

    setCart((prevCart) => {
      const existingCartItemIndex = prevCart.products.findIndex((product) => product.id === id && product.option === newProduct.option);
      let updatedCartProducts;
      if (existingCartItemIndex > -1) {
        updatedCartProducts = prevCart.products.map((product, index) => {
          if (index === existingCartItemIndex) {
            const newQuantity = product.quantity + 1;
            return { ...product, quantity: newQuantity, totalPrice: newQuantity * product.unitPrice };
          }
          return product;
        });
      } else {
        newProduct.totalPrice = newProduct.unitPrice * newProduct.quantity;
        updatedCartProducts = [...prevCart.products, newProduct];
      }
      return { ...prevCart, products: updatedCartProducts };
    });

    addAlert(
      uuid(),
      t("alerts.cart.productAdded.text", { option: selectedOption, per: pricesPer, name }),
      t("alerts.cart.productAdded.title"),
      "emerald"
    );
  };

  const handleSelectOption = (value: string) => {
    if (!productData) return;
    updateProduct(id, { option: value, price: productData.productOptions[value]?.price || "0" });
  };

  if (!productData) {
    return (
      <div className={twMerge("animate-pulse", isInModale ? "mt-1" : "mt-1 xl:mt-6")}>
        <div className={clsx("grid grid-cols-3 gap-2", isInModale ? "w-full px-1" : "w-5/6 mx-auto")}>
          {new Array(isInModale ? 3 : 6).fill(0).map((_, i) => (
            <div key={i} className="col-span-1 h-12 sm:h-14 rounded-md bg-gray-200" />
          ))}
        </div>
        {!isInModale && <div className="h-5 w-3/4 bg-gray-200 rounded mx-auto my-4"></div>}
        <div className={twMerge(clsx("mx-auto", isInModale ? "w-full mt-2 mb-1 px-1" : "w-5/6 my-6"))}>
          <div className="w-full h-10 sm:h-11 rounded-md bg-gray-300" />
        </div>
      </div>
    );
  }

  return (
    <div className={twMerge(isInModale ? "mt-1" : "mt-1 xl:mt-6")}>
      <fieldset aria-label={t("productOptions.chooseOptionLabel")}>
        <legend className="sr-only">{t("productOptions.chooseOptionLabel")}</legend>
        <RadioGroup
          value={productData.option}
          onChange={handleSelectOption}
          className={clsx("grid grid-cols-3 gap-2", isInModale ? "w-full px-1" : "w-full sm:w-5/6 mx-auto")}
        >
          {Object.entries(productData.productOptions).map(([option, priceData]) => {
            const optionValue = parseInt(option, 10);
            const isOptionDisabled = isNaN(optionValue) || optionValue > currentStock;

            return (
              <Radio key={option} value={option} disabled={isOptionDisabled} as={Fragment}>
                {({ checked, disabled, focus }) => (
                  <div
                    className={twMerge(
                      "relative flex cursor-pointer flex-col items-center justify-center rounded-md border py-2 px-1 text-center text-sm font-medium shadow-sm transition-colors duration-150 ease-in-out",
                      disabled
                        ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                        : checked
                        ? "border-transparent text-black ring-2 ring-green ring-offset-1"
                        : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
                      focus && !disabled && "ring-2 ring-green ring-offset-1",
                      isInModale && "py-1 text-xs"
                    )}
                  >
                    <span className="font-semibold">
                      {option}
                      {pricesPer === "g" ? "g" : "u"}
                    </span>
                    {!isInModale && (
                      <span className="text-xs opacity-70">
                        ({(parseFloat(priceData.price) / optionValue).toFixed(2)}€/{pricesPer})
                      </span>
                    )}
                  </div>
                )}
              </Radio>
            );
          })}
        </RadioGroup>
      </fieldset>

      {!isInModale && <FidelityPointsEarned price={price} />}

      <div className={twMerge("flex items-center justify-center", isInModale ? "mt-2 mb-1 px-1" : "w-full sm:w-5/6 mx-auto my-2")}>
        <button
          type="button"
          onClick={addProductToCart}
          disabled={!hasStockAvailable}
          className={twMerge(buttonClassname, "w-full flex justify-center items-center", isInModale && "py-1.5 text-xs")}
        >
          {hasStockAvailable ? (
            <>
              {t("productOptions.addToCartButton")}
              <span className="mx-1">|</span>
              {price.toFixed(2)} €
            </>
          ) : (
            t("productOptions.outOfStockButton")
          )}
        </button>
      </div>
    </div>
  );
}
