import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Product from "@/models/Product"; // Ensure Product model is registered for populate

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).populate("cart.productId").lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Format the cart items for the frontend
    const cartItems = user.cart.map((item: any) => ({
      ...item.productId,
      quantity: item.quantity,
      id: item.productId._id, // Add id for compatibility
    }));

    return NextResponse.json({ success: true, data: cartItems });
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, cart } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Transform frontend cart items (with objects) back to schema format (with IDs)
    const dbCart = cart.map((item: any) => ({
      productId: item._id || item.id,
      quantity: item.quantity,
    }));

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { cart: dbCart } },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Cart updated" });
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update cart" },
      { status: 500 }
    );
  }
}
