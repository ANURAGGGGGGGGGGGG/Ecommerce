import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Running Shoes",
    price: 3499,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    sellerId: "",
  },
  {
    id: 2,
    name: "Classic Cotton T-Shirt",
    price: 799,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
    sellerId: "",
  },
  {
    id: 3,
    name: "Leather Crossbody Bag",
    price: 2199,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
    sellerId: "",
  },
  {
    id: 4,
    name: "Wireless Headphones",
    price: 5999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    sellerId: "",
  },
];

/** Load all products from API, optionally filtered by sellerId */
export async function getAllProducts(sellerId?: string): Promise<Product[]> {
  try {
    const url = sellerId ? `/api/products?sellerId=${encodeURIComponent(sellerId)}` : "/api/products";
    const res = await fetch(url);
    const data = await res.json();
    if (!data.success) return products;
    
    // Map _id to id for frontend compatibility
    return data.data.map((p: any) => ({
      ...p,
      id: p._id || p.id
    }));
  } catch (error) {
    console.error("getAllProducts error:", error);
    return products;
  }
}

/** Load a single product by ID from API */
export async function getProductById(id: string | number): Promise<Product | null> {
  try {
    const res = await fetch(`/api/products/${id}`);
    const data = await res.json();
    if (!data.success) return null;

    return {
      ...data.data,
      id: data.data._id || data.data.id
    };
  } catch (error) {
    console.error("getProductById error:", error);
    return null;
  }
}

/** Return only the products listed by a specific seller (matched by email). */
export async function getSellerProducts(email: string): Promise<Product[]> {
  try {
    const res = await fetch(`/api/products/seller/${encodeURIComponent(email)}`);
    const data = await res.json();
    if (!data.success) return [];

    return data.data.map((p: any) => ({
      ...p,
      id: p._id || p.id
    }));
  } catch (error) {
    console.error("getSellerProducts error:", error);
    return [];
  }
}

/** Remove a product by id and persist via API. */
export async function deleteProduct(id: string | number): Promise<boolean> {
  try {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const data = await res.json();
    return data.success;
  } catch (error) {
    console.error("deleteProduct error:", error);
    return false;
  }
}

/** Add a new product and persist via API. */
export async function addProduct(product: Omit<Product, "id">): Promise<Product | null> {
  try {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("addProduct error:", error);
    return null;
  }
}

/** Update an existing product by id and persist via API. */
export async function updateProduct(id: string | number, updates: Partial<Product>): Promise<boolean> {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    return data.success;
  } catch (error) {
    console.error("updateProduct error:", error);
    return false;
  }
}