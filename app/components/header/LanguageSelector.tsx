"use client";

import { MutableRefObject, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { LanguageIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

function generatePathWithLocale(pathname: string, locale: string): string {
  const pathSegments = pathname.split("/");
  if (pathSegments.length > 1 && pathSegments[1].length === 2) {
    pathSegments[1] = locale;
  } else {
    return `/${locale}${pathname}`;
  }
  return pathSegments.join("/");
}

export default function LanguageSelector() {
  const t = useTranslations("navbar");
  const [isVisible, setIsVisible] = useState(false);
  const iconRef = useRef<HTMLButtonElement | null>(null);
  const pathName = usePathname();

  useEffect(() => {
    setIsVisible(false);
  }, [pathName]);

  const toggleVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsVisible(!isVisible);
  };

  return (
    <div className="relative">
      <button
        ref={iconRef}
        type="button"
        className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white rounded-full p-1"
        onClick={toggleVisibility}
        aria-haspopup="true"
        aria-expanded={isVisible}
        aria-controls="language-menu"
      >
        <span className="sr-only">{t("selectLanguageSR")}</span>
        <LanguageIcon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
      </button>
      {isVisible && <LanguageSelectorMenu onClickOutside={() => setIsVisible(false)} iconRef={iconRef} />}
    </div>
  );
}

interface MenuProps {
  onClickOutside: () => void;
  iconRef: MutableRefObject<HTMLButtonElement | null>;
}

function LanguageSelectorMenu({ onClickOutside, iconRef }: MenuProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const t = useTranslations("navbar.burger");
  const currentLocale = useLocale();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && iconRef.current && !ref.current.contains(event.target as Node) && !iconRef.current.contains(event.target as Node)) {
        onClickOutside();
      }
    };
    const timerId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside, true);
    }, 0);
    return () => {
      clearTimeout(timerId);
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside, iconRef]);

  const languageSelector = [
    { key: "french", textKey: "french", src: "🇫🇷", locale: "fr" },
    { key: "spanish", textKey: "spanish", src: "🇪🇸", locale: "es" },
    { key: "english", textKey: "english", src: "🇬🇧", locale: "en" },
  ];

  return (
    <div
      ref={ref}
      id="language-menu"
      className={clsx(
        "absolute right-0 z-[5000] mt-2 w-40 origin-top-right rounded-md bg-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
        "top-full"
      )}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="language-button"
    >
      <div className="py-1" role="none">
        {languageSelector.map((e, i, a) => (
          <Link
            key={e.key}
            href={generatePathWithLocale(pathname, e.locale)}
            className={clsx(
              "flex items-center px-4 py-2 text-sm text-gray-100 hover:bg-gray-700 hover:text-white transition-colors duration-100 ease-in-out",
              i === a.length - 1 ? "rounded-b-md" : ""
            )}
            role="menuitem"
          >
            <span className="mr-3 text-lg" aria-hidden="true">
              {e.src}
            </span>
            <span className={clsx({ "font-semibold text-green": currentLocale === e.locale })}>{t(e.textKey)} </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
