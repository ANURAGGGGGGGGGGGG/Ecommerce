"use client";

const features = [
  { icon: "🚚", title: "Free Shipping", desc: "Free delivery on orders over ₹500" },
  { icon: "🔒", title: "Secure Payments", desc: "End-to-end encrypted transactions" },
  { icon: "↩️", title: "Easy Returns", desc: "30-day hassle-free return policy" },
  { icon: "⭐", title: "Premium Quality", desc: "Handpicked products, guaranteed quality" },
];

export default function FeatureCards() {
  return (
    <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
      {features.map((f, i) => (
        <div
          key={i}
          className="hover-feature-card"
          style={{
            background: "rgba(31,31,40,0.6)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16,
            padding: "28px 24px",
            transition: "all 0.25s ease",
            cursor: "default",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
          <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: "#e4e1ee", letterSpacing: "-0.01em" }}>
            {f.title}
          </h3>
          <p style={{ margin: 0, fontSize: 14, color: "#918fa1", lineHeight: 1.5 }}>
            {f.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
