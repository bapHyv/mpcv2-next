import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

interface Params {
  params: {
    locale: string;
    product: string;
  };
}

const products = ["bonne_fleur_sa_mere", "fleur_4000", "diamond"];

export async function generateMetadata({
  params: { locale, product },
}: Params) {
  const t = await getTranslations({ locale, namespace: "category" });
  return {
    title: product,
    description: t("description"),
  };
}

export async function generateStaticParams() {
  return products.map((product) => ({ product }));
}

export default async function Page({ params: { locale, product } }: Params) {
  // TODO fetch products here. Use the category
  // if (!products.includes(product)) notFound();

  // const t = await getTranslations({ locale, namespace: "product" });

  return (
    <div>
      <h1>{product}</h1>
    </div>
  );
}
