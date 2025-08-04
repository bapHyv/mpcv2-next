"use client";

import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";
import { v4 as uuid } from "uuid";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import CartConflictModal from "@/app/components/modals/CartConflictModal";
import { useAlerts } from "@/app/context/alertsContext";
import { ProductCart, useProductsAndCart } from "@/app/context/productsAndCartContext";
import { AuthContextType, UserDataAPIResponse } from "@/app/types/profileTypes";
import { useSse } from "@/app/context/sseContext";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserDataAPIResponse | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [referralToken, setReferralToken] = useState<null | string>(null);
  const [conflictingData, setConflictingData] = useState<{ cartBkp: string } | null>(null);
  const [isConflictModalVisible, setIsConflictModalVisible] = useState(false);

  const { cart: localCart, setCart } = useProductsAndCart();
  const { sseData } = useSse();
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
      const remoteCart: { total: number; products: ProductCart[] } | null = JSON.parse(userData.cartBkp || "null");

      // If no remote cart, no need to compute anything, just keep the localCartHasItems
      if (!remoteCart) return;
      if (remoteCart.products.length === 0) return;

      // Check if cartBkp has products that don't exist or not enough stock
      if (remoteCart && remoteCart.products.length > 0 && sseData) {
        remoteCart.products = remoteCart.products.filter((product) => {
          if (!(product.id in sseData.stocks)) {
            return false;
          } else if (product.quantity * parseInt(product.option, 10) > sseData.stocks[product.id]) {
            return false;
          } else {
            return true;
          }
        });
      }

      const remoteHasItems = remoteCart && remoteCart.products.length > 0;

      // Has to remove cartItemId to compare the products. The cartItemId is a uuid, making each product unique.
      // For example, 1g of MIX SMALL BUD in one cart, will be different from 1g of MIX SMALL BUD in an other cart because of its id.
      // This is the reason why the cartItemIds have to be removed to compare the carts.
      const areCartsDifferent = (() => {
        const normalizeCart = (cart: { products: ProductCart[] } | null) => {
          if (!cart || !cart.products) return null;

          // 1. Deep copy to avoid mutating the original state
          const cartCopy = JSON.parse(JSON.stringify(cart));

          // 2. Sort the products array by ID and then by option for consistency
          cartCopy.products.sort((a: ProductCart, b: ProductCart) => {
            if (a.id !== b.id) {
              return a.id - b.id;
            }
            return a.option.localeCompare(b.option);
          });

          // 3. Remove the client-specific `cartItemId` from each product
          cartCopy.products.forEach((p: any) => delete p.cartItemId);

          return cartCopy;
        };

        const normalizedLocal = normalizeCart(localCart);
        const normalizedRemote = normalizeCart(remoteCart);

        // 4. Compare the stringified versions of the normalized objects
        return JSON.stringify(normalizedLocal) !== JSON.stringify(normalizedRemote);
      })();

      if (!localCartHasItems && remoteHasItems) {
        setCart(remoteCart);
      } else if (areCartsDifferent) {
        setConflictingData({ cartBkp: JSON.stringify(remoteCart) });
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
          const responseText = await response.text();

          if (responseText && responseText !== "null") {
            const fetchedUserData: UserDataAPIResponse = JSON.parse(responseText);
            setUserData(fetchedUserData);
          } else {
            setUserData(null);
            cleanUpLocalStorageUserRelated();
          }
        } else {
          setUserData(null);
          cleanUpLocalStorageUserRelated();
        }
      } catch (error) {
        console.log(error);
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
