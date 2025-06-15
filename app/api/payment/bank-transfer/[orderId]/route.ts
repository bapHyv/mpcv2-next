import { serverFetchWrapper } from "@/app/utils/serverFetchWrapper";
import { generatePaymentToken } from "@/app/utils/auth";
import { NextResponse } from "next/server";

interface RouteParams {
  params: {
    orderId: string;
  };
}

export async function POST(request: Request, { params }: RouteParams) {
  const { orderId } = params;
  if (!orderId) {
    return NextResponse.json({ message: "Order ID is required." }, { status: 400 });
  }

  try {
    const body = await request.json();

    const response = await serverFetchWrapper(`${process.env.API_HOST}/order/${orderId}/transfer-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.status !== 204) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({ message: errorData.message || "Failed to set up bank transfer." }, { status: response.status });
    }

    const token = generatePaymentToken({ orderId: parseInt(orderId), payment: "bankTransfer" });

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error(`Error in /api/payment/bank-transfer/${orderId} POST route:`, error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}
