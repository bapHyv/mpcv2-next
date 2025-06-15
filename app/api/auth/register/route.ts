import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { UserDataAPIResponse } from "@/app/types/profileTypes";
import { shippingAddress, billingAddress } from "@/app/types/orderTypes";

interface BackendRegisterPayload {
  mail: string;
  password: string;
  firstname: string;
  lastname: string;
  optInMarketing: boolean;
  shippingAddress: shippingAddress | null;
  billingAddress: billingAddress | null;
  referralToken: string | null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.mail || !body.password || !body.firstname || !body.lastname) {
      return NextResponse.json({ message: "Missing required registration fields." }, { status: 400 });
    }

    const backendPayload: BackendRegisterPayload = {
      mail: body.mail,
      password: body.password,
      firstname: body.firstname,
      lastname: body.lastname,
      optInMarketing: body.optInMarketing || false,
      referralToken: body.referralToken || null,
      shippingAddress: body.shippingAddress || null,
      billingAddress: body.billingAddress || null,
    };

    if (backendPayload.shippingAddress && body.isDifferentBilling === false) {
      backendPayload.billingAddress = { ...backendPayload.shippingAddress };
    }

    const response = await fetch(`${process.env.API_HOST}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendPayload),
    });

    const responseData = await response.json().catch(() => ({}));

    if (response.status === 409) {
      return NextResponse.json({ message: responseData.message || "User already exists.", email: body.mail }, { status: 409 });
    }

    if (!response.ok) {
      return NextResponse.json({ message: responseData.message || "Registration failed." }, { status: response.status });
    }

    const userData: UserDataAPIResponse = responseData;

    const domain = process.env.NODE_ENV === "development" ? "localhost" : process.env.MAIN_DOMAIN;
    const cookieOptions = { httpOnly: true, secure: true, sameSite: "strict" as const, path: "/", domain };

    cookies().set("accessToken", userData.accessToken, cookieOptions);
    cookies().set("refreshToken", userData.refreshToken, cookieOptions);

    const { accessToken, refreshToken, ...userProfileData } = userData;

    return NextResponse.json(userProfileData, { status: 200 });
  } catch (error) {
    console.error("Error in /api/auth/register:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}
