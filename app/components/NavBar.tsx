import Image from "next/image";
import Link from "next/link";
import { NewspaperIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

import SideCart from "@/app/components/cart/SideCart";
import BurgerMenuHeader from "@/app/components/header/BurgerMenuHeader";
import LanguageSelector from "@/app/components/header/LanguageSelector";

import { buttonClassname, iconHeaderClassname } from "@/app/staticData/cartPageClasses";

export default async function NavBar({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "navbar" });

  return (
    <nav className={clsx("fixed bottom-0 md:top-0 md:bottom-auto", "w-full max-w-[1920px] mx-auto", "bg-black z-[6500]")}>
      <div className="relative w-full px-3 md:px-4 lg:px-8 py-1 md:py-2">
        <div className="flex h-12 items-center justify-around md:hidden">
          {/* BURGER MENU PHONE */}
          <BurgerMenuHeader />
          {/* LANGUAGE SELECTOR PHONE */}
          <LanguageSelector />
          {/* LOGO PHONE (Central Item) */}
          <Link href={`/${locale}`} className="flex-shrink-0">
            <Image alt={t("mainLogoAlt")} src="/logo-blanc.png" width={55} height={55} className="h-auto" />
          </Link>
          {/* PROFILE LINK/ICON PHONE */}
          <Link href={`/${locale}/mon-compte/profil`}>
            <UserCircleIcon className={iconHeaderClassname} />
          </Link>
          {/* CART BUTTON AND SIDE CART */}
          <SideCart />
        </div>
        {/* --- TABLET AND DESKTOP VIEW --- */}
        <div className="hidden md:flex h-16 items-center justify-between gap-x-4 lg:gap-x-6">
          <div className="flex-shrink-0">
            <Link href={`/${locale}`}>
              <Image alt={t("mainLogoAlt")} src="/logo-blanc.png" width={80} height={80} className="h-auto" />
            </Link>
          </div>
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* PRODUCTS BUTTON */}
            <Link href={`/${locale}/fleurs-cbd`} className={twMerge(buttonClassname, "px-4 py-2 text-sm inline-flex items-center")}>
              <Image src="/canna-blanc.png" alt={t("cbdLogoAlt")} height={20} width={20} className="mr-2" />
              <div>
                <span>{t("productsLink")}</span>
              </div>
            </Link>

            {/* BLOG LINK */}
            <Link href={`/${locale}/blog`} className={twMerge(buttonClassname, "px-4 py-2 text-sm inline-flex items-center")}>
              <NewspaperIcon className="w-5 h-5 text-white mr-2" />
              <div>
                <span>{t("blogLink")}</span>
              </div>
            </Link>
          </div>
          {/* Right-Side Icons */}
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* LANGUAGE SELECTOR */}
            <LanguageSelector />

            {/* PROFILE LINK */}
            <Link href={`/${locale}/mon-compte/profil`}>
              <UserCircleIcon className={iconHeaderClassname} />
            </Link>

            {/* CART BUTTON AND SIDE CART */}
            <SideCart />
          </div>
        </div>
      </div>
    </nav>
  );
}
