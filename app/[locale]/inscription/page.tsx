import type { Metadata } from "next";

import SignUpForm from "@/app/components/SignUpForm";
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

export async function generateMetadata({ params }: GenerateMetadataParams): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "signUpPage" });

  return {
    title: t("metadataTitle"), // e.g., "Inscription - MonPlanCBD"
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
  const t = await getTranslations({ locale, namespace: "signUpPage" });
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center px-6 py-12 lg:px-8 bg-gray-50">
      <div className="w-full sm:max-w-md">
        {/* Logo Section */}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm mb-8">
          <Image alt={t("logoAlt")} width={50} height={50} src={`/canna-vert.png`} className="mx-auto h-12 w-auto" />
          <h1 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">{t("h1")}</h1>
        </div>

        {/* Form Section */}
        <div className={twMerge("bg-white px-6 py-8 shadow rounded-lg sm:px-10 sm:py-10")}>
          <SignUpForm />

          {/* Sign In Link */}
          <p className="mt-8 text-center text-sm text-gray-500">
            {t("signInPrompt")}{" "}
            <Link href="/connexion" className={twMerge(linkClassname)}>
              {t("signInLink")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
