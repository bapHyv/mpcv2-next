"use client";
import Link from "next/link";
import Image from "next/image";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Bars3Icon, XMarkIcon, NewspaperIcon } from "@heroicons/react/24/outline";
import ThemeSwitch from "@/app/components/ThemeSwitch";
import Separator from "../Separator";
import React from "react";
import clsx from "clsx";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

const iconClassname = `h-10 w-10 text-neutral-100 flex items-center
hover:text-white hover:bg-neutral-700
focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white`;

/**
 * TODO:
 *  -Traduction (alt image)
 *  -Theme switch (it must take the whole row)
 */

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
        <XMarkIcon
          ref={iconRef}
          role="button"
          className={iconClassname}
          onClick={() => setIsVisible(false)}
        />
      ) : (
        <Bars3Icon
          role="button"
          className={iconClassname}
          onClick={() => setIsVisible(true)}
        />
      )}
      {isVisible && (
        <BurgerMenu
          locale={locale}
          onClickOutside={() => setIsVisible(false)}
          iconRef={iconRef}
        />
      )}
    </div>
  );
}

function BurgerMenu({
  locale,
  onClickOutside,
  iconRef,
}: {
  locale: string;
  onClickOutside: any;
  iconRef: MutableRefObject<SVGSVGElement | null>;
}) {
  const urlLocale = useLocale();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutsideBurgerMenu = (event: MouseEvent) => {
      if (
        ref.current &&
        iconRef.current &&
        !ref.current.contains(event.target as HTMLElement) &&
        !iconRef.current.contains(event.target as HTMLElement)
      ) {
        console.log("here");
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener("click", handleClickOutsideBurgerMenu, true);
    return () => {
      document.removeEventListener("click", handleClickOutsideBurgerMenu, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClickOutside]);

  const hw = { h: 24, w: 24 };
  const languageSelector = [
    {
      key: "Français",
      alt: "Français",
      text: "Français",
      src: "/fr.png",
      locale: "fr",
      h: hw.h,
      w: hw.w,
    },
    {
      key: "Espagnol",
      alt: "Espagnol",
      text: "Espagnol",
      src: "/es.png",
      locale: "es",
      h: hw.h,
      w: hw.w,
    },
    {
      key: "Anglais",
      alt: "Anglais",
      text: "Anglais",
      src: "/en.png",
      locale: "en",
      h: hw.h,
      w: hw.w,
    },
  ];
  return (
    <div
      ref={ref}
      className="absolute bottom-14 bg-black text-white flex flex-col rounded-t-md w-[40dvw]"
    >
      {/* BLOG */}
      <Link href={`/${locale}/blog`} className="flex items-center ml-2">
        <NewspaperIcon className="w-6 h-6 text-white" />
        <span className="p-2">Blog</span>
      </Link>
      <Separator classname="m-0" />

      {/* THEME */}
      <div className="flex items-center ml-2">
        <ThemeSwitch />
        <span className="p-2">Theme</span>
      </div>
      <Separator classname="m-0" />
      {/* LANGUAGE SELECTOR */}
      {languageSelector.map((e, i, a) => (
        <React.Fragment key={e.key}>
          <Link href={generatePathWithLocale(pathname, e.locale)}>
            <div className="flex items-center ml-2">
              <Image alt={e.alt} src={e.src} height={e.h} width={e.w} />
              <span className={clsx("p-2", { "text-light-green": urlLocale === e.locale })}>
                {e.text}
              </span>
            </div>
            {i !== a.length - 1 && <Separator classname="m-0" />}
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
}
