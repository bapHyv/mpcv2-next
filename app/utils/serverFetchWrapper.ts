import { cookies } from "next/headers";

interface RefreshTokenAPIResponse {
  accessToken: string;
  refreshToken: string;
}

async function refreshToken(): Promise<string> {
  const oldRefreshToken = cookies().get("refreshToken")?.value;
  const oldAccessToken = cookies().get("accessToken")?.value;

  if (!oldRefreshToken || !oldAccessToken) {
    throw new Error("Missing tokens for refresh");
  }

  const response = await fetch(`${process.env.API_HOST}/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: oldAccessToken,
    },
    body: JSON.stringify({ refreshToken: oldRefreshToken }),
  });

  if (!response.ok) {
    cookies().delete("accessToken");
    cookies().delete("refreshToken");
    throw new Error("Failed to refresh token from backend");
  }

  const { accessToken, refreshToken: newRefreshToken }: RefreshTokenAPIResponse = await response.json();

  const domain = process.env.NODE_ENV === "development" ? "localhost" : process.env.MAIN_DOMAIN;
  const cookieOptions = { httpOnly: true, secure: true, sameSite: "strict" as const, path: "/", domain };

  cookies().set("accessToken", accessToken, cookieOptions);
  cookies().set("refreshToken", newRefreshToken, cookieOptions);

  return accessToken;
}

export async function serverFetchWrapper(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const accessToken = cookies().get("accessToken")?.value;

  if (!accessToken) {
    return new Response(JSON.stringify({ message: "No access token provided" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const headers = new Headers(init?.headers);
  headers.set("Authorization", accessToken);

  let response = await fetch(input, { ...init, headers });

  if (response.status === 401) {
    console.log("ServerFetchWrapper: Received 401, attempting to refresh token...");
    try {
      const newAccessToken = await refreshToken();
      console.log("ServerFetchWrapper: Token refreshed successfully. Retrying request.");
      headers.set("Authorization", newAccessToken);

      response = await fetch(input, { ...init, headers });
    } catch (error) {
      console.error("ServerFetchWrapper: Refresh token failed. Returning original 401 response.", error);
    }
  }

  return response;
}
