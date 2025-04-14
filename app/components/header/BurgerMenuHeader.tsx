// BurgerMenuHeader.tsx (Updated with i18n)
"use client";

import Link from "next/link";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import clsx from "clsx";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { iconHeaderClassname } from "@/app/staticData/cartPageClasses";

export default function BurgerMenuHeader() {
  const t = useTranslations("navbar");
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const pathName = usePathname();

  // Close menu on navigation
  useEffect(() => {
    setIsVisible(false);
  }, [pathName]);

  const toggleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsVisible(!isVisible);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        className={iconHeaderClassname}
        onClick={toggleMenu}
        aria-controls="mobile-menu"
        aria-expanded={isVisible}
      >
        <span className="sr-only">{isVisible ? t("closeMainMenuSR") : t("openMainMenuSR")}</span>
        {isVisible ? <XMarkIcon aria-hidden="true" /> : <Bars3Icon aria-hidden="true" />}
      </button>
      {isVisible && <BurgerMenu onClickOutside={() => setIsVisible(false)} iconRef={buttonRef} />}
    </div>
  );
}

interface MenuProps {
  onClickOutside: () => void;
  iconRef: MutableRefObject<HTMLButtonElement | null>;
}

function BurgerMenu({ onClickOutside, iconRef }: MenuProps) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement | null>(null);
  const tCat = useTranslations("category");
  const tBlog = useTranslations("blog");
  const locale = useLocale();

  useEffect(() => {
    const handleClickOutsideBurgerMenu = (event: MouseEvent) => {
      if (ref.current && iconRef.current && !ref.current.contains(event.target as Node) && !iconRef.current.contains(event.target as Node)) {
        onClickOutside();
      }
    };
    const timerId = setTimeout(() => {
      // Delay listener attachment
      document.addEventListener("click", handleClickOutsideBurgerMenu, true);
    }, 0);
    return () => {
      clearTimeout(timerId);
      document.removeEventListener("click", handleClickOutsideBurgerMenu, true);
    };
  }, [onClickOutside, iconRef]);

  const categories = [
    { categoryKey: "flower", emoji: "🌿", slug: "fleurs-cbd" },
    { categoryKey: "hash", emoji: "🍫", slug: "pollens-resines-hash-cbd" },
    { categoryKey: "moonrock", emoji: "🌠", slug: "moonrocks-cbd" },
    { categoryKey: "oil", emoji: "💧", slug: "huiles-cbd" },
    { categoryKey: "herbalTea", emoji: "🌱", slug: "infusions-cbd" },
    { categoryKey: "health", emoji: "🌿", slug: "soins-cbd" },
    { categoryKey: "vaporizer", emoji: "💨", slug: "vaporisateur" },
  ];

  const activeSlug = pathname.split("/").pop();

  return (
    <div
      ref={ref}
      id="mobile-menu"
      className={clsx(
        "absolute bottom-full left-0 mb-1",
        "z-[6500]",
        "w-56 rounded-md bg-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      )}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="main-menu-button"
    >
      <div className="py-1 space-y-1" role="none">
        {categories.map((e) => (
          <Link
            key={e.categoryKey}
            href={`/${locale}/${e.slug}`}
            className={clsx(
              "flex items-center px-4 py-2 text-sm text-gray-100 hover:bg-gray-700 hover:text-white transition-colors duration-100 ease-in-out rounded-md", // Item styling
              activeSlug === e.slug && " text-green font-semibold"
            )}
            role="menuitem"
          >
            <span className="mr-3 text-lg" aria-hidden="true">
              {e.emoji}
            </span>
            <span>{tCat(e.categoryKey)}</span>
          </Link>
        ))}
        <Link
          href={`/${locale}/blog`}
          className={clsx(
            "flex items-center px-4 py-2 text-sm text-gray-100 hover:bg-gray-700 hover:text-white transition-colors duration-100 ease-in-out rounded-md",
            pathname.includes("/blog") && " text-green font-semibold"
          )}
          role="menuitem"
        >
          <span className="mr-3 text-lg" aria-hidden="true">
            📰
          </span>
          <span>{tBlog("link")}</span>
        </Link>
      </div>
    </div>
  );
}
