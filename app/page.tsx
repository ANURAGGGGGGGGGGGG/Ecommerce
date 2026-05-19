import Navbar from "@/components/Navbar";
import HeroButtons from "@/components/HeroButtons";
import FeatureCards from "@/components/FeatureCards";
import StatsCounter from "@/components/StatsCounter";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#13121b" }}>
      <Navbar />

      {/* Hero Section */}
      <section
        className="home-section"
        style={{
          padding: "clamp(48px, 8vw, 80px) 32px clamp(40px, 6vw, 64px)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow orbs */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 300,
            background: "radial-gradient(ellipse, rgba(108,99,255,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-block",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#c4c0ff",
              background: "rgba(108,99,255,0.12)",
              border: "1px solid rgba(108,99,255,0.25)",
              padding: "6px 16px",
              borderRadius: 999,
              marginBottom: 24,
            }}
          >
            ✦ New Collection 2026
          </div>

          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 72px)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.04em",
              margin: "0 0 24px",
              background: "linear-gradient(135deg, #ffffff 0%, #c4c0ff 50%, #8781ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Discover Premium
            <br />
            Products
          </h1>

          <p
            style={{
              fontSize: "clamp(15px, 2vw, 18px)",
              color: "#918fa1",
              maxWidth: 520,
              margin: "0 auto 40px",
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            Explore our exclusive collection of handpicked, premium-quality products crafted for the discerning buyer.
          </p>

          <HeroButtons />
        </div>
      </section>

      {/* Stats bar – animated counters */}
      <section
        className="home-section"
        style={{
          marginBottom: 64,
          padding: "0 32px",
        }}
      >
        <StatsCounter />
      </section>

      {/* Features */}
      <section className="home-section" style={{ marginBottom: 80, padding: "0 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2
            style={{
              fontSize: "clamp(24px, 3vw, 32px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#e4e1ee",
              margin: "0 0 12px",
            }}
          >
            Why Choose ShopLux?
          </h2>
          <p style={{ color: "#918fa1", fontSize: 16, margin: 0 }}>
            We deliver an unmatched shopping experience
          </p>
        </div>

        <FeatureCards />
      </section>

      {/* Footer */}
      <footer
        className="home-section"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "32px",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, fontSize: 13, color: "#464555" }}>
          © 2025 ShopLux. All rights reserved. Crafted with ♥
        </p>
      </footer>
    </div>
  );
}