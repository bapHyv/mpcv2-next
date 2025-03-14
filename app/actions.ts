"use server";

import { Address, UserDataAPIResponse } from "@/app/types/profileTypes";
import { cookies } from "next/headers";
import { fetchWrapper } from "@/app/utils/fetchWrapper";

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

interface IComment {
  review: string;
  rating: number;
}

interface IPayment {
  "shipping-firstname": string;
  "shipping-lastname": string;
  "shipping-company": string;
  "shipping-country": string;
  "shipping-address1": string;
  "shipping-address2": string;
  "shipping-postalCode": string;
  "shipping-city": string;
  "shipping-province": string;
  "shipping-phone": string;
  "shipping-email": string;
  "shipping-password": string;
  "shipping-order-notes": string;
  "different-billing": "false" | "true";
  "billing-firstname": string;
  "billing-lastname": string;
  "billing-company": string;
  "billing-country": string;
  "billing-address1": string;
  "billing-address2": string;
  "billing-postalCode": string;
  "billing-city": string;
  "billing-province": string;
  "billing-phone": string;
  "billing-email": string;
  "payment-method": string;
  "shipping-method": string;
}

type statusCode = 200 | 204 | 400 | 401 | 409 | 422 | 500;
type data = null | UserDataAPIResponse | Address | { id: string };

function responseAPI(message: string, data: data, isSuccess: boolean, statusCode: statusCode) {
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
    } else if (response.ok && response.status === 204) {
      return responseAPI("User does not exist, you will get redirected", null, true, response.status);
    }

    const userData: UserDataAPIResponse = await response.json();

    const domain = process.env.NODE_ENV === "development" ? "localhost" : process.env.MAIN_DOMAIN;
    const cookieOptions = { httpOnly: true, secure: true, sameSite: "strict" as const, path: "/", domain };

    cookies().set("accessToken", userData.accessToken, cookieOptions);
    cookies().set("refreshToken", userData.refreshToken, cookieOptions);

    return responseAPI("User successfully logged in", userData, true, response.status as 200);
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
    const cookieOptions = { httpOnly: true, secure: true, sameSite: "strict" as const, path: "/", domain };

    cookies().set("accessToken", userData.accessToken, cookieOptions);
    cookies().set("refreshToken", userData.refreshToken, cookieOptions);

    return responseAPI("User successfully signed up", userData, true, response.status as 200);
  } catch (error: any | ErrorReponse) {
    console.error("Sign up error:", error);

    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Error while logging in";

    return responseAPI(errorMessage, null, false, statusCode);
  }
}

/**
 * status code:
 *  200: success, send {message, data, isSuccess, status code: 200}
 *  400: invalid data {message, null, !isSuccess, statusCode: 400}
 *  401: unauthorized {message, null, !isSuccess, statusCode: 401}
 *  422: semantic error {message, null, !isSuccess, statusCode: 422}
 *  500: error server {message, null, !isSuccess, statusCode: 500}
 */
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

    const fetchOptions = {
      method: "PUT",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetchWrapper(`${process.env.API_HOST}/user`, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw {
        message: `Error while updating user. Status code: ${response.status}`,
        statusCode: response.status,
        errorData,
      };
    }

    const userData: UserDataAPIResponse = await response.json();

    return responseAPI("User successfully updated", userData, true, response.status as 200);
  } catch (error: any | ErrorReponse) {
    console.error("Update error:", error);

    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Error while logging in";

    return responseAPI(errorMessage, null, false, statusCode);
  }
}

/**
 * status code:
 *  200: success, send {message, data, isSuccess, status code: 200}
 *  400: invalid data {message, null, !isSuccess, statusCode: 400}
 *  401: unauthorized {message, null, !isSuccess, statusCode: 401}
 *  422: semantic error {message, null, !isSuccess, statusCode: 422}
 *  500: error server {message, null, !isSuccess, statusCode: 500}
 */
export async function addAddress(prevState: Address, formData: FormData) {
  try {
    const address = {
      firstname: formData.get("firstname"),
      lastname: formData.get("lastname"),
      address1: formData.get("address1"),
      address2: formData.get("address2"),
      postalCode: formData.get("postalCode"),
      city: formData.get("city"),
      country: formData.get("country"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      billing: formData.get("billing") ? true : false,
      shipping: formData.get("shipping") ? true : false,
      company: formData.get("company"),
    };

    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(address),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetchWrapper(`${process.env.API_HOST}/user/addresses/add`, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw {
        message: `Error while add address. Status code: ${response.status}`,
        statusCode: response.status,
        errorData,
      };
    }

    const addressResponse: Address = await response.json();

    return responseAPI("Address successfully added", addressResponse, true, response.status as 200);
  } catch (error: any | ErrorReponse) {
    console.error("Add address error:", error);

    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Error while logging in";

    return responseAPI(errorMessage, null, false, statusCode);
  }
}

/**
 * status code:
 *  200: success, send {message, data, isSuccess, status code: 200}
 *  400: invalid data {message, null, !isSuccess, statusCode: 400}
 *  401: unauthorized {message, null, !isSuccess, statusCode: 401}
 *  500: error server {message, null, !isSuccess, statusCode: 500}
 */
export async function deleteAddress(prevState: any, formData: FormData) {
  try {
    const { id } = {
      id: formData.get("addressId"),
    };

    if (!id) {
      const errorData = null;
      throw {
        message: "The address id is required",
        statusCode: 400,
        errorData,
      };
    }

    const fetchOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetchWrapper(`${process.env.API_HOST}/user/addresses/${id}`, fetchOptions);

    return responseAPI("Address successfully deleted", { id: id.toString() }, true, response.status as 200);
  } catch (error: any | ErrorReponse) {
    console.error("Delete address error:", error);

    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Error while deleting address";

    return responseAPI(errorMessage, null, false, statusCode);
  }
}

export async function updateAddress(prevState: Address & { id: string }, formData: FormData) {
  try {
    const address = {
      firstname: formData.get("firstname"),
      lastname: formData.get("lastname"),
      address1: formData.get("address1"),
      address2: formData.get("address2") ? formData.get("address2") : "",
      postalCode: formData.get("postalCode"),
      city: formData.get("city"),
      country: formData.get("country"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      billing: formData.get("billing") ? true : false,
      shipping: formData.get("shipping") ? true : false,
      company: formData.get("company"),
    };

    const { id } = {
      id: formData.get("addressId"),
    };

    if (!id) {
      const errorData = null;
      throw {
        message: "The address id is required",
        statusCode: 400,
        errorData,
      };
    }

    const fetchOptions = {
      method: "PUT",
      body: JSON.stringify(address),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetchWrapper(`${process.env.API_HOST}/user/addresses/${id}`, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw {
        message: `Error while add address. Status code: ${response.status}`,
        statusCode: response.status,
        errorData,
      };
    }

    const addressResponse: Address = await response.json();

    return responseAPI("Address successfully updated", addressResponse, true, response.status as 200);
  } catch (error: any | ErrorReponse) {
    console.error("Update address error:", error);

    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Error while updating address";

    return responseAPI(errorMessage, null, false, statusCode);
  }
}

/**
 * status code:
 *  204: success, send {message, null, isSuccess, status code: 204}
 *  400: invalid data {message, null, !isSuccess, statusCode: 400}
 *  401: unauthorized {message, null, !isSuccess, statusCode: 401}
 *  500: error server {message, null, !isSuccess, statusCode: 500}
 */

export async function comment(prevState: IComment, formData: FormData) {
  try {
    const comment = {
      review: formData.get("comment"),
      rating: parseInt((formData.get("rating") as string) || "0"),
    };

    const { id } = {
      id: formData.get("id"),
    };

    if (!id) {
      const errorData = null;
      throw {
        message: "The product id is required",
        statusCode: 400,
        errorData,
      };
    }

    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(comment),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetchWrapper(`${process.env.API_HOST}/product/${id}/add-comment`, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw {
        message: `Error while adding comment. Status code: ${response.status}`,
        statusCode: response.status,
        errorData,
      };
    }

    return responseAPI("Comment added successfully", null, true, response.status as 204);
  } catch (error: any | ErrorReponse) {
    console.error("Add comment error:", error);

    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Error while adding comment";

    return responseAPI(errorMessage, null, false, statusCode);
  }
}

/**
 * 204: success no content {message, null, isSuccess, status code: 204}
 * 409: password recovery failed {message, null, !isSuccess, statusCode: 409}
 */
export async function forgottenPassword(prevState: { email: string }, formData: FormData) {
  try {
    const email = {
      mail: formData.get("email"),
    };

    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(email),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(`${process.env.API_HOST}/forgotten-password`, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw {
        message: `Error recovering password. Status code: ${response.status}`,
        statusCode: response.status,
        errorData,
      };
    }

    return responseAPI("Recover password successful", null, true, response.status as 204);
  } catch (error: any | ErrorReponse) {
    console.error("Recover password error:", error);

    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Error while recovering password";

    return responseAPI(errorMessage, null, false, statusCode);
  }
}

/**
 *
 * S'il y a different-billing
 * S'il y a un password
 * Prendre en compte:
 *  - shipping-method
 *  - payment-method
 */

export async function payment(prevState: IPayment, formData: FormData) {}
