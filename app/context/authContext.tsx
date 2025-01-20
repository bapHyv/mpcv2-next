"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import axiosInstance from "../utils/apiClient";
import { User, UserData, UpdatedUserData, AuthContextType } from "../types/profileTypes";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isTokenExpired = (token: string): boolean => {
  const decoded: any = jwtDecode(token); // Decode the JWT
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  return decoded.exp < currentTime; // Compare the expiration time with the current time
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  const router = useRouter();

  // Check for access token and auto-login on initial load
  useEffect(() => {
    const checkToken = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        if (isTokenExpired(accessToken)) {
          // If the token is expired, try to refresh the token
          try {
            const { data } = await axiosInstance.post("/refresh");

            // Store the new access token
            localStorage.setItem("accessToken", data.accessToken);
            // Update user data and consider user signed in
            setIsSignedIn(true);
          } catch (err) {
            console.error("Failed to refresh token:", err);
            setIsSignedIn(false);
            localStorage.removeItem("accessToken");
            router.push("/login"); // Redirect to login if refresh fails
          }
        } else {
          const { data }: any = await axios.get(`https://api.monplancbd.fr/user`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setUserData({
            display_name: data.display_name,
            firstname: data.firstname,
            lastname: data.lastname,
            mail: data.mail,
            nickname: data.nickname,
            addresses: data.addresses ? data.addresses : [],
          });
          const oldStorage = JSON.parse(localStorage.getItem("userData") || "{}");

          // Merge old data with new data; new data will overwrite existing keys if they overlap
          const updatedData = { ...oldStorage, ...data };

          // Store the merged data back in localStorage
          localStorage.setItem("userData", JSON.stringify(updatedData));
          setIsSignedIn(true);
        }
      } else {
        setIsSignedIn(false);
      }
      setLoading(false); // Done checking
    };
    checkToken();
  }, [router]); // Run when the component mounts

  const login = async (user: User) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("https://api.monplancbd.fr/login", user, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // Store the access token in the localStorage
      if (data) {
        console.log(data);
        localStorage.setItem("accessToken", data.accessToken);
        setUserData({
          display_name: data.display_name,
          firstname: data.firstname,
          lastname: data.lastname,
          mail: data.mail,
          nickname: data.nickname,
          addresses: data.addresses ? data.addresses : [],
        });
        localStorage.setItem("userData", JSON.stringify(data));
        setIsSignedIn(true);
        router.push("/");
      }
      return data;
    } catch (err: any) {
      setUser(null);
      console.log(err);
      if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message); // Pass the error message up
      } else {
        throw new Error("An unexpected error occurred during login.");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log("logout");
    try {
      const logoutUser = await axios.get(`https://api.monplancbd.fr/logout`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      localStorage.clear();
      setUser(null);
      setIsSignedIn(false);
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  const register = async (user: User) => {
    setLoading(true);
    try {
      const newUser = await axios.post("https://api.monplancbd.fr/register", { user });
      console.log(newUser);
      await login(user); // Auto-login after registration
      setIsSignedIn(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updatedUserData: Partial<UserData>) => {
    setLoading(true);
    try {
      // Make an API call to update user info (adjust endpoint as needed)
      const { data } = await axiosInstance.put(
        "https://api.monplancbd.fr/user",
        updatedUserData
      );

      // Update the local state with new user data
      setUserData((prevData) => ({
        ...prevData,
        ...data, // Merge updated data (be careful with how you handle merging)
      }));

      // Optionally show success message or handle redirect
    } catch (err) {
      console.error("Failed to update user data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, userData, isSignedIn, loading, login, logout, register, updateUser }}
    >
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
