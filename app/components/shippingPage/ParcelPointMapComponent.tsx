"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";

import { useOrder } from "@/app/context/orderContext";
import { BoxtalParcelPointMap, ParcelPoint } from "@/app/types/mapTypes";
import { BoxtalAuthResponse } from "@/app/api/boxtal-token/route";
import { buttonClassname } from "@/app/staticData/cartPageClasses";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const BoxtalMaps = require("@boxtal/parcel-point-map");

interface BoxtalToken {
  token: string;
  expiresIn: number;
}

export default function ParcelPointMapComponent() {
  const t = useTranslations("shippingPage.parcelPointMap");
  const [accessToken, setAccessToken] = useState<null | string>(null);
  const [mapInstance, setMapInstance] = useState<null | BoxtalParcelPointMap>(null);
  const [errorLoadingMap, setErrorLoadingMap] = useState<string | null>(null);

  const { order, setOrder } = useOrder();

  // --- Handler to Search for Points ---
  const handleFind = () => {
    if (mapInstance && order.shippingAddress.postalCode && order.shippingAddress.city) {
      setErrorLoadingMap(null);
      const address = {
        country: order.shippingAddress.country === "France (Corse)" ? "FR" : "FR",
        zipCode: order.shippingAddress.postalCode,
        city: order.shippingAddress.city,
        street: order.shippingAddress.address1,
      };
      console.log("Searching parcel points for:", address);
      try {
        // The callback updates the order state when a point is selected *by the user* on the map
        mapInstance.searchParcelPoints(address, (parcelPoint: ParcelPoint) => {
          console.log("Parcel point selected:", parcelPoint);
          setOrder((prevState) => ({ ...prevState, "parcel-point": parcelPoint }));
        });
      } catch (error) {
        console.error("Error searching parcel points:", error);
        setErrorLoadingMap(t("errorSearchText"));
      } finally {
        // Note: Loading might stop before user selection, map handles its own loading state visually
      }
    } else {
      console.warn("Cannot search points: Map not ready or address incomplete.");
      setErrorLoadingMap(t("errorAddressIncompleteText"));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setErrorLoadingMap(null);
      try {
        const stringifiedLsAccessToken = localStorage.getItem("accessTokenBoxtal");
        let lsAccessToken: BoxtalToken = { token: "", expiresIn: 0 };

        if (stringifiedLsAccessToken) {
          try {
            lsAccessToken = JSON.parse(stringifiedLsAccessToken);
          } catch (e) {
            console.error("Failed to parse cached token", e);
          }
        }

        if (lsAccessToken.token && Date.now() < lsAccessToken.expiresIn) {
          setAccessToken(lsAccessToken.token);
          console.log("Boxtal Token: LS Hit");
        } else {
          console.log("Boxtal Token: LS Miss or Expired, Fetching...");
          const response = await fetch("/api/boxtal-token");
          if (!response.ok) {
            throw new Error(`Failed to fetch access token (${response.status})`);
          }
          const data: BoxtalAuthResponse = await response.json();
          if (!data.accessToken) {
            throw new Error("Access token not found in API response");
          }
          const { accessToken: _accessToken, expiresIn } = data;
          const expiryTime = Date.now() + (expiresIn - 60) * 1000;
          localStorage.setItem("accessTokenBoxtal", JSON.stringify({ token: _accessToken, expiresIn: expiryTime }));
          setAccessToken(_accessToken);
        }
      } catch (error) {
        console.error("Error fetching/setting Boxtal access token:", error);
        setErrorLoadingMap(t("errorAuthText"));
      }
    };

    fetchData();

    // --- Cleanup Logic ---
    // Cleanup selected point when component unmounts or shipping method changes
    // This prevents keeping a point selected if user switches away from Boxtal
    return () => {
      console.log("Cleaning up parcel point map component");
      setOrder((prevState) => {
        // Only clear if the current method IS boxtal - avoids clearing if it was never set
        if (prevState["shipping-method"] === "boxtal_connect" && prevState["parcel-point"]?.code) {
          console.log("Clearing selected parcel point due to unmount/method change");
          return { ...prevState, "parcel-point": null };
        }
        return prevState;
      });
    };
    // Rerun if shipping method changes externally (though typically unmounts)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Effect to Initialize Map Instance ---
  useEffect(() => {
    let map: BoxtalParcelPointMap | null = null; // Local variable for cleanup
    if (accessToken && !mapInstance && !errorLoadingMap) {
      // Only init if token exists, no map yet, and no error
      try {
        console.log("Initializing Boxtal Map...");
        map = new BoxtalMaps.BoxtalParcelPointMap({
          domToLoadMap: "#parcel-point-map",
          accessToken,
          config: {
            locale: "fr",
            parcelPointNetworks: [{ code: "CHRP_NETWORK", markerTemplate: { color: "#1E8571" } }],
            options: { primaryColor: "#1E8571", autoSelectNearestParcelPoint: true },
          },
        });
        setMapInstance(map);
        console.log("Boxtal Map Initialized");
      } catch (error) {
        console.error("Error initializing Boxtal Map instance:", error);
        setErrorLoadingMap(t("errorLoadText"));
      } finally {
      }
    }

    return () => {
      if (map) {
        console.log("Destroying Boxtal map instance");
        setMapInstance(null);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, errorLoadingMap]); // Re-run if token changes or error occurs

  return (
    <div className="space-y-3">
      {/* Map Container */}
      <div id="parcel-point-map" className="h-[400px] sm:h-[500px] w-full rounded-md overflow-hidden relative" />

      {/* Loading Overlay */}
      {/* {isLoadingMap && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <LoadingSpinner color="green" size="md" />
            <span className="ml-2 text-sm text-gray-600">{t("loadingMapText")}</span>
          </div>
        )} */}
      {/* Error Overlay */}
      {/* {errorLoadingMap && (
          <div className="absolute inset-0 bg-red-50 flex items-center justify-center p-4 z-10">
            <p className="text-sm text-red-700 text-center">{errorLoadingMap}</p>
          </div>
        )} */}
      {/* Initial Load/Auth Error Overlay */}
      {/* {!accessToken &&
          !errorLoadingMap && ( // TODO: Condition might need adjustment based on auth error state
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center p-4">
              <p className="text-sm text-gray-500 text-center">{t("errorLoadText")}</p>
            </div>
          )} */}

      {/* Button / Selection Info Area */}
      <div className="flex items-center justify-center min-h-[40px]">
        <button
          type="button"
          className={twMerge(buttonClassname, "px-4 py-2")}
          onClick={handleFind}
          disabled={!order.shippingAddress.postalCode || !order.shippingAddress.city || !!errorLoadingMap} // Also disable on error
        >
          {t("findButton")}
        </button>
      </div>
    </div>
  );
}
