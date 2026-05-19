import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

// GET /api/products — fetch all products
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("sellerId");

    const query = sellerId ? { sellerId } : {};
    const products = await Product.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products — create a new product
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const { name, price, image, description, category, stock, sellerId } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { success: false, message: "name and price are required" },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      price,
      image: image || "",
      description: description || "",
      category: category || "Other",
      stock: stock ?? 0,
      sellerId: sellerId || "",
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 }
    );
  }
}
