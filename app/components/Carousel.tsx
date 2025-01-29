"use client";

import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import Separator from "./Separator";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface Props {
  children: JSX.Element[];
  length: number;
}

export default function Carousel({ children, length }: Props) {
  const divRef = useRef<HTMLDivElement | null>(null);

  const isPhone = useMemo(() => window.innerWidth < 640, []);

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
      <div className="lg:px-2 xl:px-16 mb-12 lg:mb-0">
        <div
          ref={divRef}
          className={clsx("flex gap-1 p-1 overflow-x-scroll w-[344px] m-auto rounded-md no-scrollbar", "sm:w-[624px]", "lg:w-[1620px]")}
        >
          {children}
        </div>
        {divRef && isPhone ? (
          <div className="p-1 w-[336px] m-auto">
            <div className="relative">
              <ChevronLeftIcon
                onClick={scrollLeft}
                className={clsx(
                  "absolute left-0 top-1 z-10 h-6 w-6 text-neutral-700 border border-neutral-400 bg-neutral-100 rounded-full",
                  "dark:bg-white dark:text-light-white"
                )}
              />
              <ChevronRightIcon
                onClick={scrollRight}
                className={clsx(
                  "absolute right-0 top-1 z-10 h-6 w-6 text-neutral-700 border border-neutral-400 bg-neutral-100 rounded-full",
                  "dark:bg-white dark:text-light-white"
                )}
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

  const isTablet = useMemo(() => window.innerWidth >= 640 && window.innerWidth < 1280, []);
  const isDesktop = useMemo(() => window.innerWidth >= 1280, []);

  useEffect(() => {
    if (isTablet) {
      setBullets(Math.ceil(length / 2));
    } else if (isDesktop) {
      setBullets(Math.ceil(length / 4));
    }
  }, [isTablet, isDesktop, length]);

  const handleClick = (index: number) => {
    if (divRef.current) {
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 1280;
      const isDesktop = window.innerWidth >= 1280;

      let left = 0;

      if (isTablet) {
        // On tablet, 2 cards are displayed in the carrousel. 620 is the width of 2 cards + 2 gaps
        // card width = 306px; gap width = 4px; 306*2 + 4*2 = 620
        left = 620 * index;
      } else if (isDesktop) {
        // On desktop, 4 cards are displayed in the carrousel. 1616 is the width of 4 cards + 4 gaps
        // card width = 400px; gap width = 4px; 400*4 + 4*4 = 1616
        left = 1616 * index;
      }

      setIndex(index);

      divRef.current?.scrollTo({
        left,
        behavior: "smooth",
      });
    }
  };

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
