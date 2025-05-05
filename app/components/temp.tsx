import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { APIResponse, categories, Product } from "@/app/types/productsTypes";
import Title from "@/app/components/Title";
import clsx from "clsx";

import { doesCategoryExists, findSlug, findTitle } from "@/app/utils/productFunctions";
import ProductCard from "@/app/components/products/ProductCard";
import ProductCardSkeleton from "@/app/components/products/ProductCardSkeleton";
import Link from "next/link";
import OtherNavbar from "@/app/components/OtherNavbar";
import { twMerge } from "tailwind-merge";
import { titleClassname } from "@/app/staticData/cartPageClasses";

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
    { url: "soins", urlTitle: `🧴 ${t("health")}`, category: "soins", title: t("health"), slug: "soins-cbd" },
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

  return <div className="space-y-3"></div>;
}
