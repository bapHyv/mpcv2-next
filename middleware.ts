import createIntlMiddleware from "next-intl/middleware"; // Renamed import for clarity
import { locales } from "@/i18n.config";
import { NextResponse, NextRequest } from "next/server";

// Initialize the next-intl middleware function
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: "fr",
});

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  let modifiedRequest = request;

  if (requestHeaders.get("origin")?.toLowerCase() === "null") {
    requestHeaders.delete("origin");

    // Create a new request object with the modified headers.
    // We clone the URL and copy other essential properties.
    modifiedRequest = new NextRequest(request.nextUrl.clone(), {
      headers: requestHeaders,
      method: request.method,
      body: request.body,
      credentials: request.credentials,
      cache: request.cache,
      redirect: request.redirect,
      integrity: request.integrity,
      keepalive: request.keepalive,
      signal: request.signal,
      geo: request.geo,
      ip: request.ip,
    });
  }
  const { pathname } = modifiedRequest.nextUrl;
  const accessToken = modifiedRequest.cookies.get("accessToken")?.value;

  const pathLocale = locales.find((locale) => pathname.startsWith(`/${locale}`));

  // Check for protected route access without token
  if (pathLocale && pathname.startsWith(`/${pathLocale}/mon-compte`) && !accessToken) {
    return NextResponse.redirect(new URL(`/${pathLocale}/connexion`, modifiedRequest.url));
  }

  // Check for accessing login/signup while already logged in
  if (pathLocale && (pathname === `/${pathLocale}/connexion` || pathname === `/${pathLocale}/inscription`) && accessToken) {
    return NextResponse.redirect(new URL(`/${pathLocale}`, modifiedRequest.url));
  }

  // Pass the potentially modified request to the next-intl middleware
  const intlResponse = intlMiddleware(modifiedRequest);

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|assets|sw.js|.*\\.\\w+).*)"],
};
