"use client";
import { useTranslations } from "next-intl";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("globalError");
  return (
    <html>
      <body>
        <div>
          <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking- dark:text-white text-black sm:text-4xl">
                {t("message")}
              </h2>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <button
                  className="rounded-md bg-green px-3.5 py-2.5 text-sm 
            font-semibold text-white shadow-sm hover:bg-light-green 
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  onClick={() => reset()}
                >
                  {t("button")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
