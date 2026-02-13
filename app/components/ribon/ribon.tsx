"use client";

import React, { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  scrollContainerRef: RefObject<HTMLElement>;
  color?: string;
  strokeWidth?: number;
  ampX?: number;
};

export default function Ribbon({
  scrollContainerRef,
  color = "#ffffff",
  strokeWidth = 90,
  ampX = 200,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const path = pathRef.current;
    if (!wrap || !path) return;

    const scroller = scrollContainerRef.current;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: wrap,
        scroller,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;

          // Lateral oscillation — slow, wide, organic
          const sLateral = Math.sin(p * Math.PI * 2 * 1.5);

          // Subtle vertical drift
          const sVertical = Math.sin(p * Math.PI * 2 * 0.8) * 40;

          // Gentle tilt that follows the lateral swing
          const rot = sLateral * 8;

          // Slight breathing scale
          const scl = 1 + Math.abs(sLateral) * 0.05;

          // Path morph: warp the control points as the ribbon swings
          // so the stroke feels alive and not just sliding
          const bendX = sLateral * 60;
          const bendY = p * 30;
          const newD = `
            M ${260 + bendX * 0.3} 20
            C ${380 + bendX} ${100 + bendY},
              ${420 + bendX * 0.5} ${180 - bendY},
              ${300 - bendX * 0.2} ${260}
            C ${160 - bendX * 0.8} ${340 + bendY},
              ${130 - bendX} ${410 - bendY * 0.5},
              ${270 + bendX * 0.4} 500
          `;

          gsap.to(path, {
            attr: { d: newD },
            duration: 0.18,
            overwrite: "auto",
            ease: "power2.out",
          });

          gsap.to(wrap, {
            x: sLateral * ampX,
            y: sVertical,
            rotate: rot,
            scale: scl,
            duration: 0.15,
            overwrite: "auto",
            ease: "power2.out",
          });
        },
      });

      ScrollTrigger.refresh();

      return () => {
        st.kill();
      };
    }, wrap);

    return () => ctx.revert();
  }, [scrollContainerRef, ampX]);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      aria-hidden="true"
    >
      <svg
        width="520"
        height="520"
        viewBox="0 0 520 520"
        className="opacity-90 drop-shadow-[0_0_40px_rgba(255,255,255,0.22)]"
      >
        {/* Glow layer — same path, blurred, lower opacity */}
        <path
          d="M 260 20
             C 380 100, 420 180, 300 260
             C 160 340, 130 410, 270 500"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth * 1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: "blur(18px)", opacity: 0.18 }}
        />

        {/* Main ribbon stroke */}
        <path
          ref={pathRef}
          d="M 260 20
             C 380 100, 420 180, 300 260
             C 160 340, 130 410, 270 500"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}