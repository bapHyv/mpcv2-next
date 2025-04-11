import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { APIResponse, categories, Product } from "@/app/types/productsTypes";
import Title from "@/app/components/Title";
import clsx from "clsx";

import { doesCategoryExists, findSlug, findTitle } from "@/app/utils/productFunctions";
import ProductCard from "@/app/components/products/ProductCard";
import ProductCardSkeleton from "@/app/components/products/ProductCardSkeleton";
import Link from "next/link";

interface Params {
  params: {
    locale: string;
    category: string;
  };
}

export default async function Page({ params: { locale, category } }: Params) {
  const t = await getTranslations({ locale, namespace: "category" });

  const categories: categories = [
    {
      url: "fleurs%20de%20cbd",
      urlTitle: `🌿 ${t("flower")}`,
      category: "fleurs",
      title: t("flower"),
      slug: "fleurs-cbd",
    },
    {
      url: "hash%20de%20cbd",
      urlTitle: `🍫 ${t("hash")}`,
      category: "hashs",
      title: t("hash"),
      slug: "pollens-resines-hash-cbd",
    },
    {
      url: "moonrocks",
      urlTitle: `🌠 ${t("moonrock")}`,
      category: "moonrocks",
      title: t("moonrock"),
      slug: "moonrocks-cbd",
    },
    { url: "huiles", urlTitle: `💧 ${t("oil")}`, category: "huiles", title: t("oil"), slug: "huiles-cbd" },
    {
      url: "infusions",
      urlTitle: `🌱 ${t("herbalTea")}`,
      category: "infusions",
      title: t("herbalTea"),
      slug: "infusions-cbd",
    },
    { url: "soins", urlTitle: `🌿 ${t("health")}`, category: "soins", title: t("health"), slug: "soins-cbd" },
    {
      url: "vaporisateurs",
      urlTitle: `💨 ${t("vaporizer")}`,
      category: "vaporisateurs",
      title: t("vaporizer"),
      slug: "vaporisateur",
    },
  ];

  if (!doesCategoryExists(categories, category)) notFound();

  const currentTitle = findTitle(categories, category);

  const currentSlug = findSlug(categories, category);

  const response = await fetch(`${process.env.API_HOST}/products/${currentSlug}`);
  const data: APIResponse<Product> = await response.json();
  const formatedProducts: Product[] = Object.values(data.products);

  return (
    <div>
      {/* NAV CATEGORY */}
      <div
        className={clsx(
          "fixed z-[1000] bottom-[58px] px-5 animate-slide-in-bottom bg-gradient-to-t from-black via-black via-60% to-green flex items-center h-10 w-full max-w-[1920px] overflow-y-scroll no-scrollbar ",
          "md:top-[88px] md:bottom-auto md:justify-between md:h-14 md:animate-slide-in-top md:bg-gradient-to-b md:via-70%"
        )}
      >
        {categories.map((cat) => (
          <Link
            key={cat.title}
            href={cat.slug}
            className={clsx(
              category === cat.slug ? "text-green font-medium" : "text-white",
              "capitalize text-center text-sm py-1 px-2 rounded-md text-nowrap",
              "xl:text-xl"
            )}
          >
            {cat.urlTitle}
          </Link>
        ))}
      </div>

      <Title
        title={currentTitle}
        type="h1"
        classname={clsx("relative my-4 uppercase text-xl text-green text-center font-bold tracking-widest", "sm:mt-8", "2xl:pl-2")}
        firstLetterClassname="text-4xl"
      />

      <div className="flex flex-wrap px-2 justify-center gap-2 mb-8">
        {/* PRODUCT CARDS */}
        {!response.ok
          ? new Array(8).fill(0).map((e) => <ProductCardSkeleton key={Math.random()} />)
          : formatedProducts.map((prod) => <ProductCard key={prod.name} locale={locale} {...prod} />)}
      </div>
    </div>
  );
}
