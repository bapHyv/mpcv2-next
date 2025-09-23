"use client";

import Title from "@/app/components/Title";
import { sectionWrapperClassname } from "@/app/staticData/cartPageClasses";
import { APIResponse, Product } from "@/app/types/productsTypes";
import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import Link from "next/link";

interface FormatedProduct {
  name: string;
  category: string;
  analyzes: {
    cannabinoïdes: string;
  };
  image: {
    url: string;
    alt: string;
  };
}

interface State {
  [id: number]: FormatedProduct;
}

export default function Content() {
  const [products, setProducts] = useState<null | State>(null);
  const [filterQuery, setFilterQuery] = useState<string>("");
  const baseUrl = "https://api.monplancbd.fr/products";

  const t = useTranslations("analyses");
  const locale = useLocale();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(baseUrl);
        const data: APIResponse<Product> = await response.json();

        const formatedProducts = Object.values(data.products)
          .filter(Boolean)
          .filter((product) => !Array.isArray(product))
          .filter((product) => Object.entries(product.prices).length)
          .reduce((acc: State, product: Product) => {
            if ("analyzes" in product && Object.keys(product.analyzes).length) {
              console.log(product);
              acc[product.id] = {
                name: product.name,
                category: product.category,
                image: {
                  url: product.images.main ? product.images.main.url : "",
                  alt: product.images.main ? product.images.main.alt : "",
                },
                analyzes: {
                  cannabinoïdes: product.analyzes["cannabinoïdes"],
                },
              };
            }

            return acc;
          }, {} as State);

        setProducts(formatedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products
    ? Object.entries(products).filter(([id, product]) => product.name.toLowerCase().includes(filterQuery.toLowerCase()))
    : [];

  const skeleton = new Array(16)
    .fill(0)
    .map((_, i) => <div key={`${_}-${i}`} className="w-full h-[46px] bg-neutral-300 animate-pulse rounded-md shadow-md mb-2"></div>);

  return (
    <div className={twMerge("container mx-auto px-4 sm:px-6 lg:px-8 mt-0")}>
      <Title
        title={t("title")}
        type="h1"
        classname={clsx("relative mt-6 mb-8 uppercase text-xl text-green text-center font-bold tracking-widest", "sm:mt-10", "2xl:pl-2")}
        firstLetterClassname="text-4xl"
      />
      <div className="text-justify m-auto md:w-5/6 lg:w-4/6">
        <p>{t("text.part1")}</p>
        <p className="mt-6">{t("text.part2")}</p>
      </div>
      <div className="relative mt-8 mb-4 m-auto md:w-2/3 lg:w-1/2 2xl:w-1/3">
        <input
          type="text"
          value={filterQuery}
          // We will add the onChange handler in the next step
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder={t("filterPlaceholder")}
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green focus:border-green"
        />
      </div>
      <div className={twMerge(sectionWrapperClassname, "m-auto mt-6", "md:w-2/3 lg:w-1/2 2xl:w-1/3")}>
        {!!products
          ? filteredProducts.map(([id, product]: [string, FormatedProduct]) => (
              <div key={id} className="flex w-full border rounded-md shadow-md mb-2">
                <div className="relative flex-shrink-0 w-[46px] h-[46px] 2xl:w-[92px] 2xl:h-[92px]">
                  <Image
                    className="rounded-l-md"
                    src={!!product.image.url ? `https://www.monplancbd.fr/wp-content/uploads/${product.image.url}` : "/canna-vert.png"}
                    alt={!!product.image.alt ? product.image.alt : product.name}
                    fill
                    sizes="(max-width: 640px) 20vw, 15vw"
                  />
                </div>
                <div className=" flex justify-center items-center p-2">
                  <Link
                    href={`https://www.monplancbd.fr/${locale}/analyses/${product.analyzes["cannabinoïdes"]}`}
                    className="text-xs 2xl:text-sm text-green underline flex gap-1"
                  >
                    {product.name}
                  </Link>
                </div>
              </div>
            ))
          : skeleton}
      </div>
    </div>
  );
}
