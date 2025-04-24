"use server";

import { Address, UserDataAPIResponse } from "@/app/types/profileTypes";
import { cookies } from "next/headers";
import { fetchWrapper } from "@/app/utils/fetchWrapper";
import { billingAddress, Order, shippingAddress, SipsFailResponse, SipsSuccessResponse } from "@/app/types/orderTypes";
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

interface IUser {
  mail: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
  firstname: FormDataEntryValue | null;
  lastname: FormDataEntryValue | null;
  optInMarketing: boolean;
  shippingAddress: shippingAddress | null;
  billingAddress: billingAddress | null;
}

export type statusCode = 0 | 200 | 201 | 204 | 400 | 401 | 404 | 409 | 422 | 500;
export type data = null | UserDataAPIResponse | Address | { id: string } | {};

export interface IResponseAPI {
  message: string;
  data: data;
  isSuccess: boolean;
  statusCode: statusCode;
}

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
      return responseAPI("User does not exist, you will get redirected", user.username, true, response.status);
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

export async function register(prevState: any, formData: FormData) {
  try {
    const shippingAddress: shippingAddress = JSON.parse(formData.get("shipping-address") as string);
    const billingAddress: billingAddress = JSON.parse(formData.get("billing-address") as string);
    const isDifferentBilling = !!formData.get("different-billing");

    const user: IUser = {
      mail: formData.get("email"),
      password: formData.get("password"),
      firstname: formData.get("firstname"),
      lastname: formData.get("lastname"),
      optInMarketing: formData.get("optInMarketing") ? true : false,
      shippingAddress: !!shippingAddress ? shippingAddress : null,
      billingAddress: !!billingAddress ? billingAddress : null,
    };

    if (!isDifferentBilling) {
      for (const key in shippingAddress) {
        if (key !== "order-notes") {
          billingAddress[key as keyof billingAddress] = shippingAddress[key as keyof shippingAddress];
        }
      }
    }

    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(`${process.env.API_HOST}/register`, fetchOptions);

    if (!response.ok && response.status === 409) {
      return responseAPI("User successfully signed up", user.mail, false, response.status);
    }

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
export async function update(strigifiedData: string) {
  try {
    const user = JSON.parse(strigifiedData);

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
export async function addAddress(stringifiedData: string) {
  try {
    const address = JSON.parse(stringifiedData);

    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(address),
      headers: {
        "Content-Type": "application/json",
      },
    };

    console.log({ address });
    console.log({ fetchOptions });

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
export async function deleteAddress(stringifiedData: string) {
  try {
    const { id }: { id: string } = JSON.parse(stringifiedData);

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

export async function updateAddress(stringifiedData: string) {
  try {
    const { address, id }: { address: Address; id: string } = JSON.parse(stringifiedData);

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
 * TODO STATUS: add 201 and 403
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

export async function payment(stringifiedOrder: string) {
  try {
    const order: Order = JSON.parse(stringifiedOrder);

    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(order),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetchWrapper(`${process.env.API_HOST}/order/init-payment`, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw {
        message: `Error payment. Status code: ${response.status}`,
        statusCode: response.status,
        errorData,
      };
    }

    const initPaymentData: ({ orderId: number } & SipsSuccessResponse) | ({ orderId: number } & SipsFailResponse) = await response.json();

    return responseAPI("Init payment successful", initPaymentData, true, response.status as 200);
  } catch (error: any | ErrorReponse) {
    console.error("payment error:", error);

    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Error in payment";

    return responseAPI(errorMessage, null, false, statusCode);
  }
}

export async function bankTransfer(stringifiedOrder: string, orderId: number) {
  try {
    const order: Order = JSON.parse(stringifiedOrder);

    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(order),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetchWrapper(`${process.env.API_HOST}/order/${orderId}/transfer-payment`, fetchOptions);

    if (response.status === 204) {
      const cookieOptions = {
        path: "/",
        httpOnly: true, // Important for security: Cannot be accessed via client-side JS
        secure: process.env.NODE_ENV === "production", // Use secure in production (HTTPS)
        maxAge: 300, // Expires after 5 minutes
        sameSite: "lax" as const, // Good default for navigation context
      };
      cookies().set("allow_bank_transfer_access", "true", cookieOptions);
      return responseAPI("Bank transfer call successful", null, true, response.status);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw {
        message: `Error bank transfer payment. Status code: ${response.status}`,
        statusCode: response.status,
        errorData,
      };
    }

    return responseAPI("Something went wrong", null, false, 500);
  } catch (error: any | ErrorReponse) {
    console.error("payment error:", error);

    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Error in payment";

    return responseAPI(errorMessage, null, false, statusCode);
  }
}

export async function clearBankTransferCookie() {
  cookies().delete("allow_bank_transfer_access");
}
