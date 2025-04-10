import Image from "next/image";
import Link from "next/link";

import { ShoppingBagIcon, NewspaperIcon } from "@heroicons/react/24/outline";

import ProfileHeader from "@/app/components/header/ProfileHeader";
import SideCart from "@/app/components/cart/SideCart";
import BurgerMenuHeader from "@/app/components/header/BurgerMenuHeader";
import LanguageSelector from "@/app/components/header/LanguageSelector";

export default async function NavBar({ locale }: { locale: string }) {
  return (
    <nav className="fixed bottom-0 bg-black sm:top-0 sm:bottom-auto w-full max-w-[1920px] z-[5000] flex">
      <div className="relative w-full px-3 sm:px-2 lg:px-8 my-1">
        {/* PHONE ITEMS */}
        <div className="flex items-center justify-around sm:hidden">
          {/* BURGER MENU PHONE */}
          <BurgerMenuHeader locale={locale} />

          {/* PROFILE DROPDOWN PHONE */}
          <ProfileHeader locale={locale} />

          {/* LOGO PHONE */}
          <Link href={`/${locale}`}>
            <Image alt="Monplancbd" src="/logo_fleur_verte_souligne_blanc.png" width={50} height={50} />
          </Link>

          {/* PRODUCTS LINK PHONE */}
          <Link href={`/${locale}/fleurs-cbd`}>
            <ShoppingBagIcon className="w-10 h-10 text-white" />
          </Link>

          {/* CART BUTTON AND SIDE CART */}
          <SideCart />
        </div>

        {/* TABLET AND DESKTOP ITEMS */}
        <div className="hidden sm:flex items-center justify-between">
          {/* LOGO TABLET AND DESKTOP */}
          <div className="w-[15%] sm:w-[20%]">
            <Link href={`/${locale}`}>
              <Image alt="Monplancbd" src="/logo-blanc.png" width={80} height={80} />
            </Link>
          </div>

          {/* PRODUCTS BUTTON TABLET AND DESKTOP */}
          <Link
            href={`/${locale}/fleurs-cbd`}
            className="bg-green px-3 py-2 text-white uppercase rounded-md font-semibold text-sm flex items-center hover:bg-dark-green"
          >
            <Image src="/canna-blanc.png" alt="logo CBD blanc" height={20} width={20} className="mr-2" />
            <span className="block mt-1">produits</span>
          </Link>

          {/* BLOG LINK TABLET AND DESKTOP */}
          <Link
            href={`/${locale}/blog`}
            className="bg-green px-3 py-2 text-white uppercase rounded-md font-semibold text-sm flex items-center hover:bg-dark-green"
          >
            <NewspaperIcon className="w-5 h-5 text-white mr-2" />
            <span className="block mt-1">blog</span>
          </Link>

          <div className="flex justify-between w-[15%] sm:w-[25%]">
            {/* LANGUAGE SELECTOR TABLET AND DESKTOP */}
            <LanguageSelector locale={locale} />

            <ProfileHeader locale={locale} />

            <SideCart />
          </div>
        </div>
      </div>
    </nav>
  );
}
