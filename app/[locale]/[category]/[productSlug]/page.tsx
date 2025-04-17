import { Disclosure, DisclosureButton, DisclosurePanel, TabGroup, TabPanel, TabPanels } from "@headlessui/react";
import { StarIcon, PlusIcon, MinusIcon } from "@heroicons/react/20/solid";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import geoip from "geoip-lite";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { notFound } from "next/navigation";

import ProductOptions from "@/app/components/products/ProductOptions";
import ProductPrice from "@/app/components/products/ProductPrice";
import ReviewForm from "@/app/components/productPage/ReviewForm";
import Timer from "@/app/components/Timer";
import ProductImageGallery from "@/app/components/productPage/ProductImageGallery";

import { Product } from "@/app/types/productsTypes";
import { terpenesToColor } from "@/app/utils/terpenesToColor";
import { findHighestOption, returnRenamedGrowingMethod } from "@/app/utils/productFunctions";
import getClientIp from "@/app/components/getClientIp";

import { sectionWrapperClassname, titleClassname as baseTitleClassname, linkClassname } from "@/app/staticData/cartPageClasses";

interface Params {
  params: {
    locale: string;
    category: string;
    productSlug: string;
  };
}

async function getProductDataForMeta(productSlug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${process.env.API_HOST}/product/slug/${productSlug}`);
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Metadata: Product with slug "${productSlug}" not found (404).`);
        return null;
      }
      throw new Error(`Failed to fetch product data: ${response.status}`);
    }
    const product: Product = await response.json();
    return product;
  } catch (error) {
    console.error("Error fetching product data for metadata:", error);
    return null;
  }
}

export async function generateMetadata({ params: { category: categorySlug, locale, productSlug } }: Params): Promise<Metadata> {
  const product = await getProductDataForMeta(productSlug);

  if (!product) {
    notFound();
  }

  const t = await getTranslations({ locale });

  const brandName = t("global.brandName");
  const categoryTitle = t(`category.${product.category}`);
  const productName = product.name;
  const shortDescription = product.shortDescription;

  const representativePrice = Object.entries(product.prices)[0][1].price;

  const stockStatus = product.stock && parseInt(product.stock, 10) > 0 ? "instock" : "outofstock";

  const siteBaseUrl = process.env.MAIN_URL || "https://www.monplancbd.fr";
  const canonicalUrl = `${siteBaseUrl}/${locale}/${categorySlug}/${productSlug}`;

  const mainImage = product.images?.main;
  const ogImageUrl = mainImage ? `${process.env.MAIN_URL}${process.env.IMG_HOST}${mainImage.url}` : `${siteBaseUrl}/og-image-default.png`; // **Fallback image is crucial**
  const ogImageAlt = mainImage ? mainImage.alt : `Image of ${productName}`; // Descriptive fallback alt

  const title = `${t("productOptions.addToCartButton")} ${productName} - ${categoryTitle} | ${brandName}`;

  // TODO: **Description:** ~150-160 characters. Engaging summary, includes keywords, potentially a subtle CTA.
  const description = shortDescription.length > 160 ? `${shortDescription.substring(0, 157)}...` : shortDescription;

  const keywords = [
    productName,
    `${productName} CBD`,
    categoryTitle,
    `Acheter ${categoryTitle}`,
    `Acheter ${productName}`,
    brandName,
    "CBD",
    locale === "fr" ? "acheter" : locale === "en" ? "buy" : "comprar",
  ].join(", ");

  return {
    title: title,
    description: description,
    keywords: keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "fr-FR": `${siteBaseUrl}/fr/${categorySlug}/${productSlug}`,
        "en-US": `${siteBaseUrl}/en/${categorySlug}/${productSlug}`,
        "es-ES": `${siteBaseUrl}/es/${categorySlug}/${productSlug}`,
        "x-default": `${siteBaseUrl}/fr/${categorySlug}/${productSlug}`,
      },
    },
    openGraph: {
      title: title,
      description: description,
      url: canonicalUrl,
      siteName: brandName,
      images: [
        {
          url: ogImageUrl,
          width: 800,
          height: 800,
          alt: ogImageAlt,
        },
        ...product.images.others.slice(0, 2).map((img) => ({
          url: `${process.env.MAIN_URL}${process.env.IMG_HOST}${img.url}`,
          width: 800,
          height: 800,
          alt: img.alt || `Image of ${productName}`,
        })),
      ],
      locale: locale.replace("-", "_"),
      alternateLocale: ["fr_FR", "en_US", "es_ES"].filter((altLocale) => altLocale !== locale.replace("-", "_")),
      type: "article",
      authors: brandName,
      section: categoryTitle,
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
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
    other: {
      "product:price:amount": representativePrice,
      "product:price:currency": "EUR",
      "product:availability": stockStatus,
      "product:brand": brandName,
    },
  };
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default async function Page({ params: { category, locale, productSlug } }: Params) {
  const t = await getTranslations({ locale });

  // Fetch product data (keep existing logic)
  const response = await fetch(`${process.env.API_HOST}/product/slug/${productSlug}`);
  // TODO: Add error handling for fetch (e.g., if product not found -> notFound())
  if (!response.ok) {
    // Handle error, maybe redirect or show a not found component
    console.error("Failed to fetch product:", response.status, response.statusText);
    // Example: import { notFound } from 'next/navigation'; notFound();
    return <div className="container mx-auto py-12 text-center">Produit non trouvé.</div>;
  }
  const product: Product = await response.json();

  const counts = product.ratings.reviews.reduce(
    (acc, rating) => {
      return { ...acc, [rating.rating]: acc[rating.rating] + 1 };
    },
    { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 } as { [key: string]: number }
  );

  const terpenesFlavor = {
    caryophyllene: t("category.caryophyllene"),
    limonene: t("category.limonene"),
    myrcene: t("category.myrcene"),
    linalol: t("category.linalol"),
    terpinolene: t("category.terpinolene"),
    piperine: t("category.piperine"),
    caryophyllenePeper: t("category.caryophyllenePeper"),
    pinene: t("category.pinene"),
    humulene: t("category.humulene"),
  };

  const countries = {
    af: "afghanistan",
    ch: "Suisse",
    en: "Royaume-unis",
    es: "Espagne",
    fr: "France",
    it: "Italie",
    lb: "Liban",
    ma: "Maroc",
    np: "Nepal",
    usa: "Etats-unis",
  };

  const renamedGrowindMethod = returnRenamedGrowingMethod("growingMethod" in product ? product.growingMethod : undefined);

  let isFrance = false;
  const clientIp = getClientIp();

  if (clientIp && clientIp !== "127.0.0.1" && clientIp !== "::1") {
    try {
      const geo = geoip.lookup(clientIp);
      if (geo && geo.country === "FR") {
        isFrance = true;
      }
    } catch (error) {
      console.error(`Error performing GeoIP lookup for ${clientIp}:`, error);
      isFrance = false;
    }
  } else {
    if (process.env.NODE_ENV === "development") {
      isFrance = true;
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 xl:gap-x-12">
        {/* --- Image Gallery --- */}
        <TabGroup as="div" className="flex flex-col-reverse">
          {/* Image selector thumbnails */}
          <ProductImageGallery images={product.images} />
          {/* Main image display */}
          <TabPanels className="aspect-h-1 aspect-w-1 w-full mt-4 sm:mt-0">
            {product.images.main && (
              <TabPanel key={`${product.images.main.alt}-panel`}>
                <Image
                  priority
                  width={800}
                  height={800}
                  alt={product.images.main.alt}
                  src={`${process.env.MAIN_URL}${process.env.IMG_HOST}${product.images.main.url}`}
                  className="h-full w-full object-cover object-center sm:rounded-lg border border-gray-200 shadow-md"
                />
              </TabPanel>
            )}
            {product.images.others.map((image) => (
              <TabPanel key={`${image.alt}-${image.url}-panel`}>
                <Image
                  width={800}
                  height={800}
                  alt={image.alt}
                  src={`${process.env.MAIN_URL}${process.env.IMG_HOST}${image.url}`}
                  className="h-full w-full object-cover object-center sm:rounded-lg border border-gray-200 shadow-md"
                />
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>

        {/* --- Product Info Column --- */}
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0 space-y-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl text-center lg:text-left">{product.name}</h1>
          {/* Product Price Component Placeholder */}
          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <ProductPrice id={product.id} />
          </div>
          {/* Stars Review Link */}
          {!!product.ratings.amount && (
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center gap-x-2">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      aria-hidden="true"
                      className={classNames(product.ratings.value > rating ? "text-yellow-400" : "text-gray-300", "h-5 w-5 flex-shrink-0")}
                    />
                  ))}
                </div>
                <Link href="#reviews-heading" scroll className={linkClassname}>
                  {product.ratings.amount} avis
                </Link>
              </div>
            </div>
          )}
          {/* Short Description */}
          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div
              dangerouslySetInnerHTML={{ __html: product.shortDescription }}
              className="space-y-6 text-base text-gray-700 prose prose-sm max-w-none"
            />
          </div>
          {/* Timer Component Placeholder */}
          {isFrance && <Timer />}
          <ProductOptions
            pricesPer={product.pricesPer}
            prices={product.prices}
            name={product.name}
            id={product.id}
            image={product.images.main ?? product.images.others[0]}
            stock={product.stock}
            slug={productSlug}
            category={category}
            isInModale={false}
          />
          {/* --- Additional Details Disclosure --- */}
          {(!!renamedGrowindMethod || ("country" in product && !!product.country.length)) /* ... TODO: other checks ... */ && (
            <section aria-labelledby="details-heading" className="mt-8 border-t border-gray-200 pt-8">
              <h2 id="details-heading" className="sr-only">
                Additional details
              </h2>
              <Disclosure as="div">
                <DisclosureButton className="group relative flex w-full items-center justify-between py-2 text-left focus:outline-none focus-visible:ring focus-visible:ring-green focus-visible:ring-opacity-75">
                  <span className={clsx("text-base font-medium text-gray-900", "group-data-[open]:text-green")}>Informations Complémentaires</span>
                  <span className="ml-6 flex items-center">
                    <PlusIcon aria-hidden="true" className="block h-6 w-6 text-gray-400 group-hover:text-gray-500 group-data-[open]:hidden" />
                    <MinusIcon aria-hidden="true" className="hidden h-6 w-6 text-gray-400 group-hover:text-gray-500 group-data-[open]:block" />
                  </span>
                </DisclosureButton>
                <DisclosurePanel
                  transition
                  className="mt-4 pb-4 text-sm text-gray-700 origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0" // Smoother transition
                >
                  {/* Details Content - Improved layout */}
                  <dl className="space-y-4">
                    {/* Growing Method */}
                    {"growingMethod" in product && renamedGrowindMethod && (
                      <div className="flex items-center justify-between gap-4">
                        <dt className="font-medium text-gray-900">Méthode de culture:</dt>
                        <dd className="flex items-center gap-x-2 text-gray-700">
                          <span>{product.growingMethod}</span>
                          <Image src={`/${renamedGrowindMethod}.png`} alt={`Culture: ${product.growingMethod}`} width={20} height={20} />
                        </dd>
                      </div>
                    )}
                    {/* Provenance */}
                    {"country" in product && product.country && countries[product.country as keyof typeof countries] && (
                      <div className="flex items-center justify-between gap-4">
                        <dt className="font-medium text-gray-900">Provenance:</dt>
                        <dd className="flex items-center gap-x-2 text-gray-700">
                          <span>{countries[product.country as keyof typeof countries]}</span>
                          <Image
                            src={`/${product.country}.png`}
                            alt={`Drapeau ${product.country}`}
                            width={24}
                            height={24}
                            className="border border-gray-200"
                          />
                        </dd>
                      </div>
                    )}
                    {/* Analyses */}
                    {/* ... TODO: logic for analyses links ... */}
                    {/* Cannabinoids */}
                    {"cannabinoids" in product && product.cannabinoids && Object.keys(product.cannabinoids).length > 0 && (
                      <div className="pt-4 border-t border-gray-100">
                        <dt className="font-medium text-gray-900 mb-2">Cannabinoïdes:</dt>
                        <dd className="flex flex-wrap gap-2">
                          {Object.entries(product.cannabinoids).map(([key, value]) => {
                            const colorClass =
                              key === "CBD"
                                ? "bg-emerald-100 text-emerald-800"
                                : key === "CBG"
                                ? "bg-purple-100 text-purple-800"
                                : key === "CBN"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800";
                            return (
                              <span key={key} className={clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", colorClass)}>
                                {key}: {parseFloat(value).toFixed(2)}%
                              </span>
                            );
                          })}
                        </dd>
                      </div>
                    )}
                    {/* Terpenes */}
                    {"terpenes" in product && product.terpenes && Object.keys(product.terpenes).length > 0 && (
                      <div className="pt-4 border-t border-gray-100">
                        <dt className="font-medium text-gray-900 mb-2">Terpènes / Arômes:</dt>
                        <dd className="space-y-3">
                          {Object.entries(product.terpenes).map(([key, value]) => (
                            <div key={key}>
                              <div className="flex justify-between items-center mb-1 text-xs capitalize">
                                <span className="font-medium text-gray-700">
                                  {terpenesFlavor[key.toLowerCase() as keyof typeof terpenesFlavor] ?? key}
                                </span>
                                <span className="text-gray-500">{value}/5</span>
                              </div>
                              {/* Progress Bar */}
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className={clsx(
                                    "h-1.5 rounded-full",
                                    terpenesToColor[key.toLowerCase() as keyof typeof terpenesToColor] ?? "bg-gray-400"
                                  )}
                                  style={{ width: `${Math.min(100, parseInt(value) * 20)}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </dd>
                      </div>
                    )}
                  </dl>
                </DisclosurePanel>
              </Disclosure>
            </section>
          )}
        </div>
      </div>

      {/* --- Long Description --- */}
      <div className="mt-16 lg:mt-20 prose prose-sm sm:prose-base max-w-none text-gray-700">
        <div className="product-page-long-description" dangerouslySetInnerHTML={{ __html: product.longDescription }} />
      </div>

      {/* --- Review Form Placeholder --- */}
      <section aria-labelledby="review-form-heading" className={twMerge(sectionWrapperClassname, "mt-16 lg:mt-20")}>
        <ReviewForm id={product.id} />
      </section>

      {/* --- Reviews List Section --- */}
      {!!product.ratings.reviews.length && (
        <section aria-labelledby="reviews-heading" className="mt-16 lg:mt-20">
          <div className="max-w-2xl mx-auto lg:max-w-none">
            <h2 id="reviews-heading" className={clsx(baseTitleClassname, "text-center text-xl mb-8")}>
              {t("singleProduct.reviews")} ({product.ratings.amount})
            </h2>

            {/* Review Summary/Histogram */}
            <div className="mb-12">
              <h3 className="sr-only">Review data</h3>
              <dl className="space-y-2 max-w-lg mx-auto">
                {Object.entries(counts)
                  .reverse()
                  .map(([rating, count]) => (
                    <div key={rating} className="flex items-center text-sm">
                      <dt className="w-4 font-medium text-gray-900">
                        {rating}
                        <span className="sr-only"> star reviews</span>
                      </dt>
                      <dd className="flex flex-1 items-center ml-2">
                        <StarIcon aria-hidden="true" className={clsx(count > 0 ? "text-yellow-400" : "text-gray-300", "w-5 h-5 flex-shrink-0")} />
                        <div className="relative ml-2 flex-1 h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                          {count > 0 && (
                            <div
                              style={{ width: `calc(${count} / ${product.ratings.reviews.length} * 100%)` }}
                              className="absolute inset-y-0 left-0 bg-yellow-400 rounded-full"
                            />
                          )}
                        </div>
                        <span className="ml-3 w-10 text-right tabular-nums text-gray-600">
                          {product.ratings.reviews.length ? Math.round((count / product.ratings.reviews.length) * 100) : 0}%
                        </span>
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>

            {/* Individual Reviews List */}
            <div className="space-y-10 divide-y divide-gray-200 border-t border-gray-200 pt-10">
              {product.ratings.reviews.map((review) => (
                <div key={Math.random()} className="pt-10 first:pt-0">
                  <div className="flex flex-col sm:flex-row items-start gap-x-4 gap-y-2">
                    {/* Author and Date */}
                    <div className="flex-shrink-0">
                      <p className="font-semibold text-gray-900">{review.author}</p>
                      <p className="text-xs text-gray-500">
                        <time dateTime={new Date(review.date).toISOString()}>{new Date(review.date).toLocaleDateString()}</time>
                      </p>
                    </div>
                    {/* Rating and Content */}
                    <div className="flex-grow">
                      <div className="flex items-center mb-2">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            aria-hidden="true"
                            className={classNames(parseInt(review.rating) > rating ? "text-yellow-400" : "text-gray-300", "h-5 w-5 flex-shrink-0")}
                          />
                        ))}
                      </div>
                      <div dangerouslySetInnerHTML={{ __html: review.content }} className="prose prose-sm max-w-none text-gray-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- Related Products Section --- */}
      {product.relatedProducts && !!product.relatedProducts.length && (
        <section aria-labelledby="related-heading" className="mt-16 lg:mt-20">
          <h2 id="related-heading" className={clsx(baseTitleClassname, "text-center text-xl mb-8")}>
            {t("singleProduct.relatedProducts")}
          </h2>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-6">
            {product.relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.name}
                className="group relative text-sm border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-h-1 aspect-w-1 bg-gray-100">
                  <Image
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    alt={relatedProduct.images?.main?.alt ?? relatedProduct.name}
                    src={
                      relatedProduct.images?.main?.url
                        ? `${process.env.MAIN_URL}${process.env.IMG_HOST}${relatedProduct.images.main.url}`
                        : "/placeholder.png"
                    }
                    className="object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <div className="p-3 space-y-1 bg-white">
                  <h3 className="font-medium text-gray-900 truncate">
                    <Link href={`/${locale}/${category}${relatedProduct.productUrl}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {relatedProduct.name}
                    </Link>
                  </h3>
                  <p className="text-gray-700">
                    À partir de {findHighestOption(relatedProduct.prices).price}€/{relatedProduct.pricesPer}
                  </p>
                  {/* Optional: Add rating */}
                  {/* {!!relatedProduct.ratings.amount && ( ... stars ... )} */}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div> // End Container
  );
}
