"use client";
import Link from "next/link";
import Image from "next/image";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Bars3Icon, XMarkIcon, NewspaperIcon } from "@heroicons/react/24/outline";
import ThemeSwitch from "@/app/components/ThemeSwitch";
import Separator from "../Separator";
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
  const [isClosing, setIsClosing] = useState(false);
  const pathName = usePathname();
  const iconRef = useRef<SVGSVGElement | null>(null);

  const handleIsClosing = () => {
    setIsClosing(true);
    // This setTimeout is here to let the animation trigger before removing the component
    // The time must be equal to animation-duration property in .close-menu-item class (see globals.css)
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 150);
  };

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
          onClick={() => handleIsClosing()}
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
          onClickOutside={() => handleIsClosing()}
          iconRef={iconRef}
          isVisible={isVisible}
          isClosing={isClosing}
        />
      )}
    </div>
  );
}

function BurgerMenu({
  locale,
  onClickOutside,
  iconRef,
  isVisible,
  isClosing,
}: {
  locale: string;
  onClickOutside: any;
  iconRef: MutableRefObject<SVGSVGElement | null>;
  isVisible: boolean;
  isClosing: boolean;
}) {
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

  const hw = { h: 24, w: 24 };
  const languageSelector = [
    {
      key: "Français",
      alt: t("french"),
      text: "Français",
      src: "/fr.png",
      locale: "fr",
      h: hw.h,
      w: hw.w,
    },
    {
      key: "Espagnol",
      alt: t("spanish"),
      text: "Español",
      src: "/es.png",
      locale: "es",
      h: hw.h,
      w: hw.w,
    },
    {
      key: "Anglais",
      alt: t("english"),
      text: "English",
      src: "/en.png",
      locale: "en",
      h: hw.h,
      w: hw.w,
    },
  ];

  return (
    <div
      ref={ref}
      className={clsx(
        "absolute -top-52 bg-black text-white flex flex-col rounded-t-md w-[45dvw]",
        { "open-menu-item": isVisible, "close-menu-item": isClosing }
      )}
    >
      {/* BLOG */}
      <Link href={`/${locale}/blog`} className="flex items-center ml-2">
        <NewspaperIcon className="w-6 h-6 text-white" />
        <span className="p-2">Blog</span>
      </Link>
      <Separator classname="m-0" />

      {/* THEME */}
      <ThemeSwitch />
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
