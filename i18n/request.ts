import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { Locale, locales } from "@/i18n.config";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    locale: locale,
  };
});
