"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaReact, FaCss3Alt, FaJsSquare } from "react-icons/fa";
import {
  SiTailwindcss,
  SiSupabase,
  SiNextdotjs,
  SiTypescript,
} from "react-icons/si";

gsap.registerPlugin(ScrollTrigger);

type Step = {
  id: string;
  label: string;
  description: string;
  years: string;
  icon: React.ReactNode;
  side: "left" | "right";
  color: string;
};

export default function Technologies({
  scrollContainerRef,
}: {
  scrollContainerRef: RefObject<HTMLElement | null>;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bandWrapRef = useRef<HTMLDivElement | null>(null);
  const bandRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  const steps: Step[] = useMemo(() => {
    const techs = [
      {
        id: "react",
        label: "React",
        description: "UI components & state management",
        years: "1 yrs",
        icon: <FaReact />,
        color: "#61DAFB",
      },
      {
        id: "next",
        label: "Next.js",
        description: "SSR, routing & full-stack apps",
        years: "1 yrs",
        icon: <SiNextdotjs />,
        color: "#ffffff",
      },
      {
        id: "ts",
        label: "TypeScript",
        description: "Static typing & safer codebases",
        years: "1 yrs",
        icon: <SiTypescript />,
        color: "#3178C6",
      },
      {
        id: "js",
        label: "JavaScript",
        description: "Core language, async patterns, DOM",
        years: "2 yrs",
        icon: <FaJsSquare />,
        color: "#F7DF1E",
      },
      {
        id: "css",
        label: "CSS",
        description: "Animations, layouts & custom design",
        years: "2 yrs",
        icon: <FaCss3Alt />,
        color: "#1572B6",
      },
      {
        id: "tailwind",
        label: "Tailwind",
        description: "Utility-first rapid styling",
        years: "1 yrs",
        icon: <SiTailwindcss />,
        color: "#38BDF8",
      },
      {
        id: "supabase",
        label: "Supabase",
        description: "Auth, database & realtime backend",
        years: "1 yr",
        icon: <SiSupabase />,
        color: "#3ECF8E",
      },
    ];

    return techs.map((t, i) => ({
      ...t,
      side: i % 2 === 0 ? ("left" as const) : ("right" as const),
    }));
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const bandWrap = bandWrapRef.current;
    const band = bandRef.current;
    const line = lineRef.current;
    const scroller = scrollContainerRef.current;

    if (!section || !bandWrap || !band || !scroller) return;

    const ctx = gsap.context(() => {
      // bandWrap is sticky via CSS — no JS position toggling needed (zero CLS)

      // Movimiento sutil vertical de la barra
      gsap.fromTo(
        band,
        { y: -60 },
        {
          y: 60,
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

      // Línea de timeline crece con el scroll
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              scroller,
              start: "top 80%",
              end: "bottom 20%",
              scrub: true,
            },
          }
        );
      }

      // ✅ Animación igual que el original — se anima [data-tech-content] entero (icono+texto)
      // El dot e index se animan por separado sin x para no romper su posición absoluta
      const rows = gsap.utils.toArray<HTMLElement>("[data-tech-step]");

      rows.forEach((row) => {
        const isLeft = row.classList.contains("justify-start");
        const fromX = isLeft ? -80 : 80;

        const content  = row.querySelector<HTMLElement>("[data-tech-content]");
        const label    = row.querySelector<HTMLElement>("[data-tech-label]");
        const dot      = row.querySelector<HTMLElement>("[data-tech-dot]");
        const indexNum = row.querySelector<HTMLElement>("[data-tech-index]");

        // Estado inicial — sin blur (costoso para GPU)
        if (content)  gsap.set(content,  { opacity: 0, x: fromX, y: 8 });
        if (label)    gsap.set(label,    { opacity: 0, y: 6 });
        if (dot)      gsap.set(dot,      { scale: 0, opacity: 0 });
        if (indexNum) gsap.set(indexNum, { opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            scroller,
            start: "top 85%",
            end: "top 35%",
            scrub: true,
          },
        });

        if (content)  tl.to(content,  { opacity: 1, x: 0, y: 0, ease: "power2.out" });
        if (label)    tl.to(label,    { opacity: 1, y: 0, ease: "power2.out" }, 0.08);
        if (dot)      tl.to(dot,      { scale: 1, opacity: 1, ease: "back.out(1.7)" }, 0.1);
        if (indexNum) tl.to(indexNum, { opacity: 1, ease: "none" }, 0.15);
      });

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, [scrollContainerRef]);

  return (
    <section
      ref={sectionRef}
      id="tech"
      className="relative w-screen bg-black py-28"
    >
      {/* Barra flotante — sticky en vez de JS fixed/absolute (zero CLS) */}
      <div
        ref={bandWrapRef}
        className="pointer-events-none sticky top-0 inset-x-0 z-20 h-0"
      >
        <div className="relative h-screen">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              ref={bandRef}
              className="
                w-[clamp(14px,1.9vw,12px)]
                h-[12vh]
                rounded-full
                bg-gradient-to-b from-white via-white/90 to-white/70
                shadow-[0_0_60px_rgba(255,255,255,0.35)]
              "
            />
          </div>
        </div>
      </div>


      {/* Contenido */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        {/* Línea vertical */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px overflow-hidden pointer-events-none">
          <div
            ref={lineRef}
            className="w-full h-full bg-gradient-to-b from-transparent via-white/15 to-transparent"
          />
        </div>

        <div className="flex flex-col gap-[22vh]">
          {steps.map((s, i) => (
            <TechRow
              key={s.id}
              side={s.side}
              label={s.label}
              description={s.description}
              years={s.years}
              icon={s.icon}
              color={s.color}
              index={i}
            />
          ))}
        </div>
      </div>

      <div className="h-[30vh]" />
    </section>
  );
}

function TechRow({
  side,
  label,
  description,
  years,
  icon,
  color,
  index,
}: {
  side: "left" | "right";
  label: string;
  description: string;
  years: string;
  icon: React.ReactNode;
  color: string;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      data-tech-step
      className={`flex items-center relative ${
        side === "left" ? "justify-start" : "justify-end"
      }`}
    >
      {/* Dot central — posición absoluta, fuera del content que se mueve con x */}
      <div
        data-tech-dot
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 20px ${color}88`,
        }}
      />

      {/* Índice — posición absoluta, fuera del content */}
      <div
        data-tech-index
        className={`
          absolute top-1/2 -translate-y-1/2
          text-white/10 font-mono text-xs tracking-widest
          pointer-events-none select-none
          ${side === "left" ? "right-[calc(50%+24px)]" : "left-[calc(50%+24px)]"}
        `}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* ✅ CONTENT — este es el wrapper que GSAP anima con x + blur, igual que el row original */}
      <div
        data-tech-content
        className={`max-w-[38rem] ${side === "left" ? "pr-[10%]" : "pl-[10%]"}`}
      >
        <div
          className={`flex items-center gap-6 md:gap-8 ${
            side === "left" ? "" : "flex-row-reverse"
          }`}
        >
          {/* Icono — sin data-tech-icon para que no interfiera con GSAP */}
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative cursor-pointer flex-shrink-0 text-[4.5rem] md:text-[5rem]"
            style={{
              color: hovered ? color : "white",
              transition: "color 0.3s ease, filter 0.3s ease, transform 0.3s ease",
              filter: hovered
                ? `drop-shadow(0 0 60px ${color})`
                : "drop-shadow(0 0 35px rgba(255,255,255,0.75))",
              transform: hovered ? "translateY(-8px) scale(1.1) rotate(2deg)" : undefined,
            }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 -z-10 rounded-full blur-2xl"
              style={{
                opacity: hovered ? 1 : 0,
                background: `radial-gradient(circle, ${color}55 0%, transparent 70%)`,
                transition: "opacity 0.3s ease",
              }}
            />
            {icon}
          </div>

          {/* Texto */}
          <div className={side === "right" ? "text-right" : "text-left"}>
            <div
              data-tech-label
              className="text-white/90 text-3xl md:text-5xl font-semibold tracking-tight leading-none mb-2"
            >
              {label}
            </div>

            <div className="flex flex-col gap-1">
              <p
                className={`text-white/40 text-sm md:text-base font-light tracking-wide ${
                  side === "right" ? "ml-auto" : ""
                }`}
              >
                {description}
              </p>
              <span
                className={`text-[11px] font-mono tracking-[0.2em] uppercase px-2 py-0.5 rounded-full border w-fit ${
                  side === "right" ? "ml-auto" : ""
                }`}
                style={{
                  color: color,
                  borderColor: `${color}40`,
                  background: `${color}10`,
                }}
              >
                {years}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}