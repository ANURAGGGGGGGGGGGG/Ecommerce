"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  target: number;
  suffix: string;
  label: string;
  icon: string;
  prefix?: string;
  decimals?: number;
}

const STATS: Stat[] = [
  { icon: "😊", target: 10,  suffix: "K+",  label: "Happy Customers",  decimals: 0 },
  { icon: "📦", target: 500, suffix: "+",   label: "Premium Products", decimals: 0 },
  { icon: "⭐", target: 4.9, suffix: "★",   label: "Average Rating",   decimals: 1 },
];

function useCountUp(target: number, decimals: number, active: boolean, duration = 2500) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [active, target, duration, decimals]);

  return count;
}

function CounterCard({ stat, active, index }: { stat: Stat; active: boolean; index: number }) {
  const count = useCountUp(stat.target, stat.decimals ?? 0, active);

  const displayValue =
    stat.decimals && stat.decimals > 0
      ? count.toFixed(stat.decimals)
      : Math.floor(count).toLocaleString();

  return (
    <div
      className="hover-stat-card"
      style={{
        textAlign: "center",
        padding: "32px 24px",
        borderRight: index < STATS.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
        position: "relative",
        cursor: "default",
      }}
    >
      {/* Hover glow */}
      <div
        className="stat-glow"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(108,99,255,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          borderRadius: "inherit",
        }}
      />

      {/* Icon */}
      <div
        className="stat-icon"
        style={{
          fontSize: 28,
          marginBottom: 12,
          display: "inline-block",
        }}
      >
        {stat.icon}
      </div>

      {/* Animated number */}
      <div
        className="stat-number"
        style={{
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          marginBottom: 8,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {(stat.prefix ?? "")}{displayValue}{stat.suffix}
      </div>

      {/* Label */}
      <div
        className="stat-label"
        style={{
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "0.02em",
        }}
      >
        {stat.label}
      </div>

      {/* Bottom accent line */}
      <div
        className="stat-line"
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          width: "60%",
          height: 2,
          background: "linear-gradient(90deg, transparent, #8781ff, transparent)",
          borderRadius: 999,
        }}
      />
    </div>
  );
}

export default function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect(); // fire once
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div
        className="mobile-grid-1"
        style={{
          background: "rgba(31,31,40,0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Top gradient shine */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(108,99,255,0.6), transparent)",
            pointerEvents: "none",
          }}
        />

        {STATS.map((stat, i) => (
          <CounterCard key={stat.label} stat={stat} active={active} index={i} />
        ))}
      </div>
    </div>
  );
}
