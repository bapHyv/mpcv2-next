"use client";

import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

import { buttonClassname } from "@/app/staticData/cartPageClasses";
import CarrouselButtons from "@/app/components/homepage/CarrouselButtons";

interface Props {
  children: React.ReactElement[];
  length: number;
}

export default function Carousel({ children, length }: Props) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    const checkIsPhone = () => {
      if (typeof window !== "undefined") {
        setIsPhone(window.innerWidth < 640);
      }
    };
    checkIsPhone();
    window.addEventListener("resize", checkIsPhone);
    return () => window.removeEventListener("resize", checkIsPhone);
  }, []);

  const calculateCardWidthWithGap = (): number => {
    if (divRef.current?.firstElementChild) {
      const cardElement = divRef.current.firstElementChild as HTMLElement;
      const styles = window.getComputedStyle(divRef.current);
      const gap = parseFloat(styles.gap) || 0;
      return cardElement.offsetWidth + gap;
    }
    return 336 + 16;
  };

  const scrollRight = () => {
    if (divRef.current) {
      const container = divRef.current;
      const scrL = container.scrollLeft;
      const cardWidthWithGap = calculateCardWidthWithGap();
      if (cardWidthWithGap <= 0) return;

      const targetScrollLeft = Math.ceil((scrL + 1) / cardWidthWithGap) * cardWidthWithGap;

      container.scrollTo({
        left: Math.min(targetScrollLeft, container.scrollWidth - container.clientWidth),
        behavior: "smooth",
      });
    }
  };

  const scrollLeft = () => {
    if (divRef.current) {
      const container = divRef.current;
      const scrL = container.scrollLeft;
      const cardWidthWithGap = calculateCardWidthWithGap();
      if (cardWidthWithGap <= 0) return;

      const targetScrollLeft = Math.floor((scrL - 1) / cardWidthWithGap) * cardWidthWithGap;

      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full max-w-full overflow-hidden">
      <div className={clsx("mx-auto", "w-[344px]", "sm:w-[624px]", "lg:w-[812px]", "xl:w-[1216px]", "3xl:w-[1620px] snap-start")}>
        <div
          ref={divRef}
          className={clsx("flex bg-gray-50 gap-1 p-1 rounded-lg overflow-x-scroll no-scrollbar", "scroll-smooth snap-x snap-mandatory")}
        >
          {React.Children.map(children, (child) => React.cloneElement(child as React.ReactElement, { className: twMerge(child.props.className) }))}
        </div>
      </div>
      {length > 1 && <Bullets length={length} divRef={divRef} />}
    </div>
  );
}

interface PropsBullets {
  length: number;
  divRef: MutableRefObject<HTMLDivElement | null>;
}

function Bullets({ length, divRef }: PropsBullets) {
  const [bullets, setBullets] = useState(0);
  const [index, setIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3);

  useEffect(() => {
    const calculateLayout = () => {
      if (typeof window !== "undefined" && divRef.current?.firstElementChild) {
        const containerWidth = divRef.current.clientWidth;
        const cardElement = divRef.current.firstElementChild as HTMLElement;
        const styles = window.getComputedStyle(divRef.current);
        const gap = parseFloat(styles.gap) || 0;
        const cardWidthWithGap = cardElement.offsetWidth + gap;

        const calculatedCardsPerPage = Math.max(1, Math.floor(containerWidth / cardWidthWithGap));
        setCardsPerPage(calculatedCardsPerPage);
        setBullets(Math.ceil(length / calculatedCardsPerPage));

        const currentScroll = divRef.current.scrollLeft;
        const calculatedIndex = Math.round(currentScroll / (cardWidthWithGap * calculatedCardsPerPage));
        setIndex(calculatedIndex);
      }
    };

    calculateLayout();
    window.addEventListener("resize", calculateLayout);

    const scrollContainer = divRef.current;
    const handleScroll = () => {
      if (scrollContainer?.firstElementChild) {
        const cardElement = scrollContainer.firstElementChild as HTMLElement;
        const styles = window.getComputedStyle(scrollContainer);
        const gap = parseFloat(styles.gap) || 0;
        const cardWidthWithGap = cardElement.offsetWidth + gap;
        const calculatedCardsPerPage = Math.max(1, Math.floor(scrollContainer.clientWidth / cardWidthWithGap)); // Recalculate just in case
        const currentScroll = scrollContainer.scrollLeft;
        const calculatedIndex = Math.round(currentScroll / (cardWidthWithGap * calculatedCardsPerPage));
        setIndex(calculatedIndex);
      }
    };
    scrollContainer?.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", calculateLayout);
      scrollContainer?.removeEventListener("scroll", handleScroll);
    };
  }, [length, divRef]);

  const handleClick = (bulletIndex: number) => {
    if (divRef.current?.firstElementChild) {
      const cardElement = divRef.current.firstElementChild as HTMLElement;
      const styles = window.getComputedStyle(divRef.current);
      const gap = parseFloat(styles.gap) || 0;
      const cardWidthWithGap = cardElement.offsetWidth + gap;

      const scrollAmount = cardWidthWithGap * cardsPerPage * bulletIndex;

      setIndex(bulletIndex);

      divRef.current?.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (bullets <= 1) {
    return null;
  }

  return (
    <div className="mt-6 mb-1 flex justify-center">
      <div className="flex items-center justify-center gap-2.5">
        {new Array(bullets).fill(0).map((_, i) => (
          <button
            key={`${i}-bullet`}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index ? "true" : "false"}
            className={twMerge(
              "h-2.5 w-2.5 rounded-full transition-colors duration-150 ease-in-out",
              i === index ? "bg-green scale-110" : "bg-gray-300 hover:bg-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green"
            )}
            onClick={() => handleClick(i)}
          />
        ))}
      </div>
    </div>
  );
}
