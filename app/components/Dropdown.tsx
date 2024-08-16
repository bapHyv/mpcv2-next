"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Link from "next/link";
import { IDropdown } from "@/app/types";
import { twMerge } from "tailwind-merge";

export default function Dropdown({
  items,
  button,
  locale,
  menuButtonClassname,
  menuItemsClassname,
}: IDropdown) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton
          className={twMerge(
            `uppercase inline-flex w-full justify-center gap-x-1.5 rounded-md bg-green px-3 py-2 
            text-sm font-semibold text-neutral-100 shadow-sm hover:ring-1 ring-inset ring-neutral-100 hover:bg-light-green`,
            menuButtonClassname
          )}
        >
          {button}
        </MenuButton>
      </div>

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
          <div className="py-1" key={`${item.text}-${item.href}`}>
            <MenuItem>
              <Link
                href={`/${locale}/${item.href}`}
                className="uppercase group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
              >
                {item.text}
              </Link>
            </MenuItem>
          </div>
        ))}
      </MenuItems>
    </Menu>
  );
}
