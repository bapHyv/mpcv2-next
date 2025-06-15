import { Address } from "@/app/types/profileTypes";
import { serverFetchWrapper } from "@/app/utils/serverFetchWrapper";
import { NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}

interface UpdateAddressResponse {
  firstname: string;
  lastname: string;
  company: string;
  country: string;
  address1: string;
  address2: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  billing: boolean;
  shipping: boolean;
  id: string;
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: "Address ID is required." }, { status: 400 });
  }

  try {
    const response = await serverFetchWrapper(`${process.env.API_HOST}/user/addresses/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({ message: errorData.message || "Failed to delete address." }, { status: response.status });
    }

    return NextResponse.json({ message: "Address deleted successfully", id }, { status: 200 });
  } catch (error) {
    console.error(`Error in /api/user/addresses/${id} DELETE route:`, error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: "Address ID is required." }, { status: 400 });
  }

  try {
    const body: Address = await request.json();

    if (!body.firstname || !body.address1) {
      return NextResponse.json({ message: "Missing required address fields." }, { status: 400 });
    }

    const response = await serverFetchWrapper(`${process.env.API_HOST}/user/addresses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json({ message: responseData.message || "Failed to update address." }, { status: response.status });
    }

    const updatedAddress: UpdateAddressResponse = responseData;

    return NextResponse.json(updatedAddress, { status: 200 });
  } catch (error) {
    console.error(`Error in /api/user/addresses/${id} PUT route:`, error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}
