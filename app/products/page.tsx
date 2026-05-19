"use client"

import { useState, useEffect, useMemo } from "react"
import Navbar from "@/components/Navbar"
import ProductCard from "@/components/ProductCard"
import Link from "next/link"
import { Product } from "@/types/product"
import { getAllProducts } from "@/data/product"

const ALL = "All"

interface CartItem extends Product {
  quantity: number;
}

export default function Products() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [toast, setToast] = useState<string | null>(null)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState(ALL)
  const [user, setUser] = useState<{ email: string; role: string } | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        const data = await getAllProducts()
        setAllProducts(data)
      } finally {
        setLoading(false)
      }
    }
    init()

    const storedUser = sessionStorage.getItem("shoplux_user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      
      const fetchCart = async () => {
        try {
          const res = await fetch(`/api/cart?email=${encodeURIComponent(parsedUser.email)}`)
          const data = await res.json()
          if (data.success) {
            setCart(data.data)
          }
        } catch (err) {
          console.error("Failed to fetch cart:", err)
        }
      }
      fetchCart()
    } else {
      const storedCart = localStorage.getItem("shoplux_cart")
      if (storedCart) {
        setCart(JSON.parse(storedCart))
      }
    }
  }, [])

  const isSeller = user?.role === "seller"

  // Derive unique category list from products
  const categories = useMemo(() => {
    const cats = allProducts
      .map((p) => p.category)
      .filter((c): c is string => Boolean(c))
    return [ALL, ...Array.from(new Set(cats))]
  }, [allProducts])

  // Filtered products
  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (p.category ?? "").toLowerCase().includes(search.toLowerCase())
      const matchesCategory =
        activeCategory === ALL || p.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [allProducts, search, activeCategory])

  const syncCart = async (newCart: CartItem[]) => {
    if (!user) {
      localStorage.setItem("shoplux_cart", JSON.stringify(newCart))
      return
    }
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

  const addToCart = (product: Product) => {
    const existing = cart.find((p) => String(p._id || p.id) === String(product._id || product.id))
    if (existing && existing.quantity >= 10) {
      setToast(`You can only add up to 10 of this item!`)
      setTimeout(() => setToast(null), 2500)
      return
    }
    
    let newCart;
    if (existing) {
      newCart = cart.map(p => String(p._id || p.id) === String(product._id || product.id) ? { ...p, quantity: p.quantity + 1 } : p)
    } else {
      newCart = [...cart, { ...product, quantity: 1 }]
    }
    
    setCart(newCart)
    syncCart(newCart)
    setToast(`${product.name} added to cart!`)
    setTimeout(() => setToast(null), 2500)
  }

  const removeFromCart = (productId: number | string) => {
    const existing = cart.find((p) => String(p._id || p.id) === String(productId))
    if (!existing) return
    
    let newCart;
    if (existing.quantity > 1) {
      newCart = cart.map(p => String(p._id || p.id) === String(productId) ? { ...p, quantity: p.quantity - 1 } : p)
    } else {
      newCart = cart.filter((p) => String(p._id || p.id) !== String(productId))
    }
    
    setCart(newCart)
    syncCart(newCart)
  }

  const removeAllFromCart = (productId: number | string) => {
    const newCart = cart.filter((p) => String(p._id || p.id) !== String(productId))
    setCart(newCart)
    syncCart(newCart)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#13121b",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <Navbar />

      {/* Toast */}
      <div
        className="toast-mobile"
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 100,
          transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: toast ? "translateY(0) scale(1)" : "translateY(16px) scale(0.95)",
          opacity: toast ? 1 : 0,
          pointerEvents: toast ? "auto" : "none",
        }}
      >
        <div
          style={{
            background: "rgba(31,31,40,0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(108,99,255,0.3)",
            borderRadius: 12,
            padding: "14px 20px",
            color: "#e4e1ee",
            fontSize: 14,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <span style={{ color: "#4ade80", fontSize: 16 }}>✓</span>
          {toast}
        </div>
      </div>

      <div className="page-container">

        {/* ── Page header ───────────────────────────────────────────────── */}
        <div className="page-header-row">
          <div>
            <h1
              style={{
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                margin: "0 0 6px",
                background: "linear-gradient(135deg, #ffffff, #c4c0ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              All Products
            </h1>
            <p style={{ margin: 0, color: "#918fa1", fontSize: 14 }}>
              {filtered.length} of {allProducts.length} products
              {activeCategory !== ALL && ` in ${activeCategory}`}
              {search && ` matching "${search}"`}
            </p>
          </div>

          {/* Cart badge */}
          {!isSeller && (
            <Link
              href="/cart"
              className="hover-nav-btn"
              style={{
                background: "rgba(31,31,40,0.7)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: "10px 20px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: "#c4c0ff",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </Link>
          )}
        </div>

        {/* ── Search bar ────────────────────────────────────────────────── */}
        <div style={{ position: "relative", marginBottom: 24 }}>
          {/* Search icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#918fa1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: "absolute",
              left: 18,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            id="product-search"
            type="text"
            placeholder="Search products by name, category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 48px 14px 50px",
              background: "rgba(31,31,40,0.7)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              color: "#e4e1ee",
              fontSize: 15,
              fontFamily: "inherit",
              outline: "none",
              backdropFilter: "blur(12px)",
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "rgba(108,99,255,0.5)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
            }
          />

          {/* Clear button */}
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.07)",
                border: "none",
                borderRadius: 6,
                color: "#918fa1",
                fontSize: 13,
                padding: "3px 8px",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* ── Category pills ────────────────────────────────────────────── */}
        {categories.length > 1 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 36,
            }}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  id={`cat-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 999,
                    border: isActive
                      ? "1px solid rgba(108,99,255,0.5)"
                      : "1px solid rgba(255,255,255,0.08)",
                    background: isActive
                      ? "linear-gradient(135deg, rgba(108,99,255,0.3), rgba(139,92,246,0.2))"
                      : "rgba(31,31,40,0.6)",
                    color: isActive ? "#c4c0ff" : "#918fa1",
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    backdropFilter: "blur(8px)",
                    transition: "all 0.18s ease",
                    boxShadow: isActive
                      ? "0 0 16px rgba(108,99,255,0.2)"
                      : "none",
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        )}

        {/* ── Products grid ─────────────────────────────────────────────── */}
        {loading ? (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            minHeight: "300px",
            color: "#c4c0ff",
            fontSize: "18px",
            fontWeight: 600
          }}>
            <div className="loading-spinner" style={{
              width: "40px",
              height: "40px",
              border: "3px solid rgba(108,99,255,0.2)",
              borderTop: "3px solid #6C63FF",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginRight: "15px"
            }}></div>
            Loading products...
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : filtered.length > 0 ? (
          <div className="products-grid">
            {filtered.map((p) => (
              <ProductCard 
                key={p.id} 
                product={p} 
                addToCart={addToCart} 
                removeFromCart={removeFromCart}
                removeAllFromCart={removeAllFromCart}
                cartQuantity={cart.find((item) => String(item._id || item.id) === String(p._id || p.id))?.quantity || 0}
                isSeller={isSeller} 
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 32px",
              background: "rgba(31,31,40,0.4)",
              border: "1px dashed rgba(255,255,255,0.08)",
              borderRadius: 24,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <h3
              style={{
                margin: "0 0 8px",
                fontSize: 20,
                fontWeight: 700,
                color: "#e4e1ee",
              }}
            >
              No products found
            </h3>
            <p style={{ margin: "0 0 24px", color: "#918fa1", fontSize: 14 }}>
              Try a different search term or category.
            </p>
            <button
              onClick={() => { setSearch(""); setActiveCategory(ALL) }}
              style={{
                padding: "10px 24px",
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
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
