"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import { twMerge } from "tailwind-merge";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

import banner1Desktop from "@/public/blueberry_2:1.png";
import banner1Tablet from "@/public/blueberry_3:2.png";
import banner1Mobile from "@/public/blueberry_4:3.png";

import banner2Desktop from "@/public/pf_2:1.png";
import banner2Tablet from "@/public/pf_3:2.png";
import banner2Mobile from "@/public/pf_4:3.png";

const carouselBanners: {
  desktopSrc: StaticImageData | string;
  tabletSrc: StaticImageData | string;
  mobileSrc: StaticImageData | string;
  alt: string;
  href: string;
}[] = [
  {
    desktopSrc: banner1Desktop,
    tabletSrc: banner1Tablet,
    mobileSrc: banner1Mobile,
    alt: "Blueberry Banner",
    href: "/fleurs-cbd/-blueberry-",
  },
  {
    desktopSrc: banner2Desktop,
    tabletSrc: banner2Tablet,
    mobileSrc: banner2Mobile,
    alt: "Passion fruit Banner",
    href: "/pollens-resines-hash-cbd/-passion-fruit-dry-sift-120u-",
  },
];

const TABLET_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1024;
const SWIPE_THRESHOLD = 50;

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeBanners, setActiveBanners] = useState<(StaticImageData | string)[]>([]);
  const totalSlides = carouselBanners.length;
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let sources: (StaticImageData | string)[];
      if (width >= DESKTOP_BREAKPOINT) {
        sources = carouselBanners.map((b) => b.desktopSrc);
      } else if (width >= TABLET_BREAKPOINT) {
        sources = carouselBanners.map((b) => b.tabletSrc);
      } else {
        sources = carouselBanners.map((b) => b.mobileSrc);
      }
      setActiveBanners(sources);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const scrollLeft = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalSlides - 1 : prevIndex - 1));
  }, [totalSlides]);

  const scrollRight = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex === totalSlides - 1 ? 0 : prevIndex + 1));
  }, [totalSlides]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (totalSlides <= 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (totalSlides <= 1 || !touchStartX.current) return;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (totalSlides <= 1 || !touchStartX.current) return;

    const deltaX = touchStartX.current - touchEndX.current;

    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX > 0) {
        scrollRight();
      } else {
        scrollLeft();
      }
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  useEffect(() => {
    if (carouselBanners.length <= 1) return;
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex === carouselBanners.length - 1 ? 0 : prevIndex + 1));
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  if (activeBanners.length === 0) {
    return (
      <div
        className={twMerge(
          "relative w-full overflow-hidden bg-gray-200",
          "aspect-w-4 aspect-h-3",
          "md:aspect-w-3 md:aspect-h-2",
          "lg:aspect-w-2 lg:aspect-h-1"
        )}
      ></div>
    );
  }

  return (
    <div
      ref={carouselRef}
      className="relative w-full overflow-hidden group"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {activeBanners.map((src, index) => {
          const bannerData = carouselBanners[index];
          const Wrapper = bannerData.href ? "a" : "div";
          const wrapperProps = bannerData.href ? { href: bannerData.href } : {};

          return (
            <Wrapper key={index} className="flex-shrink-0 w-full" {...wrapperProps}>
              <div
                className={twMerge(
                  "relative w-full overflow-hidden",
                  "aspect-w-4 aspect-h-3",
                  "md:aspect-w-3 md:aspect-h-2",
                  "lg:aspect-w-2 lg:aspect-h-1"
                )}
              >
                <Image
                  src={src}
                  alt={bannerData.alt}
                  fill
                  className="object-cover pointer-events-none"
                  priority={index === 0}
                  sizes="100vw"
                  draggable="false"
                />
              </div>
            </Wrapper>
          );
        })}
      </div>
      {carouselBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {carouselBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={twMerge(
                "h-2.5 w-2.5 rounded-full transition-all duration-150 ease-in-out",
                index === currentIndex ? "bg-green scale-110" : "bg-gray-400 hover:bg-gray-500",
                "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green"
              )}
            />
          ))}
        </div>
      )}

      {carouselBanners.length > 1 && (
        <>
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Previous slide"
            className={twMerge(
              "absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 z-10",
              "bg-white/60 backdrop-blur-sm border border-gray-300 text-gray-700",
              "hover:bg-white hover:text-green focus:ring-green",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "hidden md:block"
            )}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            aria-label="Next slide"
            className={twMerge(
              "absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 z-10",
              "bg-white/60 backdrop-blur-sm border border-gray-300 text-gray-700",
              "hover:bg-white hover:text-green focus:ring-green",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "hidden md:block"
            )}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
};

export default HeroCarousel;
