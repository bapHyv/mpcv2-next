"use server";

import { Address, UserDataAPIResponse } from "@/app/types/profileTypes";
import { cookies } from "next/headers";
import { fetchWrapper } from "@/app/utils/fetchWrapper";
import { billingAddress, Order, shippingAddress } from "@/app/types/orderTypes";
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

export type statusCode = 200 | 204 | 400 | 401 | 409 | 422 | 500;
export type data = null | UserDataAPIResponse | Address | { id: string } | {};

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
 * Si utilisateur connecté, envoyer init payment au chargement de la page "commander"
 *
 * [x] S'il y a different-billing
 * [x] S'il y a parcel-point et "boxtal_connect"
 * [x] shippingMethodId === null renvoyer une erreur
 * [-] S'il y a un password
 * [-] modifier l'url selon payment-method ("secure-3d-card" | "bank-transfer")
 *
 * Prendre en compte:
 *  - shipping-method
 *  - payment-method
 *
 *
 *
 * Demander a Victor:
 *  - Comment faire la page analyse
 *  - Comment faire pour utiliser la route transfer-payment
 *
 * Lorsque l'utilisateur est nouveau et que je lui crée un compte
 * en même temps que sa commande, il faut soit:
 *  - Que je set les cookies access et refresh et que je log dans l'ui (userData dans le local storage)
 *  - Que je garde le cookies access dans une variable et que je l'utilise pour valider la commande.
 *
 * Je pense que la première option est la bonne car, lors du logout, le access token est nécessaire.
 * Je peux également le utiliser logout à la fin de la commande pour rendre le access token périmé
 *
 *
 * SCÉNARION COMMANDE NOUVEL UTILISATEUR:
 * - Doit remplir le formulaire
 * - Peut choisir de facturer à une adresse différente. Si c'est le cas, un nouveau formulaire doit apparaître
 * - Doit choisir un mode d'expédition
 * - Doit choisir un mode de paiement.
 * - Doit accepter les conditions générales de vente
 *
 *  Lorsqu'il appuie sur le bouton Payer:
 *    - Vérifier si il y a quelque chose dans formData.get("order"). Si ce n'est PAS le cas, envoyer une erreur
 *    - Parser formData.get("order")
 *    - Vérifier qu'il y a bien une shippingMethodId. Si ce n'est PAS le cas, envoyer une erreur
 *    - Vérifier si l'adresse de facturation est différente de l'adresse d'expédition. Si ce n'est PAS le cas, transformer l'adresse de facturation en adresse de livraison
 *    - Vérifier s'il y a quelque chose dans order.shippingAddresse.password
 *        ↳ Si c'est le cas. Essayer de créer un utilisateur
 *                            ↳ Si c'est un succès:
 *                                - Enregistrer le accessToken dans une variable pour l'utiliser à la fin de commande afin d'appeler logout pour périmer l'accessToken
 *                            ↳ Si l'utilisateur existe déjà: Throw error avec le status et le message de la réponse
 *    - Vérifier la méthode de paiement.
 *        ↳ Si c'est "secure-3d-card" appeler la route `${process.env.API_HOST}/order`
 *        ↳ Si c'est "bank-transfer" appeler la route `${process.env.API_HOST}/order/transfer-payment`
 */

export async function payment(prevState: null, formData: FormData) {
  try {
    let accessToken = null;
    const rawOrderData = formData.get("order");

    if (!rawOrderData) {
      const errorData = null;
      throw {
        message: "No data found in the form",
        statusCode: 400,
        errorData,
      };
    }

    const order: Order = JSON.parse(rawOrderData as string);

    if (!order.shippingMethodId) {
      const errorData = null;
      throw {
        message: "Shipping method id is required",
        statusCode: 400,
        errorData,
      };
    }

    // // If the customer did not chose a different billing address,
    // // copy all the values from shipping address into the billing address
    if (!order["different-billing"]) {
      for (const key in order.shippingAddress) {
        if (key !== "password" && key !== "order-notes") {
          order.billingAddress[key as keyof billingAddress] = order.shippingAddress[key as keyof shippingAddress];
        }
      }
    }

    // For a UX purpose, if the user is new, create an account on the fly to
    // avoid asking him to create a new account before ordering
    const isNewUser = !!order.shippingAddress.password;

    if (isNewUser) {
      const user = {
        mail: order.shippingAddress.email,
        password: order.shippingAddress.password,
        firstname: order.shippingAddress.firstname,
        lastname: order.shippingAddress.lastname,
        optInMarketing: formData.get("actualite-produits") ? true : false,
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

      // TODO: DON'T RETURN
      return responseAPI("User successfully signed up", userData, true, response.status as 200);
    }

    return responseAPI("Nothing for now", {}, true, 200);

    // const url = `${process.env.API_HOST}/order`;

    // console.log(isNewUser);

    // console.log(data);

    // if (!data) {
    //   const errorData = null;
    //   throw {
    //     message: "The form is required",
    //     statusCode: 400,
    //     errorData,
    //   };
    // }

    // console.log(0);

    // const fetchOptions = {
    //   method: "POST",
    //   body: JSON.stringify(data),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // };

    // const response = await fetchWrapper(`${process.env.API_HOST}/order/init-payment`, fetchOptions);

    // console.log(response);

    // if (!response.ok) {
    //   const errorData = await response.json().catch(() => null);
    //   throw {
    //     message: `Error payment. Status code: ${response.status}`,
    //     statusCode: response.status,
    //     errorData,
    //   };
    // }

    // console.log(2);

    // const initPaymentData = await response.json();

    // console.log(3);

    // console.log(initPaymentData);
  } catch (error: any | ErrorReponse) {
    console.error("payment error:", error);

    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Error in payment";

    return responseAPI(errorMessage, null, false, statusCode);
  }
}

const truc = {
  redirectionData: "GIANT_TOKEN",
  redirectionStatusCode: "00",
  redirectionStatusMessage: "INITIALISATION REQUEST ACCEPTED",
  redirectionUrl: "https://sherlocks-paiement.secure.lcl.fr/payment",
  redirectionVersion: "IR_WS_2.0",
  seal: "778f0f4deb045e32adf11ebab2b75c9883e06d9fe15099a182d6c7243ddd6026",
};

const autre = {
  redirectionStatusCode: "34",
  redirectionVersion: "IR_WS_2.0",
  seal: "7e369be3cac72b376ef58c688d3d9141ca8a3070b5442afdc657bc65d46613d0",
};
