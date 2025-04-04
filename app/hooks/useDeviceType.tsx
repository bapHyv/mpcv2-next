"use client";

import { useState, useEffect, useMemo } from "react";

// Define breakpoints (adjust as needed)
const BREAKPOINTS = {
  SMARTPHONE: 767, // Max width for smartphones
  TABLET: 1024, // Max width for tablets
};

type DeviceType = "smartphone" | "tablet" | "desktop" | "unknown";

const useDeviceType = (): DeviceType => {
  const [screenWidth, setScreenWidth] = useState(0);
  const [userAgent, setUserAgent] = useState<string | null>(null);
  const [isTouchSupported, setIsTouchSupported] = useState<boolean | null>(null);
  const [deviceType, setDeviceType] = useState<DeviceType>("unknown");

  // --- Step 1: Gather Raw Data ---

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setUserAgent(navigator.userAgent.toLowerCase());
      const touch = "maxTouchPoints" in navigator && navigator.maxTouchPoints > 0;
      setIsTouchSupported(touch);
    }
  }, []);

  // --- Step 2: Calculate Device Type based on gathered data ---

  useEffect(() => {
    // Wait until we have all necessary information
    if (screenWidth === 0 || userAgent === null || isTouchSupported === null) {
      // Keep initial "unknown" or previous state until data is ready
      // Setting explicitly to unknown might cause flicker if data arrives fast
      // If you prefer stability until calculation:
      // if (deviceType !== "unknown") setDeviceType("unknown"); // Set only if not already unknown
      // Or simply return and wait for next render cycle:
      return;
    }

    // User agent checks (using useMemo could optimize if UA string was frequently changing, but it doesn't)
    const isMobileUA = /iphone|android.*mobile|blackberry|windows phone|webos/i.test(userAgent);
    const isTabletUA = /ipad|android(?!.*mobile)|tablet|kindle|silk|playbook/i.test(userAgent);

    let calculatedType: DeviceType = "unknown";

    // Decision Logic (Example - Prioritize screen size, refine with touch/UA)
    if (screenWidth <= BREAKPOINTS.SMARTPHONE) {
      // Small screens are almost always smartphones
      calculatedType = "smartphone";
    } else if (screenWidth <= BREAKPOINTS.TABLET) {
      // Medium screens: Could be tablet or small laptop
      // Prioritize tablet if touch is supported or UA indicates tablet
      if (isTouchSupported || isTabletUA) {
        calculatedType = "tablet";
      } else {
        // Otherwise, likely a small non-touch laptop
        calculatedType = "desktop";
      }
    } else {
      // Large screens: Could be desktop, large tablet, or touch laptop
      // Prioritize desktop unless touch AND tablet UA are present
      if (isTouchSupported && isTabletUA) {
        // Could be a large tablet (e.g., iPad Pro)
        calculatedType = "tablet";
      } else {
        // Default to desktop for large screens (includes touch laptops)
        calculatedType = "desktop";
      }
    }

    // Update the state only if the calculated type is different
    if (calculatedType !== deviceType) {
      setDeviceType(calculatedType);
    }
  }, [screenWidth, userAgent, isTouchSupported, deviceType]);

  return deviceType;
};

export default useDeviceType;
