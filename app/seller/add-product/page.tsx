"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addProduct } from "@/data/product";

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Home & Living",
  "Books",
  "Sports",
  "Beauty",
  "Fashion",
  "Other",
];

interface FormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  image: string;
}

const EMPTY: FormData = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "Electronics",
  image: "",
};

export default function AddProductPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("shoplux_user");
    if (!stored) { router.push("/login"); return; }
    const parsed = JSON.parse(stored);
    if (parsed.role !== "seller") { router.push("/login"); return; }
    setUser(parsed);
  }, [router]);

  function validate(): boolean {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = "Product name is required";
    
    const priceNum = Number(form.price);
    if (!form.price || isNaN(priceNum) || priceNum <= 0) {
      e.price = "Enter a valid price";
    } else if (priceNum > 1000000) {
      e.price = "Price cannot exceed ₹10,00,000";
    }

    const stockNum = Number(form.stock);
    if (!form.stock || isNaN(stockNum) || stockNum < 0) {
      e.stock = "Enter a valid stock quantity";
    } else if (stockNum > 30) {
      e.stock = "Maximum 30 items can be added at a time";
    }
    
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || !user) return;
    setLoading(true);
    
    try {
      const result = await addProduct({
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        image: form.image.trim(),
        sellerId: user.email,
      });

      if (result) {
        setSuccess(true);
      } else {
        setErrors((prev) => ({ ...prev, name: "Failed to create product. Try again." }));
      }
    } catch (err) {
      console.error("Add product error:", err);
      setErrors((prev) => ({ ...prev, name: "An unexpected error occurred." }));
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  // ── Input style helper ──────────────────────────────────────────────────
  const inputStyle = (hasErr?: string): React.CSSProperties => ({
    width: "100%",
    padding: "12px 14px",
    background: "rgba(14,13,22,0.8)",
    border: `1px solid ${hasErr ? "rgba(255,100,100,0.5)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 10,
    color: "#e4e1ee",
    fontSize: 15,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#c7c4d8",
    marginBottom: 8,
  };

  const errStyle: React.CSSProperties = {
    fontSize: 12,
    color: "#f87171",
    marginTop: 4,
  };

  // ── Preview card ────────────────────────────────────────────────────────
  const previewPrice = Number(form.price) || 0;

  return (
    <div className="seller-layout">
      {/* Sidebar */}
      <aside
        className="mobile-sidebar"
        style={{
          width: 240,
          minHeight: "100vh",
          background: "rgba(19,18,27,0.95)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          flexDirection: "column",
          padding: "24px 16px",
          gap: 4,
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", marginBottom: 24, padding: "0 8px" }}>
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #fff 0%, #c4c0ff 50%, #8781ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ShopLux
          </span>
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            background: "rgba(108,99,255,0.1)",
            border: "1px solid rgba(108,99,255,0.2)",
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6C63FF, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            🏪
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#c4c0ff" }}>Seller</div>
            <div style={{ fontSize: 11, color: "#918fa1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>
              {user.email}
            </div>
          </div>
        </div>

        {[
          { href: "/seller/dashboard", icon: "📊", label: "Dashboard" },
          { href: "/seller/products", icon: "📦", label: "My Products" },
          { href: "/seller/add-product", icon: "➕", label: "Add Product", active: true },
          { href: "/products", icon: "🛒", label: "View Store" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 16px",
              borderRadius: 10,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
              color: item.active ? "#fff" : "#918fa1",
              background: item.active
                ? "linear-gradient(135deg, rgba(108,99,255,0.35), rgba(139,92,246,0.25))"
                : "transparent",
              border: item.active
                ? "1px solid rgba(108,99,255,0.3)"
                : "1px solid transparent",
            }}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </aside>

      {/* Main */}
      <main className="mobile-p-sm" style={{ flex: 1, padding: "40px", overflow: "auto" }}>
        {/* Back + heading */}
        <div style={{ marginBottom: 32 }}>
          <Link
            href="/seller/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              textDecoration: "none",
              color: "#8781ff",
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            ← Back to Dashboard
          </Link>
          <h1
            style={{
              fontSize: "clamp(24px, 3vw, 34px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: 0,
              background: "linear-gradient(135deg, #fff 0%, #c4c0ff 50%, #8781ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Add New Product
          </h1>
          <p style={{ margin: "8px 0 0", color: "#918fa1", fontSize: 15 }}>
            Fill in the details — your product will appear in the buyer store instantly.
          </p>
        </div>

        {/* Success state */}
        {success ? (
          <div
            style={{
              background: "rgba(74,222,128,0.07)",
              border: "1px solid rgba(74,222,128,0.3)",
              borderRadius: 20,
              padding: "60px 32px",
              textAlign: "center",
              maxWidth: 480,
            }}
          >
            <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
            <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700, color: "#4ade80" }}>
              Product Listed!
            </h2>
            <p style={{ color: "#918fa1", margin: "0 0 28px", fontSize: 15 }}>
              Your product is now visible in the buyer store.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => { setForm(EMPTY); setSuccess(false); }}
                style={{
                  padding: "11px 24px",
                  background: "linear-gradient(135deg, #6C63FF, #8b5cf6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  boxShadow: "0 0 20px rgba(108,99,255,0.35)",
                }}
              >
                ➕ Add Another
              </button>
              <Link href="/seller/dashboard" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    padding: "11px 24px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10,
                    color: "#e4e1ee",
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  📊 Dashboard
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Form */}
            <form
              onSubmit={handleSubmit}
              style={{
                flex: "1 1 400px",
                background: "rgba(27,27,36,0.75)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {/* Name */}
              <div>
                <label htmlFor="prod-name" style={labelStyle}>Product Name *</label>
                <input
                  id="prod-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Wireless Earbuds Pro"
                  style={inputStyle(errors.name)}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(108,99,255,0.6)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(108,99,255,0.12)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = errors.name ? "rgba(255,100,100,0.5)" : "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
                />
                {errors.name && <p style={errStyle}>{errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="prod-desc" style={labelStyle}>Description</label>
                <textarea
                  id="prod-desc"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe your product..."
                  style={{ ...inputStyle(), resize: "vertical", minHeight: 80 }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(108,99,255,0.6)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(108,99,255,0.12)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>

              {/* Price + Stock row */}
              <div className="mobile-col" style={{ display: "flex", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="prod-price" style={labelStyle}>Price (₹) *</label>
                  <input
                    id="prod-price"
                    name="price"
                    type="number"
                    min="1"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="999"
                    style={inputStyle(errors.price)}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(108,99,255,0.6)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(108,99,255,0.12)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = errors.price ? "rgba(255,100,100,0.5)" : "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                  {errors.price && <p style={errStyle}>{errors.price}</p>}
                </div>
                <div style={{ flex: 1 }}>
                  <label htmlFor="prod-stock" style={labelStyle}>Stock Qty *</label>
                  <input
                    id="prod-stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="10"
                    style={inputStyle(errors.stock)}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(108,99,255,0.6)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(108,99,255,0.12)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = errors.stock ? "rgba(255,100,100,0.5)" : "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                  {errors.stock && <p style={errStyle}>{errors.stock}</p>}
                </div>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="prod-cat" style={labelStyle}>Category</label>
                <select
                  id="prod-cat"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  style={{ ...inputStyle(), cursor: "pointer" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(108,99,255,0.6)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} style={{ background: "#1f1f28" }}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="prod-img" style={labelStyle}>Image URL</label>
                <input
                  id="prod-img"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  style={inputStyle()}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(108,99,255,0.6)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(108,99,255,0.12)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>

              {/* Submit */}
              <button
                id="submit-product"
                type="submit"
                disabled={loading}
                style={{
                  padding: "14px",
                  background: loading
                    ? "rgba(108,99,255,0.5)"
                    : "linear-gradient(135deg, #6C63FF, #8b5cf6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: "inherit",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 0 28px rgba(108,99,255,0.45)",
                  transition: "all 0.2s",
                  marginTop: 4,
                }}
              >
                {loading ? "Adding Product…" : "➕ Add Product"}
              </button>
            </form>

            {/* Live Preview */}
            <div style={{ flex: "0 1 280px" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: "#918fa1", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Live Preview
              </h3>
              <div
                style={{
                  background: "rgba(31,31,40,0.7)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                {/* Image area */}
                <div
                  style={{
                    height: 180,
                    background: "linear-gradient(135deg, #1f1f28, #2a2933)",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {form.image ? (
                    <img
                      src={form.image}
                      alt="preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <span style={{ fontSize: 48, color: "#464555" }}>📦</span>
                  )}
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      background: "rgba(108,99,255,0.9)",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 999,
                    }}
                  >
                    ₹{previewPrice > 0 ? previewPrice.toLocaleString() : "—"}
                  </div>
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <h4
                    style={{
                      margin: "0 0 6px",
                      fontSize: 15,
                      fontWeight: 700,
                      color: form.name ? "#e4e1ee" : "#464555",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {form.name || "Product name…"}
                  </h4>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#c4c0ff",
                      background: "rgba(108,99,255,0.12)",
                      border: "1px solid rgba(108,99,255,0.2)",
                      padding: "2px 8px",
                      borderRadius: 4,
                      display: "inline-block",
                    }}
                  >
                    {form.category}
                  </span>
                  <p style={{ margin: "10px 0 14px", fontSize: 13, color: "#918fa1", lineHeight: 1.5 }}>
                    {form.description || "Description will appear here…"}
                  </p>
                  <button
                    disabled
                    style={{
                      width: "100%",
                      padding: "10px 0",
                      background: "linear-gradient(135deg, #6C63FF, #8b5cf6)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "default",
                      opacity: 0.8,
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <p style={{ margin: "12px 0 0", fontSize: 12, color: "#464555", textAlign: "center" }}>
                Buyers will see this card in the store.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
