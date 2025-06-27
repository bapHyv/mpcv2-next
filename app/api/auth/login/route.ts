import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { UserDataAPIResponse } from "@/app/types/profileTypes";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required." }, { status: 400 });
    }

    const response = await fetch(`${process.env.API_HOST}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.status === 204) {
      return NextResponse.json({ message: "User not found", email: username }, { status: 404 });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "An unknown error occurred." }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const userData: UserDataAPIResponse = await response.json();

    const domain = process.env.NODE_ENV === "development" ? "localhost" : process.env.MAIN_DOMAIN;
    const cookieOptions = { httpOnly: true, secure: true, sameSite: "strict" as const, path: "/", domain };

    cookies().set("accessToken", userData.accessToken, cookieOptions);
    cookies().set("refreshToken", userData.refreshToken, cookieOptions);

    const { accessToken, refreshToken, ...userProfileData } = userData;

    return NextResponse.json(userProfileData, { status: 200 });
  } catch (error) {
    console.error("Error in /api/auth/login:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}
