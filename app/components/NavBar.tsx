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
import { ChevronDownIcon } from "@heroicons/react/20/solid";

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
      href: `moonrock`,
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
      href: `fleurs%20de%20cbd`,
    },
    {
      text: t("addresses"),
      href: `hash%20de%20cbd`,
    },
    {
      text: t("orders"),
      href: `moonrock`,
    },
    {
      text: t("fidelity"),
      href: `huiles`,
    },
  ];

  return (
    <Disclosure as="nav" className="bg-black">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button*/}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
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
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <Link href="/">
              <Image
                alt="Monplancbd"
                src="/logo-blanc.png"
                width={50}
                height={50}
              />
            </Link>
            <ThemeSwitch />
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Dropdown
                  button={
                    <>
                      <span>Produits</span>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="-mr-1 h-5 w-5 text-gray-400"
                      />
                    </>
                  }
                  items={itemsDropdown}
                  locale={locale}
                />
                <Link
                  href="/blog"
                  className="uppercase text-neutral-300 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                  blog
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Profile dropdown */}
            {isSignedId ? (
              <Dropdown
                button={
                  <>
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <UserCircleIcon className="h-10 w-10 text-green bg-white" />
                  </>
                }
                items={itemsProfile}
                locale={locale}
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
        <div className="w-1/4">
          <div className="space-y-1 px-2 pb-3 pt-2 flex flex-col">
            <Dropdown
              button={
                <>
                  <span>Produits</span>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="-mr-1 h-5 w-5 text-gray-400"
                  />
                </>
              }
              items={itemsDropdown}
              locale={locale}
            />
            <Link
              href="/blog"
              className="uppercase text-neutral-300 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
            >
              blog
            </Link>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
