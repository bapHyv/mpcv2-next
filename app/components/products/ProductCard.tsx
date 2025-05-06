import { StarIcon } from "@heroicons/react/20/solid";
import { getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import ProductOptions from "@/app/components/products/ProductOptions";
import { BaseProduct, Hash, Moonrock, Oil, Flower, Cannabinoids, Terpenes } from "@/app/types/productsTypes";
import { findHighest, findHighestOption, returnRenamedGrowingMethod } from "@/app/utils/productFunctions";
import { statusBadgeBase } from "@/app/staticData/cartPageClasses";

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
  const cannabinoidColorClasses = !cannabinoidRating
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
  const isOutOfStock = !parseInt(stock);

  const codeToCountry = {
    af: "Afghanistan",
    ch: "Suisse",
    en: "Royaume-unis",
    es: "Espagne",
    fr: "France",
    it: "Italie",
    lb: "Liban",
    ma: "Maroc",
    np: "Nepal",
    usa: "États-unis",
  };

  return (
    <div className={twMerge("transform text-left text-base transition w-[336px] sm:w-[306px] lg:w-[25rem] flex-shrink-0", mainDivClassname)}>
      <div
        className={twMerge(
          "flex flex-col h-full overflow-hidden p-3 rounded-lg shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-150 ease-in-out",
          secondeDivClassname
        )}
      >
        <div className="relative mb-3">
          <Link href={`/${category}/${slug}`} className="block">
            <div
              className={clsx("relative w-full overflow-hidden rounded-md bg-gray-100", "aspect-w-1 aspect-h-1", isOutOfStock ? "opacity-65" : "")}
            >
              <Image
                alt={!!images.main ? images.main.alt : name}
                src={!!images.main ? `${process.env.MAIN_URL}${process.env.IMG_HOST}${images.main.url}` : "/logo-noir.png"}
                fill
                sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 33vw"
                className="object-cover object-center group-hover:opacity-75 transition-opacity"
                priority={false}
              />
            </div>
          </Link>
          <div className="absolute top-2 right-2 z-10">
            {isOutOfStock ? (
              <span className={twMerge(statusBadgeBase, "bg-red-100 text-red-800")}>{t("outOfStock")}</span>
            ) : isPromo ? (
              <Link href={`/${category}/${slug}`}>
                <span className={twMerge(statusBadgeBase, "bg-green text-white animate-tada cursor-pointer")}>{t("promo")}</span>
              </Link>
            ) : null}
          </div>
          {/* <div className="absolute bottom-2 left-2 flex items-end justify-end gap-1.5 z-10">
            {country && (
              <div className="h-full flex items-center justify-center shadow-sm has-tooltip group">
                <Image className="tooltip-trigger" src={`/${country}.png`} alt={`Drapeau ${country}`} width={30} height={30} />
                <span className="tooltip tooltip-product-attribute">Provenance: {codeToCountry[country]}</span>
              </div>
            )}
            {renamedGrowindMethod && (
              <div className="w-6 h-6 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-full shadow-sm has-tooltip group">
                <Image className="tooltip-trigger" src={`/${renamedGrowindMethod}.png`} alt={`Culture: ${growingMethod}`} width={25} height={25} />
                <span className="tooltip tooltip-product-attribute">Méthode de culture: {growingMethod}</span>
              </div>
            )}
          </div> */}
          {cannabinoidRating && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10">
              <span
                className={`${twMerge(
                  statusBadgeBase,
                  `bg${cannabinoidColorClasses}100 border${cannabinoidColorClasses}700 text${cannabinoidColorClasses}700`,
                  "border"
                )}`}
              >
                {cannabinoidRating.name}: {cannabinoidRating.value}%
              </span>
            </div>
          )}
        </div>

        <section aria-labelledby={`info-${id}`} className="text-center flex flex-col flex-grow">
          <Link href={`/${locale}/${category}/${slug}`} className="mb-1 group w-4/5 m-auto">
            <h2
              id={`info-${id}`}
              className={clsx("text-base font-semibold text-gray-900 truncate group-hover:text-green transition-colors", "xl:text-lg")}
              title={name}
            >
              {name}
            </h2>
          </Link>

          <p className="text-sm text-gray-500 mb-2">
            {t("fromPrice")} {(highestOption.price / highestOption.quantity).toFixed(2)}
            €/{pricesPer}
          </p>

          <div className="flex justify-center items-center mb-3">
            <h4 className="sr-only">Reviews</h4>
            <div className="flex items-center">
              {[0, 1, 2, 3, 4].map((ratingStar) => (
                <StarIcon
                  key={ratingStar}
                  aria-hidden="true"
                  className={clsx(
                    ratings?.value && Math.round(ratings.value) > ratingStar ? "text-yellow-400" : "text-gray-300",
                    "h-4 w-4 flex-shrink-0"
                  )}
                />
              ))}
            </div>
            <Link href={{ pathname: `/${locale}/${category}/${slug}`, hash: "review-form" }}>
              <span className="ml-2 text-xs font-medium text-gray-500 underline">
                ({ratings?.amount ?? 0} {t("reviews")})
              </span>
            </Link>
          </div>
        </section>

        <section aria-labelledby={`options-${id}`} className="mt-auto flex-shrink-0">
          <h3 id={`options-${id}`} className="sr-only">
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
  );
}
