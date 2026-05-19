"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Coupon {
  id: string;
  code: string;
  type: "percent" | "flat";
  value: number;
  minOrder: number;
  active: boolean;
  uses: number;
}

const DEFAULT_COUPONS: Coupon[] = [
  { id: "1", code: "SAVE10", type: "percent", value: 10, minOrder: 0,   active: true,  uses: 42 },
  { id: "2", code: "FLAT50", type: "flat",    value: 50, minOrder: 300, active: true,  uses: 17 },
  { id: "3", code: "LUXE20", type: "percent", value: 20, minOrder: 999, active: false, uses: 8  },
];

function SidebarLink({ href, icon, label, active }: { href: string; icon: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      style={{
        display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
        borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 600,
        color: active ? "#fff" : "#918fa1",
        background: active ? "linear-gradient(135deg, rgba(108,99,255,0.35), rgba(139,92,246,0.25))" : "transparent",
        border: active ? "1px solid rgba(108,99,255,0.3)" : "1px solid transparent",
        transition: "all 0.2s",
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      {label}
    </Link>
  );
}

function Badge({ active }: { active: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px",
        borderRadius: 999, fontSize: 11, fontWeight: 700,
        background: active ? "rgba(74,222,128,0.12)" : "rgba(255,100,100,0.1)",
        border: `1px solid ${active ? "rgba(74,222,128,0.3)" : "rgba(255,100,100,0.25)"}`,
        color: active ? "#4ade80" : "#f87171",
      }}
    >
      {active ? "● Active" : "● Inactive"}
    </span>
  );
}

export default function SellerCoupons() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>(DEFAULT_COUPONS);
  const [toast, setToast] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // New coupon form
  const [form, setForm] = useState({ code: "", type: "percent" as "percent" | "flat", value: "", minOrder: "" });
  const [formErr, setFormErr] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("shoplux_user");
    if (!stored) { router.push("/login"); return; }
    const parsed = JSON.parse(stored);
    if (parsed.role !== "seller") { router.push("/login"); return; }
    setUser(parsed);
  }, [router]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function toggleActive(id: string) {
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c));
    showToast("Coupon status updated.");
  }

  function handleDelete(id: string) {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    setDeleteId(null);
    showToast("Coupon deleted.");
  }

  function handleAdd() {
    const code = form.code.trim().toUpperCase();
    const val  = parseFloat(form.value);
    const min  = parseFloat(form.minOrder) || 0;
    if (!code || code.length < 3)                       { setFormErr("Code must be at least 3 characters."); return; }
    if (coupons.some((c) => c.code === code))           { setFormErr("Coupon code already exists."); return; }
    if (!val || val <= 0)                               { setFormErr("Enter a valid discount value."); return; }
    if (form.type === "percent" && val > 80)            { setFormErr("Percent discount cannot exceed 80%."); return; }
    const newCoupon: Coupon = {
      id: crypto.randomUUID(), code, type: form.type, value: val, minOrder: min, active: true, uses: 0,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    setForm({ code: "", type: "percent", value: "", minOrder: "" });
    setFormErr("");
    setShowForm(false);
    showToast(`Coupon "${code}" created!`);
  }

  function handleLogout() {
    sessionStorage.clear();
    router.push("/login");
  }

  if (!user) return null;

  return (
    <div
      style={{
        minHeight: "100vh", background: "#13121b",
        display: "flex", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* ── Sidebar ── */}
      <aside
        className="mobile-sidebar"
        style={{
          width: 240, minHeight: "100vh", background: "rgba(19,18,27,0.95)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          display: "flex", flexDirection: "column", padding: "24px 16px", gap: 4,
          position: "sticky", top: 0, height: "100vh", overflow: "auto",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", marginBottom: 24, padding: "0 8px" }}>
          <span
            style={{
              fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #fff 0%, #c4c0ff 50%, #8781ff 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}
          >ShopLux</span>
        </Link>

        <div
          style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
            background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.2)",
            borderRadius: 12, marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "linear-gradient(135deg, #6C63FF, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0,
            }}
          >🏪</div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#c4c0ff" }}>Seller</div>
            <div style={{ fontSize: 11, color: "#918fa1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.email}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <SidebarLink href="/seller/dashboard"   icon="📊" label="Dashboard"   />
          <SidebarLink href="/seller/products"    icon="📦" label="My Products"  />
          <SidebarLink href="/seller/add-product" icon="➕" label="Add Product"  />
          <SidebarLink href="/seller/coupons"     icon="🏷️" label="Coupons"      active />
          <SidebarLink href="/products"           icon="🛒" label="View Store"   />
        </div>

        <div style={{ marginTop: "auto" }}>
          <button
            id="seller-logout"
            onClick={handleLogout}
            style={{
              width: "100%", padding: "10px 16px",
              background: "rgba(255,100,100,0.07)", border: "1px solid rgba(255,100,100,0.18)",
              borderRadius: 10, color: "#ffb4ab", fontSize: 14, fontWeight: 600,
              fontFamily: "inherit", cursor: "pointer", textAlign: "left",
              display: "flex", alignItems: "center", gap: 10,
            }}
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="mobile-p-sm" style={{ flex: 1, padding: "40px 40px 80px", overflow: "auto" }}>
        {/* Header */}
        <div
          className="seller-header-row tablet-stack"
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 36, flexWrap: "wrap", gap: 16,
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
                color: "#c4c0ff", background: "rgba(108,99,255,0.12)",
                border: "1px solid rgba(108,99,255,0.25)", padding: "4px 12px",
                borderRadius: 999, marginBottom: 10,
              }}
            >🏷️ Coupon Manager</div>
            <h1
              style={{
                fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, letterSpacing: "-0.03em", margin: 0,
                background: "linear-gradient(135deg, #fff 0%, #c4c0ff 50%, #8781ff 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}
            >Coupons</h1>
          </div>
          <button
            id="create-coupon-btn"
            onClick={() => { setShowForm(true); setFormErr(""); }}
            style={{
              padding: "12px 24px", background: "linear-gradient(135deg, #6C63FF, #8b5cf6)",
              color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700,
              fontFamily: "inherit", cursor: "pointer", boxShadow: "0 0 24px rgba(108,99,255,0.45)",
              display: "flex", alignItems: "center", gap: 8,
            }}
          >
            <span style={{ fontSize: 16 }}>＋</span> Create Coupon
          </button>
        </div>

        {/* Stats row */}
        <div
          className="tablet-grid-1"
          style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 16, marginBottom: 32,
          }}
        >
          {[
            { icon: "🏷️", label: "Total Coupons",   value: coupons.length },
            { icon: "✅", label: "Active",           value: coupons.filter((c) => c.active).length },
            { icon: "📊", label: "Total Uses",       value: coupons.reduce((s, c) => s + c.uses, 0) },
          ].map(({ icon, label, value }) => (
            <div
              key={label}
              style={{
                background: "rgba(31,31,40,0.7)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16, padding: "20px",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#c4c0ff", letterSpacing: "-0.02em" }}>{value}</div>
              <div style={{ fontSize: 12, color: "#918fa1", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Coupons table */}
        <div
          style={{
            background: "rgba(31,31,40,0.7)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 20, overflow: "hidden",
          }}
        >
          {/* Table header */}
          <div
            className="coupons-table-header"
            style={{
              display: "grid", gridTemplateColumns: "1fr 120px 120px 100px 80px 140px",
              padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)",
              fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#918fa1",
              textTransform: "uppercase",
            }}
          >
            <span>Code</span><span>Type</span><span>Discount</span><span>Min Order</span><span>Uses</span><span>Actions</span>
          </div>

          {coupons.length === 0 ? (
            <div style={{ padding: "60px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏷️</div>
              <p style={{ color: "#918fa1", margin: 0 }}>No coupons yet. Create your first one!</p>
            </div>
          ) : (
            coupons.map((c, i) => (
              <div
                key={c.id}
                className="hover-table-row coupons-table-row"
                style={{
                  display: "grid", gridTemplateColumns: "1fr 120px 120px 100px 80px 140px",
                  padding: "16px 24px", alignItems: "center",
                  borderBottom: i < coupons.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  transition: "background 0.15s",
                }}
              >
                {/* Code + status */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontFamily: "monospace", fontWeight: 800, fontSize: 15, color: "#e4e1ee",
                      letterSpacing: "0.08em",
                    }}
                  >{c.code}</span>
                  <Badge active={c.active} />
                </div>

                {/* Type */}
                <span style={{ fontSize: 13, color: "#918fa1", fontWeight: 500 }}>
                  {c.type === "percent" ? "Percentage" : "Flat Amount"}
                </span>

                {/* Discount */}
                <span style={{ fontSize: 14, fontWeight: 700, color: "#c4c0ff" }}>
                  {c.type === "percent" ? `${c.value}% off` : `₹${c.value} off`}
                </span>

                {/* Min order */}
                <span style={{ fontSize: 13, color: "#918fa1" }}>
                  {c.minOrder > 0 ? `₹${c.minOrder}+` : "—"}
                </span>

                {/* Uses */}
                <span style={{ fontSize: 13, fontWeight: 600, color: "#c7c4d8" }}>{c.uses}</span>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => toggleActive(c.id)}
                    title={c.active ? "Deactivate" : "Activate"}
                    style={{
                      padding: "6px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                      fontFamily: "inherit", cursor: "pointer", transition: "all 0.15s",
                      background: c.active ? "rgba(255,183,120,0.08)" : "rgba(74,222,128,0.08)",
                      border: `1px solid ${c.active ? "rgba(255,183,120,0.25)" : "rgba(74,222,128,0.25)"}`,
                      color: c.active ? "#ffb785" : "#4ade80",
                    }}
                  >{c.active ? "Pause" : "Enable"}</button>
                  <button
                    onClick={() => setDeleteId(c.id)}
                    title="Delete"
                    style={{
                      width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                      background: "rgba(255,100,100,0.07)", border: "1px solid rgba(255,100,100,0.2)",
                      color: "#f87171", cursor: "pointer", fontSize: 13, transition: "all 0.15s",
                    }}
                  >🗑</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* ── Create Coupon Modal ── */}
      {showForm && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 200,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
        >
          <div
            style={{
              background: "rgba(27,27,36,0.98)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20, padding: "32px 28px", maxWidth: 440, width: "90%",
            }}
          >
            <h3 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700, color: "#e4e1ee" }}>Create Coupon</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Code */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#918fa1", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
                  Coupon Code
                </label>
                <input
                  id="new-coupon-code"
                  type="text"
                  placeholder="e.g. SUMMER25"
                  value={form.code}
                  onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase().replace(/\s/g, "") }))}
                  style={{
                    width: "100%", background: "rgba(14,13,22,0.8)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10, color: "#e4e1ee", fontSize: 14, fontWeight: 700, padding: "11px 14px",
                    outline: "none", fontFamily: "inherit", letterSpacing: "0.08em", boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Type */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#918fa1", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
                  Discount Type
                </label>
                <div style={{ display: "flex", gap: 10 }}>
                  {(["percent", "flat"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm((p) => ({ ...p, type: t }))}
                      style={{
                        flex: 1, padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                        fontFamily: "inherit", cursor: "pointer", transition: "all 0.2s",
                        background: form.type === t ? "rgba(108,99,255,0.25)" : "rgba(255,255,255,0.04)",
                        border: form.type === t ? "1px solid rgba(108,99,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
                        color: form.type === t ? "#c4c0ff" : "#918fa1",
                      }}
                    >{t === "percent" ? "% Percentage" : "₹ Flat Amount"}</button>
                  ))}
                </div>
              </div>

              {/* Value + Min Order */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#918fa1", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
                    {form.type === "percent" ? "Percent (%)" : "Amount (₹)"}
                  </label>
                  <input
                    id="new-coupon-value"
                    type="number" min="1" placeholder={form.type === "percent" ? "10" : "50"}
                    value={form.value}
                    onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
                    style={{
                      width: "100%", background: "rgba(14,13,22,0.8)", border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10, color: "#e4e1ee", fontSize: 14, fontWeight: 600, padding: "11px 14px",
                      outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#918fa1", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
                    Min Order (₹)
                  </label>
                  <input
                    id="new-coupon-min"
                    type="number" min="0" placeholder="0 = no min"
                    value={form.minOrder}
                    onChange={(e) => setForm((p) => ({ ...p, minOrder: e.target.value }))}
                    style={{
                      width: "100%", background: "rgba(14,13,22,0.8)", border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10, color: "#e4e1ee", fontSize: 14, fontWeight: 600, padding: "11px 14px",
                      outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              {formErr && <p style={{ margin: 0, fontSize: 13, color: "#f87171" }}>⚠ {formErr}</p>}

              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    flex: 1, padding: "12px 0", background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e4e1ee",
                    fontSize: 14, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
                  }}
                >Cancel</button>
                <button
                  id="save-coupon-btn"
                  onClick={handleAdd}
                  style={{
                    flex: 1, padding: "12px 0", background: "linear-gradient(135deg, #6C63FF, #8b5cf6)",
                    border: "none", borderRadius: 10, color: "#fff",
                    fontSize: 14, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
                    boxShadow: "0 0 20px rgba(108,99,255,0.4)",
                  }}
                >Create Coupon</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete modal ── */}
      {deleteId && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 200,
          }}
        >
          <div
            style={{
              background: "rgba(27,27,36,0.98)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20, padding: "32px 28px", maxWidth: 340, width: "90%", textAlign: "center",
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#e4e1ee" }}>Delete Coupon?</h3>
            <p style={{ margin: "0 0 24px", color: "#918fa1", fontSize: 14 }}>This cannot be undone.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setDeleteId(null)}
                style={{
                  flex: 1, padding: "11px 0", background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e4e1ee",
                  fontSize: 14, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
                }}
              >Cancel</button>
              <button
                onClick={() => handleDelete(deleteId)}
                style={{
                  flex: 1, padding: "11px 0", background: "rgba(255,100,100,0.15)",
                  border: "1px solid rgba(255,100,100,0.35)", borderRadius: 10, color: "#f87171",
                  fontSize: 14, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
                }}
              >Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      <div
        className="toast-mobile"
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 300,
          transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          transform: toast ? "translateY(0) scale(1)" : "translateY(12px) scale(0.95)",
          opacity: toast ? 1 : 0, pointerEvents: "none",
        }}
      >
        <div
          style={{
            background: "rgba(31,31,40,0.97)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(108,99,255,0.3)", borderRadius: 12, padding: "12px 18px",
            color: "#e4e1ee", fontSize: 14, fontWeight: 500,
            display: "flex", alignItems: "center", gap: 10,
          }}
        >
          <span style={{ color: "#4ade80" }}>✓</span> {toast}
        </div>
      </div>
    </div>
  );
}
