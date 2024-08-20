import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ProductCard from "@/app/components/products/ProductCard";
import products from "@/app/fakeData/products.json";
import {
  Cannabinoids,
  Category,
  Prices,
  Product,
  Products,
  Terpenes,
  categories,
} from "@/app/types/productsTypes";

interface Params {
  params: {
    locale: string;
    category: string;
  };
}

function doesCategoryExists(categories: categories, category: string) {
  return categories.find((e) => e.url === category);
}

function findCategory(categories: categories, category: string) {
  return categories.filter((cat) => cat.url === category);
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
  const categories: categories = [
    { url: "fleurs%20de%20cbd", category: "fleurs" },
    { url: "hash%20de%20cbd", category: "hashs" },
    { url: "moonrocks", category: "moonrocks" },
    { url: "huiles", category: "huiles" },
    { url: "infusions", category: "infusions" },
    { url: "soins", category: "soins" },
    { url: "vaporisateurs", category: "vaporisateurs" },
  ];
  // TODO fetch categories here
  if (!doesCategoryExists(categories, category)) notFound();

  const currentCategory = findCategory(categories, category)[0].category;

  const currentProducts = products[currentCategory];

  const t = await getTranslations({ locale, namespace: "category" });

  return (
    <div>
      <h1>{t("title")}</h1>
      <h2>{category}</h2>
      {currentProducts.map((prod) => (
        <ProductCard key={prod.name} {...prod} />
      ))}
    </div>
  );
}
