import { StarIcon } from "@heroicons/react/20/solid";
import { getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import ProductOptions from "@/app/components/products/ProductOptions";
import { BaseProduct, Hash, Moonrock, Oil, Flower, Cannabinoids, Terpenes } from "@/app/types/productsTypes";
import { findHighest, findHighestOption, returnRenamedGrowingMethod } from "@/app/utils/productFunctions";

export default async function ProductCard({
  id,
  images,
  pricesPer,
  isPromo,
  name,
  prices,
  stock,
  ratings,
  cannabinoids,
  locale,
  category,
  mainDivClassname,
  secondeDivClassname,
  slug,
  growingMethod,
  country,
}: (BaseProduct | Oil | Hash | Moonrock | Flower) & {
  locale: string;
  category: string;
  cannabinoids?: Cannabinoids;
  grower?: string;
  terpenes?: Terpenes;
  mainDivClassname?: string;
  secondeDivClassname?: string;
  growingMethod?: "Extérieur" | "Sous-serre" | "Intérieur";
  country?: "af" | "ch" | "en" | "es" | "fr" | "it" | "lb" | "ma" | "np" | "usa";
}) {
  const t = await getTranslations({ locale, namespace: "category" });

  const cannabinoidRating = findHighest(cannabinoids);
  const cannabinoidColor = !cannabinoidRating
    ? null
    : cannabinoidRating.name === "CBD"
    ? "emerald"
    : cannabinoidRating.name === "CBG"
    ? "purple"
    : cannabinoidRating.name === "CBN"
    ? "yellow"
    : "neutral";

  const highestOption = findHighestOption(prices);

  const renamedGrowindMethod = returnRenamedGrowingMethod(growingMethod);

  return (
    <div className={twMerge(clsx("transform text-left text-base transition w-[336px] sm:w-[306px] lg:w-[25rem]"), mainDivClassname)}>
      <div className="flex overflow-hidden px-2 py-2 rounded-md shadow-product-cards bg-purl">
        <div className={twMerge(clsx(secondeDivClassname))}>
          {/* IMAGE */}
          <div className="relative m-auto rounded-lg h-min">
            {
              <Link href={`/${category}/${slug}`}>
                <div className={clsx(!parseInt(stock) ? "opacity-60" : "", "w-[320px] h-56 sm:w-[290px] sm:h-[200px] lg:w-96 lg:h-72")}>
                  <Image
                    alt={!!images.main ? images.main.alt : "image placeholder"}
                    src={!!images.main ? `${process.env.MAIN_URL}${process.env.IMG_HOST}${images.main.url}` : "/logo-noir.png"}
                    className="rounded-md object-cover w-[320px] h-56 sm:w-[290px] sm:h-[200px] lg:w-96 lg:h-72"
                    width={1080}
                    height={1920}
                  />
                </div>
              </Link>
            }

            {/* PROMO or OUT OF STOCK CHIP */}
            {!parseInt(stock) ? (
              <div className="absolute right-5 top-5 p-1 text-sm rounded-md text-white bg-red-600">{t("outOfStock")}</div>
            ) : isPromo ? (
              <div className="absolute right-5 top-5 p-1 text-sm rounded-md animate-tada text-white bg-green">{t("promo")}</div>
            ) : null}

            {/* COUNTRY and GROWING METHOD */}
            <div className="absolute top-2 left-2 flex items-center gap-1">
              {country && (
                <div className="w-6">
                  <Image src={`/${country}.png`} alt={`Drapeau ${country}`} width={20} height={20} />
                </div>
              )}
              {renamedGrowindMethod && (
                <div className="w-6">
                  <Image src={`/${renamedGrowindMethod}.png`} alt={`Méthode de culture: ${growingMethod}`} width={30} height={30} />
                </div>
              )}
            </div>

            {cannabinoidRating && (
              <div className="absolute w-full bottom-2 flex items-center justify-center">
                <div
                  className={`text-xs text-center px-1 py-0.5 rounded-full bg${cannabinoidColor}100 border border${cannabinoidColor}700 text${cannabinoidColor}700`}
                >
                  <span>
                    {cannabinoidRating.name}: {cannabinoidRating.value}%
                  </span>
                </div>
              </div>
            )}
          </div>

          <section aria-labelledby="information-heading" className="text-center mt-2 flex flex-col gap-1 xl:mt-6">
            {/* PRODUCT NAME */}
            <h2
              className={clsx(
                "text-base text-center max-w-[320px] font-medium text-neutral-900 text-ellipsis overflow-hidden text-nowrap",
                "sm:max-w-[290px]",
                "lg:max-w-96",
                "xl:text-xl",
                "dark:text-neutral-100"
              )}
            >
              {name}
            </h2>

            {/* PRODUCT PRICE FROM & PRODUCT PRICE */}
            <h3 id="information-heading" className="sr-only">
              Product information
            </h3>

            {/* PRICE / UNIT */}
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
              {t("fromPrice")} {(highestOption.price / highestOption.quantity).toFixed(2)}
              €/{pricesPer}
            </p>

            {/* RATING - REVIEWS */}
            {!!ratings.amount ? (
              <div className="flex justify-center">
                <h4 className="sr-only">Reviews</h4>
                <div className="flex items-center">
                  {/*  */}
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((ratingStar) => (
                      <StarIcon
                        key={ratingStar}
                        aria-hidden="true"
                        className={clsx(Math.round(ratings.value) > ratingStar ? "text-yellow-400" : "text-gray-200", "h-5 w-5 flex-shrink-0 mb-1")}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium text-neutral-700 dark:text-neutral-200">
                    ({ratings.amount} {t("reviews")})
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <h4 className="sr-only">Reviews</h4>
                <div className="flex items-center">
                  {/*  */}
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((ratingStar) => (
                      <StarIcon key={ratingStar} aria-hidden="true" className={clsx("text-gray-200", "h-5 w-5 flex-shrink-0 mb-1")} />
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium text-neutral-700 dark:text-neutral-200">(0 {t("reviews")})</span>
                </div>
              </div>
            )}
          </section>

          {/* PRODUCT OPTIONS */}
          <section aria-labelledby="options-heading" className="">
            <h3 id="options-heading" className="sr-only">
              Product options
            </h3>

            <ProductOptions
              pricesPer={pricesPer}
              image={images.main}
              prices={prices}
              name={name}
              id={id}
              stock={stock}
              slug={slug}
              category={category}
              isInModale={false}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
