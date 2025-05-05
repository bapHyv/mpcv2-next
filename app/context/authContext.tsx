"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuid } from "uuid";
import { useTranslations } from "next-intl";

import { logout as logoutAction } from "@/app/actions";
import { useAlerts } from "@/app/context/alertsContext";
import { AuthContextType, UserDataAPIResponse } from "@/app/types/profileTypes";
import { usePathname, useRouter } from "next/navigation";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserDataAPIResponse | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { addAlert } = useAlerts();
  const router = useRouter();
  const pathname = usePathname();
  const tAlerts = useTranslations("alerts.auth");

  const cleanUpLocalStorageUserRelated = () => {
    localStorage.removeItem("userData");
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");

    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      cleanUpLocalStorageUserRelated();
    }
  }, [userData]);

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      const result = await logoutAction();
      if (result.isSuccess) {
        cleanUpLocalStorageUserRelated();
        setUserData(null);
        addAlert(uuid(), tAlerts("logoutSuccess.text"), tAlerts("logoutSuccess.title"), "emerald");
        if (pathname.includes("/mon-compte")) {
          router.push("/");
        }
        router.refresh();
      } else {
        console.error("Logout action failed:", result.message);
        addAlert(uuid(), result.message || tAlerts("logoutFailed.text"), tAlerts("logoutFailed.title"), "red");
      }
    } catch (error) {
      console.error("Error during logout process:", error);
      addAlert(uuid(), tAlerts("logoutError.text"), tAlerts("logoutError.title"), "red");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const value = { userData, setUserData, cleanUpLocalStorageUserRelated, logout, isLoggingOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
