"use client";

import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";
import { v4 as uuid } from "uuid";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import CartConflictModal from "@/app/components/modals/CartConflictModal";
import { useAlerts } from "@/app/context/alertsContext";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { AuthContextType, UserDataAPIResponse } from "@/app/types/profileTypes";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 *
 * TODO: ajouter un check des produits lors de la comparaison de cart et cartBkp
 */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserDataAPIResponse | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [referralToken, setReferralToken] = useState<null | string>(null);
  // TODO: remove orderBkp here
  const [conflictingData, setConflictingData] = useState<{ cartBkp: string; orderBkp: string } | null>(null);
  const [isConflictModalVisible, setIsConflictModalVisible] = useState(false);

  const { cart: localCart, setCart } = useProductsAndCart();
  const { addAlert } = useAlerts();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tAlerts = useTranslations("alerts.auth");

  const cleanUpLocalStorageUserRelated = () => {
    localStorage.removeItem("userData");
  };

  const resolveCartConflict = (choice: "local" | "remote") => {
    if (choice === "remote" && conflictingData) {
      const savedCart = JSON.parse(conflictingData.cartBkp);
      setCart(savedCart);
      addAlert(uuid(), tAlerts("cartConflict.remoteSelected.text"), tAlerts("cartConflict.remoteSelected.title"), "emerald");
    } else {
      setUserData((prevState) => {
        if (prevState) {
          return {
            ...prevState,
            cartBkp: JSON.stringify(localCart),
          };
        } else {
          return null;
        }
      });
      addAlert(uuid(), tAlerts("cartConflict.localSelected.text"), tAlerts("cartConflict.localSelected.title"), "emerald");
    }

    setIsConflictModalVisible(false);
    setConflictingData(null);
  };

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      cleanUpLocalStorageUserRelated();
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      const localCartHasItems = localCart.products && localCart.products.length > 0;
      const remoteHasItems = userData.cartBkp && userData.cartBkp !== "null" && JSON.parse(userData.cartBkp).products.length > 0;
      const areCartsDifferent = JSON.stringify(localCart) !== userData.cartBkp;
      if (!localCartHasItems && remoteHasItems) {
        setCart(JSON.parse(userData.cartBkp || "null"));
      } else if (areCartsDifferent) {
        // TODO: remove orderBkp here
        setConflictingData({ cartBkp: userData.cartBkp || "null", orderBkp: userData.orderBkp || "null" });
        setIsConflictModalVisible(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  useEffect(() => {
    const fetchInitialSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const fetchedUserData: UserDataAPIResponse = await response.json();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        cleanUpLocalStorageUserRelated,
        logout,
        isLoggingOut,
        isAuthLoading,
        referralToken,
      }}
    >
      {conflictingData && (
        <CartConflictModal
          isOpen={isConflictModalVisible}
          onClose={() => resolveCartConflict("local")}
          onResolve={resolveCartConflict}
          localCart={localCart}
          remoteCart={JSON.parse(conflictingData.cartBkp)}
        />
      )}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
