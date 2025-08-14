import type { Metadata } from "next";

import ForgotPasswordForm from "@/app/components/ForgotPasswordForm";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { linkClassname } from "@/app/staticData/cartPageClasses";

interface Params {
  params: {
    locale: string;
  };
}

interface GenerateMetadataParams {
  params: { locale: string };
}

export async function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }, { locale: "es" }];
}

export async function generateMetadata({ params }: GenerateMetadataParams): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "forgotPasswordPage" });

  return {
    title: t("metadataTitle"),
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
        "max-video-preview": -1,
        "max-image-preview": "none",
        "max-snippet": -1,
      },
    },
  };
}

export default async function Page({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "forgotPassword" });
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center px-6 py-12 lg:px-8 bg-gray-50">
      <div className="w-full sm:max-w-md">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm mb-8">
          <Image alt={t("logoAltText")} width={50} height={50} src={`/canna-vert.png`} className="mx-auto h-12 w-auto" />
          <h1 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">{t("h1")}</h1>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600 max-w-sm mx-auto">{t("introText")}</p>
        <p className="text-yellow-500 font-bold italic mb-4 text-center mt-5">{t("operation")}</p>
        <div className={twMerge("mt-8 bg-white px-6 py-8 shadow rounded-lg sm:px-10 sm:py-10")}>
          <ForgotPasswordForm />
        </div>
        <p className="mt-8 text-center text-sm text-gray-500">
          {t("rememberPasswordPrompt")}
          <Link href={`/${locale}/connexion`} className={twMerge(linkClassname)}>
            {t("loginLinkText")}
          </Link>
        </p>
      </div>
    </div>
  );
}
