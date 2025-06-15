import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const accessToken = cookies().get("accessToken")?.value;

  try {
    if (accessToken) {
      await fetch(`${process.env.API_HOST}/logout`, {
        method: "GET", // Your actions.txt used GET
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.error("Error calling backend logout, but proceeding with client-side logout:", error);
  } finally {
    cookies().delete("accessToken");
    cookies().delete("refreshToken");
  }

  return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
}
