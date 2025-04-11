"use client";

import { MutableRefObject, useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

import Separator from "@/app/components/Separator";

interface Props {
  children: JSX.Element[];
  length: number;
}

export default function Carousel({ children, length }: Props) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const checkIsPhone = () => {
      if (typeof window !== "undefined") {
        setIsPhone(window.innerWidth < 640);
      }
    };

    checkIsPhone();

    window.addEventListener("resize", checkIsPhone);

    return () => window.removeEventListener("resize", checkIsPhone);
  }, []);

  const scrollRight = () => {
    if (divRef.current) {
      const scrL = divRef.current.scrollLeft;
      // The + 4 comes from the gap-1 (4px)
      // @ts-ignore
      const cardWidth = divRef.current.childNodes[0].clientWidth + 4;

      let left = scrL + cardWidth;

      if (scrL % cardWidth !== 0) {
        left = scrL + (cardWidth - (scrL % cardWidth));
      }

      if (left > divRef.current.scrollWidth) {
        left = divRef.current.scrollWidth;
      }

      divRef.current?.scrollTo({
        left,
        behavior: "smooth",
      });
    }
  };

  const scrollLeft = () => {
    if (divRef.current) {
      const scrL = divRef.current.scrollLeft;
      // The + 4 comes from the gap-1 (4px)
      // @ts-ignore
      const cardWidth = divRef.current.childNodes[0].clientWidth + 4;

      let left = scrL - cardWidth;

      if (scrL % cardWidth !== 0) {
        left = scrL - (scrL % cardWidth);
      }

      if (left < 0) {
        left = 0;
      }

      divRef.current?.scrollTo({
        left,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div className="lg:px-2 xl:px-[31px] mb-12 lg:mb-0">
        <div
          ref={divRef}
          className={clsx(
            "flex gap-1 p-1 overflow-x-scroll w-[344px] m-auto rounded-md no-scrollbar",
            "sm:w-[624px]",
            "lg:w-[812px]",
            "xl:w-[1218px]",
            "3xl:w-[1624px]"
          )}
        >
          {children}
        </div>
        {divRef && isPhone ? (
          <div className="p-1 w-[336px] m-auto">
            <div className="relative">
              <ChevronLeftIcon
                onClick={scrollLeft}
                className={clsx("absolute left-0 top-1 z-10 h-6 w-6 text-neutral-700 border border-neutral-400 bg-neutral-100 rounded-full")}
              />
              <ChevronRightIcon
                onClick={scrollRight}
                className={clsx("absolute right-0 top-1 z-10 h-6 w-6 text-neutral-700 border border-neutral-400 bg-neutral-100 rounded-full")}
              />
            </div>
          </div>
        ) : (
          <Bullets length={length} divRef={divRef} />
        )}
      </div>
      <Separator />
    </>
  );
}

interface PropsBullets {
  length: number;
  divRef: MutableRefObject<HTMLDivElement | null>;
}

function Bullets({ length, divRef }: PropsBullets) {
  const [bullets, setBullets] = useState(0);
  const [index, setIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [cardsPerPage, setCardsPerPage] = useState(4);

  useEffect(() => {
    setIsClient(true);

    const updateLayout = () => {
      if (typeof window !== "undefined") {
        const width = window.innerWidth;
        let newCardsPerPage = 4;
        if (width >= 640 && width < 1280) {
          newCardsPerPage = 2;
        } else if (width >= 1280 && width < 1920) {
          newCardsPerPage = 3;
        } else if (width < 640) {
          newCardsPerPage = 1;
        }
        setCardsPerPage(newCardsPerPage);
        setBullets(Math.ceil(length / newCardsPerPage));
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);

    setIndex(0);
    if (divRef.current) {
      divRef.current.scrollTo({ left: 0, behavior: "auto" });
    }

    return () => window.removeEventListener("resize", updateLayout);
  }, [length, divRef]);

  const handleClick = (bulletIndex: number) => {
    if (divRef.current?.childNodes[0]) {
      const cardElement = divRef.current.childNodes[0] as HTMLElement;
      const style = window.getComputedStyle(cardElement.parentElement!);
      const gap = parseFloat(style.gap) || 4;
      const cardWidthWithGap = cardElement.offsetWidth + gap;

      const scrollAmount = cardWidthWithGap * cardsPerPage * bulletIndex;

      setIndex(bulletIndex);

      divRef.current?.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!isClient || bullets <= 1) {
    return null;
  }

  return (
    <div className="my-5">
      <div className="flex justify-around w-full sm:w-1/3 lg:w-1/4 m-auto">
        {new Array(bullets).fill(0).map((_, i) => (
          <div
            key={`${i}-bullet`}
            className={twMerge(clsx("w-3 h-3 bg-neutral-300 rounded-full cursor-pointer", { "bg-green": i === index }))}
            onClick={() => handleClick(i)}
          />
        ))}
      </div>
    </div>
  );
}
