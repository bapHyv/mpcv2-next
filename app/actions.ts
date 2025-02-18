"use server";

import { UserDataAPIResponse } from "./types/profileTypes";
import { cookies } from "next/headers";

interface Login {
  email: string;
  password: string;
}

interface Register extends Login {
  firstname: string;
  lastname: string;
  optInMarketing: boolean;
}

interface Update {
  title: string;
  firstname: string;
  lastname: string;
  displayName: string;
  email: string;
  optInMarketing: number;
}

interface ErrorReponse {
  message: string;
  statusCode: number;
  errorData: any;
}

function responseAPI(message: string, data: null | UserDataAPIResponse, isSuccess: boolean, statusCode: number) {
  return { message, data, isSuccess, statusCode };
}

/**
 * status code:
 *  200: success, send {message, data, isSuccess, status code: 200}, redirect to "/"
 *  204: user does not exist {message, null, isSuccess, status code: 204}, redirect to "/inscription?email=user@mail.com"
 *  401: wrong password {message, null, !isSuccess, statusCode: 401}
 *  500: error server {message, null, !isSuccess, statusCode: 500}
 */
export async function login(prevState: Login, formData: FormData) {
  try {
    const user = { username: formData.get("email"), password: formData.get("password") };

    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(`${process.env.API_HOST}/login`, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw {
        message: `Error while logging in. Status code: ${response.status}`,
        statusCode: response.status,
        errorData,
      };
    }

    const userData: UserDataAPIResponse = await response.json();

    const domain = process.env.NODE_ENV === "development" ? "localhost" : process.env.MAIN_DOMAIN;

    cookies().set("accessToken", userData.accessToken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 24 * 60 * 60, path: "/", domain });
    cookies().set("refreshToken", userData.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
      path: "/",
      domain,
    });

    return responseAPI("User successfully logged in", userData, true, response.status);
  } catch (error: any | ErrorReponse) {
    console.error("Login error:", error);

    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Error while logging in";

    return responseAPI(errorMessage, null, false, statusCode);
  }
}

export async function logout() {
  try {
    const accessToken = cookies().get("accessToken")?.value ?? "";

    const fetchOptions = { method: "GET", headers: { Authorization: accessToken, "Content-Type": "application/json" } };

    await fetch(`${process.env.API_HOST}/logout`, fetchOptions);

    cookies().delete("accessToken");
    cookies().delete("refreshToken");

    return { message: "User successfully logged out", data: null, isSuccess: true };
  } catch (error) {
    console.error(error);
    return { message: "Error while logging out", data: null, isSuccess: false };
  }
}

/**
 * status code:
 *  200: success, send {message, data, isSuccess, status code: 200}, redirect to "/"
 *  409: user already exists {message, null, !isSuccess, statusCode: 409} redirect to "/connexion"
 *  500: error server {message, null, !isSuccess, statusCode: 500}
 */
export async function register(prevState: Register, formData: FormData) {
  try {
    const user = {
      mail: formData.get("email"),
      password: formData.get("password"),
      firstname: formData.get("firstname"),
      lastname: formData.get("lastname"),
      optInMarketing: formData.get("optInMarketing") ? true : false,
    };
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(`${process.env.API_HOST}/register`, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw {
        message: `Error while signing up. Status code: ${response.status}`,
        statusCode: response.status,
        errorData,
      };
    }

    const userData: UserDataAPIResponse = await response.json();

    const domain = process.env.NODE_ENV === "development" ? "localhost" : process.env.MAIN_DOMAIN;

    cookies().set("accessToken", userData.accessToken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 24 * 60 * 60, path: "/", domain });
    cookies().set("refreshToken", userData.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
      path: "/",
      domain,
    });

    return responseAPI("User successfully signed up", userData, true, response.status);
  } catch (error: any | ErrorReponse) {
    console.error("Sign up error:", error);

    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Error while logging in";

    return responseAPI(errorMessage, null, false, statusCode);
  }
}

export async function update(prevState: Update, formData: FormData) {
  try {
    const user = {
      mail: formData.get("email"),
      firstname: formData.get("firstname"),
      lastname: formData.get("lastname"),
      optInMarketing: formData.get("optInMarketing") ? true : false,
      oldPassword: formData.get("oldPassword"),
      newPassword: formData.get("newPassword"),
    };

    const accessToken = cookies().get("accessToken")?.value;

    if (!accessToken) {
      const errorData = null;
      throw {
        message: `No access token found`,
        statusCode: 500,
        errorData,
      };
    }

    const fetchOptions = {
      method: "PUT",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await fetch(`${process.env.API_HOST}/user`, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw {
        message: `Error while updating user. Status code: ${response.status}`,
        statusCode: response.status,
        errorData,
      };
    }

    const userData: UserDataAPIResponse = await response.json();

    return responseAPI("User successfully updated", userData, true, response.status);
  } catch (error: any | ErrorReponse) {
    console.error("Sign up error:", error);

    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Error while logging in";

    return responseAPI(errorMessage, null, false, statusCode);
  }
}
