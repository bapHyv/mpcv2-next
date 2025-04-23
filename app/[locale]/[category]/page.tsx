import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

import { APIResponse, categories as ICategories, Product } from "@/app/types/productsTypes";
import Title from "@/app/components/Title";
import { doesCategoryExists, findSlug, findTitle } from "@/app/utils/productFunctions";
import ProductCard from "@/app/components/products/ProductCard";
import ProductCardSkeleton from "@/app/components/products/ProductCardSkeleton";
import OtherNavbar from "@/app/components/OtherNavbar";
import Separator from "@/app/components/Separator";
import { linkClassname, titleClassname } from "@/app/staticData/cartPageClasses";

interface Params {
  params: {
    locale: string;
    category: string;
  };
}

async function getCategories(locale: string): Promise<ICategories> {
  const t = await getTranslations({ locale, namespace: "category" });
  return [
    { url: "fleurs%20de%20cbd", urlTitle: `🌿 ${t("flower")}`, category: "fleurs", title: t("flower"), slug: "fleurs-cbd" },
    { url: "hash%20de%20cbd", urlTitle: `🍫 ${t("hash")}`, category: "hashs", title: t("hash"), slug: "pollens-resines-hash-cbd" },
    { url: "moonrocks", urlTitle: `🌠 ${t("moonrock")}`, category: "moonrocks", title: t("moonrock"), slug: "moonrocks-cbd" },
    { url: "huiles", urlTitle: `💧 ${t("oil")}`, category: "huiles", title: t("oil"), slug: "huiles-cbd" },
    { url: "infusions", urlTitle: `🌱 ${t("herbalTea")}`, category: "infusions", title: t("herbalTea"), slug: "infusions-cbd" },
    { url: "soins", urlTitle: `🌿 ${t("health")}`, category: "soins", title: t("health"), slug: "soins-cbd" },
    { url: "vaporisateurs", urlTitle: `💨 ${t("vaporizer")}`, category: "vaporisateurs", title: t("vaporizer"), slug: "vaporisateur" },
  ];
}

async function getCategoryProducts(categorySlug: string): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.API_HOST}/products/${categorySlug}`);
    if (!response.ok) {
      console.error(`Failed to fetch ${categorySlug}: ${response.status}`);
      return [];
    }
    const data: APIResponse<Product> = await response.json();
    return Object.values(data.products).filter((p) => p && p.stock && parseInt(p.stock, 10) > 0);
  } catch (error) {
    console.error(`Error fetching ${categorySlug}:`, error);
    return [];
  }
}

interface GenerateMetadataParams {
  params: {
    locale: string;
    category: string;
  };
}

export async function generateMetadata({ params: { category: categorySlug, locale } }: GenerateMetadataParams): Promise<Metadata> {
  const categories = await getCategories(locale);
  if (!doesCategoryExists(categories, categorySlug)) {
    notFound();
  }
  const currentCategoryObject = categories.find((cat) => cat.slug === categorySlug);
  if (!currentCategoryObject) {
    notFound();
  }
  const currentTitle = currentCategoryObject.title;

  let tContent, tGlobal;
  try {
    tContent = await getTranslations({ locale, namespace: `categoryPageContent.${categorySlug}` });
    tGlobal = await getTranslations({ locale, namespace: "global" });
  } catch (error) {
    console.error(`Error fetching translations for locale ${locale}, category ${categorySlug}:`, error);
    notFound();
  }

  const brandName = tGlobal("brandName");
  const siteBaseUrl = process.env.MAIN_URL || "https://www.monplancbd.fr";
  const canonicalUrl = `${siteBaseUrl}/${locale}/${categorySlug}`;
  const metaDescription = tContent("descriptionMetaTag") || tContent("descriptionPara1").substring(0, 157) + "...";
  const ogImageUrl = `${siteBaseUrl}/og-image-${categorySlug}.jpg`;
  const fallbackOgImageUrl = `${siteBaseUrl}/og-image-default.jpg`;
  const finalOgImageUrl = ogImageUrl.includes("undefined") ? fallbackOgImageUrl : ogImageUrl;

  const title = `${currentTitle} | ${brandName} - Acheter ${currentTitle} de Qualité`;

  const actionVerb = locale === "fr" ? "acheter" : locale === "en" ? "buy" : "comprar";

  const keywordsArray = [currentTitle, `${actionVerb} ${currentTitle}`, `${currentTitle} France`, "CBD", brandName, categorySlug];

  const uniqueKeywords = [...new Set(keywordsArray.filter(Boolean))];
  const keywords = uniqueKeywords.join(", ");
  const locales = ["en_US", "es_ES", "fr_FR"];
  const alternatesLanguages: { [key: string]: string } = {};

  locales.forEach((altLocale) => {
    const langCode = altLocale.split("_")[0];
    if (langCode !== locale) {
      alternatesLanguages[altLocale.replace("_", "-")] = `${siteBaseUrl}/${langCode}/${categorySlug}`;
    }
  });

  return {
    title: title,
    description: metaDescription,
    keywords: keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: alternatesLanguages,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: title,
      description: metaDescription,
      url: canonicalUrl,
      siteName: brandName,
      images: [
        {
          url: finalOgImageUrl,
          width: 1200,
          height: 630,
          alt: `Acheter ${currentTitle} CBD de Qualité | ${brandName}`,
        },
      ],
      locale: locale.replace("-", "_"),
      alternateLocale: locales.filter((alt) => alt !== locale.replace("-", "_")),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: metaDescription,
      images: [finalOgImageUrl],
    },
  };
}

export default async function CategoryPage({ params: { locale, category } }: Params) {
  const categories = await getCategories(locale);
  if (!doesCategoryExists(categories, category)) {
    notFound();
  }

  const currentTitle = findTitle(categories, category);
  const currentSlug = findSlug(categories, category);

  const t = await getTranslations({ locale });

  const products = await getCategoryProducts(currentSlug);

  const productCardsSkeleton = new Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={`skeleton-${i}`} />);

  return (
    <div className="md:pt-10">
      {/* Category Navigation Bar */}
      <OtherNavbar className="xl:justify-center">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/${locale}/${cat.slug}`}
            className={twMerge(
              "capitalize text-center text-sm py-1 px-3 mx-1 rounded-md text-nowrap whitespace-nowrap transition-colors duration-150 ease-in-out hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white",
              category === cat.slug ? "font-medium text-green bg-white/10 ring-1 ring-green/50" : "text-white"
            )}
          >
            {cat.urlTitle}
          </Link>
        ))}
      </OtherNavbar>
      {/* Main Category Title */}
      <Title
        title={currentTitle}
        type="h1"
        classname={twMerge(titleClassname, "mt-8 mb-6 md:mt-10 text-green text-center")}
        firstLetterClassname="text-xl"
      />
      {/* Product Grid Container */}
      <div className="flex flex-wrap px-2 justify-center gap-4 mb-8 md:mb-12">
        {products.length > 0
          ? products.map((prod) => <ProductCard key={prod.id} locale={locale} {...prod} category={currentSlug} />)
          : productCardsSkeleton}
      </div>
      <section aria-labelledby="category-content-heading" className="py-10 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Separator />
          <Title
            id="category-content-heading"
            type="h2"
            title={t(`categoryPageContent.${currentSlug}.sectionTitle`, { categoryName: currentTitle })}
            classname="text-2xl md:text-3xl font-bold text-center my-8 text-gray-800"
          />
          {/* Main Description */}
          <div className="prose prose-sm sm:prose-base max-w-none mx-auto text-gray-700 space-y-4 mb-8 md:mb-12 text-justify">
            <p>{t(`categoryPageContent.${currentSlug}.descriptionPara1`)}</p>
            <p>{t(`categoryPageContent.${currentSlug}.descriptionPara2`)}</p>
          </div>
          {t(`categoryPageContent.${currentSlug}.benefitsTitle`) !== `categoryPageContent.${currentSlug}.benefitsTitle` && (
            <>
              <Title
                type="h3"
                title={t(`categoryPageContent.${currentSlug}.benefitsTitle`)}
                classname="text-xl md:text-2xl font-semibold text-center mb-6 text-gray-800"
              />
              <ul className="list-disc list-inside space-y-2 mb-8 md:mb-12 text-gray-700">
                <li>{t(`categoryPageContent.${currentSlug}.benefitsItem1`)}</li>
                <li>{t(`categoryPageContent.${currentSlug}.benefitsItem2`)}</li>
                <li>{t(`categoryPageContent.${currentSlug}.benefitsItem3`)}</li>
                <li>{t(`categoryPageContent.${currentSlug}.benefitsItem4`)}</li>
                <li>{t(`categoryPageContent.${currentSlug}.benefitsItem5`)}</li>
              </ul>
            </>
          )}
          {t(`categoryPageContent.${currentSlug}.faqTitle`) !== `categoryPageContent.${currentSlug}.faqTitle` && (
            <>
              <Title
                type="h3"
                title={t(`categoryPageContent.${currentSlug}.faqTitle`)}
                classname="text-xl md:text-2xl font-semibold text-center mb-6 text-gray-800"
              />
              <dl className="space-y-6">
                <div>
                  <dt className="font-semibold text-gray-900">{t(`categoryPageContent.${currentSlug}.faq1Question`)}</dt>
                  <dd className="mt-1 text-gray-700">{t(`categoryPageContent.${currentSlug}.faq1Answer`)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-900">{t(`categoryPageContent.${currentSlug}.faq2Question`)}</dt>
                  <dd className="mt-1 text-gray-700">{t(`categoryPageContent.${currentSlug}.faq2Answer`)}</dd>
                </div>
              </dl>
            </>
          )}
          <div className="mt-10 text-center">
            <p className="text-gray-600 mb-4">{t(`categoryPageContent.${currentSlug}.moreInfoText`)}</p>
            <Link href={`/${locale}/blog`} legacyBehavior>
              <a className={twMerge(linkClassname, "text-base font-medium inline-flex items-center")}>
                {t(`categoryPageContent.${currentSlug}.blogLinkText`)}{" "}
                <span aria-hidden="true" className="ml-1">
                  →
                </span>
              </a>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
