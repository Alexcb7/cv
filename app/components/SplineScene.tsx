"use client";

import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});

export default function SplineScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Spline
        scene="https://prod.spline.design/ciA9LoJBoNucyD0D/scene.splinecode"
        className="h-full w-full"
      />
    </div>
  );
}
