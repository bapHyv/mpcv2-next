// File: app/api/refresh-token/route.ts

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface RefreshTokenAPIResponse {
  accessToken: string;
  refreshToken: string;
}

export async function POST() {
  const oldRefreshToken = cookies().get("refreshToken")?.value;
  const oldAccessToken = cookies().get("accessToken")?.value;

  if (!oldRefreshToken || !oldAccessToken) {
    return NextResponse.json({ message: "Missing refresh token." }, { status: 401 });
  }

  try {
    const response = await fetch(`${process.env.API_HOST}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: oldAccessToken,
      },
      body: JSON.stringify({ refreshToken: oldRefreshToken }),
    });

    if (!response.ok) {
      console.error("Backend failed to refresh token. Status:", response.status);
      cookies().delete("accessToken");
      cookies().delete("refreshToken");
      return NextResponse.json({ message: "Failed to refresh token." }, { status: 401 });
    }

    const { accessToken, refreshToken: newRefreshToken }: RefreshTokenAPIResponse = await response.json();

    // Set the new tokens in secure, httpOnly cookies
    const domain = process.env.NODE_ENV === "development" ? "localhost" : process.env.MAIN_DOMAIN;
    const cookieOptions = { httpOnly: true, secure: true, sameSite: "strict" as const, path: "/", domain };

    cookies().set("accessToken", accessToken, cookieOptions);
    cookies().set("refreshToken", newRefreshToken, cookieOptions);

    // Signal success to the client-side fetchWrapper
    return NextResponse.json({ message: "Token refreshed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/refresh-token:", error);
    // Clear cookies on any unexpected error
    cookies().delete("accessToken");
    cookies().delete("refreshToken");
    return NextResponse.json({ message: "An internal error occurred during token refresh." }, { status: 500 });
  }
}
