import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

interface Params {
  params: {
    locale: string;
    category: string;
  };
}

// TODO category ici
const categories = [
  "fleurs%20de%20cbd",
  "hash%20de%20cbd",
  "moonrock",
  "huiles",
  "infusions",
  "soins",
  "vaporisateur",
];

export async function generateMetadata({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "category" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export async function generateStaticParams() {
  return categories.map((category) => ({ category }));
}

export default async function Page({ params: { locale, category } }: Params) {
  // TODO fetch categories here
  if (!categories.includes(category)) notFound();

  const t = await getTranslations({ locale, namespace: "category" });

  return (
    <div>
      <h1>{t("title")}</h1>
      <h2>{category}</h2>
    </div>
  );
}
