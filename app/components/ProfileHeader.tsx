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
import { useAuth } from "../context/authContext";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Separator from "./Separator";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

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

/**
 *
 * TODO: Close on navigate
 */

export default function ProfileHeader({ locale }: { locale: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const pathName = usePathname();
  const ignoreNextClick = useRef(false);

  console.log(ignoreNextClick);

  useEffect(() => {
    setIsVisible(false);
  }, [pathName]);

  const handleIconClick = () => {
    ignoreNextClick.current = true;
    setIsVisible((prev) => !prev);
  };

  return (
    <div>
      <div className="flex" onClick={handleIconClick}>
        <span className="sr-only">Open user menu</span>
        <UserCircleIcon className="h-8 w-8 text-white" role="button" />
      </div>
      {isVisible && (
        <UserMenu
          locale={locale}
          onClickOutside={() => {
            if (ignoreNextClick.current) {
              ignoreNextClick.current = false;
              return;
            }
            setIsVisible(false);
          }}
        />
      )}
    </div>
  );
}

function UserMenu({ locale, onClickOutside }: { locale: string; onClickOutside: any }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const t = useTranslations("navbar");
  const { isSignedIn, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
        console.log("here");
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside]);

  const itemsProfile: ItemsProfile[] = [
    {
      text: t("info"),
      href: `/mon_compte/profile`,
      key: "info",
      icon: <UserIcon className="w-6 h-6 ml-2 text-white" />,
    },
    {
      text: t("addresses"),
      href: `/mon_compte/adresses`,
      key: "addresses",
      icon: <HomeModernIcon className="w-6 h-6 ml-2 text-white" />,
    },
    {
      text: t("orders"),
      href: `/mon_compte/commandes`,
      key: "orders",
      icon: <TruckIcon className="w-6 h-6 ml-2 text-white" />,
    },
    {
      text: t("fidelity"),
      href: `/mon_compte/fidelite`,
      key: "fidelity",
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6 ml-2 text-white" />,
    },
    {
      text: t("logout"),
      onClick: () => logout(),
      key: "logout",
      icon: <ArrowRightStartOnRectangleIcon className="w-6 h-6 ml-2 text-white" />,
    },
  ];

  const itemsAuth: WithHref[] = [
    {
      text: t("login"),
      href: `/login`,
      key: "login",
      icon: <ArrowLeftEndOnRectangleIcon className="w-6 h-6 ml-2 text-white" />,
    },
    {
      text: t("register"),
      href: `/register`,
      key: "register",
      icon: <PencilSquareIcon className="w-6 h-6 ml-2 text-white" />,
    },
  ];

  const loggedInItems = itemsProfile.map((e) => (
    <div key={e.key} className="here">
      {"href" in e ? (
        <>
          <div className="flex items-center">
            {e.icon}
            <Link href={`/${locale}/${e.href}`} className="p-2">
              {e.text}
            </Link>
          </div>
          <Separator classname="m-0" />
        </>
      ) : (
        <div className="flex items-center">
          {e.icon}
          <button onClick={e.onClick} className="p-2 text-left">
            {e.text}
          </button>
        </div>
      )}
    </div>
  ));

  const loggedOutItems = itemsAuth.map((e, i, a) => (
    <>
      <div className={`flex items-center ${i === a.length - 1 ? "mb-3" : ""}`}>
        {e.icon}
        <Link href={`/${locale}/${e.href}`} className="p-2">
          {e.text}
        </Link>
      </div>
      <Separator classname="m-0" />
    </>
  ));

  return (
    <div
      ref={ref}
      className={`absolute bottom-14 bg-black text-white flex flex-col rounded-t-md w-[40dvw]`}
    >
      {isSignedIn ? loggedInItems : loggedOutItems}
    </div>
  );
}
