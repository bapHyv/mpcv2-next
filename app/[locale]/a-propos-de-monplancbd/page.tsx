import type { Metadata } from "next";
import { linkClassname } from "@/app/staticData/cartPageClasses";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

interface GenerateMetadataParams {
  params: { locale: string };
}

export async function generateMetadata({ params }: GenerateMetadataParams): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "" });
  const siteBaseUrl = process.env.MAIN_URL || "https://www.monplancbd.fr";

  const title = t("metadataAbout.title");
  const description = t("metadataAbout.description");

  return {
    title: title,
    description: description,
    keywords: t("metadataAbout.keywords")
      .split(",")
      .map((k) => k.trim()),
    alternates: {
      canonical: `${siteBaseUrl}/${locale}/a-propos-de-monplancbd`,
      languages: {
        "fr-FR": `${siteBaseUrl}/fr/a-propos-de-monplancbd`,
        "en-US": `${siteBaseUrl}/en/a-propos-de-monplancbd`,
        "es-ES": `${siteBaseUrl}/es/a-propos-de-monplancbd`,
        "x-default": `${siteBaseUrl}/fr/a-propos-de-monplancbd`,
      },
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
      description: description,
      url: `${siteBaseUrl}/${locale}/a-propos-de-monplancbd`,
      siteName: t("global.brandName"),
      images: [
        {
          url: `${siteBaseUrl}/og-image-about.jpg`,
          width: 1200,
          height: 630,
          alt: t("metadataAbout.ogImageAlt"),
        },
      ],
      locale: locale.replace("-", "_"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [`${siteBaseUrl}/og-image-about.jpg`],
    },
  };
}

interface Params {
  params: {
    locale: string;
  };
}

export default async function Page({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "about" });
  return (
    <div className="utility-page">
      {" "}
      {/* Apply base styling for utility pages */}
      {/* Page Title (H1) */}
      <h1>{t("pageTitle")}</h1>
      {/* Optional: Placeholder for an authentic image */}
      <div className="my-6 flex justify-center">
        <Image
          src="/bayonne.jpg"
          alt={t("imageAlt")} // Add translation for image alt text
          width={600} // Adjust dimensions
          height={400}
          className="rounded-lg shadow-md object-cover"
        />
      </div>
      {/* Section 1: The Spark - Origin Story */}
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mt-8 mb-4">{t("section1.title")}</h2>
      <p>{t("section1.para1")}</p>
      <p>{t("section1.para2")}</p>
      <p>{t("section1.para3")}</p>
      {/* Section 2: Our Commitment - Quality & Transparency */}
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mt-8 mb-4">{t("section2.title")}</h2>
      <p>{t("section2.intro")}</p>
      <ul className="list-disc list-inside space-y-2 my-4 text-gray-700">
        {" "}
        {/* Styled list */}
        <li>
          <strong>{t("section2.item1.label")}</strong> {t("section2.item1.text")}
        </li>
        <li>
          <strong>{t("section2.item2.label")}</strong> {t("section2.item2.text")}
        </li>
        <li>
          <strong>{t("section2.item3.label")}</strong> {t("section2.item3.text")}
        </li>
        <li>
          <strong>{t("section2.item4.label")}</strong> {t("section2.item4.text")}
        </li>
      </ul>
      {/* Section 3: More Than Products - A Vision for Wellness */}
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mt-8 mb-4">{t("section3.title")}</h2>
      <p>{t("section3.para1")}</p>
      <p>{t("section3.para2")}</p>
      <p>{t("section3.para3")}</p>
      {/* Concluding Call-to-Action */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        {" "}
        {/* Added spacing and separator */}
        <p className="mb-4 text-gray-600">{t("cta.intro")}</p>
        <div className="flex flex-wrap justify-center gap-4">
          {" "}
          {/* Flex layout for links */}
          <Link href={`/${locale}/fleurs-cbd`} className={linkClassname}>
            {t("cta.link1")}
          </Link>
          <Link href={`/${locale}/huiles-cbd`} className={linkClassname}>
            {t("cta.link2")}
          </Link>
          <Link href={`/${locale}/blog`} className={linkClassname}>
            {t("cta.link3")}
          </Link>
        </div>
      </div>
    </div>
  );
}
