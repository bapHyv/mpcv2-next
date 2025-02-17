// apiClient.js
import axios from "axios";
import { UserDataAPIResponse } from "../types/profileTypes";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: "https://api.monplancbd.fr",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add access token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors (when access token expires)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If we get a 401 (Unauthorized) response, try to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const userDataString = localStorage.getItem("userData");
        if (!userDataString) {
          console.error("No user data found in localStorage");
          localStorage.removeItem("accessToken");
          if (typeof window !== "undefined") {
            window.location.href = "/connexion";
          }
          return Promise.reject(new Error("No user data found"));
        }

        let userData: UserDataAPIResponse;
        try {
          userData = JSON.parse(userDataString) as UserDataAPIResponse;
        } catch (parseError) {
          console.error("Failed to parse user data from localStorage", parseError);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userData");
          if (typeof window !== "undefined") {
            window.location.href = "/connexion";
          }
          return Promise.reject(parseError);
        }

        // Call the refresh token endpoint to get a new access token
        const { data } = await axiosInstance.post("/refresh", { refreshToken: userData.refreshToken });

        const { refreshToken, accessToken } = data;

        if (!refreshToken || !accessToken) {
          console.error("Invalid token response from refresh endpoint");
          return Promise.reject(new Error("Invalid token response"));
        }

        // Store the new access token
        localStorage.setItem("accessToken", accessToken);

        // Replace the new access token in userData
        userData.accessToken = accessToken;

        // Replace the new refresh token in userData
        userData.refreshToken = refreshToken;

        // Save updated userData back to localStorage
        localStorage.setItem("userData", JSON.stringify(userData));

        // Update the authorization header with the new access token.
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh token is invalid, log the user out
        console.error("Refresh token failed", refreshError);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("userData");
        // Redirect to login page or perform any other action
        if (typeof window !== "undefined") {
          window.location.href = "/connexion"; // Redirect to login page
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
