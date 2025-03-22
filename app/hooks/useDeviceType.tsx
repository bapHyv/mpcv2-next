"use client";

import { useState, useEffect } from "react";

const detectDeviceType = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const screenWidth = typeof window !== undefined ? window.innerWidth : 0;
  const isTouchSupported = "maxTouchPoints" in navigator && navigator.maxTouchPoints > 0;

  // User agent patterns
  const isMobileUA = /iphone|android|blackberry|windows phone|webos/i.test(userAgent);
  const isTabletUA = /ipad|android(?!.*mobile)|tablet|kindle|silk/i.test(userAgent);
  const isDesktopUA = !isMobileUA && !isTabletUA;

  // Screen size breakpoints
  const isSmallScreen = screenWidth <= 767;
  const isMediumScreen = screenWidth > 767 && screenWidth <= 1024;
  const isLargeScreen = screenWidth > 1024;

  // Decision logic
  if (isMobileUA && isSmallScreen && isTouchSupported) {
    return "smartphone";
  } else if (isTabletUA && isMediumScreen && isTouchSupported) {
    return "tablet";
  } else if (isDesktopUA && isLargeScreen && !isTouchSupported) {
    return "desktop";
  } else {
    if (isTouchSupported) {
      if (screenWidth <= 767) return "smartphone";
      if (screenWidth <= 1024) return "tablet";
    }
    if (isLargeScreen) return "desktop";
    return "unknown";
  }
};

const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<"smartphone" | "tablet" | "desktop" | "unknown">(detectDeviceType());

  useEffect(() => {
    // Update device type on window resize
    const handleResize = () => {
      setDeviceType(detectDeviceType());
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array means it only runs on mount/unmount

  return deviceType;
};

export default useDeviceType;
