// ProductOptions.tsx (Styled)
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
  const { products, updateProduct, setCart } = useProductsAndCart();
  const { addAlert } = useAlerts();
  const t = useTranslations("category");

  const productData = products ? products[id] : null;
  const price = productData ? parseFloat(productData.price) : 0;
  const currentStock = productData ? parseInt(productData.stock, 10) : 0;

  const hasStockAvailable = useMemo(() => {
    return !isNaN(currentStock) && currentStock > 0;
  }, [currentStock]);

  // --- Handlers ---
  const addProductToCart = () => {
    if (!productData) return;

    const selectedOption = productData.option;
    const optionPrice = parseFloat(productData.productOptions[selectedOption]?.price || "0");

    // Prevent adding if specific option quantity exceeds stock (important!)
    const optionQuantity = parseInt(selectedOption, 10); // e.g., "3" -> 3
    if (isNaN(optionQuantity) || optionQuantity > currentStock) {
      addAlert(uuid(), `Stock insuffisant pour l'option ${selectedOption}${pricesPer}.`, "Stock insuffisant", "yellow");
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
        // Increment quantity if item already exists
        updatedCartProducts = prevCart.products.map((product, index) => {
          if (index === existingCartItemIndex) {
            // TODO: Add stock check here? Prevent adding more than available?
            const newQuantity = product.quantity + 1;
            return {
              ...product,
              quantity: newQuantity,
              totalPrice: newQuantity * product.unitPrice,
            };
          }
          return product;
        });
      } else {
        // Add new item to cart
        newProduct.totalPrice = newProduct.unitPrice * newProduct.quantity; // Calculate initial total price
        updatedCartProducts = [...prevCart.products, newProduct];
      }
      return { ...prevCart, products: updatedCartProducts };
    });

    // Triggers an alert
    const alertDescription = `${selectedOption}${pricesPer} - ${name} ajouté au panier.`; // Simplified message
    addAlert(uuid(), alertDescription, "Ajouté au panier", "emerald");
  };

  // Handler when a radio button option is selected
  const handleSelectOption = (value: string) => {
    if (!productData) return;
    // Update the product context with the new selected option and its corresponding price
    updateProduct(id, { option: value, price: productData.productOptions[value]?.price || "0" });
  };

  if (!productData) {
    return (
      <div className={twMerge("animate-pulse", isInModale ? "mt-1" : "mt-4 xl:mt-6")}>
        <div className={clsx("grid grid-cols-3 gap-2", isInModale ? "w-full px-1" : "w-5/6 mx-auto")}>
          {" "}
          {/* Adjusted gap/width */}
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
    <div className={twMerge(isInModale ? "mt-1" : "mt-4 xl:mt-6")}>
      <fieldset aria-label={t("chooseOptionLabel")}>
        <legend className="sr-only">{t("chooseOptionLabel")}</legend>
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
                      "relative flex cursor-pointer flex-col items-center justify-center rounded-md border py-2 px-1 text-center text-sm font-medium shadow-sm transition-colors duration-150 ease-in-out", // Base styles
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
                      <span className="text-xs opacity-80">
                        ({(parseFloat(priceData.price) / optionValue).toFixed(2)}€/{pricesPer})
                      </span>
                    )}
                  </div>
                )}
              </Radio>
            );
          })}
          {/* TODO: Needed? */}
          {/* Optional: Add spacer if needed, maybe only if !isInModale */}
          {/* {Object.keys(productData.productOptions).length <= 3 && !isInModale && <div className="col-span-3 h-[1px]"></div>} */}
        </RadioGroup>
      </fieldset>

      {!isInModale && <FidelityPointsEarned price={price} />}

      <div className={twMerge("flex items-center justify-center", isInModale ? "mt-2 mb-1 px-1" : "w-full sm:w-5/6 mx-auto my-6")}>
        <button
          type="button"
          onClick={addProductToCart}
          disabled={!hasStockAvailable}
          className={twMerge(buttonClassname, "w-full flex justify-center items-center", isInModale && "py-1.5 text-xs")}
        >
          {hasStockAvailable ? (
            <>
              {t("addToCart")}
              <span className="mx-1">|</span>
              {price.toFixed(2)} €
            </>
          ) : (
            t("outOfStock")
          )}
        </button>
      </div>
    </div>
  );
}
