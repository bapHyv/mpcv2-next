import createMiddleware from "next-intl/middleware";
import { Locale, locales } from "@/i18n.config";

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  // Used when no locale matches
  defaultLocale: "fr",
});

export const config = {
  // Match only internationalized pathnames
  // Update locales here
  matcher: ["/", "/(fr|en|es)/:path*"],
};
