"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuid } from "uuid";
import { useTranslations } from "next-intl";

import { logout as logoutAction } from "@/app/actions";
import { useAlerts } from "@/app/context/alertsContext";
import { AuthContextType, UserDataAPIResponse } from "@/app/types/profileTypes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserDataAPIResponse | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [referralToken, setReferralToken] = useState<null | string>(null);

  const { addAlert } = useAlerts();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tAlerts = useTranslations("alerts.auth");

  const cleanUpLocalStorageUserRelated = () => {
    localStorage.removeItem("userData");
  };

  /**
   *
   *
   * Cas 0:
   * -Si userData dans le localStorage:
   *      -Utiliser refresh token pour avoir nouveau AT, RF et data user
   *      -Si error: logout
   *
   * S'il est connecté sur deux appareil en même temps:
   *
   * Cas 1:
   * L'utilisateur se connecte sur Appareil-1, il reçois un token AT1 et RF1
   * L'utilisateur se connecte sur Appareil-2, il reçois un token AT2 et RF2 rendant AT1 et RF1 obsolète
   * Plus tard, l'utilisateur revient sur Appareil-1, ce qui déclenche un fetch user avec le RT1 => Error donc logout
   *
   * Cas 2:
   *  L'utilisateur se connecte sur Appareil-1, il reçois un token AT1 et RF1
   *  L'utilisateur se connecte sur Appareil-2, il reçois un token AT2 et RF2, rendant AT1 et RF1 obsolète
   *  L'utilisateur essaye de passer une commande ou de faire une modification sur Appareil-1 sans avoir refresh la page au préalable, QUE DOIT-IL SE PASSER?
   *
   * Lors de la modification de ses données OU de la modification de son panier OU quand il arrive sur la page expédition:
   *
   *
   *
   * Actions: Modifier
   *
   *
   * Jusqu'à présent, je n'avais pas besoin des tokens dans le front.
   * Lors du login, je set les AT et RT dans les cookies
   * Lors du logout, je delete les AT et RT
   * L'utilisation des tokens se faisait uniquement dans les actions.
   * Pour gérer les réponses 401, j'ai crée un fetchWrapper qui,
   *  lors de requête, s'il reçois un 401, il utilise le RT
   *  pour récupérer un nouvel AT valide puis relance la requête avec ce nouvel AT.
   *
   * Aujourd'hui, nous mettons en place le fetch des data users lors de l'arrivé sur le site.
   * Ce qui fait que, les tokens sont à deux endroits: cookies et userData
   * Lors du fetch des données utilisateurs dans le FE avec le RT,
   *  je me retrouve obligatoirement avec une différence de token entre le userData et le refreshToken
   */

  /**
   * TODO: Add fetch user data with refresh token here
   *
   * Utiliser AT. Si 401, utilisation du RT. Le payload utilisateur sera dans avec le nouvel AT et RT.
   */
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

  useEffect(() => {
    if (!referralToken && !!searchParams.get("referral")) {
      setReferralToken(searchParams.get("referral"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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

  const value = { userData, setUserData, cleanUpLocalStorageUserRelated, logout, isLoggingOut, referralToken };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
