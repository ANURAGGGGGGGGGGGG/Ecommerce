"use client";

import Link from "next/link";

export default function HeroButtons() {
  return (
    <div className="mobile-col" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
      <Link href="/products" style={{ textDecoration: "none" }}>
        <button
          className="hover-btn-primary"
          style={{
            background: "linear-gradient(135deg, #6C63FF, #8b5cf6)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "14px 36px",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "0.02em",
            cursor: "pointer",
            boxShadow: "0 0 28px rgba(108,99,255,0.45)",
            transition: "all 0.25s ease",
          }}
        >
          Shop the Collection
        </button>
      </Link>
      <Link href="/cart" style={{ textDecoration: "none" }}>
        <button
          className="hover-btn-secondary"
          style={{
            background: "rgba(255,255,255,0.05)",
            color: "#e4e1ee",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12,
            padding: "14px 36px",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "0.02em",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            transition: "all 0.25s ease",
          }}
        >
          View Cart
        </button>
      </Link>
    </div>
  );
}
