import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import products from "@/app/fakeData/products.json";
import { categories } from "@/app/types/productsTypes";
import Title from "@/app/components/Title";
import Link from "next/link";
import clsx from "clsx";

import {
  doesCategoryExists,
  findCategory,
  findTitle,
} from "@/app/utils/productFunctions";
import ProductCard from "@/app/components/products/ProductCard";

interface Params {
  params: {
    locale: string;
    category: string;
  };
}

export async function generateMetadata({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "category" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function Page({ params: { locale, category } }: Params) {
  // TODO category ici
  const t = await getTranslations({ locale, namespace: "category" });

  const categories: categories = [
    { url: "fleurs%20de%20cbd", category: "fleurs", title: t("flower") },
    { url: "hash%20de%20cbd", category: "hashs", title: t("hash") },
    { url: "moonrocks", category: "moonrocks", title: t("moonrock") },
    { url: "huiles", category: "huiles", title: t("oil") },
    { url: "infusions", category: "infusions", title: t("herbalTea") },
    { url: "soins", category: "soins", title: t("health") },
    { url: "vaporisateurs", category: "vaporisateurs", title: t("vaporizer") },
  ];
  // TODO fetch categories here
  if (!doesCategoryExists(categories, category)) notFound();

  const currentCategory = findCategory(categories, category);

  const currentTitle = findTitle(categories, category);

  const currentProducts = products[currentCategory];

  return (
    <div>
      <Title
        title={currentTitle}
        type="h1"
        classname="bg-green text-white text-6xl py-5 text-center"
      />

      {/* NAV CATEGORY */}
      <div className="mt-5 px-5 bg-neutral-200 dark:bg-light-black flex items-center md:justify-center xl:gap-7 h-14 overflow-scroll no-scrollbar">
        {categories.map((cat) => (
          <Link
            key={cat.title}
            href={cat.url}
            className={clsx(
              category === cat.url ? "bg-green text-white" : "bg-none",
              "capitalize text-center text-sm xl:text-2xl py-1 px-2 rounded-md text-nowrap"
            )}
          >
            {cat.title}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4 px-2">
        {/* PRODUCT FILTERS */}
        {/* <ProductFilter
        currentCategory={currentCategory}
        locale={locale}
        products={products}
        currentProduct={currentProducts}
        setCurrentProducts={setCurrentProducts}
      /> */}

        {/* PRODUCT CARDS */}
        {currentProducts.map((prod) => (
          <ProductCard
            key={prod.name}
            locale={locale}
            category={category}
            {...prod}
          />
        ))}
      </div>
    </div>
  );
}
