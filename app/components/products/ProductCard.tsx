"use client";

import { useState } from "react";
import { Radio, RadioGroup } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { Cannabinoids, Prices, Product } from "@/app/types/productsTypes";

const product = {
  name: "Women's Basic Tee",
  price: "$32",
  rating: 3.9,
  reviewCount: 512,
  href: "#",
  imageSrc:
    "https://tailwindui.com/img/ecommerce-images/product-page-01-featured-product-shot.jpg",
  imageAlt: "Back of women's Basic Tee in black.",
  colors: [
    { name: "Black", bgColor: "bg-gray-900", selectedColor: "ring-gray-900" },
    {
      name: "Heather Grey",
      bgColor: "bg-gray-400",
      selectedColor: "ring-gray-400",
    },
  ],
  quantity: [
    { name: "1g", inStock: true },
    { name: "3g", inStock: true },
    { name: "5g", inStock: true },
    { name: "10g", inStock: true },
    { name: "25g", inStock: true },
    { name: "50g", inStock: true },
    { name: "100g", inStock: false },
  ],
};

function findHighestCannabinoid(cannabinoids: Cannabinoids | undefined) {
  if (!cannabinoids) return null;
  // Convertir les valeurs en nombre et garder une trace des cannabinoïdes
  const entries = Object.entries(cannabinoids).map(([key, value]) => ({
    name: key,
    value: parseFloat(value || "0"), // Convertit la chaîne en nombre
  }));

  // Si l'objet est vide ou aucune conversion n'a été possible
  if (entries.length === 0) {
    return null;
  }

  // Trouver l'entrée avec la valeur la plus élevée
  const highest = entries.reduce((prev, current) =>
    current.value > prev.value ? current : prev
  );

  return highest;
}

function findHighestQuantity(prices: Prices) {
  let highestQuantity = { quantity: 0, price: 0 };

  const entries = Object.entries(prices)
    .map(([key, value]) => {
      if (Number(parseInt(key) && Number(parseFloat(value)))) {
        return {
          quantity: parseInt(key),
          price: parseFloat(value || "0"),
        };
      } else {
        return null;
      }
    })
    .filter(Boolean)
    .forEach((price) => {
      if (!price) return null;
      if (price.quantity > highestQuantity.quantity) {
        highestQuantity.quantity = price.quantity;
        highestQuantity.price = price.price;
      }
    }, 0);

  return highestQuantity;
}

function formatOption(prices: Prices) {
  const entries = Object.entries(prices)
    .map(([key, value]) => {
      if (Number(parseInt(key) && Number(parseFloat(value)))) {
        return {
          quantity: key,
          price: value,
        };
      } else {
        return null;
      }
    })
    .filter(Boolean);

  return entries;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductCard({
  image,
  isPromo,
  name,
  prices,
  productUrl,
  stock,
  cannabinoids,
  grower,
  growingMethod,
  terpenes,
}: Product) {
  const [selectedWeight, setSelectedWeight] = useState(product.quantity[2]);

  const [selectedOption, setSelectedOption] = useState(
    formatOption(prices)[0]?.quantity
  );

  const cannabinoidRating = findHighestCannabinoid(cannabinoids);

  const highestQuantity = findHighestQuantity(prices);

  const formatedOption = formatOption(prices);

  // console.log({
  //   image,
  //   isPromo,
  //   name,
  //   prices,
  //   productUrl,
  //   stock,
  //   cannabinoids,
  //   grower,
  //   growingMethod,
  //   terpenes,
  // });

  console.log(cannabinoidRating);

  return (
    <div className="relative">
      <div className="inset-0 w-screen overflow-y-auto">
        <div className="min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
          <div className="flex w-full transform text-left text-base transition data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in md:my-8 md:max-w-2xl md:px-4 data-[closed]:md:translate-y-0 data-[closed]:md:scale-95 lg:max-w-4xl">
            <div className="relative flex w-full items-center overflow-hidden bg-neutral-100 dark:bg-light-black px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
              <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:items-center lg:gap-x-8">
                <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-green-100 sm:col-span-4 lg:col-span-5">
                  <Image
                    alt="cbd flower"
                    src={image}
                    className="object-cover object-center"
                    width={400}
                    height={300}
                  />
                </div>
                <div className="sm:col-span-8 lg:col-span-7">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 sm:pr-12">
                      {name}
                      {cannabinoidRating && (
                        <span className="text-dark-green dark:text-light-green">
                          {` - ${cannabinoidRating?.name}: ${cannabinoidRating?.value}%`}
                        </span>
                      )}
                    </h2>

                    {isPromo && (
                      <div className=" text-white bg-green p-2 rounded-md animate-tada ">
                        Promo
                      </div>
                    )}
                  </div>
                  <section
                    aria-labelledby="information-heading"
                    className="mt-1 flex flex-col gap-1"
                  >
                    <h3 id="information-heading" className="sr-only">
                      Product information
                    </h3>

                    {/* PRICE / UNIT */}
                    {"per" in prices && (
                      <p className="text-neutral-600 dark:text-neutral-400">
                        À partir de {highestQuantity.price}€/{prices.per}
                      </p>
                    )}

                    {/* PRODUCT PRICE */}
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      {selectedOption
                        ? parseFloat(prices[selectedOption]) *
                          parseInt(selectedOption)
                        : prices["1"]}{" "}
                      €
                    </p>

                    {/* RATING - REVIEWS */}
                    {/* <div className="mt-4">
                      <h4 className="sr-only">Reviews</h4>
                      <div className="flex items-center">
                        <p className="text-sm text-gray-700">
                          {product.rating}
                          <span className="sr-only"> out of 5 stars</span>
                        </p>
                        <div className="ml-1 flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                              key={rating}
                              aria-hidden="true"
                              className={classNames(
                                product.rating > rating
                                  ? "text-yellow-400"
                                  : "text-gray-200",
                                "h-5 w-5 flex-shrink-0"
                              )}
                            />
                          ))}
                        </div>
                        <div className="ml-4 hidden lg:flex lg:items-center">
                          <span aria-hidden="true" className="text-gray-300">
                            &middot;
                          </span>
                          <a
                            href="#"
                            className="ml-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            See all {product.reviewCount} reviews
                          </a>
                        </div>
                      </div>
                    </div> */}
                  </section>

                  <section aria-labelledby="options-heading" className="mt-8">
                    <h3 id="options-heading" className="sr-only">
                      Product options
                    </h3>

                    <form>
                      {/* Size picker */}
                      {("per" in prices || "unit" in prices) && (
                        <fieldset aria-label="Choose a size" className="mt-8">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                              {prices.per === "g" ? "Quantité" : "unité"}
                            </div>
                          </div>

                          <RadioGroup
                            value={selectedOption}
                            onChange={setSelectedOption}
                            className="mt-2 grid grid-cols-7 gap-2"
                          >
                            {formatedOption.map((price) => (
                              <Radio
                                key={price?.quantity}
                                value={price?.quantity}
                                className={classNames(
                                  stock
                                    ? "cursor-pointer focus:outline-none"
                                    : "cursor-not-allowed opacity-25",
                                  `flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-3 text-sm font-medium uppercase text-neutral-900 hover:bg-neutral-200
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

                      <button
                        type="submit"
                        className={`mt-8 flex w-full items-center justify-center rounded-md border border-transparent 
                          bg-green px-8 py-3 text-base font-medium text-white hover:bg-dark-green focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2`}
                      >
                        Ajouter au panier
                      </button>

                      <p className="absolute left-4 top-4 text-center sm:static sm:mt-8">
                        <a
                          href={product.href}
                          className="font-medium text-green hover:text-light-green"
                        >
                          Voir plus de détails
                        </a>
                      </p>
                    </form>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
