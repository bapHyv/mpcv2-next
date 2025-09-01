import type { Metadata } from "next";

import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import { v4 as uuid } from "uuid";

import HeroCarousel from "@/app/components/HeroCarousel";
import Carousel from "@/app/components/Carousel";
import ProductCard from "@/app/components/products/ProductCard";
import ProductCardSkeleton from "@/app/components/products/ProductCardSkeleton";
import Title from "@/app/components/Title";
import Separator from "@/app/components/Separator";

import {
  ShieldCheckIcon,
  TruckIcon,
  NewspaperIcon,
  ChatBubbleLeftRightIcon,
  BeakerIcon,
  ScaleIcon,
  GiftIcon,
  ArrowUturnLeftIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

import { APIResponse, Product } from "@/app/types/productsTypes";
import { linkClassname, titleClassname as baseTitleClassname } from "@/app/staticData/cartPageClasses";
import TrustpilotScore from "@/app/components/homepage/TrustpilotScore";

interface GenerateMetadataParams {
  params: {
    locale: string;
  };
}

export async function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }, { locale: "es" }];
}

export async function generateMetadata({ params }: GenerateMetadataParams): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale });

  const siteBaseUrl = process.env.MAIN_URL || "https://www.monplancbd.fr";
  const homepageUrl = `${siteBaseUrl}/${locale}`;
  const ogImageUrl = `${siteBaseUrl}/og-image-homepage.jpg`;

  const metadata: Metadata = {
    title: t("homepage.seoH1"),

    description: t("homepage.seoDescription"),

    keywords: t("homepage.seoKeywords"),

    alternates: {
      canonical: homepageUrl,
      languages: {
        "fr-FR": `${siteBaseUrl}/fr`,
        "en-US": `${siteBaseUrl}/en`,
        "es-ES": `${siteBaseUrl}/es`,
        "x-default": `${siteBaseUrl}/fr`,
      },
    },

    openGraph: {
      title: t("homepage.seoH1"),
      description: t("homepage.seoDescription"),
      url: homepageUrl,
      siteName: t("global.brandName"),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: t("homepage.ogImageAlt"),
        },
      ],
      locale: locale,
      alternateLocale: ["en_US", "es_ES", "fr_FR"].filter((altLocale) => altLocale.startsWith(locale) === false),
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: t("homepage.seoH1"),
      description: t("homepage.seoDescription"),
      images: [ogImageUrl],
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

    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };

  return metadata;
}

async function getProductsByCategory(slug: string): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.API_HOST}/products/${slug}`);
    if (!response.ok) {
      console.error(`Failed to fetch ${slug}: ${response.status}`);
      return [];
    }
    const data: APIResponse<Product> = await response.json();
    const formattedProducts = Object.values(data.products).filter(
      (p) => p && p.prices && Object.keys(p.prices).length > 0 && p.stock && parseInt(p.stock, 10) > 0
    );
    return formattedProducts;
  } catch (error) {
    console.error(`Error fetching ${slug}:`, error);
    return [];
  }
}

interface Params {
  params: {
    locale: string;
  };
}

// Homepage Component
export default async function HomePage({ params }: Params) {
  const { locale } = params;
  const t = await getTranslations({ locale });

  const flowersData = getProductsByCategory("fleurs-cbd");
  const hashsData = getProductsByCategory("pollens-resines-hash-cbd");
  const oilsData = getProductsByCategory("huiles-cbd");

  const [flowers, hashs, oils] = await Promise.all([flowersData, hashsData, oilsData]);

  const productCardsSkeleton: JSX.Element[] = new Array(4).fill(0).map(() => <ProductCardSkeleton key={uuid()} />);

  const homePageCategories: {
    nameKey: string;
    slug: string;
    IconComponent: string;
    bgColor: string;
    textColor: string;
    hoverBgColor: string;
  }[] = [
    {
      nameKey: "category.flower",
      slug: "fleurs-cbd",
      IconComponent: "🌿",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-800",
      hoverBgColor: "hover:bg-emerald-200",
    },
    {
      nameKey: "category.hash",
      slug: "pollens-resines-hash-cbd",
      IconComponent: "🍫",
      bgColor: "bg-amber-50",
      textColor: "text-amber-800",
      hoverBgColor: "hover:bg-amber-200",
    },
    {
      nameKey: "category.oil",
      slug: "huiles-cbd",
      IconComponent: "💧",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-800",
      hoverBgColor: "hover:bg-cyan-200",
    },
    {
      nameKey: "category.moonrock",
      slug: "moonrocks-cbd",
      IconComponent: "🌠",
      bgColor: "bg-purple-50",
      textColor: "text-purple-800",
      hoverBgColor: "hover:bg-purple-200",
    },
    {
      nameKey: "category.herbalTea",
      slug: "infusions-cbd",
      IconComponent: "🌱",
      bgColor: "bg-lime-50",
      textColor: "text-lime-800",
      hoverBgColor: "hover:bg-lime-200",
    },
    {
      nameKey: "category.health",
      slug: "soins-cbd",
      IconComponent: "🧴",
      bgColor: "bg-rose-50",
      textColor: "text-rose-800",
      hoverBgColor: "hover:bg-rose-200",
    },
    {
      nameKey: "category.vaporizer",
      slug: "vaporisateur",
      IconComponent: "💨",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-800",
      hoverBgColor: "hover:bg-indigo-200",
    },
    // Add more categories if needed
  ];

  const trustSignals: { IconComponent: React.ElementType; titleKey: string; textKey: string }[] = [
    {
      IconComponent: BeakerIcon,
      titleKey: "homepage.trustSignalLabTestedTitle",
      textKey: "homepage.trustSignalLabTestedText",
    },
    {
      IconComponent: ShieldCheckIcon,
      titleKey: "homepage.trustSignalSecurePaymentTitle",
      textKey: "homepage.trustSignalSecurePaymentText",
    },
    {
      IconComponent: TruckIcon,
      titleKey: "homepage.trustSignalFastDiscreetShippingTitle",
      textKey: "homepage.trustSignalFastDiscreetShippingText",
    },
    {
      IconComponent: MapPinIcon,
      titleKey: "homepage.trustSignalFrenchQualityTitle",
      textKey: "homepage.trustSignalFrenchQualityText",
    },
    {
      IconComponent: ChatBubbleLeftRightIcon,
      titleKey: "homepage.trustSignalSupportTitle",
      textKey: "homepage.trustSignalSupportText",
    },
    {
      IconComponent: ScaleIcon,
      titleKey: "homepage.trustSignalLegalComplianceTitle",
      textKey: "homepage.trustSignalLegalComplianceText",
    },
    {
      IconComponent: GiftIcon,
      titleKey: "homepage.trustSignalLoyaltyTitle",
      textKey: "homepage.trustSignalLoyaltyText",
    },
    {
      IconComponent: ArrowUturnLeftIcon,
      titleKey: "homepage.trustSignalSatisfactionTitle",
      textKey: "homepage.trustSignalSatisfactionText",
    },
  ];

  const sectionTitleClassname = twMerge(baseTitleClassname, "text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800");

  return (
    <div className="mb-14 sm:mb-0">
      {/* 1. SEO H1 - Visually Hidden or Styled Subtly */}
      <h1 className="sr-only">{t("homepage.seoH1")}</h1>

      {/* 2. Hero Section */}
      <section aria-labelledby="hero-heading">
        <h2 id="hero-heading" className="sr-only">
          {t("homepage.heroSR")}
        </h2>
        <HeroCarousel />
      </section>

      {/* 2. Trust Pilot */}
      <section aria-labelledby="trustpilot-heading" className="px-4 mt-8">
        <h2 id="trustpilot-heading" className="sr-only">
          {t("homepage.trustpilotSR")}
        </h2>
        <TrustpilotScore />
      </section>

      {/* 3. Featured Flowers Section */}
      <section aria-labelledby="featured-flowers-heading" className="my-8 md:my-12">
        <Title type="h2" title={t("homepage.featuredFlowersTitle")} classname={sectionTitleClassname} id="featured-flowers-heading" />

        <Carousel length={flowers ? flowers.length : 0}>
          {flowers && flowers.length > 0
            ? flowers.map((flower) => (
                <ProductCard key={flower.id} {...flower} locale={locale} category={"fleurs-cbd"} mainDivClassname="rounded-md" />
              ))
            : productCardsSkeleton}
        </Carousel>

        {/* Introductory Text for Flowers */}
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8 mt-6 md:mb-10 px-4 sm:px-6 lg:px-8 leading-relaxed">
          {t("homepage.featuredFlowersIntroText")} {/* Add this translation key */}
        </p>
      </section>

      {/* Optional: Link to All Flowers */}
      <div className="text-center mb-8 md:mb-12">
        <Link href={`/${locale}/fleurs-cbd`} legacyBehavior>
          <a className={twMerge(linkClassname, "text-base font-medium inline-flex items-center")}>
            {t("homepage.viewAllFlowersLink")}{" "}
            <span aria-hidden="true" className="ml-1">
              →
            </span>
          </a>
        </Link>
      </div>

      <Separator classname="my-8 md:my-12" />

      {/* 5. Featured Hashs Section */}
      <section aria-labelledby="featured-hashs-heading" className="mb-8 md:mb-12">
        <Title type="h2" title={t("homepage.featuredHashsTitle")} classname={sectionTitleClassname} id="featured-hashs-heading" />

        <Carousel length={hashs ? hashs.length : 0}>
          {hashs && hashs.length > 0
            ? hashs.map((hash) => (
                <ProductCard key={hash.id} {...hash} locale={locale} category={"pollens-resines-hash-cbd"} mainDivClassname="rounded-md" />
              ))
            : productCardsSkeleton}
        </Carousel>

        {/* Introductory Text for Hashs */}
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8 md:mb-10 mt-6 px-4 sm:px-6 lg:px-8 leading-relaxed">
          {t("homepage.featuredHashsIntroText")} {/* Add this translation key */}
        </p>
      </section>

      {/* Optional: Link to All Hash */}
      <div className="text-center mb-8 md:mb-12">
        <Link href={`/${locale}/pollens-resines-hash-cbd`} legacyBehavior>
          <a className={twMerge(linkClassname, "text-base font-medium inline-flex items-center")}>
            {t("homepage.viewAllHashLink")}{" "}
            <span aria-hidden="true" className="ml-1">
              →
            </span>
          </a>
        </Link>
      </div>

      <Separator classname="my-8 md:my-12" />

      {/* 6. Featured Oils Section */}
      <section aria-labelledby="featured-oils-heading" className="mb-8 md:mb-12">
        <Title type="h2" title={t("homepage.featuredOilsTitle")} classname={sectionTitleClassname} id="featured-oils-heading" />

        <Carousel length={oils ? oils.length : 0}>
          {oils && oils.length > 0
            ? oils.map((oil) => <ProductCard key={oil.id} {...oil} locale={locale} category={"huiles-cbd"} mainDivClassname="rounded-md" />)
            : productCardsSkeleton}
        </Carousel>

        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8 md:mb-10 mt-6 px-4 sm:px-6 lg:px-8 leading-relaxed">
          {t("homepage.featuredOilsIntroText")} {/* Add this translation key */}
        </p>
      </section>

      {/* Optional: Link to All Oils */}
      <div className="text-center mb-8 md:mb-12">
        <Link href={`/${locale}/huiles-cbd`} legacyBehavior>
          <a className={twMerge(linkClassname, "text-base font-medium inline-flex items-center")}>
            {t("homepage.viewAllOilsLink")}{" "}
            <span aria-hidden="true" className="ml-1">
              →
            </span>
          </a>
        </Link>
      </div>

      <Separator classname="my-8 md:my-12" />

      {/* 4. Categories Section */}
      <section aria-labelledby="categories-heading" className="px-4 sm:px-6 lg:px-8 mb-10 md:mb-16">
        <Title type="h2" title={t("homepage.categoriesTitle")} classname={sectionTitleClassname} id="categories-heading" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 md:gap-5 max-w-7xl mx-auto">
          {homePageCategories.map((cat) => (
            <Link key={cat.slug} href={`/${locale}/${cat.slug}`} legacyBehavior>
              <a
                className={twMerge(
                  "group flex flex-col items-center justify-center p-5 rounded-lg border border-gray-200 shadow-sm transition-all duration-200 ease-in-out",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green",
                  cat.bgColor,
                  cat.textColor,
                  cat.hoverBgColor,
                  "hover:shadow-md hover:-translate-y-1"
                )}
              >
                {cat.IconComponent}
                <span className="text-sm md:text-base font-medium text-center leading-tight">{t(cat.nameKey)}</span>
              </a>
            </Link>
          ))}
        </div>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mt-8 md:mt-10">{t("homepage.categoriesIntroText")}</p>
      </section>

      <Separator classname="my-8 md:my-12" />

      {/* 7. Trust Signals / Value Propositions Section */}
      <section
        aria-labelledby="trust-signals-heading"
        className="px-4 sm:px-6 lg:px-8 mb-10 md:mb-16 bg-gradient-to-b from-gray-50 to-white py-12 md:py-20"
      >
        <Title type="h2" title={t("homepage.whyChooseUsTitle")} classname={sectionTitleClassname} id="trust-signals-heading" />

        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed">{t("homepage.whyChooseUsIntroText")}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {trustSignals.map((signal, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200 ease-in-out" // Card styling
            >
              <div className="flex-shrink-0 p-3 bg-green/10 rounded-full mb-4">
                <signal.IconComponent className="h-8 w-8 text-green" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t(signal.titleKey)}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{t(signal.textKey)}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href={`/${locale}/a-propos-de-monplancbd`} legacyBehavior>
            <a className={twMerge(linkClassname, "text-base font-medium inline-flex items-center")}>
              {t("homepage.learnMoreAboutCommitmentsLink")}
              <span aria-hidden="true" className="ml-1">
                →
              </span>
            </a>
          </Link>
        </div>
      </section>

      {/* 8. Informational Content / Blog Link Section */}
      <section aria-labelledby="info-content-heading" className="px-4 sm:px-6 lg:px-8 my-10 md:my-16 text-center">
        <Title type="h2" title={t("homepage.learnMoreTitle")} classname={sectionTitleClassname} id="info-content-heading" />
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">{t("homepage.learnMoreText")}</p>
        <Link href={`/${locale}/blog`} legacyBehavior>
          <a className={twMerge(linkClassname, "inline-flex items-center text-lg font-medium")}>
            <NewspaperIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            {t("homepage.visitBlogLink")}
          </a>
        </Link>
      </section>
    </div>
  );
}
