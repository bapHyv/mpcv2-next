import { serverFetchWrapper } from "@/app/utils/serverFetchWrapper";
import { NextResponse } from "next/server";

interface BackupPayload {
  cartBkp: string;
  orderBkp: string;
}

export async function POST(request: Request) {
  try {
    const body: BackupPayload = await request.json();
    const { cartBkp } = body;

    if (!cartBkp) {
      return NextResponse.json({ message: "Cart data is required." }, { status: 400 });
    }

    console.log(cartBkp);

    const response = await serverFetchWrapper(`${process.env.API_HOST}/backup-order-data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart: cartBkp }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({ message: errorData.message || "Failed to back up user data." }, { status: response.status });
    }

    return NextResponse.json({ message: "Backup successful" }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/user/backup POST route:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}
