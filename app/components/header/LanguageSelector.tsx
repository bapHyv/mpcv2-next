"use client";

import { MutableRefObject, useEffect, useRef, useState } from "react";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { LanguageIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Separator from "@/app/components/Separator";

function generatePathWithLocale(pathname: string, locale: string) {
  const newPath = pathname.split("/");
  newPath[1] = locale;
  return newPath.join("/");
}

export default function LanguageSelector({ locale }: { locale: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const iconRef = useRef<SVGSVGElement | null>(null);
  const pathname = usePathname();

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
  }, [pathname]);

  return (
    <div className="relative">
      <LanguageIcon
        role="button"
        ref={iconRef}
        className="w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 text-white"
        onClick={() => {
          if (isVisible) {
            handleIsClosing();
          } else {
            setIsVisible(true);
          }
        }}
      />
      {isVisible && (
        <LanguageSelectorMenu locale={locale} onClickOutside={handleIsClosing} iconRef={iconRef} isVisible={isVisible} isClosing={isClosing} />
      )}
    </div>
  );
}

function LanguageSelectorMenu({
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
  const ref = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();
  const t = useTranslations("navbar.burger");
  const urlLocale = useLocale();

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
    <div
      ref={ref}
      className={clsx(
        "absolute top-14 bg-black text-white flex flex-col rounded-b-md w-40",
        "sm:-translate-x-[calc(50%-12px)] sm:w-32",
        "lg:-translate-x-[calc(50%-16px)]",
        "xl:top-16 xl:-translate-x-[calc(50%-20px)]",
        {
          "open-menu-item": isVisible,
          "close-menu-item": isClosing,
        }
      )}
    >
      {languageSelector.map((e, i, a) => (
        <Link
          key={e.key}
          href={generatePathWithLocale(pathname, e.locale)}
          className={clsx("hover:bg-light-black", { "rounded-b-md": i === a.length - 1 })}
        >
          <div className="flex items-center w-full ml-2">
            <span>{e.src}</span>
            <span
              className={clsx("p-2", {
                "text-green": urlLocale === e.locale,
              })}
            >
              {e.text}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
