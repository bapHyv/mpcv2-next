import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { Providers } from "@/app/providers";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Monplancbd",
  description: "Les meilleures fleurs aux meilleurs prix",
};

const myFont = localFont({
  src: [
    {
      path: "../fonts/noirPro/NoirPro-Bold.ttf",
      weight: "700",
      style: "bold",
    },
    {
      path: "../fonts/noirPro/NoirPro-Bold.woff",
      weight: "700",
      style: "bold",
    },
    {
      path: "../fonts/noirPro/NoirPro-Bold.woff2",
      weight: "700",
      style: "bold",
    },
    {
      path: "../fonts/noirPro/NoirPro-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../fonts/noirPro/NoirPro-BoldItalic.woff",
      weight: "700",
      style: "italic",
    },
    {
      path: "../fonts/noirPro/NoirPro-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../fonts/noirPro/NoirPro-Heavy.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../fonts/noirPro/NoirPro-Heavy.woff",
      weight: "900",
      style: "normal",
    },
    {
      path: "../fonts/noirPro/NoirPro-Heavy.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../fonts/noirPro/NoirPro-HeavyItalic.ttf",
      weight: "900",
      style: "italic",
    },
    {
      path: "../fonts/noirPro/NoirPro-HeavyItalic.woff",
      weight: "900",
      style: "italic",
    },
    {
      path: "../fonts/noirPro/NoirPro-HeavyItalic.woff2",
      weight: "900",
      style: "italic",
    },
    {
      path: "../fonts/noirPro/NoirPro-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/noirPro/NoirPro-Italic.woff",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/noirPro/NoirPro-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/noirPro/NoirPro-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/noirPro/NoirPro-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/noirPro/NoirPro-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/noirPro/NoirPro-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/noirPro/NoirPro-LightItalic.woff",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/noirPro/NoirPro-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/noirPro/NoirPro-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/noirPro/NoirPro-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/noirPro/NoirPro-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/noirPro/NoirPro-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/noirPro/NoirPro-MediumItalic.woff",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/noirPro/NoirPro-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/noirPro/NoirPro-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/noirPro/NoirPro-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/noirPro/NoirPro-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/noirPro/NoirPro-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../fonts/noirPro/NoirPro-SemiBoldItalic.woff",
      weight: "600",
      style: "italic",
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
            <NavBar locale={locale} />
            <main className="min-h-screen 2xl:px-0 sm:pt-20">{children}</main>
            <Footer locale={locale} />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
