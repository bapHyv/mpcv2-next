import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function GenericNotFound() {
  const t = useTranslations("notFound");
  const locale = useLocale();
  return (
    <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-dark-green">{t("statusCode")}</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-dark-black sm:text-5xl">{t("title")}</h1>
        <p className="mt-6 text-base leading-7 text-gray-600">{t("description")}</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href={`/${locale}`}
            className="rounded-md bg-green px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-light-green
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t("goBackHomeLink")}
          </Link>
        </div>
      </div>
    </main>
  );
}
