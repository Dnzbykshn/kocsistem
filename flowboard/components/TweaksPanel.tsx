"use client";

import { useEffect, useRef } from "react";
import { useTweaks, Tweaks } from "./TweaksProvider";

const ACCENTS: { v: string; name: string }[] = [
  { v: "#5B5BF5", name: "Indigo" },
  { v: "#E6884E", name: "Amber" },
  { v: "#2E7D6A", name: "Forest" },
  { v: "#C84B7A", name: "Rose" },
  { v: "#141413", name: "Ink" },
];

const DENSITIES: { v: Tweaks["density"]; label: string }[] = [
  { v: "comfortable", label: "Roomy" },
  { v: "compact", label: "Compact" },
];

const BGS: { v: Tweaks["bg"]; label: string }[] = [
  { v: "paper", label: "Paper" },
  { v: "cool", label: "Cool" },
  { v: "dark", label: "Dark" },
];

export function TweaksPanel({ onClose }: { onClose: () => void }) {
  const { tweaks, applyTweak } = useTweaks();
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        bottom: 56,
        left: 10,
        zIndex: 200,
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: 12,
        boxShadow: "var(--shadow-lg)",
        padding: "14px 14px 12px",
        width: 224,
        fontSize: 13,
      }}
    >
      <div
        style={{
          margin: "0 0 12px",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          color: "var(--ink-3)",
        }}
      >
        Appearance
      </div>

      {/* Accent */}
      <label style={labelStyle}>Accent color</label>
      <div style={{ display: "flex", gap: 7, marginBottom: 12 }}>
        {ACCENTS.map((a) => (
          <button
            key={a.v}
            title={a.name}
            onClick={() => applyTweak({ accent: a.v })}
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: a.v,
              cursor: "pointer",
              padding: 0,
              border: "none",
              outline:
                tweaks.accent === a.v
                  ? "2.5px solid var(--ink)"
                  : "2px solid transparent",
              outlineOffset: 2,
            }}
          />
        ))}
      </div>

      {/* Density */}
      <label style={labelStyle}>Density</label>
      <div style={{ ...segWrap, marginBottom: 12 }}>
        {DENSITIES.map((d) => (
          <button
            key={d.v}
            onClick={() => applyTweak({ density: d.v })}
            style={segBtn(tweaks.density === d.v)}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Background */}
      <label style={labelStyle}>Background</label>
      <div style={segWrap}>
        {BGS.map((d) => (
          <button
            key={d.v}
            onClick={() => applyTweak({ bg: d.v })}
            style={segBtn(tweaks.bg === d.v)}
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  color: "var(--ink-3)",
  textTransform: "uppercase",
  letterSpacing: ".06em",
  fontWeight: 600,
  marginBottom: 6,
};

const segWrap: React.CSSProperties = {
  display: "inline-flex",
  background: "var(--surface-2)",
  borderRadius: 8,
  padding: 2,
};

function segBtn(active: boolean): React.CSSProperties {
  return {
    border: 0,
    padding: "4px 11px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
    background: active ? "var(--surface)" : "transparent",
    color: active ? "var(--ink)" : "var(--ink-3)",
    boxShadow: active ? "var(--shadow-sm)" : "none",
    fontWeight: active ? 500 : 400,
  };
}
