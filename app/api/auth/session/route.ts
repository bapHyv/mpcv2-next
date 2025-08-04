import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { UserDataAPIResponse } from "@/app/types/profileTypes";

interface BackendRefreshResponse {
  userData: UserDataAPIResponse;
  accessToken: string;
  refreshToken: string;
}

async function refreshSession() {
  const oldRefreshToken = cookies().get("refreshToken")?.value;
  const oldAccessToken = cookies().get("accessToken")?.value;

  if (!oldRefreshToken || !oldAccessToken) {
    return NextResponse.json(null, { status: 200 });
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
      cookies().delete("accessToken");
      cookies().delete("refreshToken");
      return NextResponse.json({ message: "Session invalid or expired" }, { status: 401 });
    }

    const { accessToken, refreshToken, userData }: BackendRefreshResponse = await response.json();

    const domain = process.env.NODE_ENV === "development" ? "localhost" : process.env.MAIN_DOMAIN;
    const cookieOptions = { httpOnly: true, secure: true, sameSite: "strict" as const, path: "/", domain };

    cookies().set("accessToken", accessToken, cookieOptions);
    cookies().set("refreshToken", refreshToken, cookieOptions);

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error in refreshSession logic:", error);
    cookies().delete("accessToken");
    cookies().delete("refreshToken");
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}

export async function GET() {
  return await refreshSession();
}

export async function POST() {
  return await refreshSession();
}
