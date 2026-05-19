import mongoose, { Schema, Model } from "mongoose";

export interface IProduct {
  _id?: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
  stock?: number;
  sellerId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    category: { type: String, default: "Other" },
    stock: { type: Number, default: 0, min: 0 },
    sellerId: { type: String, default: "" },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// Prevent model re-compilation during Next.js hot-reload
const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
