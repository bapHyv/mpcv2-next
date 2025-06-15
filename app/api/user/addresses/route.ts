import { serverFetchWrapper } from "@/app/utils/serverFetchWrapper";
import { NextResponse } from "next/server";
import { Address } from "@/app/types/profileTypes";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.firstname || !body.address1 || !body.city || !body.postalCode || !body.country) {
      return NextResponse.json({ message: "Missing required address fields." }, { status: 400 });
    }

    const response = await serverFetchWrapper(`${process.env.API_HOST}/user/addresses/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json({ message: responseData.message || "Failed to add address." }, { status: response.status });
    }

    const newAddress: Address = responseData;

    return NextResponse.json(newAddress, { status: 200 });
  } catch (error) {
    console.error("Error in /api/user/addresses POST route:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}
