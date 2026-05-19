import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";


const SEED_PRODUCTS = [
  {
    name: "Premium Running Shoes",
    price: 3499,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    description: "High-performance running shoes for all terrains.",
    category: "Sports",
    stock: 50,
    sellerId: "admin@shoplux.com",
  },
  {
    name: "Classic Cotton T-Shirt",
    price: 799,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
    description: "Soft 100% cotton tee, available in multiple colours.",
    category: "Clothing",
    stock: 200,
    sellerId: "admin@shoplux.com",
  },
  {
    name: "Leather Crossbody Bag",
    price: 2199,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
    description: "Genuine leather bag with adjustable strap.",
    category: "Fashion",
    stock: 30,
    sellerId: "admin@shoplux.com",
  },
  {
    name: "Wireless Headphones",
    price: 5999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    description: "Noise-cancelling wireless headphones with 40-hour battery life.",
    category: "Electronics",
    stock: 75,
    sellerId: "admin@shoplux.com",
  },
];

export async function POST() {
  try {
    await dbConnect();
    
    // Seed products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(SEED_PRODUCTS);
    }

    return NextResponse.json({
      success: true,
      message: "Seeding completed successfully.",
    });
  } catch (error) {
    console.error("POST /api/seed error:", error);
    return NextResponse.json(
      { success: false, message: "Seeding failed" },
      { status: 500 }
    );
  }
}
