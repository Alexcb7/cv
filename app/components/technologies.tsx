"use client";

import React, { useEffect, useMemo, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaReact, FaCss3Alt, FaGithub } from "react-icons/fa";
import { SiTailwindcss, SiSupabase, SiNextdotjs, SiTypescript } from "react-icons/si";

gsap.registerPlugin(ScrollTrigger);

type Step = {
  id: string;
  label: string;
  icon: React.ReactNode;
  side: "left" | "right";
};

export default function Technologies({
  scrollContainerRef,
}: {
  scrollContainerRef: RefObject<HTMLElement | null>;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const ribbonWrapRef = useRef<HTMLDivElement | null>(null);
  const ribbonPathRef = useRef<SVGPathElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const steps: Step[] = useMemo(
    () => [
      { id: "react", label: "React", icon: <FaReact />, side: "right" },
      { id: "tailwind", label: "Tailwind", icon: <SiTailwindcss />, side: "left" },
      { id: "ts", label: "TypeScript", icon: <SiTypescript />, side: "right" },
      { id: "next", label: "Next.js", icon: <SiNextdotjs />, side: "left" },
      { id: "supabase", label: "Supabase", icon: <SiSupabase />, side: "right" },
      { id: "css", label: "CSS", icon: <FaCss3Alt />, side: "left" },
      { id: "github", label: "GitHub", icon: <FaGithub />, side: "right" },
    ],
    []
  );

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const wrap = ribbonWrapRef.current;
    const path = ribbonPathRef.current;
    const track = trackRef.current;
    if (!section || !wrap || !path || !track) return;

    const scroller = scrollContainerRef.current;

    if (!section || !wrap || !path || !track || !scroller) return;

    const ctx = gsap.context(() => {
      // ---- Ribbon flow (dash) ----
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length * 0.15} ${length * 0.06}`;

      const dashTween = gsap.to(path, {
        strokeDashoffset: -length,
        duration: 2.5,
        ease: "none",
        repeat: -1,
      });

      const items = gsap.utils.toArray<HTMLElement>("[data-tech-step]");

      const revealed = new Set<number>();
      let lastActiveIdx = -1;
      let lastSide: "left" | "right" | null = null;
      let sideSpin = 0;

      gsap.set(items, { opacity: 0, y: 30, scale: 0.92, filter: "blur(10px)" });

      gsap.fromTo(
        track,
        { y: 0 },
        {
          // sube el track (el contenido baja visualmente)
          y: () => -(track.scrollHeight - window.innerHeight * 0.75),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            scroller,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );

      // ---- Master: ribbon viva + step activo según progreso ----
      const master = ScrollTrigger.create({
        trigger: section,
        scroller,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;

          const velocity = self.getVelocity();
          const velN = gsap.utils.clamp(-1, 1, velocity / 1600);
          const velAbs = Math.min(1, Math.abs(velN));

          const oscillations = 2.0;
          const s = Math.sin(p * Math.PI * 2 * oscillations);

          const ampX = gsap.utils.interpolate(240, 520, velAbs);
          const y = Math.sin(p * Math.PI * 2 * 1.1) * 46 + velN * 40;

          let activeEl: HTMLElement | null = null;
          let activeIdx = 0;
          let minDist = Number.POSITIVE_INFINITY;

          const centerY = (() => {
            if (!scroller) return window.innerHeight / 2;
            const r = scroller.getBoundingClientRect();
            return r.top + scroller.clientHeight / 2;
          })();

          for (let i = 0; i < items.length; i++) {
            const rect = items[i].getBoundingClientRect();
            const itemCenterY = rect.top + rect.height / 2;
            const d = Math.abs(itemCenterY - centerY);
            if (d < minDist) {
              minDist = d;
              activeEl = items[i];
              activeIdx = i;
            }
          }

          const canReveal = p >= revealStartProgress;

          const stageRect = stage.getBoundingClientRect();
          const stageCenterX = stageRect.left + stageRect.width / 2;
          const stageCenterY = stageRect.top + stageRect.height / 2;

          let targetX = 0;
          let targetY = 0;

          if (canReveal && activeEl) {
            const r = activeEl.getBoundingClientRect();
            const elCenterX = r.left + r.width / 2;
            const elCenterY = r.top + r.height / 2;
            targetX = elCenterX - stageCenterX;
            targetY = elCenterY - stageCenterY;
          } else {
            const sweepX = Math.sin(p * Math.PI * 2 * 1.25) * (stageRect.width * 0.42);
            const sweepY = Math.cos(p * Math.PI * 2 * 0.85) * (stageRect.height * 0.22);
            targetX = sweepX + velN * (stageRect.width * 0.12);
            targetY = sweepY + velN * (stageRect.height * 0.06);
          }

          const viewportW = scroller ? scroller.clientWidth : window.innerWidth;
          const edge = viewportW * 1.15;
          let edgeX = 0;
          if (p < 0.18) edgeX = gsap.utils.mapRange(0, 0.18, -edge, 0, p);
          else if (p > 0.82) edgeX = gsap.utils.mapRange(0.82, 1, 0, edge, p);

          const side = activeEl?.dataset.side;
          const sideBias = side === "left" ? -1 : 1;
          const bias = side ? sideBias * gsap.utils.interpolate(90, 220, velAbs) : 0;

          const sideNow = side === "left" || side === "right" ? (side as "left" | "right") : null;
          if (sideNow && sideNow !== lastSide) {
            sideSpin += sideNow === "right" ? 1 : -1;
            lastSide = sideNow;
          }

          const sideLean = sideNow ? (sideNow === "left" ? -1 : 1) : 0;
          const rot = sideSpin * 110 + sideLean * 18 + s * 14 + velN * 42;

          setX(targetX + s * ampX + bias + edgeX);
          setY(targetY + y);
          setRot(rot);
          setScale(1.35 + Math.abs(s) * 0.08 + velAbs * 0.14);

          if (canReveal && activeIdx !== lastActiveIdx) {
            const el = items[activeIdx];
            if (el && !revealed.has(activeIdx)) {
              revealed.add(activeIdx);
              gsap.fromTo(
                el,
                { opacity: 0, y: 26, scale: 0.94, filter: "blur(10px)" },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                  duration: 0.45,
                  ease: "power3.out",
                  overwrite: "auto",
                }
              );
            }

          // step activo (1 por tramo)
          const idx = Math.min(total - 1, Math.floor(p * total));

          items.forEach((el, i) => {
            const active = canReveal && i === activeIdx;
            const seen = canReveal && revealed.has(i);

            gsap.to(el, {
              opacity: active ? 1 : seen ? 0.16 : 0,
              y: active ? 0 : seen ? 10 : 18,
              scale: active ? 1 : 0.98,
              filter: active ? "blur(0px)" : seen ? "blur(2px)" : "blur(10px)",
              duration: 0.18,
              overwrite: "auto",
              ease: "power2.out",
            });
          });
        },
      });

      ScrollTrigger.refresh();

      return () => {
        master.kill();
        dashTween.kill();
      };
    }, section);

    return () => ctx.revert();
  }, [scrollContainerRef]);

  return (
    <section
      ref={sectionRef}
      id="technologies"
      className="relative min-h-[360vh] w-screen bg-black"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center px-6">
        <div className="relative w-full max-w-6xl h-[90vh]">
          {/* title */}
          <div className="absolute inset-x-0 top-6 text-center z-20">
            <h3 className="text-white/90 text-xl md:text-2xl tracking-tight">
              Technologies I use
            </h3>
          </div>

          <div
            ref={ribbonWrapRef}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            aria-hidden="true"
          >
            <svg
              width="520"
              height="520"
              viewBox="0 0 520 520"
              className="opacity-95 drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              <path
                ref={ribbonPathRef}
                d="M 380 -220
                   C 520 -60, 520 160, 340 280
                   C 160 400, 160 640, 360 760
                   C 560 880, 520 1120, 320 1240
                   C 120 1360, 120 1560, 360 1700"
                fill="none"
                stroke="#ffffff"
                strokeWidth="30"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div ref={trackRef} className="absolute left-0 right-0 top-24 bottom-10 z-20">
            <div className="relative h-[220vh]">
              {steps.map((t, i) => (
                <TimelineStep
                  key={t.id}
                  side={t.side}
                  label={t.label}
                  icon={t.icon}
                  top={`${i * 30 + 5}%`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineStep({
  side,
  label,
  icon,
  top,
}: {
  side: "left" | "right";
  label: string;
  icon: React.ReactNode;
  top: string;
}) {
  return (
    <div
      data-tech-step
      className={[
        "absolute w-full",
        // altura distinta
      ].join(" ")}
      style={{ top }}
    >
      <div
        className={[
          "flex items-center gap-4",
          side === "left" ? "justify-start" : "justify-end",
        ].join(" ")}
      >
        {side === "left" ? (
          <>
            <div className="text-6xl text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.55)]">
              {icon}
            </div>
            <div className="text-white text-xl md:text-2xl font-medium tracking-tight">
              {label}
            </div>
          </>
        ) : (
          <>
            <div className="text-white text-xl md:text-2xl font-medium tracking-tight">
              {label}
            </div>
            <div className="text-6xl text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.55)]">
              {icon}
            </div>
          </>
        )}
      </div>
    </div>
  );
}