"use client";

import { useRef } from "react";
import Separator from "./Separator";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";

interface Props {
  children: JSX.Element[];
}

export default function Carousel({ children }: Props) {
  const divRef = useRef<HTMLDivElement | null>(null);

  const scrollRight = () => {
    if (divRef.current) {
      const scrL = divRef.current.scrollLeft;
      // @ts-ignore
      const cardWidth = divRef.current.childNodes[0].clientWidth + 8;

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
      // @ts-ignore
      const cardWidth = divRef.current.childNodes[0].clientWidth + 8;

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
      <div className="relative px-2 xl:px-16 mb-12 lg:mb-0">
        <div
          ref={divRef}
          className={`flex gap-2 p-2 sm:gap-3 overflow-x-scroll w-full rounded-md no-scrollbar
          shadow-carousel dark:shadow-carousel-dark 
          bg-neutral-200 dark:bg-dark-black
          `}
        >
          {children}
        </div>
        <ArrowLeftIcon
          onClick={scrollLeft}
          className={`lg:flex absolute cursor-pointer lg:items-center lg:justify-center z-10 
          -bottom-12 right-14 lg:left-2 lg:top-1/2 text-green border-2 border-green
          h-9 w-9 lg:h-9 lg:w-9 rounded-md lg:-translate-y-1/2
          animate-backgroundOpacitySlightPulse dark:animate-none dark:bg-light-black dark:text-light-green
          `}
        />
        <ArrowRightIcon
          onClick={scrollRight}
          className={`lg:flex absolute cursor-pointer lg:items-center lg:justify-center z-10 
          -bottom-12 right-2 lg:top-1/2 text-green border-2 border-green
          h-9 w-9 lg:h-9 lg:w-9 rounded-md lg:-translate-y-1/2
          animate-backgroundOpacitySlightPulse dark:animate-none dark:bg-light-black dark:text-light-green
          `}
        />
      </div>
      <Separator />
    </>
  );
}
