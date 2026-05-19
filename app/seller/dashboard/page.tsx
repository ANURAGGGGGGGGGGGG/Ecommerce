"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getAllProducts,
  getSellerProducts,
  deleteProduct,
} from "@/data/product";
import { Product } from "@/types/product";

// ── Sidebar nav item ────────────────────────────────────────────────────────
function SidebarLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px",
        borderRadius: 10,
        textDecoration: "none",
        fontSize: 14,
        fontWeight: 600,
        color: active ? "#fff" : "#918fa1",
        background: active
          ? "linear-gradient(135deg, rgba(108,99,255,0.35), rgba(139,92,246,0.25))"
          : "transparent",
        border: active
          ? "1px solid rgba(108,99,255,0.3)"
          : "1px solid transparent",
        transition: "all 0.2s",
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      {label}
    </Link>
  );
}

// ── Animated Counter Hook ───────────────────────────────────────────────────
function useCountUp(target: number, decimals: number, active: boolean, duration = 2500) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [active, target, duration, decimals]);

  return count;
}

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  accent,
}: {
  icon: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  accent?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const count = useCountUp(value, decimals, active);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const displayValue =
    decimals > 0
      ? count.toFixed(decimals)
      : Math.floor(count).toLocaleString();

  return (
    <div
      ref={ref}
      style={{
        background: "rgba(31,31,40,0.7)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: "22px 20px",
      }}
    >
      <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: accent || "#c4c0ff",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {prefix}{displayValue}{suffix}
      </div>
      <div style={{ fontSize: 13, color: "#918fa1", marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function SellerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [allCount, setAllCount] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<string | number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState("dashboard");

  useEffect(() => {
    const stored = sessionStorage.getItem("shoplux_user");
    if (!stored) { router.push("/login"); return; }
    const parsed = JSON.parse(stored);
    if (parsed.role !== "seller") { router.push("/login"); return; }
    setUser(parsed);
    const fetchData = async () => {
      const mine = await getSellerProducts(parsed.email);
      setMyProducts(mine);
      const all = await getAllProducts();
      setAllCount(all.length);
    };
    fetchData();
  }, [router]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  async function handleDelete(id: string | number) {
    await deleteProduct(id);
    setMyProducts((prev) => prev.filter((p) => p.id !== id));
    setAllCount((n) => n - 1);
    setDeleteConfirm(null);
    showToast("Product deleted.");
  }

  function handleLogout() {
    sessionStorage.clear();
    router.push("/login");
  }

  if (!user) return null;

  const totalRevenue = myProducts.reduce((s, p) => s + p.price, 0);

  return (
    <div
      className="seller-layout"
    >
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
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
          overflow: "auto",
        }}
      >
        {/* Logo */}
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

        {/* Seller badge */}
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
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#c4c0ff" }}>
              Seller
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#918fa1",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.email}
            </div>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <SidebarLink href="/seller/dashboard" icon="📊" label="Dashboard" active={activeNav === "dashboard"} />
          <SidebarLink href="/seller/products" icon="📦" label="My Products" active={activeNav === "products"} />
          <SidebarLink href="/seller/add-product" icon="➕" label="Add Product" active={activeNav === "add"} />
          <SidebarLink href="/seller/coupons" icon="🏷️" label="Coupons" active={activeNav === "coupons"} />
          <SidebarLink href="/products" icon="🛒" label="View Store" />
        </div>

        {/* Spacer + Logout */}
        <div style={{ marginTop: "auto" }}>
          <button
            id="seller-logout"
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "10px 16px",
              background: "rgba(255,100,100,0.07)",
              border: "1px solid rgba(255,100,100,0.18)",
              borderRadius: 10,
              color: "#ffb4ab",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="mobile-p-sm" style={{ flex: 1, padding: "40px 40px 80px", overflow: "auto" }}>
        {/* Header */}
        <div
          className="seller-header-row"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 36,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#c4c0ff",
                background: "rgba(108,99,255,0.12)",
                border: "1px solid rgba(108,99,255,0.25)",
                padding: "4px 12px",
                borderRadius: 999,
                marginBottom: 10,
              }}
            >
              🏪 Seller Portal
            </div>
            <h1
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                margin: 0,
                background: "linear-gradient(135deg, #fff 0%, #c4c0ff 50%, #8781ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Dashboard
            </h1>
          </div>

          <Link href="/seller/add-product" style={{ textDecoration: "none" }}>
            <button
              id="add-product-btn"
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #6C63FF, #8b5cf6)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: "pointer",
                boxShadow: "0 0 24px rgba(108,99,255,0.45)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 16 }}>＋</span> Add New Product
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div
          className="mobile-grid-1"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 18,
            marginBottom: 40,
          }}
        >
          <StatCard icon="💰" label="Potential Revenue" value={totalRevenue} prefix="₹" />
          <StatCard icon="📦" label="My Listings" value={myProducts.length} />
          <StatCard icon="🛍️" label="Store Products" value={allCount} />
          <StatCard icon="⭐" label="Rating" value={5.0} decimals={1} accent="#ffb785" />
        </div>

        {/* My Products Section */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                color: "#e4e1ee",
                letterSpacing: "-0.02em",
              }}
            >
              My Products
            </h2>
            <Link href="/seller/products" style={{ textDecoration: "none", fontSize: 13, color: "#8781ff", fontWeight: 600 }}>
              View All →
            </Link>
          </div>

          {myProducts.length === 0 ? (
            <div
              style={{
                background: "rgba(31,31,40,0.4)",
                border: "1px dashed rgba(255,255,255,0.1)",
                borderRadius: 20,
                padding: "64px 32px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 52, marginBottom: 14 }}>📦</div>
              <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#e4e1ee" }}>
                No products yet
              </h3>
              <p style={{ color: "#918fa1", fontSize: 14, margin: "0 0 24px" }}>
                Start listing products for buyers to discover.
              </p>
              <Link href="/seller/add-product" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    padding: "12px 28px",
                    background: "linear-gradient(135deg, #6C63FF, #8b5cf6)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    boxShadow: "0 0 20px rgba(108,99,255,0.4)",
                  }}
                >
                  ➕ Add First Product
                </button>
              </Link>
            </div>
          ) : (
            <div className="seller-products-grid">
              {myProducts.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: "rgba(31,31,40,0.7)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 16,
                    overflow: "hidden",
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      height: 160,
                      background: "linear-gradient(135deg, #1f1f28, #2a2933)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 40,
                          color: "#464555",
                        }}
                      >
                        📦
                      </div>
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
                      ₹{p.price.toLocaleString()}
                    </div>
                    {/* Stock badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        background:
                          (p.stock ?? 1) > 0
                            ? "rgba(74,222,128,0.15)"
                            : "rgba(255,100,100,0.15)",
                        border: `1px solid ${
                          (p.stock ?? 1) > 0
                            ? "rgba(74,222,128,0.35)"
                            : "rgba(255,100,100,0.35)"
                        }`,
                        color: (p.stock ?? 1) > 0 ? "#4ade80" : "#f87171",
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: 999,
                      }}
                    >
                      {(p.stock ?? 1) > 0 ? `In Stock (${p.stock})` : "Out of Stock"}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: "14px 16px" }}>
                    <h3
                      style={{
                        margin: "0 0 4px",
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#e4e1ee",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {p.name}
                    </h3>
                    {p.category && (
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
                          marginBottom: 12,
                        }}
                      >
                        {p.category}
                      </span>
                    )}

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <Link
                        href={`/seller/edit-product/${p.id}`}
                        style={{ flex: 1, textDecoration: "none" }}
                      >
                        <button
                          style={{
                            width: "100%",
                            padding: "8px 0",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 8,
                            color: "#c4c0ff",
                            fontSize: 13,
                            fontWeight: 600,
                            fontFamily: "inherit",
                            cursor: "pointer",
                          }}
                        >
                          ✏️ Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(p.id)}
                        style={{
                          flex: 1,
                          padding: "8px 0",
                          background: "rgba(255,100,100,0.07)",
                          border: "1px solid rgba(255,100,100,0.2)",
                          borderRadius: 8,
                          color: "#f87171",
                          fontSize: 13,
                          fontWeight: 600,
                          fontFamily: "inherit",
                          cursor: "pointer",
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Delete confirm modal ─────────────────────────────────────────── */}
      {deleteConfirm !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
          }}
        >
          <div
            style={{
              background: "rgba(27,27,36,0.98)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: "32px 28px",
              maxWidth: 360,
              width: "90%",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#e4e1ee" }}>
              Delete Product?
            </h3>
            <p style={{ margin: "0 0 24px", color: "#918fa1", fontSize: 14 }}>
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  flex: 1,
                  padding: "11px 0",
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
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  background: "rgba(255,100,100,0.15)",
                  border: "1px solid rgba(255,100,100,0.35)",
                  borderRadius: 10,
                  color: "#f87171",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ────────────────────────────────────────────────────────── */}
      <div
        className="toast-mobile"
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 300,
          transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          transform: toast ? "translateY(0) scale(1)" : "translateY(12px) scale(0.95)",
          opacity: toast ? 1 : 0,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            background: "rgba(31,31,40,0.97)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(108,99,255,0.3)",
            borderRadius: 12,
            padding: "12px 18px",
            color: "#e4e1ee",
            fontSize: 14,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ color: "#4ade80" }}>✓</span> {toast}
        </div>
      </div>
    </div>
  );
}
