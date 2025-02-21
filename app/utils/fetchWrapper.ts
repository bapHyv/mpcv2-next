import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface RefreshTokenAPIResponse {
  accessToken: string;
  refreshToken: string;
}

interface ErrorReponse {
  message: string;
  instruction: "redirect";
}

async function refreshToken() {
  try {
    const oldAccessToken = cookies().get("accessToken")?.value;

    if (!oldAccessToken) {
      throw {
        message: `No access token found`,
        instruction: "redirect",
      };
    }

    const fetchOptions = { method: "POST", headers: { "Content-Type": "application/json", Authorization: oldAccessToken } };

    const response = await fetch(`${process.env.API_HOST}/refresh`, fetchOptions);

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const { accessToken, refreshToken }: RefreshTokenAPIResponse = await response.json();

    const domain = process.env.NODE_ENV === "development" ? "localhost" : process.env.MAIN_DOMAIN;
    const cookieOptions = { httpOnly: true, secure: true, sameSite: "strict" as const, path: "/", domain };

    cookies().set("accessToken", accessToken, cookieOptions);
    cookies().set("refreshToken", refreshToken, cookieOptions);

    return accessToken;
  } catch (error: any | ErrorReponse) {
    console.error(error);
    if (error.instruction === "redirect") {
      redirect("/login");
    }
    throw error;
  }
}

export async function fetchWrapper(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const accessToken = cookies().get("accessToken")?.value;

  const headers = new Headers(init?.headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response = await fetch(input, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    try {
      const newAccessToken = await refreshToken();

      headers.set("Authorization", `Bearer ${newAccessToken}`);

      response = await fetch(input, {
        ...init,
        headers,
      });
    } catch (error) {
      redirect("/login");
    }
  }

  return response;
}
