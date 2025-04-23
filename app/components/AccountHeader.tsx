"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { UserCircleIcon, ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";

import { useAuth } from "@/app/context/authContext";
import { iconClassname } from "@/app/staticData/cartPageClasses";
import OtherNavbar from "./OtherNavbar";

export default function AccountHeader() {
  const t = useTranslations("navbar");
  const pathname = usePathname();
  const { logout } = useAuth();

  const itemsProfile = [
    { textKey: "info", href: `/mon-compte/profil`, icon: <UserCircleIcon className={iconClassname} /> },
    {
      textKey: "addresses",
      href: `/mon-compte/adresses`,
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
      textKey: "orders",
      href: `/mon-compte/commandes`,
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
      textKey: "fidelity",
      href: `/mon-compte/fidelite`,
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
    { textKey: "logout", onClick: logout, icon: <ArrowLeftEndOnRectangleIcon className={twMerge(iconClassname)} /> },
  ];

  return (
    <OtherNavbar className="lg:justify-center">
      {itemsProfile.map((item) => {
        const isActive = "href" in item && item.href && pathname.includes(item.href);
        const commonClasses = twMerge(
          "capitalize text-center text-sm flex gap-x-1 py-1 px-1 mx-1 rounded-md text-nowrap transition-colors duration-150 ease-in-out",
          "text-white hover:bg-white/10",
          "xl:text-base xl:px-3",
          isActive && "font-medium text-green bg-white/10"
        );

        return "href" in item && item.href ? (
          <Link key={item.textKey} href={item.href} className={commonClasses} aria-current={isActive ? "page" : undefined}>
            {item.icon}
            <span>{t(item.textKey)}</span>
          </Link>
        ) : (
          <button key={item.textKey} type="button" onClick={item.onClick} className={twMerge(commonClasses, "bg-red-600 font-medium px-2")}>
            {item.icon}
            <span>{t(item.textKey)}</span>
          </button>
        );
      })}
    </OtherNavbar>
  );
}

// export default AccountHeader; // Already default export
