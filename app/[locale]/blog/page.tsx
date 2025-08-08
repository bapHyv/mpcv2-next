import data from "@/app/staticData/blog.json";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface GenerateMetadataParams {
  params: { locale: string };
}

export async function generateMetadata({ params }: GenerateMetadataParams): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "" });
  const siteBaseUrl = process.env.MAIN_URL || "https://www.monplancbd.fr";

  const title = t("blogPage.metadata.title");
  const description = t("blogPage.metadata.description");

  return {
    title: title,
    description: description,
    keywords: t("blogPage.metadata.keywords")
      .split(",")
      .map((k) => k.trim()),
    alternates: {
      canonical: `${siteBaseUrl}/${locale}/blog`,
      languages: {
        "fr-FR": `${siteBaseUrl}/fr/blog`,
        "en-US": `${siteBaseUrl}/en/blog`,
        "es-ES": `${siteBaseUrl}/es/blog`,
        "x-default": `${siteBaseUrl}/fr/blog`,
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
      url: `${siteBaseUrl}/${locale}/blog`,
      siteName: t("global.brandName"),
      images: [
        {
          url: `${siteBaseUrl}/og-image-blog.jpg`,
          width: 1200,
          height: 630,
          alt: t("blogPage.metadata.ogImageAlt"),
        },
      ],
      locale: locale.replace("-", "_"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [`${siteBaseUrl}/og-image-blog.jpg`],
    },
  };
}

interface Params {
  locale: string;
}

export default function Page({ params }: { params: Params }) {
  const { locale } = params;
  return (
    <>
      <h1 className="mt-4 xl:mt-6 text-center uppercase text-green text-3xl font-medium">Blog</h1>
      <div className="flex flex-wrap justify-center gap-2 my-4 px-2">
        {data.map((e, i) => (
          <Link
            key={`${e.alt}-${i}`}
            href={`/${locale}/blog/${e.href}`}
            className={clsx(
              "w-full flex flex-col items-center gap-1 border border-neutral-300 rounded-md p-2 shadow-md",
              "sm:w-1/3",
              "lg:w-1/4",
              "xl:w-1/5"
            )}
          >
            <h2 className="text-center">{e.title}</h2>
            <div className="w-36 h-36">
              <Image src={e.src} alt={e.alt} width={144} height={144} className="rounded-full object-cover" />
            </div>
            <span className="text-xs text-neutral-400">Published: {e.published}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
