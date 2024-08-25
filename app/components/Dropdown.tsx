"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Link from "next/link";
import { IDropdown } from "@/app/types";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { usePathname } from "next/navigation";

function generatePathWithLocale(pathname: string, locale: string) {
  const newPath = pathname.split("/");
  newPath[1] = locale;
  return newPath.join("/");
}

export default function Dropdown({
  items,
  button,
  locale,
  menuButtonClassname,
  menuItemsClassname,
  menuClassname,
}: IDropdown) {
  const pathname = usePathname();

  return (
    <Menu
      as="div"
      className={twMerge("relative inline-block text-left", menuClassname)}
    >
      <MenuButton
        className={twMerge(
          `uppercase inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-green px-3 py-2 
            text-sm font-semibold text-neutral-100 shadow-sm 
            hover:ring-1 ring-inset ring-neutral-100 hover:bg-light-green
            [&>*:first-child]:mt-1`,
          menuButtonClassname
        )}
      >
        {button}
      </MenuButton>

      <MenuItems
        transition
        className={twMerge(
          `
          absolute left-0 z-10 mt-2 w-56 origin-top-right
          rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5
          transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in`,
          menuItemsClassname
        )}
      >
        {items.map((item) => (
          <div className="py-1" key={`${item.text}`}>
            <MenuItem>
              {"href" in item ? (
                <Link
                  href={`/${locale}/${item.href}`}
                  className="uppercase group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                >
                  {item.text}
                </Link>
              ) : (
                <Link
                  href={generatePathWithLocale(pathname, item.text as string)}
                  className="flex items-center justify-between uppercase group px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                >
                  {item.text}
                  <Image
                    alt={item.text || ""}
                    src={`/${item.text}.png`}
                    height={30}
                    width={30}
                    className="mr-3"
                  />
                </Link>
              )}
            </MenuItem>
          </div>
        ))}
      </MenuItems>
    </Menu>
  );
}
