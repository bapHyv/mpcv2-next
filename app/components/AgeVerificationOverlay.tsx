// components/AgeVerificationOverlay.js
"use client"; // Mark as a Client Component
import { useEffect, useState } from "react";
import useCookies from "@/app/hooks/useCookies"; // Import your custom hook
import Image from "next/image";

const AgeVerificationOverlay = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const { addCookie } = useCookies(); // Use your custom hook

  useEffect(() => {
    // Check if the user has already verified their age
    const isAgeVerified = document.cookie.includes("age_verified=true") || localStorage.getItem("age_verified") === "true";
    if (!isAgeVerified) {
      setShowOverlay(true);
    }
  }, []);

  const verifyAge = (isOfAge: boolean) => {
    if (isOfAge) {
      // Set a cookie and localStorage to remember the user's choice
      addCookie({ name: "age_verified", value: "true", options: { Expires: 30 } }); // Expires in 30 days
      localStorage.setItem("age_verified", "true");
      setShowOverlay(false);
    } else {
      // Redirect to an age-restricted page or external site
      history.back();
    }
  };

  if (!showOverlay) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center text-white z-[9999]">
      <div className="text-center bg-white pt-5 pb-10 px-5 rounded-md text-black">
        <Image alt="Logo monplancbd" width={40} height={40} src={`/canna-vert.png`} className="mx-auto mb-5 w-auto" />
        <h1 className="text-2xl font-bold mb-4">Are you over 18 years old?</h1>
        <div className="space-x-4">
          <button
            onClick={() => verifyAge(false)}
            className="px-6 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition-colors"
          >
            No
          </button>
          <button
            onClick={() => verifyAge(true)}
            className="px-6 py-2 bg-green text-white font-semibold rounded hover:bg-dark-green transition-colors"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationOverlay;
