"use client";

import React, { forwardRef } from "react";

type RibbonProps = {
  guidePathRef: React.Ref<SVGPathElement>;
  ribbonRef: React.Ref<SVGPathElement>;
  className?: string;
};

/**
 * SOLO PRESENTACIÓN (SVG).
 * Nada de GSAP aquí.
 */
const Ribbon = forwardRef<SVGSVGElement, RibbonProps>(
  ({ guidePathRef, ribbonRef, className = "" }, svgRef) => {
    return (
      <svg
        ref={svgRef}
        className={className}
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
      >
        {/* Path guía (se dibuja con dashoffset) */}
        <path
          ref={guidePathRef}
          d="
            M 140 110
            C 320 60, 470 210, 640 160
            S 980 120, 1020 260
            S 820 430, 650 360
            S 270 330, 250 470
            S 540 650, 840 560
            S 1140 520, 1060 710
          "
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Ribbon (forma simple tipo “cinta/hoja”) */}
        <path
          ref={ribbonRef}
          d="M -22 0 C -10 -20, 10 -20, 22 0 C 10 20, -10 20, -22 0 Z"
          fill="rgba(255,255,255,0.88)"
        />
      </svg>
    );
  }
);

Ribbon.displayName = "Ribbon";
export default Ribbon;