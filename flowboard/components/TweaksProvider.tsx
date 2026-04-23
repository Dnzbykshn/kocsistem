"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface Tweaks {
  accent: string;
  density: "comfortable" | "compact";
  bg: "paper" | "cool" | "dark";
}

const DEFAULTS: Tweaks = {
  accent: "#5B5BF5",
  density: "comfortable",
  bg: "paper",
};

const LS_KEY = "flowboard.tweaks";

function load(): Tweaks {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULTS;
}

interface TweaksCtx {
  tweaks: Tweaks;
  applyTweak: (patch: Partial<Tweaks>) => void;
}

export const TweaksContext = createContext<TweaksCtx>({
  tweaks: DEFAULTS,
  applyTweak: () => {},
});

export function useTweaks() {
  return useContext(TweaksContext);
}

export function TweaksProvider({ children }: { children: React.ReactNode }) {
  const [tweaks, setTweaks] = useState<Tweaks>(DEFAULTS);

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setTweaks(load());
  }, []);

  // Apply to :root + persist whenever tweaks change
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", tweaks.accent);
    root.setAttribute("data-density", tweaks.density);
    root.setAttribute("data-bg", tweaks.bg);
    try { localStorage.setItem(LS_KEY, JSON.stringify(tweaks)); } catch {}
  }, [tweaks]);

  const applyTweak = useCallback((patch: Partial<Tweaks>) => {
    setTweaks((prev) => ({ ...prev, ...patch }));
  }, []);

  return (
    <TweaksContext.Provider value={{ tweaks, applyTweak }}>
      {children}
    </TweaksContext.Provider>
  );
}
