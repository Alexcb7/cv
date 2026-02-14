"use client";

import React, { useLayoutEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  scrollContainerRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLElement | null>;
  color?: string;
  strokeWidth?: number;
  ampX?: number;
};

export default function Ribbon({
  scrollContainerRef,
  triggerRef,
  color = "#ffffff",
  strokeWidth = 90,
  ampX = 260,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const glowPathRef = useRef<SVGPathElement | null>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const path = pathRef.current;
    const glowPath = glowPathRef.current;
    const scroller = scrollContainerRef.current;
    const trigger = triggerRef.current;

    if (!wrap || !path || !glowPath || !scroller || !trigger) return;

    // ── Dash flow ─────────────────────────────────────────────────────────────
    const totalLen = path.getTotalLength();
    const dashArr = `${totalLen * 0.12} ${totalLen * 0.07}`;
    path.style.strokeDasharray = dashArr;
    glowPath.style.strokeDasharray = dashArr;

    const dashTween = gsap.to([path, glowPath], {
      strokeDashoffset: -totalLen,
      duration: 2.8,
      ease: "none",
      repeat: -1,
    });

    // ── Quick setters — GPU only, zero reflow ─────────────────────────────────
    const setX   = gsap.quickSetter(wrap, "x",        "px");
    const setY   = gsap.quickSetter(wrap, "y",        "px");
    const setRot = gsap.quickSetter(wrap, "rotation", "deg");
    const setScl = gsap.quickSetter(wrap, "scale");

    // ── Cache item positions — rebuilt on resize, NOT every scroll frame ──────
    let itemRects: { cx: number; cy: number; side: string }[] = [];
    let wrapCX = 0;
    let wrapCY = 0;
    let scrollerH = 0;
    let scrollerW = 0;

    const cacheRects = () => {
      const items = trigger.querySelectorAll<HTMLElement>("[data-tech-step]");
      itemRects = Array.from(items).map((el) => {
        const r = el.getBoundingClientRect();
        return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, side: el.dataset.side ?? "right" };
      });
      const wr = wrap.getBoundingClientRect();
      wrapCX    = wr.left + wr.width  / 2;
      wrapCY    = wr.top  + wr.height / 2;
      scrollerH = scroller.clientHeight;
      scrollerW = scroller.clientWidth;
    };

    requestAnimationFrame(cacheRects);

    const ro = new ResizeObserver(cacheRects);
    ro.observe(scroller);
    ro.observe(trigger);

    // ── State ─────────────────────────────────────────────────────────────────
    let lastSide: string | null = null;
    let sideSpin = 0;

    // ── Path morph — skip if coords haven't moved (avoids SVG reflow spam) ────
    let lastMorphKey = "";
    const morphPath = (s: number, velN: number, p: number) => {
      const bx  = ~~(s * 70 + velN * 50);
      const by  = ~~(p * 40 + velN * 30);
      const key = `${bx},${by}`;
      if (key === lastMorphKey) return;
      lastMorphKey = key;
      const d = `M ${260 + bx * 0.3} -40 C ${400 + bx} ${60 + by},${460 + bx * 0.5} ${200 - by * 0.7},${310 - bx * 0.2} 290 C ${150 - bx * 0.8} ${380 + by},${100 - bx} ${490 - by * 0.5},${290 + bx * 0.4} 580`;
      path.setAttribute("d", d);
      glowPath.setAttribute("d", d);
    };

    // ── ScrollTrigger ─────────────────────────────────────────────────────────
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger,
        scroller,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p      = self.progress;
          const vel    = self.getVelocity();
          const velN   = gsap.utils.clamp(-1, 1, vel / 1800);
          const velAbs = Math.min(1, Math.abs(velN));

          const s       = Math.sin(p * Math.PI * 4);
          const yWobble = Math.sin(p * Math.PI * 2.2) * 46 + velN * 38;

          // Closest item — cheap, only cached cy values, no DOM reads
          const scrollerTop = scroller.getBoundingClientRect().top;
          const centerY     = scrollerTop + scrollerH / 2;
          let activeIdx     = 0;
          let minDist       = Infinity;
          for (let i = 0; i < itemRects.length; i++) {
            const d = Math.abs(itemRects[i].cy - centerY);
            if (d < minDist) { minDist = d; activeIdx = i; }
          }

          const activeItem = itemRects[activeIdx];
          const sideNow    = activeItem?.side ?? null;

          if (sideNow && sideNow !== lastSide) {
            sideSpin += sideNow === "right" ? 1 : -1;
            lastSide  = sideNow;
          }

          const sideLean = sideNow === "left" ? -1 : sideNow === "right" ? 1 : 0;
          const rot      = sideSpin * 110 + sideLean * 18 + s * 14 + velN * 42;

          // Target
          let targetX = 0;
          let targetY = 0;
          if (p >= 0.06 && activeItem) {
            targetX = activeItem.cx - wrapCX;
            targetY = activeItem.cy - wrapCY;
          } else {
            targetX = Math.sin(p * Math.PI * 2.5) * scrollerW * 0.4;
            targetY = Math.cos(p * Math.PI * 1.7) * scrollerH * 0.2;
          }

          // Edge push
          let edgeX = 0;
          if      (p < 0.18) edgeX = gsap.utils.mapRange(0, 0.18,  -scrollerW * 1.1, 0, p);
          else if (p > 0.82) edgeX = gsap.utils.mapRange(0.82, 1,   0, scrollerW * 1.1, p);

          const sideBias = sideNow ? sideLean * gsap.utils.interpolate(90, 200, velAbs) : 0;

          setX(targetX + s * ampX + sideBias + edgeX);
          setY(targetY + yWobble);
          setRot(rot);
          setScl(1.35 + Math.abs(s) * 0.08 + velAbs * 0.14);

          morphPath(s, velN, p);
        },
      });

      ScrollTrigger.refresh();
      return () => { st.kill(); dashTween.kill(); ro.disconnect(); };
    }, wrap);

    return () => ctx.revert();
  }, [scrollContainerRef, triggerRef, ampX]);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 will-change-transform"
      aria-hidden="true"
    >
      <svg
        width="540"
        height="600"
        viewBox="0 0 540 600"
        className="overflow-visible"
      >
        <path
          ref={glowPathRef}
          d="M 260 -40 C 400 60,460 200,310 290 C 150 380,100 490,290 580"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth * 1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: "blur(22px)", opacity: 0.15 }}
        />
        <path
          ref={pathRef}
          d="M 260 -40 C 400 60,460 200,310 290 C 150 380,100 490,290 580"
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