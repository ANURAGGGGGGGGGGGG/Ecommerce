import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

// GET /api/products/seller/[email] — fetch all products for a specific seller
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    await dbConnect();
    const { email } = await params;

    // Decode in case the email has URL-encoded characters (e.g. %40 → @)
    const decodedEmail = decodeURIComponent(email);

    const products = await Product.find({ sellerId: decodedEmail })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("GET /api/products/seller/[email] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch seller products" },
      { status: 500 }
    );
  }
}
