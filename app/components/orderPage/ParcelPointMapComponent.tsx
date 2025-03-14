"use client";

import { useOrder } from "@/app/context/orderContext";
import { useEffect, useState } from "react";
import { BoxtalParcelPointMap, ParcelPoint } from "@/app/types/mapTypes";
import { BoxtalAuthResponse } from "@/app/api/route";
const BoxtalMaps = require("@boxtal/parcel-point-map");

interface BoxtalToken {
  token: string;
  expiresIn: number;
}

export default function BoxtalMap() {
  const [accessToken, setAccessToken] = useState<null | string>(null);
  const [map, setMap] = useState<null | BoxtalParcelPointMap>(null);

  const { order, setOrder } = useOrder();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stringifiedLsAccessToken: null | string = localStorage.getItem("accessTokenBoxtal");
        const lsAccessToken: BoxtalToken = { token: "", expiresIn: 0 };

        if (stringifiedLsAccessToken) {
          const _lsAccessToken: BoxtalToken = JSON.parse(stringifiedLsAccessToken);

          lsAccessToken.expiresIn = _lsAccessToken.expiresIn;
          lsAccessToken.token = _lsAccessToken.token;
        }

        if (!!lsAccessToken.token && Date.now() < lsAccessToken.expiresIn) {
          setAccessToken(lsAccessToken.token);
          console.log("LS Hit");
          return;
        } else {
          const response = await fetch("/api");

          if (!response.ok) {
            throw new Error("Failed to fetch access token");
          }

          const data: BoxtalAuthResponse = await response.json();
          const { accessToken: _accessToken, expiresIn } = data;

          localStorage.setItem("accessTokenBoxtal", JSON.stringify({ token: _accessToken, expiresIn: Date.now() + expiresIn * 1000 }));
          setAccessToken(_accessToken);
          console.log("LS Miss");
          return;
        }
      } catch (error) {
        console.error("Error initializing Boxtal map:", error);
      }
    };

    fetchData();

    return () => {
      setOrder((prevState) => {
        return {
          ...prevState,
          "parcel-point": {} as ParcelPoint,
        };
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (accessToken) {
      console.log("I've been recreated");
      const _map: BoxtalParcelPointMap = new BoxtalMaps.BoxtalParcelPointMap({
        domToLoadMap: "#parcel-point-map",
        accessToken,
        config: {
          locale: "fr",
          parcelPointNetworks: [
            {
              code: "CHRP_NETWORK",
              markerTemplate: {
                color: "#1E8571",
              },
            },
          ],
          options: {
            primaryColor: "#1E8571",
            autoSelectNearestParcelPoint: true,
          },
        },
      });
      setMap(_map);
    }
  }, [accessToken]);

  const handleFind = () => {
    if (map) {
      const address = {
        country: "FR",
        zipCode: order.shippingAddress.postalCode,
        city: order.shippingAddress.city,
        street: order.shippingAddress.address1,
      };
      map.searchParcelPoints(address, (parcelPoint: ParcelPoint) => {
        setOrder((prevState) => {
          return {
            ...prevState,
            "parcel-point": parcelPoint,
          };
        });
      });
    }
  };

  return (
    <>
      <div id="parcel-point-map" className="h-[500px] w-full" />
      <div className="flex my-3 items-center justify-end">
        {"code" in order["parcel-point"] ? (
          <div className="flex items-center justify-center w-full">
            <span className="italic font-bold text-md">Utiliser la map pour choisir le point relais</span>
          </div>
        ) : (
          <button type="button" className="py-2 px-3 bg-green text-white rounded-md shadow-md" onClick={handleFind}>
            Trouver un point relais
          </button>
        )}
      </div>
    </>
  );
}
