"use client"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("shoplux_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.email === "string" && typeof parsed.role === "string") {
          setUser(parsed);
        }
      } catch (error) {
        console.error("Failed to parse user from session storage:", error);
      }
    }
  }, []);

  function handleLogout() {
    sessionStorage.removeItem("shoplux_role");
    sessionStorage.removeItem("shoplux_user");
    setUser(null);
    setIsMenuOpen(false);
    router.push("/login");
  }

  const isSeller = user?.role === "seller";

  const links = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/products", label: "Products", icon: "🛍️" },
    ...(!isSeller ? [{ href: "/cart", label: "Cart", icon: "🛒" }] : []),
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(19, 18, 27, 0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="nav-inner">
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                background: "linear-gradient(135deg, #ffffff 0%, #c4c0ff 60%, #8781ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ShopLux
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="desktop-only" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {links.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={isActive ? "" : "hover-nav-item"}
                  style={{
                    textDecoration: "none",
                    padding: "8px 16px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    color: isActive ? "#c4c0ff" : "#918fa1",
                    background: isActive ? "rgba(108, 99, 255, 0.12)" : "transparent",
                    border: isActive ? "1px solid rgba(108,99,255,0.3)" : "1px solid transparent",
                    transition: "all 0.2s ease",
                  }}
                >
                  {label}
                </Link>
              );
            })}
            {user?.role === "seller" && (
              <Link
                href="/seller/dashboard"
                id="navbar-dashboard"
                style={{
                  textDecoration: "none",
                  padding: "8px 16px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  color: pathname.startsWith("/seller") ? "#c4c0ff" : "#918fa1",
                  background: pathname.startsWith("/seller") ? "rgba(108,99,255,0.12)" : "transparent",
                  border: pathname.startsWith("/seller") ? "1px solid rgba(108,99,255,0.3)" : "1px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                📊 Dashboard
              </Link>
            )}
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#c4c0ff",
                    background: "rgba(108,99,255,0.12)",
                    border: "1px solid rgba(108,99,255,0.25)",
                    padding: "4px 12px",
                    borderRadius: 999,
                    letterSpacing: "0.06em",
                    textTransform: "capitalize",
                  }}
                >
                  {user.role === "seller" ? "🏪" : "🛒"} {user.role}
                </span>
                <button
                  id="navbar-logout"
                  onClick={handleLogout}
                  style={{
                    padding: "7px 14px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    color: "#918fa1",
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    letterSpacing: "0.02em",
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                id="navbar-login"
                style={{
                  textDecoration: "none",
                  padding: "8px 18px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  background: "linear-gradient(135deg, #6C63FF, #8b5cf6)",
                  color: "#fff",
                  boxShadow: "0 0 16px rgba(108,99,255,0.35)",
                }}
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Hamburger Button (Mobile only) */}
          <button
            className="mobile-only"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 5,
              background: "rgba(108,99,255,0.1)",
              border: "1px solid rgba(108,99,255,0.25)",
              borderRadius: 10,
              padding: "10px 12px",
              cursor: "pointer",
            }}
          >
            <span style={{ display: "block", width: 20, height: 2, background: "#c4c0ff", borderRadius: 2 }} />
            <span style={{ display: "block", width: 14, height: 2, background: "#c4c0ff", borderRadius: 2 }} />
            <span style={{ display: "block", width: 20, height: 2, background: "#c4c0ff", borderRadius: 2 }} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isMenuOpen && (
        <div
          onClick={closeMenu}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 98,
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "82vw",
          maxWidth: 340,
          background: "rgba(19, 18, 27, 0.97)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          borderRight: "1px solid rgba(255,255,255,0.09)",
          zIndex: 99,
          display: "flex",
          flexDirection: "column",
          padding: "0",
          transform: isMenuOpen ? "translateX(0)" : "translateX(-110%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: isMenuOpen ? "8px 0 40px rgba(0,0,0,0.6), 0 0 80px rgba(108,99,255,0.08)" : "none",
          overflowY: "auto",
        }}
      >
        {/* Top glow line */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent, rgba(108,99,255,0.7), transparent)",
          pointerEvents: "none",
        }} />

        {/* Drawer Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 20px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #ffffff 0%, #c4c0ff 60%, #8781ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ShopLux
          </span>
          <button
            onClick={closeMenu}
            aria-label="Close menu"
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#918fa1",
              fontSize: 18,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* User Profile Card */}
        {user && (
          <div
            style={{
              margin: "16px 16px 0",
              padding: "14px 16px",
              background: "rgba(108,99,255,0.08)",
              border: "1px solid rgba(108,99,255,0.2)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6C63FF, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                flexShrink: 0,
                boxShadow: "0 0 16px rgba(108,99,255,0.4)",
              }}
            >
              {user.role === "seller" ? "🏪" : "🛒"}
            </div>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#c4c0ff", textTransform: "capitalize", letterSpacing: "0.06em" }}>
                {user.role}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#918fa1",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  marginTop: 2,
                }}
              >
                {user.email}
              </div>
            </div>
            {/* Badge */}
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#4ade80",
                background: "rgba(74,222,128,0.12)",
                border: "1px solid rgba(74,222,128,0.3)",
                padding: "3px 8px",
                borderRadius: 999,
                letterSpacing: "0.08em",
                whiteSpace: "nowrap",
              }}
            >
              Active
            </span>
          </div>
        )}

        {/* Nav Links */}
        <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#464555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8, paddingLeft: 4 }}>
            Navigation
          </div>

          {links.map(({ href, label, icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "13px 16px",
                  borderRadius: 12,
                  textDecoration: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  color: isActive ? "#fff" : "#918fa1",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(108,99,255,0.35), rgba(139,92,246,0.2))"
                    : "rgba(255,255,255,0.03)",
                  border: isActive ? "1px solid rgba(108,99,255,0.4)" : "1px solid rgba(255,255,255,0.05)",
                  boxShadow: isActive ? "0 0 20px rgba(108,99,255,0.15)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                {label}
                {isActive && (
                  <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#c4c0ff", boxShadow: "0 0 8px rgba(196,192,255,0.8)" }} />
                )}
              </Link>
            );
          })}

          {/* Seller Dashboard link */}
          {user?.role === "seller" && (
            <>
              <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "8px 0" }} />
              <div style={{ fontSize: 10, fontWeight: 700, color: "#464555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8, paddingLeft: 4 }}>
                Seller Tools
              </div>
              {[
                { href: "/seller/dashboard", label: "Dashboard", icon: "📊" },
                { href: "/seller/products", label: "My Products", icon: "📦" },
                { href: "/seller/add-product", label: "Add Product", icon: "➕" },
                { href: "/seller/coupons", label: "Coupons", icon: "🏷️" },
              ].map(({ href, label, icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMenu}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "12px 16px",
                      borderRadius: 12,
                      textDecoration: "none",
                      fontSize: 14,
                      fontWeight: 600,
                      color: isActive ? "#fff" : "#918fa1",
                      background: isActive
                        ? "linear-gradient(135deg, rgba(108,99,255,0.35), rgba(139,92,246,0.2))"
                        : "rgba(255,255,255,0.03)",
                      border: isActive ? "1px solid rgba(108,99,255,0.4)" : "1px solid rgba(255,255,255,0.05)",
                      boxShadow: isActive ? "0 0 20px rgba(108,99,255,0.15)" : "none",
                    }}
                  >
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                    {label}
                  </Link>
                );
              })}
            </>
          )}
        </div>

        {/* Bottom Auth Section */}
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {user ? (
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "13px 16px",
                background: "rgba(255,100,100,0.08)",
                border: "1px solid rgba(255,100,100,0.2)",
                borderRadius: 12,
                color: "#f87171",
                fontSize: 15,
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <span>🚪</span> Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              onClick={closeMenu}
              style={{
                display: "block",
                textDecoration: "none",
                padding: "13px 16px",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                textAlign: "center",
                background: "linear-gradient(135deg, #6C63FF, #8b5cf6)",
                color: "#fff",
                boxShadow: "0 0 24px rgba(108,99,255,0.4)",
              }}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </>
  );
}