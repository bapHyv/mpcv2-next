import { StarIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import {
  BaseProduct,
  Hash,
  Moonrock,
  Oil,
  Flower,
} from "@/app/types/productsTypes";
import Link from "next/link";
import clsx from "clsx";
import { findHighest, findHighestQuantity } from "@/app/utils/productFunctions";
import { getTranslations } from "next-intl/server";
import ProductPrice from "./ProductPrice";
import ProductOptions from "./ProductOptions";
import Separator from "../Separator";
import { twMerge } from "tailwind-merge";

export default async function ProductCard({
  id,
  image,
  isPromo,
  name,
  prices,
  productUrl,
  stock,
  rating,
  // @ts-ignore
  cannabinoids,
  // @ts-ignore
  grower,
  // @ts-ignore
  terpenes,
  locale,
  category,
  mainDivClassname,
  secondeDivClassname,
}: (BaseProduct | Oil | Hash | Moonrock | Flower) & {
  locale: string;
  category: string;
  mainDivClassname?: string;
  secondeDivClassname?: string;
}) {
  const t = await getTranslations({ locale, namespace: "category" });

  const cannabinoidRating = findHighest(cannabinoids);

  const highestQuantity = findHighestQuantity(prices);

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
    <div
      className={twMerge(
        clsx(
          !parseInt(stock) ? "opacity-60" : "",
          "col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-3 w-full transform text-left text-base transition my-4"
        ),
        mainDivClassname
      )}
    >
      <div className="flex w-full overflow-hidden bg-neutral-100 dark:bg-light-black p-2 pt-3 shadow-lg rounded-md">
        <div
          // Dirty way to fix a css problem on ProductCard. The problem is a huge space between product info and photo when the product is out of stock.
          // Here I remove the grid system that mess things up. See below where I add a margin-top to simulate the right gap
          className={twMerge(
            clsx(
              parseInt(stock) ? "grid" : "",
              "w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8"
            ),
            secondeDivClassname
          )}
        >
          <div className="relative flex justify-center items-center overflow-hidden rounded-lg col-span-12 h-min">
            <Image
              alt={image.IMAGE_ALT}
              src={image.IMAGE_URL}
              className="object-cover object-center w-80 h-52 rounded-t-md"
              width={1080}
              height={1920}
            />
            {!parseInt(stock) ? (
              <div className="absolute right-5 top-5 p-1 text-sm rounded-md text-white bg-red-600">
                Rupture
              </div>
            ) : isPromo ? (
              <div className="absolute right-5 top-5 p-1 text-sm rounded-md animate-tada text-white bg-green">
                Promo
              </div>
            ) : null}
          </div>
          {/* Add margin top to display the product infos as it is supposed to be */}
          <div className={clsx(!parseInt(stock) ? "mt-8" : "", "col-span-12")}>
            <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
              {name}
              {cannabinoidRating && (
                <span className="text-dark-green dark:text-light-green">
                  {` - ${cannabinoidRating?.name}: ${cannabinoidRating?.value}%`}
                </span>
              )}
            </h2>

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
              <ProductPrice id={id} />
            </section>
            <Separator />
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
                  <span className="ml-4 text-sm font-medium text-neutral-700 dark:text-neutral-200">
                    {rating.quantity} Reviews
                  </span>
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

            <section aria-labelledby="options-heading" className="mt-8">
              <h3 id="options-heading" className="sr-only">
                Product options
              </h3>

              {/* The image props is necessary to pass it in the cartContext in order to display it
              in the ProductCartCard */}
              <ProductOptions
                image={image}
                prices={prices}
                name={name}
                id={id}
                stock={stock}
              />
              <p className="text-center my-4">
                <Link
                  href={`/${locale}/${category}/${productUrl}`}
                  className="font-medium text-green hover:text-light-green"
                >
                  Voir plus de détails
                </Link>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
