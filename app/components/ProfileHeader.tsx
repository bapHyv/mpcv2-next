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
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Separator from "./Separator";

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
  const { isSignedIn, logout } = useAuth();
  const t = useTranslations("navbar");

  // TODO add href and icons
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
      icon: <ArrowLeftEndOnRectangleIcon className="w-5 h-5 text-white" />,
    },
    {
      text: t("register"),
      href: `/register`,
      key: "register",
      icon: <PencilSquareIcon className="w-5 h-5 text-white" />,
    },
  ];

  const loggedInItems = itemsProfile.map((e, i, a) => (
    <MenuItem key={e.key}>
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
        <div className="flex items-center mb-5">
          {e.icon}
          <button onClick={e.onClick} className="p-2 text-left">
            {e.text}
          </button>
        </div>
      )}
    </MenuItem>
  ));

  const loggedOutItems = itemsAuth.map((e, i, a) => (
    <>
      <MenuItem key={e.key}>
        <Link
          href={`/${locale}/${e.href}`}
          className={`p-2 ${i === a.length - 1 ? "mb-5" : ""}`}
        >
          {e.text}
        </Link>
      </MenuItem>
    </>
  ));

  return (
    <Menu>
      <MenuButton className="flex">
        <span className="sr-only">Open user menu</span>
        <UserCircleIcon className="h-8 w-8 text-white" role="button" />
      </MenuButton>
      <MenuItems
        className={`bg-black text-white flex flex-col rounded-t-md top-0 w-[40dvw]`}
        anchor="top start"
      >
        {isSignedIn ? loggedInItems : loggedOutItems}
      </MenuItems>
    </Menu>
    // <Dropdown
    //   button={
    //     <>
    //       <span className="sr-only">Open user menu</span>
    //       <UserCircleIcon className="h-8 w-8 text-white" role="button" />
    //     </>
    //   }
    //   items={isSignedIn ? itemsProfile : itemsAuth}
    //   locale={locale}
    //   menuButtonClassname="bg-black p-0 m-0"
    //   menuItemsClassname=""
    // />
  );
}
