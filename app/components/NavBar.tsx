import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { IDropdownItem } from "../types";
import { getTranslations } from "next-intl/server";
import { ChevronDownIcon, ShoppingCartIcon } from "@heroicons/react/20/solid";

import Dropdown from "@/app/components/Dropdown";
import ThemeSwitch from "@/app/components/ThemeSwitch";

const navigation = [
  { name: "Produits", href: "/", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default async function NavBar({ locale }: { locale: string }) {
  // TODO add auth check
  const isSignedId = true;

  const t = await getTranslations({ locale, namespace: "navbar" });

  // TODO add locale and trad and icons
  const itemsDropdown: IDropdownItem[] = [
    {
      text: t("hemp"),
      href: `fleurs%20de%20cbd`,
    },
    {
      text: t("hash"),
      href: `hash%20de%20cbd`,
    },
    {
      text: t("moonrock"),
      href: `moonrocks`,
    },
    {
      text: t("oil"),
      href: `huiles`,
    },
    {
      text: t("tea"),
      href: `infusions`,
    },
    {
      text: t("cream"),
      href: `soins`,
    },
    {
      text: t("vaporisateur"),
      href: `vaporisateurs`,
    },
  ];

  // TODO add href and icons
  const itemsProfile = [
    {
      text: t("info"),
      href: `/`,
    },
    {
      text: t("addresses"),
      href: `/`,
    },
    {
      text: t("orders"),
      href: `/`,
    },
    {
      text: t("fidelity"),
      href: `/`,
    },
  ];

  const languageSelector = [{ text: "fr" }, { text: "es" }, { text: "en" }];

  return (
    <Disclosure as="nav" className="bg-black z-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between">
          {/* Mobile menu button*/}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton
              className={`group relative inline-flex items-center justify-center rounded-md p-2 text-neutral-100 
                hover:bg-neutral-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white`}
            >
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block h-6 w-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden h-6 w-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 gap-6 items-center justify-center sm:items-stretch sm:justify-start sm:gap-16">
            <Link
              href={`/${locale}/${itemsDropdown[0].href}`}
              className="text-white text-xl capitalize bg-green px-4 py-1 rounded-md sm:hidden"
            >
              produits
            </Link>
            <Link href="/">
              <Image
                alt="Monplancbd"
                src="/logo-blanc.png"
                width={80}
                height={80}
              />
            </Link>
            <div className="hidden sm:flex items-center">
              <ThemeSwitch />
            </div>

            <div className="hidden sm:ml-6 sm:block">
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
          <div className="absolute inset-y-0 right-0 flex justify-center gap-3 sm:static sm:inset-auto sm:pr-0">
            <div className="flex items-center justify-center w-full">
              <Dropdown
                button={
                  <>
                    <span className="sr-only">Language selector menu</span>
                    <Image
                      alt={locale}
                      src={`/${locale}.png`}
                      height={40}
                      width={40}
                    />
                  </>
                }
                items={languageSelector}
                locale={locale}
                menuButtonClassname="bg-transparent p-0 hover:bg-black hover:ring-0"
                menuItemsClassname="right-0 left-auto w-28"
              />
            </div>
            <div className="relative">
              <ShoppingCartIcon className="w-10 h-10 rounded-full bg-white text-black p-1" />
              <div>
                <span className="sr-only">Items in shopping cart</span>
                <span className="absolute top-0 text-white bg-red-600 rounded-full text-xs px-1">
                  2
                </span>
              </div>
            </div>

            {/* Profile dropdown */}
            {isSignedId ? (
              <Dropdown
                button={
                  <>
                    <span className="sr-only">Open user menu</span>
                    <UserCircleIcon className="h-8 w-8 text-white" />
                  </>
                }
                items={itemsProfile}
                locale={locale}
                menuClassname="hidden sm:inline-block"
                menuButtonClassname="rounded-full p-1"
                menuItemsClassname="right-0 left-auto"
              />
            ) : (
              <Link
                href="/"
                className="text-white bg-green py-2 px-1 rounded-md"
              >
                {t("connection")}
              </Link>
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="">
          <div className="space-y-3 px-2 pb-3 pt-2 flex flex-col">
            <div className="flex items-center justify-between w-full">
              <Link
                href={`/${locale}/blog`}
                className="uppercase text-neutral-100 hover:text-white rounded-md px-3 py-2 text-sm font-medium hover:ring-1 hover:ring-green"
              >
                blog
              </Link>
              {isSignedId ? (
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
                  href="/"
                  className="text-white bg-green py-2 px-1 rounded-md"
                >
                  {t("connection")}
                </Link>
              )}
            </div>
            <div className="flex items-center justify-end w-full">
              <ThemeSwitch />
            </div>
            <div className="flex items-center justify-end w-full">
              <Dropdown
                button={
                  <>
                    <span className="sr-only">Language selector menu</span>
                    <Image
                      alt={locale}
                      src={`/${locale}.png`}
                      height={40}
                      width={40}
                    />
                  </>
                }
                items={languageSelector}
                locale={locale}
                menuButtonClassname="bg-transparent p-0 hover:bg-black hover:ring-0"
                menuItemsClassname="right-0 left-auto w-28"
              />
            </div>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
