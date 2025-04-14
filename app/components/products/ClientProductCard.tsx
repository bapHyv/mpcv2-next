"use client";

import { StarIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useTranslations } from "next-intl";

import { findHighest, findHighestOption, returnRenamedGrowingMethod } from "@/app/utils/productFunctions";
import ProductOptions from "./ProductOptions";
import { Product, Cannabinoids, Terpenes, Image as ImageType } from "@/app/types/productsTypes";
import { linkClassname, statusBadgeBase } from "@/app/staticData/cartPageClasses";

export default function ClientProductCard({
  id,
  images,
  pricesPer,
  isPromo,
  name,
  prices,
  stock,
  ratings,
  cannabinoids,
  category,
  mainDivClassname,
  secondeDivClassname,
  slug,
  growingMethod,
  country,
}: Product & {
  category: string;
  mainDivClassname?: string;
  secondeDivClassname?: string;
  cannabinoids?: Cannabinoids;
  grower?: string;
  terpenes?: Terpenes;
  growingMethod?: "Extérieur" | "Sous-serre" | "Intérieur";
  country?: "af" | "ch" | "en" | "es" | "fr" | "it" | "lb" | "ma" | "np" | "usa";
}) {
  const t = useTranslations("category");

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
  const currentStock = parseInt(stock || "0", 10);
  const isOutOfStock = isNaN(currentStock) || currentStock <= 0;

  const mainImage: ImageType = images?.main ?? { url: "/placeholder.png", alt: name };

  return (
    <div className={twMerge("transform text-left text-base transition w-[336px] sm:w-[306px] lg:w-[25rem] flex-shrink-0", mainDivClassname)}>
      <div
        className={twMerge(
          "flex flex-col h-full overflow-hidden p-3 rounded-lg shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-150 ease-in-out", // Consistent card styling
          secondeDivClassname
        )}
      >
        <div className="relative mb-3">
          <Link href={`/${category}/${slug}`} className="block group">
            <div
              className={clsx("relative w-full overflow-hidden rounded-md bg-gray-100", "aspect-w-1 aspect-h-1", isOutOfStock ? "opacity-65" : "")}
            >
              <Image
                alt={!!images.main ? images.main.alt : "Image placeholder"}
                src={!!images.main ? `https://www.monplancbd.fr/wp-content/uploads/${images.main.url}` : "/logo-noir.png"}
                fill
                sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 33vw"
                className="object-cover object-center group-hover:opacity-75 transition-opacity"
                priority={false}
              />
            </div>
          </Link>

          {/* Overlay Chips */}
          <div className="absolute top-2 right-2 z-10">
            {isOutOfStock ? (
              <span className={twMerge(statusBadgeBase, "bg-red-100 text-red-800")}>{t("outOfStock")}</span>
            ) : isPromo ? (
              <span className={twMerge(statusBadgeBase, "bg-green text-white animate-tada")}>{t("promo")}</span>
            ) : null}
          </div>

          <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
            {country && (
              <div className="overflow-hidden shadow-sm">
                <Image src={`/${country}.png`} alt={`Drapeau ${country}`} width={24} height={24} className="object-cover" />
              </div>
            )}
            {renamedGrowindMethod && (
              <div className="w-6 h-6 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-full shadow-sm">
                <Image src={`/${renamedGrowindMethod}.png`} alt={`Culture: ${growingMethod}`} width={18} height={18} />
              </div>
            )}
          </div>

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
          <Link href={`/${category}/${slug}`} className="block mb-1 group">
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

          {/* RATING - REVIEWS */}
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
            <span className="ml-2 text-xs font-medium text-gray-500">
              ({ratings?.amount ?? 0} {t("reviews")})
            </span>
          </div>
        </section>

        <section aria-labelledby={`options-${id}`} className="mt-auto flex-shrink-0">
          <h3 id={`options-${id}`} className="sr-only">
            Product options
          </h3>
          <ProductOptions
            pricesPer={pricesPer}
            image={mainImage}
            prices={prices}
            name={name}
            id={id}
            stock={stock}
            slug={slug}
            category={category}
            isInModale={true}
          />
        </section>
      </div>
    </div>
  );
}
