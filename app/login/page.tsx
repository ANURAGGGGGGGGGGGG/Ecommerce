"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Role = "buyer" | "seller";

// ── Default credentials ──────────────────────────────────────────────────────
const CREDENTIALS: Record<Role, { email: string; password: string }> = {
  buyer: { email: "buyer@shoplux.com", password: "buyer123" },
  seller: { email: "seller@shoplux.com", password: "seller123" },
};

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("buyer");
  const [email, setEmail] = useState(CREDENTIALS.buyer.email);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Switch role and auto-fill email
  function handleRoleSwitch(newRole: Role) {
    setRole(newRole);
    setEmail(CREDENTIALS[newRole].email);
    setPassword("");
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (result.success) {
        const user = result.data;
        // Store user in sessionStorage
        sessionStorage.setItem("shoplux_role", user.role);
        sessionStorage.setItem("shoplux_user", JSON.stringify(user));
        router.push(user.role === "seller" ? "/seller/dashboard" : "/");
      } else {
        setError(result.message || "Invalid email or password.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
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

      {/* Login card */}
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
          boxShadow:
            "0 0 0 1px rgba(108,99,255,0.08), 0 32px 64px rgba(0,0,0,0.4)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span
              style={{
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                background:
                  "linear-gradient(135deg, #ffffff 0%, #c4c0ff 50%, #8781ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ShopLux
            </span>
          </Link>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 14,
              color: "#918fa1",
              fontWeight: 400,
            }}
          >
            Sign in to your account or{" "}
            <Link href="/register" style={{ color: "#c4c0ff", textDecoration: "none", fontWeight: 600 }}>
              create one
            </Link>
          </p>
        </div>

        {/* Success message from registration */}
        {typeof window !== "undefined" && window.location.search.includes("registered=true") && (
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(74,222,128,0.08)",
              border: "1px solid rgba(74,222,128,0.25)",
              borderRadius: 8,
              fontSize: 13,
              color: "#4ade80",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            Account created successfully! Please sign in.
          </div>
        )}

        {/* Role switcher */}
        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: 4,
            marginBottom: 28,
            gap: 4,
          }}
        >
          {(["buyer", "seller"] as Role[]).map((r) => (
            <button
              key={r}
              id={`role-${r}`}
              onClick={() => handleRoleSwitch(r)}
              style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.02em",
                fontFamily: "inherit",
                transition: "all 0.2s ease",
                background:
                  role === r
                    ? "linear-gradient(135deg, #6C63FF, #8b5cf6)"
                    : "transparent",
                color: role === r ? "#fff" : "#918fa1",
                boxShadow:
                  role === r
                    ? "0 0 18px rgba(108,99,255,0.4)"
                    : "none",
              }}
            >
              {r === "buyer" ? "🛒 Buyer" : "🏪 Seller"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Email */}
          <div>
            <label
              htmlFor="login-email"
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#c7c4d8",
                marginBottom: 8,
              }}
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={`${role}@shoplux.com`}
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "rgba(14,13,22,0.8)",
                border: `1px solid ${error ? "rgba(255,100,100,0.4)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 10,
                color: "#e4e1ee",
                fontSize: 15,
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(108,99,255,0.6)";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(108,99,255,0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = error
                  ? "rgba(255,100,100,0.4)"
                  : "rgba(255,255,255,0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="login-password"
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#c7c4d8",
                marginBottom: 8,
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{
                  width: "100%",
                  padding: "12px 44px 12px 14px",
                  background: "rgba(14,13,22,0.8)",
                  border: `1px solid ${error ? "rgba(255,100,100,0.4)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 10,
                  color: "#e4e1ee",
                  fontSize: 15,
                  fontFamily: "inherit",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(108,99,255,0.6)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(108,99,255,0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = error
                    ? "rgba(255,100,100,0.4)"
                    : "rgba(255,255,255,0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                id="toggle-password"
                onClick={() => setShowPassword((p) => !p)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#918fa1",
                  fontSize: 16,
                  padding: 4,
                  lineHeight: 1,
                }}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              style={{
                padding: "10px 14px",
                background: "rgba(255,100,100,0.08)",
                border: "1px solid rgba(255,100,100,0.25)",
                borderRadius: 8,
                fontSize: 13,
                color: "#ffb4ab",
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className={loading ? "" : "hover-btn-primary"}
            style={{
              marginTop: 4,
              padding: "14px",
              background: loading
                ? "rgba(108,99,255,0.5)"
                : "linear-gradient(135deg, #6C63FF, #8b5cf6)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading
                ? "none"
                : "0 0 28px rgba(108,99,255,0.45)",
              transition: "all 0.2s ease",
              letterSpacing: "0.02em",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            margin: "24px 0 20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }}
          />
          <span style={{ fontSize: 12, color: "#464555" }}>
            DEFAULT CREDENTIALS
          </span>
          <div
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }}
          />
        </div>

        {/* Credential hint box */}
        <div
          style={{
            background: "rgba(108,99,255,0.06)",
            border: "1px solid rgba(108,99,255,0.18)",
            borderRadius: 12,
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {(["buyer", "seller"] as Role[]).map((r) => (
            <div
              key={r}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                opacity: role === r ? 1 : 0.45,
                transition: "opacity 0.2s",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#c4c0ff",
                  textTransform: "capitalize",
                  letterSpacing: "0.04em",
                }}
              >
                {r === "buyer" ? "🛒" : "🏪"} {r}
              </span>
              <span style={{ fontSize: 11, color: "#918fa1", fontFamily: "monospace" }}>
                {CREDENTIALS[r].email} /{" "}
                <span style={{ color: "#c4c0ff" }}>
                  {CREDENTIALS[r].password}
                </span>
              </span>
            </div>
          ))}
          <p style={{ margin: 0, fontSize: 11, color: "#464555", marginTop: 4 }}>
            Click a credential row's role to auto-fill the email.
          </p>
        </div>
      </div>
    </div>
  );
}
