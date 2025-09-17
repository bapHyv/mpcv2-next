import { BoxtalAuthResponse } from "@/app/types/mapTypes";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const basic = btoa(`${process.env.BOXTAL_ACCESS_KEY}:${process.env.BOXTAL_SECRET_KEY}`);
    const response = await fetch(`${process.env.BOXTAL_API}${process.env.BOXTAL_AUTH_ENDPOINT}`, {
      cache: "no-cache",
      method: "POST",
      headers: { Authorization: `Basic ${basic}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch access token");
    }

    const data: BoxtalAuthResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Boxtal access token:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
