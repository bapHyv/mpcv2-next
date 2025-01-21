import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  NewspaperIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { IDropdownItem } from "../types";
import { getTranslations } from "next-intl/server";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import Dropdown from "@/app/components/Dropdown";
import ThemeSwitch from "@/app/components/ThemeSwitch";
import PublicHeader from "@/app/components/ProfileHeader";
import ProfileHeader from "@/app/components/ProfileHeader";

import SideCart from "@/app/components/cart/SideCart";

export default async function NavBar({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "navbar" });
  const isSignedIn = true;

  // Nav: dropdown profile logo produit cart
  // dropdown: blog language theme

  // TODO add locale and trad and icons
  const itemsDropdown: IDropdownItem[] = [
    {
      text: t("hemp"),
      href: "fleurs-cbd",
    },
    {
      text: t("hash"),
      href: "pollens-resines-hash-cbd",
    },
    {
      text: t("moonrock"),
      href: "moonrocks-cbd",
    },
    {
      text: t("oil"),
      href: "huiles-cbd",
    },
    {
      text: t("tea"),
      href: "infusions-cbd",
    },
    {
      text: t("cream"),
      href: "soins-cbd",
    },
    {
      text: t("vaporisateur"),
      href: "vaporisateur",
    },
  ];

  const itemsProfile: IDropdownItem[] = [
    {
      text: t("info"),
      href: `/mon_compte/profile`,
    },
    {
      text: t("addresses"),
      href: `/mon_compte/adresses`,
    },
    {
      text: t("orders"),
      href: `/mon_compte/commandes`,
    },
    {
      text: t("fidelity"),
      href: `/mon_compte/fidelite`,
    },
    {
      text: t("logout"),
      onClick: "logout",
      href: "",
    },
  ];

  const languageSelector = [{ text: "fr" }, { text: "es" }, { text: "en" }];

  /**
   * TODO:
   */

  return (
    <Disclosure
      as="nav"
      className="bg-black fixed bottom-0 sm:top-0 sm:bottom-auto w-full max-w-[1920px] z-50 flex"
    >
      <div className="relative w-full max-w-7xl px-3 sm:px-6 lg:px-8 my-1">
        {/* PHONE ITEMS NAVBAR */}
        <div className="flex items-center justify-around sm:hidden">
          {/* BURGER MENU PHONE */}
          <div className="inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton
              className={`group relative inline-flex items-center justify-center rounded-md text-neutral-100 
                hover:bg-neutral-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white`}
            >
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block h-8 w-8 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden h-8 w-8 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>

          {/* PROFILE DROPDOWN PHONE */}
          <ProfileHeader locale={locale} />

          {/* LOGO PHONE */}
          <Link href={`/${locale}`}>
            <Image
              alt="Monplancbd"
              src="/logo_fleur_verte_souligne_blanc.png"
              width={50}
              height={50}
            />
          </Link>

          {/* PRODUCTS LINK PHONE */}
          <Link href={`/${locale}/${itemsDropdown[0].href}`}>
            <ShoppingBagIcon className="w-10 h-10 text-white" />
          </Link>

          {/* CART BUTTON AND SIDE CART */}
          <SideCart />
        </div>

        <div className="hidden sm:flex flex-1 gap-6 items-center justify-center sm:items-stretch sm:justify-start sm:gap-16">
          {/* LOGO PHONE TABLET AND DESKTOP */}
          <Link href={`/${locale}`}>
            <Image alt="Monplancbd" src="/logo-blanc.png" width={80} height={80} />
          </Link>

          {/* THEME SWITCH TABLET AND DESKTOP */}
          <div className="sm:flex items-center">
            <ThemeSwitch />
          </div>

          {/* PRODUCTS BUTTON TABLET AND DESKTOP */}
          <div className="sm:ml-6 sm:block">
            <div className="flex space-x-4 h-full items-center">
              <Dropdown
                button={
                  <>
                    <span>Produits</span>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 h-5 w-5 text-neutral-100"
                    />
                  </>
                }
                items={itemsDropdown}
                locale={locale}
              />
              <Link
                href={`/${locale}/blog`}
                className="uppercase text-neutral-100 hover:text-white rounded-md px-3 py-2 text-sm font-medium hover:ring-1 hover:ring-green"
              >
                blog
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden inset-y-0 right-0 sm:flex justify-center gap-3 sm:static sm:inset-auto sm:pr-0">
          {/* LANGUAGE SELECTOR TABLET AND DESKTOP */}
          <div className="sm:block">
            <Dropdown
              button={
                <>
                  <span className="sr-only">Language selector menu</span>
                  <Image alt={locale} src={`/${locale}.png`} height={40} width={40} />
                </>
              }
              items={languageSelector}
              locale={locale}
              menuClassname="sm:flex items-center justify-center w-full"
              menuButtonClassname="bg-transparent p-0 hover:bg-black hover:ring-0"
              menuItemsClassname="right-0 left-auto top-0 w-28"
            />
          </div>
        </div>
      </div>

      {/* OPENED BURGER MENU */}
      <DisclosurePanel className="sm:hidden">
        <div className="px-2 pb-3 pt-2 flex justify-between">
          <Link
            href={`/${locale}/blog`}
            className="uppercase text-neutral-100 hover:text-white rounded-md px-3 py-2 text-sm font-medium hover:ring-1 hover:ring-green w-1/2"
          >
            blog
          </Link>
          <div className="w-1/2 flex justify-end gap-x-3">
            <ThemeSwitch />
            <Dropdown
              button={
                <>
                  <span className="sr-only">Language selector menu</span>
                  <Image alt={locale} src={`/${locale}.png`} height={40} width={40} />
                </>
              }
              items={languageSelector}
              locale={locale}
              menuButtonClassname="bg-transparent p-0 hover:bg-black hover:ring-0"
              menuItemsClassname="right-0 left-auto w-28"
            />
            {isSignedIn ? (
              <Dropdown
                button={
                  <>
                    <span className="sr-only">Open user menu</span>
                    <UserCircleIcon className="h-8 w-8 text-white" />
                  </>
                }
                items={itemsProfile}
                locale={locale}
                menuButtonClassname="rounded-full p-1"
                menuItemsClassname="right-0 left-auto"
              />
            ) : (
              <Link
                href={`/${locale}/login`}
                className="text-white bg-green py-2 px-1 rounded-md"
              >
                {t("connection")}
              </Link>
            )}
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
