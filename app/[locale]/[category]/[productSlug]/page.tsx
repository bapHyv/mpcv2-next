import { Disclosure, DisclosureButton, DisclosurePanel, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { ArrowUpRightIcon, StarIcon } from "@heroicons/react/20/solid";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Product } from "@/app/types/productsTypes";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { Metadata, ResolvingMetadata } from "next";

import { terpenesToColor } from "@/app/utils/terpenesToColor";
import { findHighest, findHighestOption } from "@/app/utils/productFunctions";
import ProductOptions from "@/app/components/products/ProductOptions";
import ProductPrice from "@/app/components/products/ProductPrice";
import ReviewForm from "@/app/components/productPage/ReviewForm";
import ShippingCalendar from "@/app/components/ShippingCalendar";
import ShareSocialMedia from "@/app/components/ShareSocialMedia";

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
  const imgHost = `${process.env.MAIN_URL}${process.env.IMG_HOST}`;
  const images = product.images.others.reduce(
    (acc, img) => {
      return [...acc, { url: `${imgHost}${img.url}`, alt: img.url }];
    },
    [{ url: `${imgHost}${product.images.main.url}`, alt: product.images.main.alt }]
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

  const cannabinoidRating = "cannabinoids" in product ? findHighest(product.cannabinoids) : null;

  const counts = product.ratings.reviews.reduce(
    (acc, rating) => {
      return { ...acc, [rating.rating]: acc[rating.rating] + 1 };
    },
    { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 } as { [key: string]: number }
  );

  return (
    <div className="bg-white dark:bg-light-black">
      <div className="mx-auto max-w-2xl px-2 py-6 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
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

          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-center md:text-left text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              {product.name}
              {cannabinoidRating && (
                <span className="text-green dark:text-light-green">{` - ${cannabinoidRating?.name}: ${cannabinoidRating?.value}%`}</span>
              )}
            </h1>

            {/* PRODUCT PRICE */}
            <ProductPrice id={product.id} />

            {/* STARS REVIEW */}
            {!!product.ratings.amount && (
              <div className="mt-3">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        aria-hidden="true"
                        className={classNames(product.ratings.value > rating ? "text-yellow-300" : "text-gray-300", "h-5 w-5 flex-shrink-0")}
                      />
                    ))}
                  </div>
                  <Link href="#reviews" className="text-green dark:text-light-green mt-1">
                    {product.ratings.amount} avis
                  </Link>
                  <p className="sr-only">{product.ratings.value} out of 5 stars</p>
                </div>
              </div>
            )}

            {/* SHORT DESCRIPTION */}
            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: product.shortDescription,
                }}
                className="space-y-6 text-base text-neutral-900 dark:text-neutral-100"
              />
            </div>

            {/* OPTION PICKER */}
            <ProductOptions
              pricesPer={product.pricesPer}
              prices={product.prices}
              name={product.name}
              id={product.id}
              image={{
                url: product.images.main.url,
                alt: product.images.main.alt,
              }}
              stock={product.stock}
              slug={productSlug}
              category={category}
              isInModale={false}
            />

            <section aria-labelledby="details-heading" className="mt-12">
              <h2 id="details-heading" className="sr-only">
                Additional details
              </h2>

              {/* ANALYSES */}
              {"analyses" in product && (
                <div className="divide-y divide-gray-200 border-t">
                  <Disclosure as="div">
                    <h3>
                      <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-data-[open]:text-green capitalize">
                          {t("singleProduct.analyzes")}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="block h-6 w-6 text-neutral-600 group-hover:text-neutral-500 dark:text-neutral-300 dark:group-hover:text-neutral-200 group-data-[open]:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="hidden h-6 w-6 text-neutral-600 group-hover:text-neutral-500 dark:text-neutral-300 dark:group-hover:text-neutral-200 group-data-[open]:block"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel
                      transition
                      className="prose prose-sm pb-6 origin-top transition duration-300 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
                    >
                      <ul role="list">
                        {Object.entries(product.analyses).map(([key, value]) => (
                          <li key={key}>
                            <Link href={value} target="_blank" className="underline flex gap-1 capitalize text-neutral-900 dark:text-neutral-100">
                              {key} <ArrowUpRightIcon className="w-3 h-3 mt-1 text-green" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </DisclosurePanel>
                  </Disclosure>
                </div>
              )}

              {/* ORIGIN AND GROWING METHOD */}
              {"grower" in product && (
                <div className="divide-y divide-gray-200 border-t">
                  <Disclosure as="div">
                    <h3>
                      <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-data-[open]:text-green capitalize">
                          {t("singleProduct.origin")}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="block h-6 w-6 text-neutral-600 group-hover:text-neutral-500 dark:text-neutral-300 dark:group-hover:text-neutral-200 group-data-[open]:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="hidden h-6 w-6 text-neutral-600 group-hover:text-neutral-500 dark:text-neutral-300 dark:group-hover:text-neutral-200 group-data-[open]:block"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel
                      transition
                      className="prose prose-sm pb-6 transition duration-300 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
                    >
                      <ul role="list">
                        <li className="flex items-center gap-3 text-neutral-900 dark:text-neutral-100">
                          Pays:
                          <Image src={`/${product.grower}.png`} alt={`${product.grower} flag`} width={30} height={30} />
                        </li>
                        {"growingMethod" in product && (
                          <li className="flex items-center gap-3 text-neutral-900 dark:text-neutral-100">
                            {product.growingMethod}
                            <Image src={`/${product.growingMethod.toLocaleLowerCase()}.png`} alt={product.growingMethod} width={30} height={30} />
                          </li>
                        )}
                      </ul>
                    </DisclosurePanel>
                  </Disclosure>
                </div>
              )}

              {/* ORIGIN AND GROWING METHOD */}
              {"cannabinoids" in product && (
                <div className="divide-y divide-gray-200 border-t">
                  <Disclosure as="div">
                    <h3>
                      <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-data-[open]:text-green capitalize">
                          {t("singleProduct.cannabinoids")}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="block h-6 w-6 text-neutral-600 group-hover:text-neutral-500 dark:text-neutral-300 dark:group-hover:text-neutral-200 group-data-[open]:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="hidden h-6 w-6 text-neutral-600 group-hover:text-neutral-500 dark:text-neutral-300 dark:group-hover:text-neutral-200 group-data-[open]:block"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel
                      transition
                      className="prose prose-sm pb-6 transition duration-300 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
                    >
                      <ul role="list">
                        {Object.entries(product.cannabinoids).map(([key, value]) => (
                          <li key={key} className="flex items-end gap-3 h-[45px]">
                            {key}: {value} %
                            <Image src={`/${key.toLocaleLowerCase()}.png`} alt={`molecul of ${key}`} width={75} height={75} />
                          </li>
                        ))}
                      </ul>
                    </DisclosurePanel>
                  </Disclosure>
                </div>
              )}

              {/* TERPENES */}
              {"terpenes" in product && (
                <div className="divide-y divide-gray-200 border-t">
                  <Disclosure as="div">
                    <h3>
                      <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-data-[open]:text-green capitalize">
                          {t("singleProduct.terpenes")}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="block h-6 w-6 text-neutral-600 group-hover:text-neutral-500 dark:text-neutral-300 dark:group-hover:text-neutral-200 group-data-[open]:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="hidden h-6 w-6 text-neutral-600 group-hover:text-neutral-500 dark:text-neutral-300 dark:group-hover:text-neutral-200 group-data-[open]:block"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel
                      transition
                      className="prose prose-sm pb-6 transition duration-300 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
                    >
                      {/* <ul role="list">
                        {Object.entries(product.terpenes).map(([key, value]) => (
                          <>
                            <li key={key} className="flex items-center gap-3 text-neutral-900 dark:text-neutral-100 capitalize">
                              {key}: {value}
                              <Image src={`/${key.toLocaleLowerCase()}.png`} alt={key} width={40} height={40} />
                            </li>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-neutral-400">
                              <div
                                className={`${
                                  terpenesToColor[key.toLocaleLowerCase()]
                                } h-1.5 rounded-full`}
                                style={{ width: `${parseInt(value) * 20}%` }}
                              ></div>
                            </div>
                          </>
                        ))}
                      </ul> */}
                    </DisclosurePanel>
                  </Disclosure>
                </div>
              )}
            </section>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row">
          <ShippingCalendar />

          <ShareSocialMedia shortDescription={product.shortDescription} />
        </div>
        <div className="pt-16" dangerouslySetInnerHTML={{ __html: product.longDescription }} />

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
              <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 capitalize" id="reviews">
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
                        <div
                          dangerouslySetInnerHTML={{ __html: review.content }}
                          className="mt-3 space-y-6 text-sm text-neutral-900 dark:text-neutral-100"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex items-center text-sm lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:flex-col lg:items-start xl:col-span-3">
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">{review.author}</p>
                      <time
                        dateTime={new Date(review.date).toLocaleString()}
                        className="ml-4 border-l border-gray-200 pl-4 text-neutral-600 dark:text-neutral-400 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0"
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
            <h2 id="related-heading" className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
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
                    <p className="text-neutral-600 dark:text-neutral-400 p-1 text-md sm:text-xs">
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
