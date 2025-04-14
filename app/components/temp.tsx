import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

import SignInForm from "@/app/components/SignInForm";

import { linkClassname } from "@/app/staticData/cartPageClasses";

interface Params {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "signIn" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function Page({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "signIn" });
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center px-6 py-12 lg:px-8 bg-gray-50">
      <div className="w-full sm:max-w-md">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm mb-8">
          <Image alt="Logo monplancbd" width={80} height={80} src={`/canna-vert.png`} className="mx-auto h-12 w-auto" />
          <h1 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">{t("title")}</h1>
        </div>
        <div className={twMerge("bg-white px-6 py-8 shadow rounded-lg sm:px-10 sm:py-10")}>
          <SignInForm />

          <p className="mt-8 text-center text-sm text-gray-500">
            Pas encore membre?{" "}
            <Link href="/inscription" className={twMerge(linkClassname)}>
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
