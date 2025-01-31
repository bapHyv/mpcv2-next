import Carousel from "@/app/components/Carousel";
import HeroCarousel from "@/app/components/HeroCarousel";
import ProductCard from "@/app/components/products/ProductCard";
import Title from "@/app/components/Title";
import { CreditCardIcon, GiftIcon, StarIcon, TruckIcon, ShoppingBagIcon } from "@heroicons/react/20/solid";
import ServiceCard from "@/app/components/homepage/ServiceCard";
import Image from "next/image";
import { Flower, Hash, Oil } from "@/app/types/productsTypes";
import { v4 as uuid } from "uuid";
import ProductCardSkeleton from "@/app/components/products/ProductCardSkeleton";
import { getTranslations } from "next-intl/server";
import clsx from "clsx";

interface Params {
  locale: string;
}

interface APIResponse<k> {
  [productId: string]: k;
}

async function getFlowers() {
  const response = await fetch(`${process.env.API_HOST}/products/fleurs-cbd`);
  const data: APIResponse<Flower> = await response.json();
  //TODO: REMOVE FILTER ON STOCK
  const formatedFlowers = Object.values(data).filter((e) => !!parseInt(e.stock));

  return formatedFlowers;
}

async function getHashs() {
  const response = await fetch(`${process.env.API_HOST}/products/pollens-resines-hash-cbd`);
  const data: APIResponse<Hash> = await response.json();
  //TODO: REMOVE FILTER ON STOCK
  const formatedHashs = Object.values(data).filter((e) => !!parseInt(e.stock));

  return formatedHashs;
}

async function getOils() {
  const response = await fetch(`${process.env.API_HOST}/products/huiles-cbd`);
  const data: APIResponse<Oil> = await response.json();
  //TODO: REMOVE FILTER ON STOCK
  const formatedOils = Object.values(data).filter((e) => !!parseInt(e.stock));

  return formatedOils;
}

// TODO: ADD PHONE NUMBER AND TRUSTPILOT

export default async function Page({ locale }: Params) {
  const t = await getTranslations({ locale, namespace: "HomePage" });

  const flowersData = getFlowers();
  const hashsData = getHashs();
  const oilsData = getOils();

  const [flowers, hashs, oils] = await Promise.all([flowersData, hashsData, oilsData]);

  const productCardsSkeleton: JSX.Element[] = new Array(8).fill(0).map(() => <ProductCardSkeleton key={uuid()} />);

  const services = [
    {
      icon: <TruckIcon className="text-white h-10 w-10 z-10" />,
      title: t("services.delivery.title"),
      text: t("services.delivery.text"),
    },
    {
      icon: <CreditCardIcon className="text-white h-10 w-10 z-10" />,
      title: t("services.payment.title"),
      text: t("services.payment.text"),
    },
    {
      icon: <ShoppingBagIcon className="text-white h-10 w-10 z-10" />,
      title: t("services.products.title"),
      text: t("services.products.text"),
    },
    {
      icon: <GiftIcon className="text-white h-10 w-10 z-10" />,
      title: t("services.fidelity.title"),
      text: t("services.fidelity.text"),
    },
    {
      icon: <StarIcon className="text-white h-10 w-10 z-10" />,
      title: t("services.sponsoring.title"),
      text: t("services.sponsoring.text"),
    },
  ];

  const titleClassname = clsx(
    "relative mt-4 mb-6 text-xl text-white font-bold",
    "after:content-['_'] after:absolute after:left-0 after:2xl:left-2 after:-bottom-1 after:h-1 after:w-8 after:bg-white",
    "sm:mt-8 ",
    "2xl:pl-2 "
  );

  return (
    <>
      <section className="">
        <HeroCarousel />
      </section>
      <section>
        <Title title={t("flowers")} type="h2" classname={titleClassname} firstLetterClassname="text-xl lowercase" />
        <Carousel length={flowers ? flowers.length : 0}>
          {!flowers
            ? productCardsSkeleton
            : flowers.map((flower) => (
                <ProductCard key={flower.id} {...flower} locale={locale} category={"fleurs-cbd"} mainDivClassname="rounded-md" />
              ))}
        </Carousel>
      </section>
      <section>
        <Title title={t("hashs")} type="h2" classname={titleClassname} firstLetterClassname="text-xl lowercase" />
        <Carousel length={hashs ? hashs.length : 0}>
          {!hashs
            ? productCardsSkeleton
            : hashs.map((hash) => (
                <ProductCard key={hash.id} {...hash} locale={locale} category={"pollens-resines-hash-cbd"} mainDivClassname="rounded-md" />
              ))}
        </Carousel>
      </section>
      <section>
        <Title title={t("oils")} type="h2" classname={titleClassname} firstLetterClassname="text-xl lowercase" />
        <Carousel length={oils ? oils.length : 0}>
          {!oils
            ? productCardsSkeleton
            : oils.map((oil) => <ProductCard key={oil.id} {...oil} locale={locale} category={"huiles-cbd"} mainDivClassname="rounded-md" />)}
        </Carousel>
      </section>
      <section className="relative mt-4 sm:mt-8">
        <div
          style={{
            position: "absolute",
            backgroundAttachment: "local",
            backgroundClip: "padding-box",
            backgroundImage: "url(/service_bg_hp.jpeg)",
            backgroundOrigin: "padding-box",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            height: "100%",
            width: "100%",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            backgroundAttachment: "local",
            backgroundClip: "padding-box",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backgroundOrigin: "padding-box",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backdropFilter: "blur(5px)",
            height: "100%",
            width: "100%",
            zIndex: 2,
          }}
        />
        <div className="flex justify-center">
          <Title
            title={t("services.title")}
            type="h2"
            classname={`relative mt-4 mb-6 uppercase text-xl text-white font-bold tracking-widest
            after:content-['_'] after:absolute after:left-0 after:-bottom-1 after:h-1.5 after:w-16 after:bg-green
            dark:after:bg-white z-10`}
            firstLetterClassname="text-4xl"
          />
        </div>
        <div className="w-full lg:w-4/5 m-auto px-2 flex flex-col sm:flex-row justify-center gap-5 sm:flex-wrap">
          {services.map((service) => (
            <ServiceCard key={service.title} icon={service.icon} title={service.title} text={service.text} />
          ))}
        </div>
        <div className="h-10" />
      </section>
      <section className="mt-10">
        <div className="flex flex-col md:items-center lg:flex-row lg:gap-x-5 lg:items-start">
          <Image src="/section_cbd.jpg" alt={t("cbdSection.imgAlt")} width={550} height={367} />
          <div>
            <Title
              title={t("cbdSection.title")}
              type="h2"
              classname={`relative mt-4 mb-6 uppercase text-xl text-black dark:text-white font-bold tracking-widest
              after:content-['_'] after:absolute after:left-0 after:-bottom-1 after:h-1.5 after:w-16 after:bg-green
              dark:after:bg-white z-10`}
              firstLetterClassname="text-4xl"
            />
            <p className="lg:pr-4 text-justify">{t("cbdSection.text")}</p>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <div className="flex flex-col md:items-center lg:flex-row-reverse lg:gap-x-5 lg:items-start">
          <Image src="/service_bg_hp.jpeg" alt={t("cbdPassion.imgAlt")} width={550} height={367} />
          <div>
            <Title
              title={t("cbdPassion.title")}
              type="h2"
              classname={`relative mt-4 mb-6 uppercase text-xl text-black dark:text-white font-bold tracking-widest
              after:content-['_'] after:absolute after:left-0 after:-bottom-1 after:h-1.5 after:w-16 after:bg-green
              dark:after:bg-white z-10`}
              firstLetterClassname="text-4xl"
            />
            <p className="text-justify">{t("cbdPassion.text")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
