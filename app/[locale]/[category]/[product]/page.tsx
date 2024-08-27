import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { StarIcon } from "@heroicons/react/20/solid";
import {
  ArrowUpRightIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { categories } from "@/app/types/productsTypes";
import fakeProductFromJSON from "@/app/fakeData/product.json";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { terpenesToColor } from "@/app/utils/terpenesToColor";
import {
  findHighest,
  findHighestQuantity,
  findCategory,
} from "@/app/utils/productFunctions";
import ProductOptions from "@/app/components/products/ProductOptions";
import ProductPrice from "@/app/components/products/ProductPrice";

interface Params {
  params: {
    locale: string;
    category: string;
    product: string;
  };
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const shortAndLongDescription = {
  shortDescription: `
    <p>Découvrez la A6 CBD, une fleur de chanvre française exceptionnelle.
    Ses arômes envoûtants de terre, de bois et d’agrumes, ainsi que ses effets relaxants puissants, 
    en font un choix incontournable pour les amateurs de CBD. En infusion ou en vaporisation, 
    cette fleur vous offre un moment de détente inégalé et une expérience sensorielle unique.</p>
  `,
  longDescription: `
    <h2 class="text-green text-2xl">A6 CBD  : Une Fleur de Chanvre d’Exception pour le Bien-Être Naturel</h2>
    <p>Découvrez la A6 CBD, une fleur de chanvre unique, issue du croisement entre deux variétés légendaires : l’ACDC et la Sour Tsunami.
    Ce croisement innovant a été réalisé par SilikSeeds, une entreprise renommée dans la création de génétiques de chanvre de haute qualité.
    La combinaison de ces deux variétés donne naissance à une fleur exceptionnelle,
    idéale pour les amateurs de bien-être naturel à la recherche de produits premium.</p>
    <h2 class="text-green text-2xl">Caractéristiques de la A6</h2>
    <ul>
      <li><span class="font-bold text-xl ">Origine et Culture</span> : Cultivée en France dans un environnement contrôlé, la A6 CBD bénéficie de conditions optimales qui lui permettent de développer pleinement ses propriétés thérapeutiques. La culture sous serre garantit une qualité constante et supérieure, préservant ainsi la pureté et la puissance de ses cannabinoïdes.</li>
      <li><span class="font-bold text-xl">Aspect et Parfum</span> : La A6 CBD se distingue par ses fleurs compactes et résineuses, couvertes de trichomes scintillants et de pistils orangés. Son parfum est une harmonie envoûtante de notes terreuses et boisées, mêlées à des nuances d’agrumes et de fruits tropicaux.</li>
      <li><span class="font-bold text-xl">Réduction du Stress</span> : Aide à apaiser l’esprit et à réduire les niveaux de stress et d’anxiété.</li>
    </ul>
  `,
};

export default async function Page({ params: { locale, category } }: Params) {
  const t = await getTranslations({ locale });

  const categories: categories = [
    {
      url: "fleurs%20de%20cbd",
      category: "fleurs",
      title: t("category.flower"),
    },
    { url: "hash%20de%20cbd", category: "hashs", title: t("category.hash") },
    { url: "moonrocks", category: "moonrocks", title: t("category.moonrock") },
    { url: "huiles", category: "huiles", title: t("category.oil") },
    { url: "infusions", category: "infusions", title: t("category.herbalTea") },
    { url: "soins", category: "soins", title: t("category.health") },
    {
      url: "vaporisateurs",
      category: "vaporisateurs",
      title: t("category.vaporizer"),
    },
  ];

  const currentCategory = findCategory(categories, category);

  const product = fakeProductFromJSON[currentCategory];

  const cannabinoidRating =
    "cannabinoids" in product ? findHighest(product.cannabinoids) : null;

  product.shortDescription = shortAndLongDescription.shortDescription;
  product.longDescription = shortAndLongDescription.longDescription;

  return (
    <div className="bg-white dark:bg-light-black">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <TabGroup className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <TabList className="grid grid-cols-4 gap-6">
                {product.image.IMAGES.map((image) => (
                  <Tab
                    key={image.alt}
                    className={`group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm
                      font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4`}
                  >
                    <span className="sr-only">{image.alt}</span>
                    <span className="absolute inset-0 overflow-hidden rounded-md">
                      <Image
                        alt={image.alt}
                        src={image.url}
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
              {product.image.IMAGES.map((image) => (
                <TabPanel key={image.alt}>
                  <Image
                    alt={image.alt}
                    src={image.url}
                    width={1920}
                    height={1080}
                    className="h-full w-full object-cover object-center sm:rounded-lg border border-green rounded-md shadow-xl"
                  />
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>

          {/* fakeProduct info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              {product.name}
              {cannabinoidRating && (
                <span className="text-green dark:text-light-green">
                  {` - ${cannabinoidRating?.name}: ${cannabinoidRating?.value}%`}
                </span>
              )}
            </h1>

            {/* PRODUCT PRICE */}
            <ProductPrice id={product.id} />

            {/* Reviews */}
            {!!parseInt(product.rating.quantity) && (
              <div className="mt-3">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        aria-hidden="true"
                        className={classNames(
                          parseInt(product.rating.value) > rating
                            ? "text-yellow-300"
                            : "text-gray-300",
                          "h-5 w-5 flex-shrink-0"
                        )}
                      />
                    ))}
                  </div>
                  <Link
                    href="#reviews"
                    className="text-green dark:text-light-green"
                  >
                    {product.rating.quantity} avis
                  </Link>
                  <p className="sr-only">
                    {product.rating.value} out of 5 stars
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>

              <div
                dangerouslySetInnerHTML={{
                  __html: product.shortDescription,
                }}
                className="space-y-6 text-base text-neutral-900 dark:text-neutral-100"
              />
            </div>

            {/* Option picker */}
            <ProductOptions
              prices={product.prices}
              name={product.name}
              id={product.id}
              image={{
                IMAGE_ALT: product.image.IMAGES[0].alt,
                IMAGE_URL: product.image.IMAGES[0].url,
              }}
              stock={product.stock}
            />

            <section aria-labelledby="details-heading" className="mt-12">
              <h2 id="details-heading" className="sr-only">
                Additional details
              </h2>

              {/* ANALYSES */}
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
                          <Link
                            href={value}
                            target="_blank"
                            className="underline flex gap-1 capitalize text-neutral-900 dark:text-neutral-100"
                          >
                            {key}{" "}
                            <ArrowUpRightIcon className="w-3 h-3 mt-1 text-green" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </DisclosurePanel>
                </Disclosure>
              </div>

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
                          <Image
                            src={`/${product.grower}.png`}
                            alt={`${product.grower} flag`}
                            width={30}
                            height={30}
                          />
                        </li>
                        {"growingMethod" in product && (
                          <li className="flex items-center gap-3 text-neutral-900 dark:text-neutral-100">
                            {product.growingMethod}
                            <Image
                              src={`/${product.growingMethod.toLocaleLowerCase()}.png`}
                              alt={product.growingMethod}
                              width={30}
                              height={30}
                            />
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
                        {Object.entries(product.cannabinoids).map(
                          ([key, value]) => (
                            <li
                              key={key}
                              className="flex items-end gap-3 h-[45px]"
                            >
                              {key}: {value} %
                              <Image
                                src={`/${key.toLocaleLowerCase()}.png`}
                                alt={`molecul of ${key}`}
                                width={75}
                                height={75}
                              />
                            </li>
                          )
                        )}
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
                      <ul role="list">
                        {Object.entries(product.terpenes).map(
                          ([key, value]) => (
                            <>
                              <li
                                key={key}
                                className="flex items-center gap-3 text-neutral-900 dark:text-neutral-100 capitalize"
                              >
                                {key}: {value}
                                <Image
                                  src={`/${key.toLocaleLowerCase()}.png`}
                                  alt={key}
                                  width={40}
                                  height={40}
                                />
                              </li>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-neutral-400">
                                <div
                                  className={`${
                                    //@ts-ignore
                                    terpenesToColor[key.toLocaleLowerCase()]
                                  } h-1.5 rounded-full`}
                                  style={{ width: `${parseInt(value) * 20}%` }}
                                ></div>
                              </div>
                            </>
                          )
                        )}
                      </ul>
                    </DisclosurePanel>
                  </Disclosure>
                </div>
              )}
            </section>
          </div>
        </div>
        <div
          className="pt-16"
          dangerouslySetInnerHTML={{ __html: product.longDescription }}
        />
        {/* REVIEWS */}
        <div>
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <h2
              className="text-lg font-medium text-neutral-900 dark:text-neutral-100 capitalize"
              id="reviews"
            >
              {t("singleProduct.reviews")}
            </h2>
            <div className="mt-6 space-y-10 divide-y divide-gray-200 border-b border-t border-gray-200 pb-10">
              {!!product.rating.reviews.length &&
                product.rating.reviews.map((review) => (
                  <div
                    key={Math.random()}
                    className="pt-10 lg:grid lg:grid-cols-12 lg:gap-x-8"
                  >
                    <div className="lg:col-span-8 lg:col-start-5 xl:col-span-9 xl:col-start-4 xl:grid xl:grid-cols-3 xl:items-start xl:gap-x-8">
                      <div className="flex items-center xl:col-span-1">
                        <div className="flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                              key={rating}
                              aria-hidden="true"
                              className={classNames(
                                parseInt(review.value) > rating
                                  ? "text-yellow-400"
                                  : "text-gray-200",
                                "h-5 w-5 flex-shrink-0"
                              )}
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
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">
                        {review.user}
                      </p>
                      <time
                        dateTime={review.date}
                        className="ml-4 border-l border-gray-200 pl-4 text-neutral-600 dark:text-neutral-400 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0"
                      >
                        {review.date}
                      </time>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <section aria-labelledby="related-heading">
          <h2
            id="related-heading"
            className="text-lg font-medium text-neutral-900 dark:text-neutral-100"
          >
            {t("singleProduct.relatedProducts")}
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-9 xl:gap-x-8 ">
            {product.relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.name}
                className="group relative border border-green rounded-md shadow-lg bg-neutral-50 lg:col-span-3"
              >
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-md lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <Image
                    alt={relatedProduct.image.IMAGE_ALT}
                    src={relatedProduct.image.IMAGE_URL}
                    width={1920}
                    height={1080}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="p-1 w-full rounded-b-md">
                  <Link
                    href={`/${locale}/${category}${relatedProduct.productUrl}`}
                    className="flex justify-between items-center"
                  >
                    <span aria-hidden="true" className="absolute inset-0" />
                    <p className="text-lg text-green">{relatedProduct.name}</p>
                    {!!parseInt(relatedProduct.rating.quantity) && (
                      <div className="flex items-start">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            aria-hidden="true"
                            className={classNames(
                              parseInt(relatedProduct.rating.value) > rating
                                ? "text-yellow-400"
                                : "text-gray-200",
                              "h-5 w-5 flex-shrink-0"
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </Link>
                </div>
                {"per" in relatedProduct.prices && (
                  <p className="text-neutral-600 dark:text-neutral-400 p-1 text-md sm:text-xs">
                    À partir de{" "}
                    {findHighestQuantity(relatedProduct.prices).price}€/
                    {relatedProduct.prices.per}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
