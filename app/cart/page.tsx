"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Product } from "@/types/product"

const COUPONS: Record<string, { type: "percent" | "flat"; value: number; label: string }> = {
  SAVE10:  { type: "percent", value: 10,  label: "10% off"      },
  FLAT50:  { type: "flat",    value: 50,  label: "₹50 flat off" },
  LUXE20:  { type: "percent", value: 20,  label: "20% off"      },
}

interface CartItem extends Product {
  quantity: number
}

export default function Cart() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const stored = sessionStorage.getItem("shoplux_user")
    if (!stored) return
    const user = JSON.parse(stored)

    const fetchCart = async () => {
      try {
        const res = await fetch(`/api/cart?email=${encodeURIComponent(user.email)}`)
        const data = await res.json()
        if (data.success) {
          setCartItems(data.data)
        }
      } catch (err) {
        console.error("Failed to fetch cart:", err)
      }
    }
    fetchCart()
  }, [])
  const [couponInput, setCouponInput] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<null | { code: string; type: "percent" | "flat"; value: number; label: string }>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null)

  const syncCart = async (newCart: CartItem[]) => {
    const stored = sessionStorage.getItem("shoplux_user")
    if (!stored) {
      localStorage.setItem("shoplux_cart", JSON.stringify(newCart))
      return
    }
    const user = JSON.parse(stored)
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, cart: newCart }),
      })
    } catch (err) {
      console.error("Failed to sync cart:", err)
    }
  }

  const updateQty = (id: number | string, delta: number) => {
    setCartItems((prev) => {
      const next = prev
        .map((item) =>
          String(item._id || item.id) === String(id) ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
      syncCart(next)
      return next
    })
  }

  const removeItem = (id: number | string) => {
    setCartItems((prev) => {
      const next = prev.filter((item) => String(item._id || item.id) !== String(id))
      syncCart(next)
      return next
    })
  }

  function applyCode() {
    const code = couponInput.trim().toUpperCase()
    if (COUPONS[code]) {
      const c = COUPONS[code]
      setAppliedCoupon({ code, ...c })
      setCouponError(null)
      setCouponSuccess(`Coupon "${code}" applied – ${c.label}!`)
    } else {
      setCouponError("Invalid coupon code. Try SAVE10, FLAT50 or LUXE20.")
      setCouponSuccess(null)
      setAppliedCoupon(null)
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null)
    setCouponInput("")
    setCouponError(null)
    setCouponSuccess(null)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 500 ? 0 : 99
  const taxes = Math.round(subtotal * 0.18)
  const discountAmt = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? Math.round(subtotal * appliedCoupon.value / 100)
      : Math.min(appliedCoupon.value, subtotal)
    : 0
  const total = subtotal + shipping + taxes - discountAmt

  function handleCheckout() {
    if (cartItems.length === 0) return
    const orderData = {
      items: cartItems,
      subtotal,
      shipping,
      taxes,
      discountAmt,
      coupon: appliedCoupon,
      total,
    }
    sessionStorage.setItem("shoplux_order", JSON.stringify(orderData))
    router.push("/checkout")
  }

  return (
    <div style={{ minHeight: "100vh", background: "#13121b" }}>
      <Navbar />

      <div className="page-container">
        {/* Page title */}
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: "0 0 8px",
              background: "linear-gradient(135deg, #ffffff, #c4c0ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Your Cart
          </h1>
          <p style={{ margin: 0, color: "#918fa1", fontSize: 15 }}>
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty state */
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              background: "rgba(31,31,40,0.6)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 24,
            }}
          >
            <div style={{ fontSize: 72, marginBottom: 24, opacity: 0.4 }}>🛒</div>
            <h2 style={{ color: "#e4e1ee", fontSize: 24, fontWeight: 700, margin: "0 0 12px" }}>
              Your cart is empty
            </h2>
            <p style={{ color: "#918fa1", fontSize: 15, margin: "0 0 32px" }}>
              Looks like you haven&apos;t added anything yet.
            </p>
            <Link href="/products" style={{ textDecoration: "none" }}>
              <button
                style={{
                  background: "linear-gradient(135deg, #6C63FF, #8b5cf6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "14px 36px",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 0 24px rgba(108,99,255,0.4)",
                }}
              >
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="cart-grid">
            {/* Cart items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {cartItems.map((item) => (
                <div
                  key={String(item._id || item.id)}
                  className="cart-item-row"
                >
                  {/* Product image placeholder */}
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #2a2933, #35343e)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.image && item.image !== "imagehere" ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }}
                      />
                    ) : (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#464555" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                      </svg>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        margin: "0 0 6px",
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#e4e1ee",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {item.name}
                    </h3>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#c4c0ff",
                      }}
                    >
                      ₹{item.price.toLocaleString()} each
                    </span>
                  </div>

                  {/* Quantity stepper */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0,
                      background: "rgba(14,13,22,0.8)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="hover-cart-item-btn"
                      style={{
                        width: 36,
                        height: 36,
                        background: "transparent",
                        border: "none",
                        color: "#c4c0ff",
                        fontSize: 18,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.15s",
                      }}
                    >
                      −
                    </button>
                    <span
                      style={{
                        width: 36,
                        textAlign: "center",
                        fontWeight: 700,
                        fontSize: 15,
                        color: "#e4e1ee",
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="hover-cart-item-btn"
                      style={{
                        width: 36,
                        height: 36,
                        background: "transparent",
                        border: "none",
                        color: "#c4c0ff",
                        fontSize: 18,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.15s",
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Line total */}
                  <div
                    style={{
                      minWidth: 80,
                      textAlign: "right",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#e4e1ee",
                    }}
                  >
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="hover-remove-btn"
                    style={{
                      background: "rgba(255,80,80,0.08)",
                      border: "1px solid rgba(255,80,80,0.15)",
                      borderRadius: 8,
                      width: 36,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      color: "#ff5050",
                      flexShrink: 0,
                    }}
                    title="Remove item"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div
              className="cart-summary-sticky"
              style={{
                background: "rgba(31,31,40,0.85)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 20,
                padding: "28px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 24px",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#e4e1ee",
                  letterSpacing: "-0.01em",
                }}
              >
                Order Summary
              </h2>

              {/* Coupon Code */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600, color: "#c4c0ff", letterSpacing: "0.04em", textTransform: "uppercase" }}>Coupon Code</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    id="coupon-input"
                    type="text"
                    value={couponInput}
                    onChange={(e) => { setCouponInput(e.target.value); setCouponError(null); setCouponSuccess(null); }}
                    onKeyDown={(e) => e.key === "Enter" && applyCode()}
                    placeholder="Enter code…"
                    disabled={!!appliedCoupon}
                    style={{
                      flex: 1,
                      background: "rgba(14,13,22,0.8)",
                      border: `1px solid ${appliedCoupon ? "rgba(74,222,128,0.35)" : couponError ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.1)"}`,
                      borderRadius: 10,
                      color: "#e4e1ee",
                      fontSize: 13,
                      fontWeight: 600,
                      padding: "9px 12px",
                      outline: "none",
                      fontFamily: "inherit",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      opacity: appliedCoupon ? 0.6 : 1,
                    }}
                  />
                  {appliedCoupon ? (
                    <button
                      onClick={removeCoupon}
                      style={{
                        padding: "9px 12px",
                        background: "rgba(255,80,80,0.1)",
                        border: "1px solid rgba(255,80,80,0.25)",
                        borderRadius: 10,
                        color: "#f87171",
                        fontSize: 13,
                        fontWeight: 700,
                        fontFamily: "inherit",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >✕ Remove</button>
                  ) : (
                    <button
                      id="apply-coupon-btn"
                      onClick={applyCode}
                      style={{
                        padding: "9px 14px",
                        background: "linear-gradient(135deg, rgba(108,99,255,0.3), rgba(139,92,246,0.2))",
                        border: "1px solid rgba(108,99,255,0.4)",
                        borderRadius: 10,
                        color: "#c4c0ff",
                        fontSize: 13,
                        fontWeight: 700,
                        fontFamily: "inherit",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >Apply</button>
                  )}
                </div>
                {couponError && <p style={{ margin: "6px 0 0", fontSize: 12, color: "#f87171" }}>⚠ {couponError}</p>}
                {couponSuccess && <p style={{ margin: "6px 0 0", fontSize: 12, color: "#4ade80" }}>✓ {couponSuccess}</p>}
                <p style={{ margin: "8px 0 0", fontSize: 11, color: "#464555" }}>Try: SAVE10 · FLAT50 · LUXE20</p>
              </div>

              <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 16 }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "Subtotal", value: `₹${subtotal.toLocaleString()}` },
                  { label: "Shipping", value: shipping === 0 ? "Free" : `₹${shipping}` },
                  { label: "GST (18%)", value: `₹${taxes.toLocaleString()}` },
                  ...(discountAmt > 0 ? [{ label: `Discount (${appliedCoupon?.code})`, value: `-₹${discountAmt.toLocaleString()}`, isDiscount: true }] : []),
                ].map(({ label, value, isDiscount }: { label: string; value: string; isDiscount?: boolean }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: isDiscount ? "#4ade80" : "#918fa1", fontSize: 14 }}>{label}</span>
                    <span
                      style={{
                        color: isDiscount ? "#4ade80" : value === "Free" ? "#4ade80" : "#c7c4d8",
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  margin: "20px 0",
                  height: 1,
                  background: "rgba(255,255,255,0.08)",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <span style={{ color: "#e4e1ee", fontSize: 16, fontWeight: 700 }}>Total</span>
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #c4c0ff, #8781ff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    letterSpacing: "-0.02em",
                  }}
                >
                  ₹{total.toLocaleString()}
                </span>
              </div>

              <button
                id="checkout-btn"
                onClick={handleCheckout}
                className="hover-checkout-btn"
                style={{
                  width: "100%",
                  background: "linear-gradient(135deg, #6C63FF, #8b5cf6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "16px",
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  cursor: "pointer",
                  boxShadow: "0 0 24px rgba(108,99,255,0.45)",
                  transition: "all 0.25s ease",
                }}
              >
                Proceed to Checkout →
              </button>

              <Link href="/products" style={{ textDecoration: "none" }}>
                <button
                  className="hover-continue-btn"
                  style={{
                    width: "100%",
                    background: "transparent",
                    color: "#918fa1",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    padding: "12px",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    marginTop: 12,
                    transition: "all 0.2s",
                  }}
                >
                  ← Continue Shopping
                </button>
              </Link>

              {/* Trust badges */}
              <div
                style={{
                  marginTop: 20,
                  paddingTop: 20,
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  justifyContent: "center",
                  gap: 16,
                  color: "#464555",
                  fontSize: 12,
                }}
              >
                <span>🔒 Secure Checkout</span>
                <span>↩️ Easy Returns</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}