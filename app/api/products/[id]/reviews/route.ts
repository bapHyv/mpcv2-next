import { serverFetchWrapper } from "@/app/utils/serverFetchWrapper";
import { NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ message: "Product ID is required." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { review, rating } = body;

    if (!review || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ message: "A valid review and rating are required." }, { status: 400 });
    }

    const response = await serverFetchWrapper(`${process.env.API_HOST}/product/${id}/add-comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review, rating }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({ message: errorData.message || "Failed to add comment." }, { status: response.status });
    }

    return NextResponse.json({ message: "Comment added successfully" }, { status: 200 });
  } catch (error) {
    console.error(`Error in /api/products/${id}/reviews POST route:`, error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}
