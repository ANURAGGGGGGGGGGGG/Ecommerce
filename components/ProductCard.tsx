"use client"
import { useState } from "react";
import { Product } from "@/types/product";

interface Props {
  product: Product;
  addToCart?: (product: Product) => void;
  removeFromCart?: (productId: number | string) => void;
  removeAllFromCart?: (productId: number | string) => void;
  cartQuantity?: number;
  isSeller?: boolean;
}

export default function ProductCard({ product, addToCart, removeFromCart, removeAllFromCart, cartQuantity = 0, isSeller }: Props) {
  const [added, setAdded] = useState(false);
  const [bump, setBump] = useState(false);

  const handleAdd = () => {
    if (addToCart) addToCart(product);
    setAdded(true);
    setBump(true);
    setTimeout(() => setBump(false), 150);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="hover-product-card"
      style={{
        background: "rgba(19,18,27,0.8)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        overflow: "hidden",
        transition: "all 0.25s ease",
        transform: "translateY(0)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          aspectRatio: "4/3",
          background: "linear-gradient(135deg, #1f1f28 0%, #2a2933 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {product.image && product.image !== "imagehere" ? (
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ textAlign: "center", color: "#464555" }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p style={{ marginTop: 8, fontSize: 12, color: "#464555" }}>No Image</p>
          </div>
        )}

        {/* Price badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(108,99,255,0.9)",
            backdropFilter: "blur(8px)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 13,
            padding: "4px 10px",
            borderRadius: 999,
            letterSpacing: "0.01em",
          }}
        >
          ₹{product.price.toLocaleString()}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 20px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Stars */}
        <div style={{ display: "flex", gap: 2 }}>
          {[1,2,3,4,5].map((s) => (
            <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#ffb785" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          ))}
          <span style={{ fontSize: 12, color: "#918fa1", marginLeft: 4, fontWeight: 500 }}>5.0</span>
        </div>

        {/* Name */}
        <h2
          style={{
            margin: 0,
            fontSize: 17,
            fontWeight: 700,
            color: "#e4e1ee",
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </h2>

        {/* Category tag */}
        <div>
          <span
            style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#c4c0ff",
              background: "rgba(108,99,255,0.12)",
              border: "1px solid rgba(108,99,255,0.2)",
              padding: "3px 8px",
              borderRadius: 4,
            }}
          >
            Premium
          </span>
        </div>

        {/* Add to Cart Button */}
        {!isSeller && (
          cartQuantity > 0 ? (
            <div
              style={{
                marginTop: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#ffffff",
                border: "2px solid #fbbf24", // Yellow border as in design
                borderRadius: 999,
                padding: "8px 16px",
                width: "100%",
                boxSizing: "border-box",
                boxShadow: "0 0 16px rgba(251,191,36,0.35)",
                transform: bump ? "scale(1.08)" : "scale(1)",
                transition: "transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (cartQuantity === 1 && removeAllFromCart) {
                    removeAllFromCart(product._id || product.id);
                  } else if (removeFromCart) {
                    removeFromCart(product._id || product.id);
                  }
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 4,
                  color: "#000",
                }}
              >
                {cartQuantity === 1 ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                )}
              </button>
              
              <span style={{ color: "#000", fontWeight: 700, fontSize: 15 }}>
                {cartQuantity} in cart
              </span>
              
              <button
                disabled={cartQuantity >= 10}
                onClick={(e) => {
                  e.preventDefault();
                  if (cartQuantity >= 10) return;
                  if (addToCart) addToCart(product);
                  setBump(true);
                  setTimeout(() => setBump(false), 150);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: cartQuantity >= 10 ? "not-allowed" : "pointer",
                  opacity: cartQuantity >= 10 ? 0.3 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 4,
                  color: "#000",
                  transition: "opacity 0.2s",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="hover-add-cart-btn"
              style={{
                marginTop: "auto",
                background: added
                  ? "linear-gradient(135deg, #4ade80, #22c55e)"
                  : "linear-gradient(135deg, #6C63FF, #8b5cf6)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "11px 0",
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: "0.02em",
                cursor: "pointer",
                width: "100%",
                transition: "all 0.25s ease",
                boxShadow: added
                  ? "0 0 16px rgba(74,222,128,0.35)"
                  : "0 0 16px rgba(108,99,255,0.35)",
                transform: "scale(1)",
              }}
            >
              {added ? "✓ Added!" : "Add to Cart"}
            </button>
          )
        )}
      </div>
    </div>
  );
}
