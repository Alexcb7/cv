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
  scrollContainerRef: RefObject<HTMLElement>;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);

  // ribbon refs
  const ribbonWrapRef = useRef<HTMLDivElement | null>(null);
  const ribbonPathRef = useRef<SVGPathElement | null>(null);

  // timeline track (se mueve hacia arriba mientras bajas)
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
    const wrap = ribbonWrapRef.current;
    const path = ribbonPathRef.current;
    const track = trackRef.current;
    if (!section || !wrap || !path || !track) return;

    const scroller = scrollContainerRef.current;

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
      const total = items.length;

      // estado inicial steps
      gsap.set(items, { opacity: 0, y: 30, scale: 0.92, filter: "blur(10px)" });

      // ---- Movimiento del track hacia arriba (así “bajas” encontrándolos) ----
      // Track es más alto que la ventana, lo movemos hacia arriba con scrub.
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

          // ribbon viva (lateral)
          const oscillations = 2.0;
          const s = Math.sin(p * Math.PI * 2 * oscillations);
          const ampX = 220;
          const y = Math.sin(p * Math.PI * 2 * 1.1) * 40;
          const rot = s * 9;

          gsap.to(wrap, {
            x: s * ampX,
            y,
            rotate: rot,
            scale: 1 + Math.abs(s) * 0.06,
            duration: 0.12,
            overwrite: "auto",
            ease: "power2.out",
          });

          // step activo (1 por tramo)
          const idx = Math.min(total - 1, Math.floor(p * total));

          items.forEach((el, i) => {
            const active = i === idx;

            gsap.to(el, {
              opacity: active ? 1 : 0.12,
              y: active ? 0 : 18,
              scale: active ? 1 : 0.96,
              filter: active ? "blur(0px)" : "blur(6px)",
              duration: 0.2,
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
    <section ref={sectionRef} id="technologies" className="relative min-h-[360vh] w-screen bg-black">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center px-6">
        <div className="relative w-full max-w-6xl h-[90vh]">
          {/* title */}
          <div className="absolute inset-x-0 top-6 text-center z-20">
            <h3 className="text-white/90 text-xl md:text-2xl tracking-tight">
              Technologies I use
            </h3>
          </div>

          {/* ribbon */}
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
                d="M 360 30
                   C 430 120, 420 180, 330 250
                   C 240 320, 210 380, 320 490"
                fill="none"
                stroke="#ffffff"
                strokeWidth="30"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* track (alto) que se mueve) */}
          <div
            ref={trackRef}
            className="absolute left-0 right-0 top-24 bottom-10 z-20"
          >
            {/* hacemos el track alto */}
            <div className="relative h-[220vh]">
              {steps.map((t, i) => (
                <TimelineStep
                  key={t.id}
                  side={t.side}
                  label={t.label}
                  icon={t.icon}
                  // cada step a una altura diferente
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