"use client";

import { useState, useEffect, useRef, MutableRefObject } from "react";
import { UserCircleIcon, ArrowLeftEndOnRectangleIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { usePathname } from "next/navigation";

import { useAuth } from "@/app/context/authContext";
import { iconClassname } from "@/app/staticData/cartPageClasses";

interface Base {
  text: string;
  key: string;
  icon: React.ReactNode;
}
interface WithHref extends Base {
  href: string;
  onClick?: never;
}
interface WithOnClick extends Base {
  onClick: () => void;
  href?: never;
}
type ItemsProfile = WithHref | WithOnClick;
type ItemsAuth = WithHref;

export default function ProfileHeader({ locale }: { locale: string }) {
  const t = useTranslations("navbar");
  const [isVisible, setIsVisible] = useState(false);
  const iconRef = useRef<HTMLDivElement | null>(null);
  const pathName = usePathname();

  useEffect(() => {
    setIsVisible(false);
  }, [pathName]);

  const toggleVisibility = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsVisible(!isVisible);
  };

  return (
    <div ref={iconRef} className="relative" onClick={toggleVisibility}>
      <span className="sr-only">{t("openUserMenuSR")}</span>
      <button
        type="button"
        className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white rounded-full"
      >
        <UserCircleIcon className="h-10 w-10 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
      </button>
      {isVisible && <UserMenu locale={locale} onClickOutside={() => setIsVisible(false)} iconRef={iconRef} />}
    </div>
  );
}

function UserMenu({
  locale,
  onClickOutside,
  iconRef,
}: {
  locale: string;
  onClickOutside: () => void;
  iconRef: MutableRefObject<HTMLDivElement | null>;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const t = useTranslations("navbar");
  const { userData, logout } = useAuth();

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

  const itemsProfile: ItemsProfile[] = [
    { text: t("info"), href: `/mon-compte/profil`, key: "info", icon: <UserCircleIcon className={iconClassname} /> },
    {
      text: t("addresses"),
      href: `/mon-compte/adresses`,
      key: "addresses",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClassname}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
          />
        </svg>
      ),
    },
    {
      text: t("orders"),
      href: `/mon-compte/commandes`,
      key: "orders",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClassname}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      ),
    },
    {
      text: t("fidelity"),
      href: `/mon-compte/fidelite`,
      key: "fidelity",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClassname}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      ),
    },
    { text: t("logout"), onClick: logout, key: "logout", icon: <ArrowLeftEndOnRectangleIcon className={iconClassname} /> },
  ];

  const itemsAuth: ItemsAuth[] = [
    { text: t("login"), href: `/connexion`, key: "login", icon: <ArrowLeftEndOnRectangleIcon className={iconClassname} /> },
    { text: t("register"), href: `/inscription`, key: "register", icon: <PencilSquareIcon className={iconClassname} /> },
  ];

  const loggedInItems = itemsProfile.map((e, i, arr) => {
    const itemClasses =
      "flex items-center px-4 py-2 text-sm text-gray-100 hover:bg-gray-700 hover:text-white transition-colors duration-100 ease-in-out";
    const conditionalClasses = i === arr.length - 1 ? "rounded-b-md" : "";

    return "href" in e ? (
      <Link key={e.key} href={`/${locale}${e.href}`} className={clsx(itemClasses, conditionalClasses)}>
        {e.icon}
        <span>{e.text}</span>
      </Link>
    ) : (
      <button key={e.key} onClick={e.onClick} className={clsx(itemClasses, conditionalClasses, "w-full text-left")}>
        {e.icon}
        <span>{e.text}</span>
      </button>
    );
  });

  const loggedOutItems = itemsAuth.map((e, i, arr) => (
    <Link
      key={e.key}
      href={`/${locale}${e.href}`}
      className={clsx(
        "flex items-center px-4 py-2 text-sm text-gray-100 hover:bg-gray-700 hover:text-white transition-colors duration-100 ease-in-out",
        i === arr.length - 1 ? "rounded-b-md" : ""
      )}
    >
      {e.icon}
      <span className="text-nowrap">{e.text}</span>
    </Link>
  ));

  return (
    <div
      ref={ref}
      className={clsx(
        "absolute right-0 z-[6500] mt-2 w-56 origin-top-right rounded-md bg-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
        "top-full"
      )}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu-button"
    >
      <div className="py-1" role="none">
        {userData ? loggedInItems : loggedOutItems}
      </div>
    </div>
  );
}
