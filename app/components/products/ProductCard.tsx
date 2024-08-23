"use client";

import { useState } from "react";
import { Radio, RadioGroup } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import {
  Cannabinoids,
  Prices,
  BaseProduct,
  Terpenes,
  Flower,
  Hash,
  Moonrock,
  Oil,
} from "@/app/types/productsTypes";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import clsx from "clsx";

function findHighest(values: Cannabinoids | Terpenes | undefined) {
  if (!values) return null;

  const entries = Object.entries(values)
    .map(([key, value]) => ({
      name: key,
      value: parseFloat(value || "0"),
    }))
    .filter(Boolean);

  if (!entries.length) return null;

  const highest = entries.reduce((prev, current) =>
    current.value > prev.value ? current : prev
  );

  return highest;
}

function findHighestQuantity(prices: Prices) {
  const highestQuantity = { quantity: 0, price: 0 };

  Object.entries(prices)
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

export default function ProductCard({
  image,
  isPromo,
  name,
  prices,
  productUrl,
  stock,
  rating,
  cannabinoids,
  grower,
  growingMethod,
  terpenes,
}: BaseProduct | Oil | Hash | Moonrock | Flower) {
  const [selectedOption, setSelectedOption] = useState(
    formatOption(prices)[0]?.quantity
  );

  const params = useParams();

  const t = useTranslations("category");

  const cannabinoidRating = findHighest(cannabinoids);

  const highestQuantity = findHighestQuantity(prices);

  const formatedOption = formatOption(prices);

  const highestTerpene = findHighest(terpenes);

  const terpenesFlavor = {
    caryophyllene: t("caryophyllene"),
    limonene: t("limonene"),
    myrcene: t("myrcene"),
    linalol: t("linalol"),
    terpinolene: t("terpinolene"),
    piperine: t("piperine"),
    caryophyllenePeper: t("caryophyllenePeper"),
    pinene: t("pinene"),
    humulene: t("humulene"),
  };

  return (
    <div className="relative col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-3 flex w-full transform text-left text-base transition my-4">
      <div className="flex w-full items-center overflow-hidden bg-neutral-100 dark:bg-light-black p-2 pt-3 shadow-lg rounded-xl">
        <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:items-center lg:gap-x-8">
          <div className="overflow-hidden rounded-lg col-span-12">
            <Image
              alt={image.IMAGE_ALT}
              src={image.IMAGE_URL}
              className="object-cover object-center"
              width={1080}
              height={1920}
            />
          </div>
          <div className="col-span-12">
            <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
              {name}
              {cannabinoidRating && (
                <span className="text-dark-green dark:text-light-green">
                  {` - ${cannabinoidRating?.name}: ${cannabinoidRating?.value}%`}
                </span>
              )}
            </h2>

            {isPromo && (
              <div className="absolute right-5 top-5 p-1 text-sm rounded-md animate-tada text-white bg-green">
                Promo
              </div>
            )}
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
            </section>
            {/* SEPARATOR */}
            <div className="flex items-center justify-center">
              <div className="bg-neutral-200 dark:bg-neutral-600 h-[1px] mt-4 w-full"></div>
            </div>
            {/* RATING - REVIEWS */}
            <div className="mt-4">
              <h4 className="sr-only">Reviews</h4>
              <div className="flex items-center">
                <p className="text-sm text-neutral-700 dark:text-neutral-200">
                  {Math.round(parseFloat(rating.value))}
                  <span className="sr-only"> out of 5 stars</span>
                </p>
                <div className="ml-1 flex items-center">
                  {[0, 1, 2, 3, 4].map((ratingStar) => (
                    <StarIcon
                      key={ratingStar}
                      aria-hidden="true"
                      className={clsx(
                        Math.round(parseFloat(rating.value)) > ratingStar
                          ? "text-yellow-400"
                          : "text-gray-200",
                        "h-5 w-5 flex-shrink-0 mb-1"
                      )}
                    />
                  ))}
                </div>
                <div className="ml-4 hidden lg:flex lg:items-center">
                  <a
                    href="#"
                    className="ml-4 text-sm font-medium text-green hover:text-light-green"
                  >
                    See all {rating.quantity} reviews
                  </a>
                </div>
              </div>
            </div>

            {/* TERPENES ORIGIN */}
            {highestTerpene && (
              <section aria-labelledby="information-body" className="">
                <h3 id="information-body" className="sr-only">
                  Product details
                </h3>
                <div className="flex items-center">
                  <p className="capitalize text-neutral-700 dark:text-neutral-200">
                    {/* @ts-ignore: Unreachable code error */}
                    {terpenesFlavor[highestTerpene?.name.toLocaleLowerCase()]}
                  </p>
                  <Image
                    src={`/${highestTerpene.name.toLocaleLowerCase()}.png`}
                    alt={highestTerpene?.name || "terpene alt"}
                    width={40}
                    height={40}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <p className="capitize text-neutral-700 dark:text-neutral-200">
                    {t("origin")}
                  </p>
                  <Image
                    src={`/${grower}.png`}
                    alt={highestTerpene?.name || "terpene alt"}
                    width={30}
                    height={30}
                  />
                </div>
              </section>
            )}
            {/* SEPARATOR */}
            <div className="flex items-center justify-center">
              <div className="bg-neutral-200 dark:bg-neutral-600 h-[1px] mt-4 w-full"></div>
            </div>

            <section aria-labelledby="options-heading" className="mt-8">
              <h3 id="options-heading" className="sr-only">
                Product options
              </h3>

              <form>
                {/* Size picker */}
                {("per" in prices || "unit" in prices) && (
                  <fieldset aria-label="Choose a size" className="mt-8">
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {prices?.per === "g" ? "Quantité" : "unité"}
                    </div>

                    <RadioGroup
                      value={selectedOption}
                      onChange={setSelectedOption}
                      className="mt-2 flex gap-2 flex-wrap"
                    >
                      {formatedOption.map((price) => (
                        <Radio
                          key={price?.quantity}
                          value={price?.quantity}
                          className={clsx(
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

                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    className={`mt-8 flex w-full items-center justify-center rounded-md border border-transparent 2xl:w-2/3
                    bg-green px-8 py-3 text-base font-medium text-white hover:bg-dark-green focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2`}
                  >
                    Ajouter au panier
                  </button>
                </div>

                <p className="text-center my-4">
                  <Link
                    href={`/${params.locale}/${params.category}/${productUrl}`}
                    className="font-medium text-green hover:text-light-green"
                  >
                    Voir plus de détails
                  </Link>
                </p>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
