"use client";

import React, { useEffect, useMemo, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaReact,
  FaCss3Alt,
  FaGithub,
  FaNodeJs,
  FaGitAlt,
  FaDocker,
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiSupabase,
  SiNextdotjs,
  SiTypescript,
  SiPostgresql,
  SiVercel,
} from "react-icons/si";

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
  const bandRef = useRef<HTMLDivElement | null>(null);

  // 🔥 Más tecnologías alternando lados automáticamente
  const steps: Step[] = useMemo(() => {
    const techs = [
      { id: "react", label: "React", icon: <FaReact /> },
      { id: "next", label: "Next.js", icon: <SiNextdotjs /> },
      { id: "tailwind", label: "Tailwind", icon: <SiTailwindcss /> },
      { id: "ts", label: "TypeScript", icon: <SiTypescript /> },
      { id: "node", label: "Node.js", icon: <FaNodeJs /> },
      { id: "supabase", label: "Supabase", icon: <SiSupabase /> },
      { id: "postgres", label: "PostgreSQL", icon: <SiPostgresql /> },
      { id: "docker", label: "Docker", icon: <FaDocker /> },
      { id: "vercel", label: "Vercel", icon: <SiVercel /> },
      { id: "git", label: "Git", icon: <FaGitAlt /> },
      { id: "css", label: "CSS", icon: <FaCss3Alt /> },
      { id: "github", label: "GitHub", icon: <FaGithub /> },
    ];

    // Alternamos lado automáticamente
    return techs.map((t, i) => ({
      ...t,
      side: i % 2 === 0 ? "left" : "right",
    }));
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const band = bandRef.current;
    const scroller = scrollContainerRef.current;

    if (!section || !band || !scroller) return;

    const ctx = gsap.context(() => {
      // 🎯 Barra movimiento vertical sutil
      gsap.fromTo(
        band,
        { y: -100 },
        {
          y: 100,
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

      const items = gsap.utils.toArray<HTMLElement>("[data-tech-step]");


      gsap.set(items, {
        opacity: 0,
        y: 30,
        x: (i) => (steps[i]?.side === "left" ? -40 : 40),
        scale: 0.95,
        filter: "blur(12px)",
      });

      gsap.to(items, {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        filter: "blur(0px)",
        ease: "power2.out",
        duration: 0.6,
        stagger: 0.7,
        scrollTrigger: {
          trigger: section,
          scroller,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, [scrollContainerRef, steps]);

  return (
    <section
      ref={sectionRef}
      id="tech"
      className="relative min-h-[420vh] w-screen bg-black"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center px-6">
        <div className="relative w-full max-w-6xl h-[85vh]">

          {/* 🔥 Barra central más impactante */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              ref={bandRef}
              className="
                w-[clamp(26px,3.5vw,52px)]
                h-[82vh]
                bg-white
                rounded-full
                shadow-[0_0_90px_rgba(255,255,255,0.45)]
              "
            />
          </div>

          {/* 💎 Steps alternando lado */}
          <div className="absolute inset-0">
            {steps.map((s, index) => (
              <TechStep
                key={s.id}
                index={index}
                side={s.side}
                label={s.label}
                icon={s.icon}
              />
            ))}
          </div>

          {/* Título */}
          <div className="absolute inset-x-0 -top-14 text-center">
            <h3 className="text-white/90 text-xl md:text-2xl tracking-tight">
              Technologies I Use
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}

function TechStep({
  index,
  side,
  label,
  icon,
}: {
  index: number;
  side: "left" | "right";
  label: string;
  icon: React.ReactNode;
}) {
  const topPosition = 14 + index * 7;

  return (
    <div
      data-tech-step
      style={{ top: `${topPosition}%` }}
      className={[
        "absolute",
        side === "left" ? "left-0" : "right-0",
      ].join(" ")}
    >
      <div
        className={[
          "flex items-center gap-8",
          side === "left" ? "justify-start" : "justify-end",
        ].join(" ")}
      >
        {side === "left" ? (
          <>
            <div className="text-[6rem] md:text-[7rem] text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.8)]">
              {icon}
            </div>
            <div className="text-white/90 text-3xl md:text-5xl font-semibold tracking-tight">
              {label}
            </div>
          </>
        ) : (
          <>
            <div className="text-white/90 text-3xl md:text-5xl font-semibold tracking-tight">
              {label}
            </div>
            <div className="text-[6rem] md:text-[7rem] text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.8)]">
              {icon}
            </div>
          </>
        )}
      </div>
    </div>
  );
}