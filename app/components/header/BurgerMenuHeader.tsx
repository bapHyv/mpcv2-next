"use client";

import Link from "next/link";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const iconClassname = `h-10 w-10 text-neutral-100 flex items-center
hover:text-white
focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white`;

function generatePathWithLocale(pathname: string, locale: string) {
  const newPath = pathname.split("/");
  newPath[1] = locale;
  return newPath.join("/");
}

export default function BurgerMenuHeader({ locale }: { locale: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const pathName = usePathname();
  const iconRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    setIsVisible(false);
  }, [pathName]);

  return (
    <div className="relavite">
      <span className="sr-only">Open main menu</span>
      {isVisible ? (
        <XMarkIcon ref={iconRef} role="button" className={iconClassname} onClick={() => setIsVisible(false)} />
      ) : (
        <Bars3Icon role="button" className={iconClassname} onClick={() => setIsVisible(true)} />
      )}
      {isVisible && <BurgerMenu locale={locale} onClickOutside={() => setIsVisible(false)} iconRef={iconRef} />}
    </div>
  );
}

function BurgerMenu({ locale, onClickOutside, iconRef }: { locale: string; onClickOutside: any; iconRef: MutableRefObject<SVGSVGElement | null> }) {
  const urlLocale = useLocale();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement | null>(null);
  const t = useTranslations("navbar.burger");

  useEffect(() => {
    const handleClickOutsideBurgerMenu = (event: MouseEvent) => {
      if (
        ref.current &&
        iconRef.current &&
        !ref.current.contains(event.target as HTMLElement) &&
        !iconRef.current.contains(event.target as HTMLElement)
      ) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener("click", handleClickOutsideBurgerMenu, true);
    return () => {
      document.removeEventListener("click", handleClickOutsideBurgerMenu, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClickOutside]);

  const languageSelector = [
    {
      key: "Français",
      text: "Français",
      src: "🇫🇷",
      locale: "fr",
    },
    {
      key: "Espagnol",
      text: "Español",
      src: "🇪🇸",
      locale: "es",
    },
    {
      key: "Anglais",
      text: "English",
      src: "🇬🇧",
      locale: "en",
    },
  ];

  return (
    <div ref={ref} className={clsx("absolute bottom-[54px] bg-black text-white flex flex-col rounded-t-md w-[45dvw]")}>
      {/* BLOG */}
      <Link href={`/${locale}/blog`} className="flex items-center ml-2">
        <span>📰</span>
        <span className="p-2">Blog</span>
      </Link>

      {/* LANGUAGE SELECTOR */}
      {languageSelector.map((e) => (
        <React.Fragment key={e.key}>
          <Link href={generatePathWithLocale(pathname, e.locale)}>
            <div className="flex items-center ml-2">
              <span>{e.src}</span>
              <span className={clsx("p-2", { "text-green": urlLocale === e.locale })}>{e.text}</span>
            </div>
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
}
