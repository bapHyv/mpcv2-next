import { serverFetchWrapper } from "@/app/utils/serverFetchWrapper";
import { NextResponse } from "next/server";
import { Order, SipsFailResponse, SipsSuccessResponse } from "@/app/types/orderTypes";
import { ProductCart } from "@/app/context/productsAndCartContext";

interface OrderAndCart {
  order: Order;
  cart: { total: number; products: ProductCart[] };
}

type initPaymentResponse = ({ orderId: number } & SipsSuccessResponse) | ({ orderId: number } & SipsFailResponse);

export async function POST(request: Request) {
  try {
    const body: OrderAndCart = await request.json();
    const { order, cart } = body;

    if (!order || !cart || !cart.products.length) {
      return NextResponse.json({ message: "Missing order or cart data." }, { status: 400 });
    }

    if (!order["different-billing"]) {
      for (const key in order.shippingAddress) {
        if (key !== "order-notes") {
          (order.billingAddress as any)[key] = (order.shippingAddress as any)[key];
        }
      }
    }

    const response = await serverFetchWrapper(`${process.env.API_HOST}/order/init-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order, cart }),
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json({ message: responseData.message || "Failed to initialize payment." }, { status: response.status });
    }

    return NextResponse.json(responseData as initPaymentResponse, { status: 200 });
  } catch (error) {
    console.error("Error in /api/payment/init POST route:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}
