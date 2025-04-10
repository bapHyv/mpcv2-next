"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("error");
  const locale = useLocale();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-black sm:text-4xl">{t("message")}</h2>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href={`/${locale}`}>
              <button
                className="rounded-md bg-green px-3.5 py-2.5 text-sm 
              font-semibold text-white shadow-sm hover:bg-light-green 
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {t("button")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
