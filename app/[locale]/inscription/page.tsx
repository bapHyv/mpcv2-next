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

export async function generateMetadata({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "signUp" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function Page({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "signUp" });
  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8 bg-gray-50">
      <div className="w-full sm:max-w-md">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm mb-8">
          <Image alt="Logo monplancbd" width={50} height={50} src={`/canna-vert.png`} className="mx-auto h-12 w-auto" />
          <h1 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">{t("h1")}</h1>
        </div>

        <div className={twMerge("bg-white px-6 py-8 shadow rounded-lg sm:px-10 sm:py-10")}>
          <SignUpForm />

          <p className="mt-8 text-center text-sm text-gray-500">
            Déjà membre?{" "}
            <Link href="/connexion" className={twMerge(linkClassname)}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
