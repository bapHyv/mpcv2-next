"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuid } from "uuid";
import { useTranslations } from "next-intl";

import { useAlerts } from "@/app/context/alertsContext";
import { AuthContextType, UserDataAPIResponse } from "@/app/types/profileTypes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserDataAPIResponse | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [referralToken, setReferralToken] = useState<null | string>(null);

  const { addAlert } = useAlerts();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tAlerts = useTranslations("alerts.auth");

  const cleanUpLocalStorageUserRelated = () => {
    localStorage.removeItem("userData");
  };

  useEffect(() => {
    const fetchInitialSession = async () => {
      try {
        const response = await fetch("/api/auth/session");

        if (response.ok) {
          const fetchedUserData: UserDataAPIResponse = await response.json();
          console.log(fetchedUserData);
          setUserData(fetchedUserData);
        } else {
          setUserData(null);
          cleanUpLocalStorageUserRelated();
        }
      } catch (error) {
        console.error("Failed to fetch initial session:", error);
        setUserData(null);
        cleanUpLocalStorageUserRelated();
      } finally {
        setIsAuthLoading(false);
      }
    };

    fetchInitialSession();
  }, []);

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      cleanUpLocalStorageUserRelated();
    }
  }, [userData]);

  useEffect(() => {
    if (!referralToken && !!searchParams.get("referral")) {
      setReferralToken(searchParams.get("referral"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        console.error("Logout API call failed:", await response.text());
      }

      setUserData(null);

      addAlert(uuid(), tAlerts("logoutSuccess.text"), tAlerts("logoutSuccess.title"), "emerald");

      if (pathname.includes("/mon-compte")) {
        router.push("/");
      }

      router.refresh();
    } catch (error) {
      console.error("Error during logout process:", error);
      addAlert(uuid(), tAlerts("logoutError.text"), tAlerts("logoutError.title"), "red");
      setUserData(null);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const value = { userData, setUserData, cleanUpLocalStorageUserRelated, logout, isLoggingOut, isAuthLoading, referralToken };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
