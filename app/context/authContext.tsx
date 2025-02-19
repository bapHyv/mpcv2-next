"use client";
import { createContext, useContext, useState, useEffect, ReactNode, use } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { v4 as uuid } from "uuid";

import axiosInstance from "@/app/utils/apiClient";
import { User, UserData, AuthContextType, UserDataAPIResponse } from "@/app/types/profileTypes";
import { useAlerts } from "@/app/context/alertsContext";
import { logout as logoutAction } from "@/app/actions";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isTokenExpired = (token: string): boolean => {
  const decoded: any = jwtDecode(token); // Decode the JWT
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  return decoded.exp < currentTime; // Compare the expiration time with the current time
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserDataAPIResponse | null>(null);
  const { addAlert } = useAlerts();

  const cleanUpLocalStorageUserRelated = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userData");
  };

  useEffect(() => {
    if (!!localStorage.getItem("userData")) {
      setUserData(JSON.parse(localStorage.getItem("userData") || ""));
    }
  }, []);

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    }
  }, [userData]);

  const logout = async () => {
    try {
      const result = await logoutAction();
      if (result.isSuccess) {
        cleanUpLocalStorageUserRelated();
        setUserData(null);
        addAlert(uuid(), "You've successfully logged out", "Logout successful", "emerald");
      } else {
        throw new Error("Error while logging out");
      }
    } catch (error) {
      console.error(error);
      addAlert(uuid(), "Error while logging out", "Logout Error", "red");
    }
  };

  return <AuthContext.Provider value={{ userData, setUserData, cleanUpLocalStorageUserRelated, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
