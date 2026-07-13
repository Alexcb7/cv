"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});

export default function SplineScene() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = (window as any).requestIdleCallback(
        () => setReady(true),
        { timeout: 3000 }
      );
      return () => (window as any).cancelIdleCallback(id);
    } else {
      const id = setTimeout(() => setReady(true), 500);
      return () => clearTimeout(id);
    }
  }, []);

  if (!ready) return null;

  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ contain: "strict" }}
    >
      <Spline
        scene="https://prod.spline.design/ciA9LoJBoNucyD0D/scene.splinecode"
        style={{ width: "100%", height: "100%", display: "block" }}
      />
      <div className="absolute bottom-0 right-0 w-64 h-14 bg-black z-10" />
    </div>
  );
}
