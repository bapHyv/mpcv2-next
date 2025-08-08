import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { Providers } from "@/app/providers";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import AgeVerificationOverlay from "@/app/components/AgeVerificationOverlay";
import CookieConsentBanner from "@/app/components/CookieConsentBanner";

export const metadata: Metadata = {
  title: "Monplancbd",
  description: "Les meilleures fleurs aux meilleurs prix",
};

export const viewport: Viewport = {
  colorScheme: "light",
};

const myFont = localFont({
  src: [
    {
      path: "../fonts/noirPro/NoirPro-Bold.woff2",
      weight: "700",
      style: "bold",
    },
    {
      path: "../fonts/noirPro/NoirPro-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../fonts/noirPro/NoirPro-Heavy.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../fonts/noirPro/NoirPro-HeavyItalic.woff2",
      weight: "900",
      style: "italic",
    },
    {
      path: "../fonts/noirPro/NoirPro-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/noirPro/NoirPro-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/noirPro/NoirPro-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/noirPro/NoirPro-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/noirPro/NoirPro-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/noirPro/NoirPro-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/noirPro/NoirPro-SemiBoldItalic.woff2",
      weight: "600",
      style: "italic",
    },
  ],
});

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();

  return (
    <html className="scroll-smooth" lang={locale} suppressHydrationWarning>
      <body className={`${myFont.className} max-w-[1920px] m-auto`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <AgeVerificationOverlay />
            <NavBar locale={locale} />
            <main className="min-h-screen 2xl:px-0 sm:pt-20">{children}</main>
            <Footer locale={locale} />
            <CookieConsentBanner />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
