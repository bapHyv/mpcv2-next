import { Disclosure, DisclosureButton, DisclosurePanel, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { ArrowUpRightIcon, StarIcon } from "@heroicons/react/20/solid";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { getTranslations } from "next-intl/server";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";
import geoip from "geoip-lite";

import ProductOptions from "@/app/components/products/ProductOptions";
import ProductPrice from "@/app/components/products/ProductPrice";
import ReviewForm from "@/app/components/productPage/ReviewForm";
import ShippingCalendar from "@/app/components/ShippingCalendar";
import Timer from "@/app/components/Timer";

import { Analyse, Cannabinoids, Product, Terpenes } from "@/app/types/productsTypes";
import { terpenesToColor } from "@/app/utils/terpenesToColor";
import { findHighestOption, returnRenamedGrowingMethod } from "@/app/utils/productFunctions";
import getClientIp from "@/app/components/getClientIp";

interface Params {
  params: {
    locale: string;
    category: string;
    productSlug: string;
  };
}

export async function generateMetadata({ params: { category, locale, productSlug } }: Params, parent: ResolvingMetadata): Promise<Metadata> {
  const response = await fetch(`${process.env.API_HOST}/product/slug/${productSlug}`);
  const product: Product = await response.json();
  const domain = process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.MAIN_DOMAIN;
  const img = !!product.images.main ? product.images.main.url : "/logo-noir.png";
  const alt = !!product.images.main ? product.images.main.alt : product.name;
  const imgHost = `${process.env.MAIN_URL}${process.env.IMG_HOST}`;
  const images = product.images.others.reduce(
    (acc, img) => {
      return [...acc, { url: `${imgHost}${img.url}`, alt: img.url }];
    },
    [{ url: `${imgHost}${img}`, alt }]
  );

  return {
    title: product.name,
    description: product.shortDescription,
    metadataBase: new URL(`${domain}/${category}/${productSlug}`),
    openGraph: {
      images,
      type: "article",
      locale: "fr-FR",
      alternateLocale: ["en-US", "es-ES"],
    },
  };
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default async function Page({ params: { category, locale, productSlug } }: Params) {
  const t = await getTranslations({ locale });

  const response = await fetch(`${process.env.API_HOST}/product/slug/${productSlug}`);
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
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-2 py-6 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <TabGroup className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <TabList className="grid grid-cols-4 gap-6">
                {product.images.others.map((image) => (
                  <Tab
                    key={`${image.alt}-${image.url}`}
                    className={`group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm
                      font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4`}
                  >
                    <span className="sr-only">{image.alt}</span>
                    <span className="absolute inset-0 overflow-hidden rounded-md">
                      <Image
                        alt={image.alt}
                        src={`${process.env.MAIN_URL}${process.env.IMG_HOST}${image.url}`}
                        className="h-full w-full object-cover object-center"
                        width={1920}
                        height={1080}
                      />
                    </span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-[selected]:ring-green"
                    />
                  </Tab>
                ))}
              </TabList>
            </div>

            <TabPanels className="aspect-h-1 aspect-w-1 w-full">
              {product.images.others.map((image) => (
                <TabPanel key={`${image.alt}-${image.url}`}>
                  <Image
                    alt={image.alt}
                    src={`${process.env.MAIN_URL}${process.env.IMG_HOST}${image.url}`}
                    width={1920}
                    height={1080}
                    className="h-full w-full object-cover object-center sm:rounded-lg border border-neutral-200 rounded-md shadow-xl"
                  />
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>

          <div className="mt-5">
            <h2 className="text-center text-xl md:text-2xl font-bold tracking-tight text-black">{product.name}</h2>

            {/* PRODUCT PRICE */}
            <ProductPrice id={product.id} />

            {/* STARS REVIEW */}
            {!!product.ratings.amount && (
              <div className="sm:my-2">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center gap-x-1 sm:gap-x-2">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        aria-hidden="true"
                        className={classNames(product.ratings.value > rating ? "text-yellow-300" : "text-gray-300", "h-5 w-5 flex-shrink-0")}
                      />
                    ))}
                  </div>
                  <Link href="#reviews" className="text-green text-sm sm:text-base mt-1">
                    {product.ratings.amount} avis
                  </Link>
                  <p className="sr-only">{product.ratings.value} out of 5 stars</p>
                </div>
              </div>
            )}

            {/* SHORT DESCRIPTION */}
            <div className="my-3">
              <h3 className="sr-only">Description</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: product.shortDescription,
                }}
                className="text-sm md:text-base text-neutral-900"
              />
            </div>

            {isFrance && <Timer />}

            {/* OPTION PICKER */}
            <ProductOptions
              pricesPer={product.pricesPer}
              prices={product.prices}
              name={product.name}
              id={product.id}
              image={{
                url: !!product.images.main ? product.images.main.url : "/logo-noir.png",
                alt: !!product.images.main ? product.images.main.alt : product.name,
              }}
              stock={product.stock}
              slug={productSlug}
              category={category}
              isInModale={false}
            />

            <section aria-labelledby="details-heading" className="mt-2">
              <h2 id="details-heading" className="sr-only">
                Additional details
              </h2>

              {(!!renamedGrowindMethod ||
                ("country" in product && !!product.country.length) ||
                ("analyzes" in product && !!Object.values(product.analyzes as Analyse).length) ||
                ("cannabinoids" in product && !!Object.values(product.cannabinoids as Cannabinoids).length) ||
                ("terpenes" in product && !!Object.values(product.terpenes as Terpenes).length)) && (
                <div className="divide-y divide-gray-200 border-t">
                  <Disclosure as="div">
                    <h3>
                      <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                        <span className="text-sm font-medium text-neutral-900 group-data-[open]:text-green capitalize">Informations</span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="block h-6 w-6 text-neutral-600 group-hover:text-neutral-500 group-data-[open]:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="hidden h-6 w-6 text-neutral-600 group-hover:text-neutral-500 group-data-[open]:block"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel
                      transition
                      className="prose prose-sm pb-6 origin-top transition duration-300 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
                    >
                      {"growingMethod" in product && (
                        <>
                          <div className="mb-2 flex items-center gap-x-2">
                            <p>Growing Method:</p>
                            <div className="flex items-center gap-x-2">
                              <span>{product.growingMethod}</span>
                              <Image
                                src={`/${renamedGrowindMethod}.png`}
                                alt={`Méthode de culture: ${product.growingMethod}`}
                                width={25}
                                height={25}
                              />
                            </div>
                          </div>
                          <div className="h-[1px] mt-2 bg-neutral-100" />
                        </>
                      )}
                      {"country" in product && !!product.country.length && (
                        <>
                          <div className="my-2 flex items-center gap-x-2">
                            <p>Provenance:</p>
                            <div className="flex items-center gap-x-2">
                              <span>{countries[product.country]}</span>
                              <Image src={`/${product.country}.png`} alt={`Drapeau ${product.country}`} width={30} height={30} />
                            </div>
                          </div>
                          <div className="h-[1px] mt-2 bg-neutral-100" />
                        </>
                      )}
                      {"analyzes" in product && !!Object.values(product.analyzes).length && !!Object.values(product.analyzes as Analyse) && (
                        <>
                          <div className="my-2 flex items-center gap-x-2">
                            <p>Analyses:</p>
                            <ul role="list">
                              {Object.entries(product.analyzes as Analyse).map(([key, value]) => (
                                <li key={key}>
                                  <Link
                                    href={`https://www.monplancbd.fr/analyses/${value}`}
                                    target="_blank"
                                    className="underline flex gap-1 capitalize text-neutral-900"
                                  >
                                    {key} <ArrowUpRightIcon className="w-3 h-3 mt-1 text-green" />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="h-[1px] mt-2 bg-neutral-100" />
                        </>
                      )}
                      {"cannabinoids" in product && !!Object.values(product.cannabinoids as Cannabinoids).length && (
                        <>
                          <div className="my-2 flex items-center gap-x-2">
                            <p>Cannabinoids:</p>
                            <ul className="flex flex-col gap-y-2" role="list">
                              {Object.entries(product.cannabinoids as Cannabinoids).map(([key, value]: [string, string]) => {
                                const cannabinoidColor = key === "CBD" ? "emerald" : key === "CBG" ? "purple" : key === "CBN" ? "yellow" : "neutral";
                                return (
                                  <li
                                    key={key}
                                    className={`flex items-end gap-3 text-xs text-center px-1 py-0.5 rounded-full bg${cannabinoidColor}100 border border${cannabinoidColor}700 text${cannabinoidColor}700`}
                                  >
                                    {key}: {parseFloat(value).toFixed(2)} %
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                          <div className="h-[1px] mt-2 bg-neutral-100" />
                        </>
                      )}
                      {"terpenes" in product && !!Object.values(product.terpenes as Terpenes).length && (
                        <div className="my-2">
                          <p className="text-center">Terpenes/Aromes</p>
                          <ul role="list">
                            {Object.entries(product.terpenes).map(([key, value]) => (
                              <>
                                <li key={key} className="flex items-center gap-3 text-neutral-900 capitalize">
                                  {key}: {value}
                                  <Image src={`/${key.toLocaleLowerCase()}.png`} alt={key} width={40} height={40} />
                                </li>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                                  <div
                                    className={`${terpenesToColor[key.toLocaleLowerCase() as keyof typeof terpenesToColor]} h-1.5 rounded-full`}
                                    style={{ width: `${parseInt(value) * 20}%` }}
                                  ></div>
                                </div>
                              </>
                            ))}
                          </ul>
                        </div>
                      )}
                    </DisclosurePanel>
                  </Disclosure>
                </div>
              )}
            </section>
          </div>
        </div>
        <div className="pt-16 product-page-long-description" dangerouslySetInnerHTML={{ __html: product.longDescription }} />

        <ReviewForm id={product.id} />

        {/* REVIEWS */}
        {!!product.ratings.reviews.length && (
          <div>
            <div className="mt-6">
              <h3 className="sr-only">Review data</h3>

              <dl className="space-y-3">
                {Object.entries(counts)
                  .reverse()
                  .map(([rating, count]) => (
                    <div key={rating} className="flex items-center text-sm">
                      <dt className="flex flex-1 items-center">
                        <p className="w-3 font-medium text-gray-900">
                          {rating}
                          <span className="sr-only"> star reviews</span>
                        </p>
                        <div aria-hidden="true" className="ml-1 flex flex-1 items-center">
                          <StarIcon aria-hidden="true" className={classNames(count > 0 ? "text-yellow-400" : "text-gray-300", "size-5 shrink-0")} />

                          <div className="relative ml-3 flex-1">
                            <div className="h-3 rounded-full border border-gray-200 bg-gray-100" />
                            {count > 0 ? (
                              <div
                                style={{ width: `calc(${count} / ${product.ratings.reviews.length} * 100%)` }}
                                className="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                              />
                            ) : null}
                          </div>
                        </div>
                      </dt>
                      <dd className="ml-3 w-10 text-right text-sm tabular-nums text-gray-900">
                        {Math.round((count / product.ratings.reviews.length) * 100)}%
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>
            <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:max-w-7xl lg:px-8">
              <h2 className="text-green text-xl text-center font-medium capitalize" id="reviews">
                {t("singleProduct.reviews")}
              </h2>
              <div className="mt-6 space-y-10 divide-y divide-gray-200 border-b border-t border-gray-200 pb-10">
                {product.ratings.reviews.map((review) => (
                  <div key={Math.random()} className="pt-10 lg:grid lg:grid-cols-12 lg:gap-x-8">
                    <div className="lg:col-span-8 lg:col-start-5 xl:col-span-9 xl:col-start-4 xl:grid xl:grid-cols-3 xl:items-start xl:gap-x-8">
                      <div className="flex items-center xl:col-span-1">
                        <div className="flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                              key={rating}
                              aria-hidden="true"
                              className={classNames(parseInt(review.rating) > rating ? "text-yellow-400" : "text-gray-200", "h-5 w-5 flex-shrink-0")}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 lg:mt-6 xl:col-span-2 xl:mt-0">
                        <div dangerouslySetInnerHTML={{ __html: review.content }} className="mt-3 space-y-6 text-sm text-neutral-900" />
                      </div>
                    </div>

                    <div className="mt-6 flex items-center text-sm lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:flex-col lg:items-start xl:col-span-3">
                      <p className="font-medium text-neutral-900 ">{review.author}</p>
                      <time
                        dateTime={new Date(review.date).toLocaleString()}
                        className="ml-4 border-l border-gray-200 pl-4 text-neutral-600  lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0"
                      >
                        {new Date(review.date).toLocaleString()}
                      </time>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RELATED PRODUCTS */}
        {!!product.relatedProducts.length && (
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-lg font-medium text-neutral-900">
              {t("singleProduct.relatedProducts")}
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-9 xl:gap-x-8 ">
              {product.relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.name} className="group relative border border-green rounded-md shadow-lg bg-neutral-50 lg:col-span-3">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-md lg:aspect-none group-hover:opacity-75 lg:h-80">
                    <Image
                      alt={relatedProduct.images.main.alt}
                      src={relatedProduct.images.main.url}
                      width={1920}
                      height={1080}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>
                  <div className="p-1 w-full rounded-b-md">
                    <Link href={`/${locale}/${category}${relatedProduct.productUrl}`} className="flex justify-between items-center">
                      <span aria-hidden="true" className="absolute inset-0" />
                      <p className="text-lg text-green">{relatedProduct.name}</p>
                      {!!relatedProduct.ratings.amount && (
                        <div className="flex items-start">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                              key={rating}
                              aria-hidden="true"
                              className={classNames(
                                relatedProduct.ratings.value > rating ? "text-yellow-400" : "text-gray-200",
                                "h-5 w-5 flex-shrink-0"
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </Link>
                  </div>
                  {
                    <p className="text-neutral-600 p-1 text-md sm:text-xs">
                      À partir de {findHighestOption(relatedProduct.prices).price}€/
                      {relatedProduct.pricesPer}
                    </p>
                  }
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
