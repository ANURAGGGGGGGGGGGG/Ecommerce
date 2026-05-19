"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSellerProducts, deleteProduct } from "@/data/product";
import { Product } from "@/types/product";

export default function SellerProductsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("shoplux_user");
    if (!stored) { router.push("/login"); return; }
    const parsed = JSON.parse(stored);
    if (parsed.role !== "seller") { router.push("/login"); return; }
    setUser(parsed);
    
    const fetchProducts = async () => {
      try {
        const data = await getSellerProducts(parsed.email);
        setProducts(data);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [router]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  async function handleDelete(id: string | number) {
    const success = await deleteProduct(id);
    if (success) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirm(null);
      showToast("Product deleted.");
    } else {
      showToast("Failed to delete product.");
    }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(search.toLowerCase())
  );

  if (!user) return null;

  const sidebarLinks = [
    { href: "/seller/dashboard", icon: "📊", label: "Dashboard" },
    { href: "/seller/products", icon: "📦", label: "My Products", active: true },
    { href: "/seller/add-product", icon: "➕", label: "Add Product" },
    { href: "/products", icon: "🛒", label: "View Store" },
  ];

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
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", background: "linear-gradient(135deg, #fff 0%, #c4c0ff 50%, #8781ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            ShopLux
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.2)", borderRadius: 12, marginBottom: 20 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #6C63FF, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🏪</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#c4c0ff" }}>Seller</div>
            <div style={{ fontSize: 11, color: "#918fa1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>{user.email}</div>
          </div>
        </div>
        {sidebarLinks.map((item) => (
          <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 600, color: item.active ? "#fff" : "#918fa1", background: item.active ? "linear-gradient(135deg, rgba(108,99,255,0.35), rgba(139,92,246,0.25))" : "transparent", border: item.active ? "1px solid rgba(108,99,255,0.3)" : "1px solid transparent" }}>
            <span>{item.icon}</span>{item.label}
          </Link>
        ))}
        <div style={{ marginTop: "auto" }}>
          <button onClick={() => { sessionStorage.clear(); router.push("/login"); }} style={{ width: "100%", padding: "10px 16px", background: "rgba(255,100,100,0.07)", border: "1px solid rgba(255,100,100,0.18)", borderRadius: 10, color: "#ffb4ab", fontSize: 14, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="mobile-p-sm" style={{ flex: 1, padding: "40px", overflow: "auto" }}>
        <div className="seller-header-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 800, letterSpacing: "-0.03em", margin: 0, background: "linear-gradient(135deg, #fff 0%, #c4c0ff 50%, #8781ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              My Products
            </h1>
            <p style={{ margin: "6px 0 0", color: "#918fa1", fontSize: 15 }}>
              {products.length} listing{products.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="tablet-stack" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="seller-search-input"
              style={{ padding: "10px 14px", background: "rgba(14,13,22,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e4e1ee", fontSize: 14, fontFamily: "inherit", outline: "none", width: 220 }}
            />
            <Link href="/seller/add-product" style={{ textDecoration: "none" }}>
              <button style={{ padding: "11px 22px", background: "linear-gradient(135deg, #6C63FF, #8b5cf6)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", boxShadow: "0 0 20px rgba(108,99,255,0.4)", display: "flex", alignItems: "center", gap: 8 }}>
                <span>＋</span> Add Product
              </button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 32px", background: "rgba(31,31,40,0.4)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="loader" style={{ width: 40, height: 40, border: "3px solid rgba(108,99,255,0.1)", borderTop: "3px solid #6C63FF", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: 16 }}></div>
            <div style={{ color: "#918fa1", fontSize: 14, fontWeight: 500 }}>Loading your products...</div>
            <style jsx>{`
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: "rgba(31,31,40,0.4)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 20, padding: "64px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>{search ? "🔍" : "📦"}</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#e4e1ee" }}>
              {search ? "No products found" : "No products yet"}
            </h3>
            <p style={{ color: "#918fa1", fontSize: 14, margin: "0 0 24px" }}>
              {search ? `No results for "${search}"` : "Start by adding your first product."}
            </p>
            {!search && (
              <Link href="/seller/add-product" style={{ textDecoration: "none" }}>
                <button style={{ padding: "12px 28px", background: "linear-gradient(135deg, #6C63FF, #8b5cf6)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", boxShadow: "0 0 20px rgba(108,99,255,0.4)" }}>
                  ➕ Add First Product
                </button>
              </Link>
            )}
          </div>
        ) : (
          /* Table-style list */
          <div style={{ background: "rgba(27,27,36,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
            {/* Header */}
            <div className="seller-table-header" style={{ display: "grid", gridTemplateColumns: "60px 1fr 100px 100px 110px 120px", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", gap: 12 }}>
              {["", "Product", "Category", "Price", "Stock", "Actions"].map((h) => (
                <span key={h} style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#464555" }}>{h}</span>
              ))}
            </div>
            {filtered.map((p, i) => (
              <div
                key={p.id}
                className="hover-table-row seller-table-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr 100px 100px 110px 120px",
                  padding: "14px 20px",
                  borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  alignItems: "center",
                  gap: 12,
                  transition: "background 0.2s",
                }}
              >
                {/* Thumb */}
                <div style={{ width: 48, height: 48, borderRadius: 8, overflow: "hidden", background: "rgba(31,31,40,1)", flexShrink: 0 }}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📦</div>
                  )}
                </div>
                {/* Name */}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#e4e1ee", letterSpacing: "-0.01em" }}>{p.name}</div>
                  {p.description && <div style={{ fontSize: 12, color: "#918fa1", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 280 }}>{p.description}</div>}
                </div>
                {/* Category */}
                <span style={{ fontSize: 11, fontWeight: 600, color: "#c4c0ff", background: "rgba(108,99,255,0.12)", border: "1px solid rgba(108,99,255,0.2)", padding: "3px 8px", borderRadius: 4, display: "inline-block", whiteSpace: "nowrap" }}>
                  {p.category || "—"}
                </span>
                {/* Price */}
                <span style={{ fontSize: 14, fontWeight: 700, color: "#e4e1ee" }}>₹{p.price.toLocaleString()}</span>
                {/* Stock */}
                <span style={{ fontSize: 12, fontWeight: 600, color: (p.stock ?? 1) > 0 ? "#4ade80" : "#f87171", background: (p.stock ?? 1) > 0 ? "rgba(74,222,128,0.1)" : "rgba(255,100,100,0.1)", border: `1px solid ${(p.stock ?? 1) > 0 ? "rgba(74,222,128,0.25)" : "rgba(255,100,100,0.25)"}`, padding: "3px 8px", borderRadius: 999, whiteSpace: "nowrap" }}>
                  {(p.stock ?? 1) > 0 ? `In Stock (${p.stock})` : "Out of Stock"}
                </span>
                {/* Actions */}
                <div style={{ display: "flex", gap: 6 }}>
                  <Link href={`/seller/edit-product/${p.id}`} style={{ textDecoration: "none" }}>
                    <button style={{ padding: "6px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, color: "#c4c0ff", fontSize: 12, fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>
                      ✏️ Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(p.id)}
                    style={{ padding: "6px 12px", background: "rgba(255,100,100,0.07)", border: "1px solid rgba(255,100,100,0.2)", borderRadius: 7, color: "#f87171", fontSize: 12, fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete modal */}
      {deleteConfirm !== null && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "rgba(27,27,36,0.98)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "32px 28px", maxWidth: 360, width: "90%", textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#e4e1ee" }}>Delete Product?</h3>
            <p style={{ margin: "0 0 24px", color: "#918fa1", fontSize: 14 }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: "11px 0", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e4e1ee", fontSize: 14, fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, padding: "11px 0", background: "rgba(255,100,100,0.15)", border: "1px solid rgba(255,100,100,0.35)", borderRadius: 10, color: "#f87171", fontSize: 14, fontWeight: 700, fontFamily: "inherit", cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className="toast-mobile" style={{ position: "fixed", bottom: 28, right: 28, zIndex: 300, transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)", transform: toast ? "translateY(0) scale(1)" : "translateY(12px) scale(0.95)", opacity: toast ? 1 : 0, pointerEvents: "none" }}>
        <div style={{ background: "rgba(31,31,40,0.97)", backdropFilter: "blur(16px)", border: "1px solid rgba(108,99,255,0.3)", borderRadius: 12, padding: "12px 18px", color: "#e4e1ee", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#4ade80" }}>✓</span> {toast}
        </div>
      </div>
    </div>
  );
}
