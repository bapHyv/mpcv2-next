'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import mandarinBanner from "../../public/mandarin-banner.png"; // Desktop banner
import mandarinMobileBanner from "../../public/mandarin-mobile-banner.png"; // Mobile banner

const HeroCarousel = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Detect mobile screen size
  useEffect(() => {
    const handleResize = () => {
      const isScreenMobile = window.innerWidth <= 768;
      setIsMobile(isScreenMobile);
    };
    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set banners based on screen size
  const banners = isMobile
    ? [mandarinMobileBanner]
    : [mandarinBanner];

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Carousel Content */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={index} className="flex-shrink-0 w-full">
            <Image
              src={banner}
              alt={`Banner ${index + 1}`}
              layout="responsive"
              objectFit="cover"
              objectPosition="center"
              priority
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-teal-600" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;