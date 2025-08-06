"use client";

import { useCallback } from "react";
import { useAuth } from "@/app/context/authContext";
import { UserDataAPIResponse } from "@/app/types/profileTypes";

let isRefreshing = false;
let failedQueue: { resolve: () => void; reject: (error?: any) => void }[] = [];

const processQueue = (error: any | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

export function useFetchWrapper() {
  const { setUserData } = useAuth();

  const fetchWrapper = useCallback(
    async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      let response = await fetch(input, init);

      if (response.status === 401) {
        if (isRefreshing) {
          return new Promise<void>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => fetch(input, init));
        }

        isRefreshing = true;

        try {
          const refreshResponse = await fetch("/api/auth/session", {
            method: "POST",
          });

          if (!refreshResponse.ok) {
            setUserData(null);
            processQueue(new Error("Token refresh failed."));
            window.location.href = "/connexion";
            return Promise.reject(refreshResponse);
          }

          // If refresh was successful, update the auth context with the new user data.
          const newUserData: UserDataAPIResponse = await refreshResponse.json();
          setUserData(newUserData);

          // Process the queue of failed requests so they can be retried.
          processQueue(null);

          // Retry the original request. The browser will now have the new access token cookie.
          response = await fetch(input, init);
        } catch (error) {
          processQueue(error);
          // Ensure user is logged out on any unexpected error during refresh.
          setUserData(null);
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }

      return response;
    },
    [setUserData]
  );

  return { fetchWrapper };
}
