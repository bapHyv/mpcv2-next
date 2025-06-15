import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mail } = body;

    if (!mail) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    const response = await fetch(`${process.env.API_HOST}/forgotten-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mail }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({ message: errorData.message || "Failed to process password recovery." }, { status: response.status });
    }

    return NextResponse.json({ message: "Password recovery email sent." }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/auth/forgot-password route:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}
