import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { APIResponse, categories, Product } from "@/app/types/productsTypes";
import Title from "@/app/components/Title";
import Link from "next/link";
import clsx from "clsx";

import { doesCategoryExists, findSlug, findTitle } from "@/app/utils/productFunctions";
import ProductCard from "@/app/components/products/ProductCard";
import ProductCardSkeleton from "@/app/components/products/ProductCardSkeleton";

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
      category: "fleurs",
      title: t("flower"),
      slug: "fleurs-cbd",
    },
    {
      url: "hash%20de%20cbd",
      category: "hashs",
      title: t("hash"),
      slug: "pollens-resines-hash-cbd",
    },
    {
      url: "moonrocks",
      category: "moonrocks",
      title: t("moonrock"),
      slug: "moonrocks-cbd",
    },
    { url: "huiles", category: "huiles", title: t("oil"), slug: "huiles-cbd" },
    {
      url: "infusions",
      category: "infusions",
      title: t("herbalTea"),
      slug: "infusions-cbd",
    },
    { url: "soins", category: "soins", title: t("health"), slug: "soins-cbd" },
    {
      url: "vaporisateurs",
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
  console.log(data);
  const formatedProducts: Product[] = Object.values(data.products);

  return (
    <div>
      <Title
        title={currentTitle}
        type="h1"
        classname={`relative mt-4 sm:mt-8 mb-6 2xl:pl-2 uppercase text-xl text-green font-bold tracking-widest
          after:content-['_'] after:absolute after:left-0 after:2xl:left-2 after:-bottom-1 after:h-1.5 after:w-16 after:bg-black
          dark:after:bg-white`}
        firstLetterClassname="text-4xl"
      />

      {/* NAV CATEGORY */}
      <div className="mt-5 px-5 bg-neutral-200 dark:bg-light-black flex items-center md:justify-center xl:gap-7 h-14 overflow-scroll no-scrollbar shadow-category-nav">
        {categories.map((cat) => (
          <Link
            key={cat.title}
            href={cat.slug}
            className={clsx(
              category === cat.slug ? "bg-green text-white" : "bg-none",
              "capitalize text-center text-sm xl:text-2xl py-1 px-2 rounded-md text-nowrap"
            )}
          >
            {cat.title}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap px-2 justify-center gap-2 my-8">
        {/* PRODUCT CARDS */}
        {!response.ok
          ? new Array(8).fill(0).map((e) => <ProductCardSkeleton key={Math.random()} />)
          : formatedProducts.map((prod) => <ProductCard key={prod.name} locale={locale} {...prod} />)}
      </div>
    </div>
  );
}
