"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const result = await res.json();

      if (result.success) {
        // Show success message and redirect to platform
        setSuccessMessage("Account created successfully! Redirecting...");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setError(result.message || "Registration failed.");
        setLoading(false);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#13121b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Background glow orbs */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "20%",
          width: 480,
          height: 480,
          background:
            "radial-gradient(ellipse, rgba(108,99,255,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-5%",
          right: "15%",
          width: 360,
          height: 360,
          background:
            "radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "60%",
          left: "-5%",
          width: 280,
          height: 280,
          background:
            "radial-gradient(ellipse, rgba(196,192,255,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="auth-card"
        style={{
          width: "100%",
          maxWidth: 440,
          background: "rgba(27, 27, 36, 0.75)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 24,
          padding: "40px 36px",
          boxShadow: "0 0 0 1px rgba(108,99,255,0.08), 0 32px 64px rgba(0,0,0,0.4)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: 0 }}>Join ShopLux</h1>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: "#918fa1" }}>Create your account today</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, marginBottom: 12 }}>
            {(["buyer", "seller"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                style={{
                  flex: 1, padding: "8px 0", borderRadius: 9, border: "none", cursor: "pointer",
                  fontSize: 14, fontWeight: 600, transition: "all 0.2s",
                  background: role === r ? "linear-gradient(135deg, #6C63FF, #8b5cf6)" : "transparent",
                  color: role === r ? "#fff" : "#918fa1",
                }}
              >
                {r === "buyer" ? "🛒 Buyer" : "🏪 Seller"}
              </button>
            ))}
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#c7c4d8", marginBottom: 8, textTransform: "uppercase" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "12px", background: "rgba(14,13,22,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#c7c4d8", marginBottom: 8, textTransform: "uppercase" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "12px", paddingRight: "40px", background: "rgba(14,13,22,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "#918fa1",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
          </div>

          {error && <p style={{ color: "#ffb4ab", fontSize: 13, margin: 0, textAlign: "center" }}>{error}</p>}
          {successMessage && <p style={{ color: "#a8ffb2", fontSize: 14, margin: 0, textAlign: "center", fontWeight: 600 }}>{successMessage}</p>}

          <button
            type="submit"
            disabled={loading || !!successMessage}
            style={{
              padding: "14px", background: "linear-gradient(135deg, #6C63FF, #8b5cf6)", color: "#fff",
              border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: (loading || successMessage) ? "not-allowed" : "pointer",
              marginTop: 8, boxShadow: "0 0 24px rgba(108,99,255,0.3)"
            }}
          >
            {loading ? "Creating Account…" : successMessage ? "Success!" : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#918fa1" }}>
          Already have an account? <Link href="/login" style={{ color: "#c4c0ff", textDecoration: "none", fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
