"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Link from "next/link"

interface OrderData {
  items: { id: number; name: string; price: number; quantity: number; image?: string }[]
  subtotal: number
  shipping: number
  taxes: number
  discountAmt: number
  coupon: { code: string; label: string } | null
  total: number
}

type PayMethod = "card" | "upi" | "cod"

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "rgba(14,13,22,0.8)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  color: "#e4e1ee",
  fontSize: 14,
  fontWeight: 500,
  padding: "11px 14px",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
}

const LABEL_STYLE: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#918fa1",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  marginBottom: 6,
}

function Field({ label, id, ...props }: { label: string; id: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label htmlFor={id} style={LABEL_STYLE}>{label}</label>
      <input
        id={id}
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e) }}
        style={{
          ...INPUT_STYLE,
          borderColor: focused ? "rgba(108,99,255,0.6)" : "rgba(255,255,255,0.1)",
          boxShadow: focused ? "0 0 0 3px rgba(108,99,255,0.12)" : "none",
        }}
      />
    </div>
  )
}

export default function Checkout() {
  const router = useRouter()
  const [order, setOrder] = useState<OrderData | null>(null)
  const [payMethod, setPayMethod] = useState<PayMethod>("card")
  const [step, setStep] = useState<"form" | "success">("form")
  const [loading, setLoading] = useState(false)

  // Form state
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", address: "", city: "", state: "", pincode: "",
    cardNumber: "", cardExpiry: "", cardCvv: "", upiId: "",
  })
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  useEffect(() => {
    const raw = sessionStorage.getItem("shoplux_order")
    if (raw) setOrder(JSON.parse(raw))
    else router.replace("/cart")
  }, [router])

  function set(field: keyof typeof form, value: string) {
    setForm((p) => ({ ...p, [field]: value }))
    setErrors((p) => ({ ...p, [field]: "" }))
  }

  function validate() {
    const e: Partial<typeof form> = {}
    if (!form.fullName.trim())  e.fullName  = "Required"
    if (!form.email.includes("@")) e.email  = "Valid email required"
    if (form.phone.replace(/\D/g, "").length < 10) e.phone   = "10-digit number required"
    if (!form.address.trim())   e.address   = "Required"
    if (!form.city.trim())      e.city      = "Required"
    if (!form.state.trim())     e.state     = "Required"
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "6-digit pincode"
    if (payMethod === "card") {
      if (form.cardNumber.replace(/\s/g, "").length < 16) e.cardNumber = "16-digit card number"
      if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry))        e.cardExpiry = "MM/YY format"
      if (form.cardCvv.length < 3)                         e.cardCvv    = "3-digit CVV"
    }
    if (payMethod === "upi" && !form.upiId.includes("@")) e.upiId = "Valid UPI ID required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handlePlaceOrder() {
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      sessionStorage.removeItem("shoplux_order")
      setLoading(false)
      setStep("success")
    }, 1800)
  }

  // ── Format card number input ──
  function formatCard(v: string) {
    return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()
  }
  function formatExpiry(v: string) {
    const d = v.replace(/\D/g, "").slice(0, 4)
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d
  }

  if (!order) return null

  // ── Success screen ─────────────────────────────────────────────────────────
  if (step === "success") {
    const orderId = "SL" + Math.floor(100000 + Math.random() * 900000)
    return (
      <div style={{ minHeight: "100vh", background: "#13121b", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
        <Navbar />
        <div className="mobile-px-sm" style={{ maxWidth: 540, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 80, marginBottom: 24, animation: "pop 0.5s ease" }}>🎉</div>
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#4ade80", background: "rgba(74,222,128,0.1)",
              border: "1px solid rgba(74,222,128,0.25)", padding: "4px 14px", borderRadius: 999, marginBottom: 16,
            }}
          >✓ Order Confirmed</div>
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 12px",
              background: "linear-gradient(135deg, #fff, #c4c0ff)", WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}
          >Thank you!</h1>
          <p style={{ color: "#918fa1", fontSize: 15, margin: "0 0 32px", lineHeight: 1.6 }}>
            Your order has been placed successfully.<br />
            We&apos;ll send a confirmation to <strong style={{ color: "#c4c0ff" }}>{form.email}</strong>.
          </p>

          <div
            style={{
              background: "rgba(31,31,40,0.85)", backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.09)", borderRadius: 20, padding: "24px 28px",
              marginBottom: 32, textAlign: "left",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ color: "#918fa1", fontSize: 13 }}>Order ID</span>
              <span style={{ color: "#c4c0ff", fontWeight: 700, fontSize: 13, letterSpacing: "0.04em" }}>{orderId}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ color: "#918fa1", fontSize: 13 }}>Total Paid</span>
              <span style={{ color: "#e4e1ee", fontWeight: 800, fontSize: 16 }}>₹{order.total.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ color: "#918fa1", fontSize: 13 }}>Payment</span>
              <span style={{ color: "#e4e1ee", fontWeight: 600, fontSize: 13 }}>
                {payMethod === "card" ? "💳 Credit / Debit Card" : payMethod === "upi" ? "📲 UPI" : "💵 Cash on Delivery"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#918fa1", fontSize: 13 }}>Delivery to</span>
              <span style={{ color: "#e4e1ee", fontWeight: 600, fontSize: 13 }}>{form.city}, {form.state}</span>
            </div>
          </div>

          <div className="mobile-col" style={{ display: "flex", gap: 12 }}>
            <Link href="/products" style={{ flex: 1, textDecoration: "none" }}>
              <button
                style={{
                  width: "100%", padding: "14px", background: "linear-gradient(135deg, #6C63FF, #8b5cf6)",
                  color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700,
                  fontFamily: "inherit", cursor: "pointer", boxShadow: "0 0 24px rgba(108,99,255,0.45)",
                }}
              >Continue Shopping</button>
            </Link>
            <Link href="/" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "14px 20px", background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
                  color: "#918fa1", fontSize: 14, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
                }}
              >Home</button>
            </Link>
          </div>
        </div>
        <style>{`@keyframes pop { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }`}</style>
      </div>
    )
  }

  // ── Checkout form ──────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#13121b", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <Navbar />

      <div className="page-container" style={{ maxWidth: 1100 }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <Link href="/cart" style={{ textDecoration: "none", color: "#918fa1", fontSize: 13, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            ← Back to Cart
          </Link>
          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 6px",
              background: "linear-gradient(135deg, #ffffff, #c4c0ff)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}
          >Checkout</h1>
          <p style={{ margin: 0, color: "#918fa1", fontSize: 15 }}>Fill in your details to complete your order.</p>
        </div>

        <div className="checkout-grid">
          {/* ── Left column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Shipping info */}
            <Section title="📦 Shipping Information">
              <div className="checkout-form-grid tablet-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Full Name" id="full-name" type="text" placeholder="John Doe"
                    value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
                  {errors.fullName && <Err>{errors.fullName}</Err>}
                </div>
                <div>
                  <Field label="Email" id="email" type="email" placeholder="john@example.com"
                    value={form.email} onChange={(e) => set("email", e.target.value)} />
                  {errors.email && <Err>{errors.email}</Err>}
                </div>
                <div>
                  <Field label="Phone" id="phone" type="tel" placeholder="+91 98765 43210"
                    value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                  {errors.phone && <Err>{errors.phone}</Err>}
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Address" id="address" type="text" placeholder="123 Main Street, Apt 4B"
                    value={form.address} onChange={(e) => set("address", e.target.value)} />
                  {errors.address && <Err>{errors.address}</Err>}
                </div>
                <div>
                  <Field label="City" id="city" type="text" placeholder="Mumbai"
                    value={form.city} onChange={(e) => set("city", e.target.value)} />
                  {errors.city && <Err>{errors.city}</Err>}
                </div>
                <div>
                  <Field label="State" id="state" type="text" placeholder="Maharashtra"
                    value={form.state} onChange={(e) => set("state", e.target.value)} />
                  {errors.state && <Err>{errors.state}</Err>}
                </div>
                <div>
                  <Field label="Pincode" id="pincode" type="text" placeholder="400001" maxLength={6}
                    value={form.pincode} onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))} />
                  {errors.pincode && <Err>{errors.pincode}</Err>}
                </div>
              </div>
            </Section>

            {/* Payment */}
            <Section title="💳 Payment Method">
              {/* Tabs */}
              <div className="payment-tabs" style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                {([["card", "💳 Card"], ["upi", "📲 UPI"], ["cod", "💵 Cash on Delivery"]] as [PayMethod, string][]).map(([id, label]) => (
                  <button
                    key={id}
                    id={`pay-${id}`}
                    onClick={() => setPayMethod(id)}
                    style={{
                      flex: 1, padding: "11px 8px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                      fontFamily: "inherit", cursor: "pointer", transition: "all 0.2s",
                      background: payMethod === id ? "linear-gradient(135deg, rgba(108,99,255,0.3), rgba(139,92,246,0.2))" : "rgba(255,255,255,0.03)",
                      border: payMethod === id ? "1px solid rgba(108,99,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
                      color: payMethod === id ? "#c4c0ff" : "#918fa1",
                    }}
                  >{label}</button>
                ))}
              </div>

              {/* Card fields */}
              {payMethod === "card" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <Field label="Card Number" id="card-number" type="text" placeholder="1234 5678 9012 3456" maxLength={19}
                      value={form.cardNumber} onChange={(e) => set("cardNumber", formatCard(e.target.value))} />
                    {errors.cardNumber && <Err>{errors.cardNumber}</Err>}
                  </div>
                  <div className="checkout-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <Field label="Expiry" id="card-expiry" type="text" placeholder="MM/YY" maxLength={5}
                        value={form.cardExpiry} onChange={(e) => set("cardExpiry", formatExpiry(e.target.value))} />
                      {errors.cardExpiry && <Err>{errors.cardExpiry}</Err>}
                    </div>
                    <div>
                      <Field label="CVV" id="card-cvv" type="password" placeholder="•••" maxLength={4}
                        value={form.cardCvv} onChange={(e) => set("cardCvv", e.target.value.replace(/\D/g, ""))} />
                      {errors.cardCvv && <Err>{errors.cardCvv}</Err>}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
                      background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: 10,
                    }}
                  >
                    <span style={{ fontSize: 14 }}>🔒</span>
                    <span style={{ fontSize: 12, color: "#918fa1" }}>Your card details are encrypted and secure.</span>
                  </div>
                </div>
              )}

              {/* UPI */}
              {payMethod === "upi" && (
                <div>
                  <Field label="UPI ID" id="upi-id" type="text" placeholder="yourname@upi"
                    value={form.upiId} onChange={(e) => set("upiId", e.target.value)} />
                  {errors.upiId && <Err>{errors.upiId}</Err>}
                  <p style={{ margin: "10px 0 0", fontSize: 12, color: "#464555" }}>Supported: GPay, PhonePe, Paytm, BHIM</p>
                </div>
              )}

              {/* COD */}
              {payMethod === "cod" && (
                <div
                  style={{
                    padding: "20px", background: "rgba(255,183,120,0.06)",
                    border: "1px solid rgba(255,183,120,0.2)", borderRadius: 14, textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 10 }}>💵</div>
                  <p style={{ margin: 0, color: "#c7c4d8", fontSize: 14, lineHeight: 1.6 }}>
                    Pay with cash when your order is delivered.<br />
                    <span style={{ color: "#ffb785", fontWeight: 600 }}>₹{order.total.toLocaleString()}</span> will be collected at your doorstep.
                  </p>
                </div>
              )}
            </Section>
          </div>

          {/* ── Right column: Order Review ── */}
          <div
            className="cart-summary-sticky"
            style={{
              background: "rgba(31,31,40,0.85)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 20,
              padding: "28px",
            }}
          >
            <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: "#e4e1ee", letterSpacing: "-0.01em" }}>
              Order Review
            </h2>

            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
              {order.items.map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 44, height: 44, borderRadius: 10, flexShrink: 0, overflow: "hidden",
                      background: "linear-gradient(135deg, #2a2933, #35343e)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {item.image && item.image !== "imagehere" ? (
                      <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : <span style={{ fontSize: 18, color: "#464555" }}>📦</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#e4e1ee", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#918fa1" }}>× {item.quantity}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#c4c0ff", flexShrink: 0 }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 16 }} />

            {/* Totals */}
            <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 20 }}>
              {[
                { label: "Subtotal",   value: `₹${order.subtotal.toLocaleString()}` },
                { label: "Shipping",   value: order.shipping === 0 ? "Free" : `₹${order.shipping}` },
                { label: "GST (18%)", value: `₹${order.taxes.toLocaleString()}` },
                ...(order.discountAmt > 0
                  ? [{ label: `Coupon (${order.coupon?.code})`, value: `-₹${order.discountAmt.toLocaleString()}`, isDiscount: true }]
                  : []),
              ].map(({ label, value, isDiscount }: { label: string; value: string; isDiscount?: boolean }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: isDiscount ? "#4ade80" : "#918fa1" }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isDiscount ? "#4ade80" : value === "Free" ? "#4ade80" : "#c7c4d8" }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 16 }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <span style={{ color: "#e4e1ee", fontSize: 15, fontWeight: 700 }}>Total</span>
              <span
                style={{
                  fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em",
                  background: "linear-gradient(135deg, #c4c0ff, #8781ff)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}
              >₹{order.total.toLocaleString()}</span>
            </div>

            <button
              id="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={loading}
              style={{
                width: "100%", padding: "16px",
                background: loading ? "rgba(108,99,255,0.4)" : "linear-gradient(135deg, #6C63FF, #8b5cf6)",
                color: "#fff", border: "none", borderRadius: 12,
                fontSize: 15, fontWeight: 700, letterSpacing: "0.02em", fontFamily: "inherit",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 0 24px rgba(108,99,255,0.45)",
                transition: "all 0.25s ease",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                  Processing…
                </>
              ) : "Place Order →"}
            </button>

            <div
              style={{
                marginTop: 16, display: "flex", justifyContent: "center", gap: 16,
                color: "#464555", fontSize: 11,
              }}
            >
              <span>🔒 SSL Encrypted</span>
              <span>↩️ Easy Returns</span>
              <span>✓ Trusted Store</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #464555; }
      `}</style>
    </div>
  )
}

// ── Helper sub-components ──────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="checkout-section"
      style={{
        background: "rgba(31,31,40,0.75)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px 28px",
      }}
    >
      <h2 style={{ margin: "0 0 24px", fontSize: 17, fontWeight: 700, color: "#e4e1ee", letterSpacing: "-0.01em" }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

function Err({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: "5px 0 0", fontSize: 12, color: "#f87171" }}>⚠ {children}</p>
}
