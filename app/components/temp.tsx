"use client";

import Link from "next/link";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const iconClassname = clsx(
  "w-6 h-6 lg:w-7 lg:h-7 text-white flex items-center",
  "hover:text-white",
  "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
);

export default function BurgerMenuHeader() {
  const [isVisible, setIsVisible] = useState(false);
  const iconRef = useRef<SVGSVGElement | null>(null);

  const pathName = usePathname();

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
      {isVisible && <BurgerMenu onClickOutside={() => setIsVisible(false)} iconRef={iconRef} />}
    </div>
  );
}

function BurgerMenu({ onClickOutside, iconRef }: { onClickOutside: any; iconRef: MutableRefObject<SVGSVGElement | null> }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement | null>(null);
  const t = useTranslations("");

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

  const categories = [
    {
      category: `🌿 ${t("category.flower")}`,
      key: "fleurs",
      slug: "fleurs-cbd",
    },
    {
      category: `🍫 ${t("category.hash")}`,
      key: "hashs",
      slug: "pollens-resines-hash-cbd",
    },
    {
      category: `🌠 ${t("category.moonrock")}`,
      key: "moonrocks",
      slug: "moonrocks-cbd",
    },
    { category: `💧 ${t("category.oil")}`, key: "huiles", slug: "huiles-cbd" },
    {
      category: `🌱 ${t("category.herbalTea")}`,
      key: "infusions",
      slug: "infusions-cbd",
    },
    { category: `🌿 ${t("category.health")}`, key: "soins", slug: "soins-cbd" },
    {
      category: `💨 ${t("category.vaporizer")}`,
      key: "vaporisateurs",
      slug: "vaporisateur",
    },
    {
      category: `📰 Blog`,
      key: "blog",
      slug: "blog",
    },
  ];

  return (
    <div ref={ref} className={clsx("absolute bottom-[54px] bg-black text-white flex flex-col gap-y-2 rounded-t-md w-[45dvw] p-2")}>
      {categories.map((e) => (
        <React.Fragment key={e.key}>
          <Link href={`/${e.slug}`}>
            <div className={clsx("flex items-center", { "font-medium text-green": pathname.includes(e.slug) })}>
              <span>{e.category}</span>
            </div>
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
}
