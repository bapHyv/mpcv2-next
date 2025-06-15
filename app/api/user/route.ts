import { serverFetchWrapper } from "@/app/utils/serverFetchWrapper";
import { NextResponse } from "next/server";
import { UserDataAPIResponse } from "@/app/types/profileTypes";

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const response = await serverFetchWrapper(`${process.env.API_HOST}/user`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json({ message: responseData.message || "Failed to update user data." }, { status: response.status });
    }

    const updatedUserData: UserDataAPIResponse = responseData;

    const { accessToken, refreshToken, ...userProfileData } = updatedUserData;

    return NextResponse.json(userProfileData, { status: 200 });
  } catch (error) {
    console.error("Error in /api/user PUT route:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}
