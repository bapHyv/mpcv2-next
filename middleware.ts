import createMiddleware from "next-intl/middleware";
import { locales } from "@/i18n.config";
import { NextRequest, NextResponse } from "next/server";

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  // Used when no locale matches
  defaultLocale: "fr",
});

export const config = {
  // Match only internationalized pathnames
  // Update locales here
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
