"use client";
import {
  UserCircleIcon,
  UserIcon,
  HomeModernIcon,
  TruckIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowLeftEndOnRectangleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import React from "react";

import { useAuth } from "@/app/context/authContext";
interface Base {
  text: string;
  key: string;
  icon: any;
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

export default function ProfileHeader({ locale }: { locale: string }) {
  const [isVisible, setIsVisible] = useState(false);

  const iconRef = useRef<HTMLDivElement | null>(null);

  const pathName = usePathname();

  useEffect(() => {
    setIsVisible(false);
  }, [pathName]);

  return (
    <div ref={iconRef} className="relative" onClick={() => setIsVisible(!isVisible)}>
      <span className="sr-only">Open user menu</span>
      <UserCircleIcon className="h-10 w-10 sm:w-6 sm:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 text-white" role="button" />
      {isVisible && <UserMenu locale={locale} onClickOutside={() => setIsVisible(false)} iconRef={iconRef} />}
    </div>
  );
}

function UserMenu({ locale, onClickOutside, iconRef }: { locale: string; onClickOutside: any; iconRef: MutableRefObject<HTMLDivElement | null> }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const t = useTranslations("navbar");
  const { userData, cleanUpLocalStorageUserRelated, logout } = useAuth();

  const iconClassname = "w-6 h-6 text-white ml-2";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        iconRef.current &&
        !ref.current.contains(event.target as HTMLElement) &&
        !iconRef.current.contains(event.target as HTMLElement)
      ) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClickOutside]);

  const itemsProfile: ItemsProfile[] = [
    {
      text: t("info"),
      href: `/mon-compte/profil`,
      key: "info",
      icon: "👤",
    },
    {
      text: t("addresses"),
      href: `/mon-compte/adresses`,
      key: "addresses",
      icon: "🏠",
    },
    {
      text: t("orders"),
      href: `/mon-compte/commandes`,
      key: "orders",
      icon: "🌿",
    },
    {
      text: t("fidelity"),
      href: `/mon-compte/fidelite`,
      key: "fidelity",
      icon: "💖",
    },
    {
      text: t("logout"),
      onClick: () => {
        cleanUpLocalStorageUserRelated();
        logout();
      },
      key: "logout",
      icon: "🚪",
    },
  ];

  const itemsAuth: WithHref[] = [
    {
      text: t("login"),
      href: `/connexion`,
      key: "login",
      icon: <ArrowLeftEndOnRectangleIcon className={iconClassname} />,
    },
    {
      text: t("register"),
      href: `/inscription`,
      key: "register",
      icon: <PencilSquareIcon className={iconClassname} />,
    },
  ];

  const loggedInItems = itemsProfile.map((e) => {
    return "href" in e ? (
      <Link key={e.key} href={`/${locale}${e.href}`} className="flex items-center hover:bg-light-black pl-2">
        {e.icon}
        <span className="p-2">{e.text}</span>
      </Link>
    ) : (
      <div key={e.key} className="flex items-center hover:bg-light-black sm:rounded-b-md pl-2">
        {e.icon}
        <button onClick={e.onClick} className="p-2 text-left">
          {e.text}
        </button>
      </div>
    );
  });

  const loggedOutItems = itemsAuth.map((e, i, a) => (
    <Link key={e.key} href={`/${locale}/${e.href}`} className={clsx("hover:bg-light-black", { "sm:rounded-b-md": i === a.length - 1 })}>
      <div className="flex items-center">
        {e.icon}
        <span className="p-2 text-nowrap">{e.text}</span>
      </div>
    </Link>
  ));

  return (
    <div
      ref={ref}
      className={clsx(
        "absolute z-[5000] bg-black text-white flex flex-col rounded-t-md w-[45dvw]",
        "sm:top-14 sm:w-fit sm:-translate-x-[calc(50%-12px)] sm:rounded-t-none sm:rounded-b-md",
        "lg:-translate-x-[calc(50%-16px)]",
        "xl:top-16 xl:-translate-x-[calc(50%-20px)]",
        {
          "-top-52": userData,
          "-top-[5.5rem]": !userData,
        }
      )}
    >
      {userData ? loggedInItems : loggedOutItems}
    </div>
  );
}
