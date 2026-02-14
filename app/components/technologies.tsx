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

  const steps: Step[] = useMemo(() => {
    const techs = [
      { id: "react", label: "React", icon: <FaReact />, color: "#61DAFB" },
      { id: "next", label: "Next.js", icon: <SiNextdotjs />, color: "#ffffff" },
      {
        id: "ts",
        label: "TypeScript",
        icon: <SiTypescript />,
        color: "#3178C6",
      },
      {
        id: "js",
        label: "JavaScript",
        icon: <FaJsSquare />,
        color: "#F7DF1E",
      },
      { id: "css", label: "CSS", icon: <FaCss3Alt />, color: "#1572B6" },
      {
        id: "tailwind",
        label: "Tailwind",
        icon: <SiTailwindcss />,
        color: "#38BDF8",
      },
      {
        id: "supabase",
        label: "Supabase",
        icon: <SiSupabase />,
        color: "#3ECF8E",
      },
    ];

    return techs.map((t, i) => ({
      ...t,
      side: i % 2 === 0 ? "left" : "right",
    }));
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const bandWrap = bandWrapRef.current;
    const band = bandRef.current;
    const scroller = scrollContainerRef.current;

    if (!section || !bandWrap || !band || !scroller) return;

    const ctx = gsap.context(() => {
      // Barra fija mientras estás dentro de la sección
      ScrollTrigger.create({
        trigger: section,
        scroller,
        start: "top top",
        end: "bottom bottom",
        onEnter: () =>
          gsap.set(bandWrap, {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
          }),
        onEnterBack: () =>
          gsap.set(bandWrap, {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
          }),
        onLeave: () =>
          gsap.set(bandWrap, {
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
          }),
        onLeaveBack: () =>
          gsap.set(bandWrap, {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
          }),
      });

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

      // ✅ Aparición desde izquierda / derecha (suave)
      const rows = gsap.utils.toArray<HTMLElement>("[data-tech-step]");

      rows.forEach((row) => {
        const isLeft = row.classList.contains("justify-start");
        const fromX = isLeft ? -80 : 80;

        const icon = row.querySelector<HTMLElement>("[data-tech-icon]");
        const label = row.querySelector<HTMLElement>("[data-tech-label]");

        // estado inicial: mueve el ROW entero
        gsap.set(row, {
          opacity: 0,
          x: fromX,
          y: 8,
          filter: "blur(10px)",
        });

        // opcional: label un poquito más tarde (da sensación pro)
        if (label) {
          gsap.set(label, { opacity: 0, y: 6, filter: "blur(8px)" });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            scroller,
            start: "top 85%",
            end: "top 35%",
            scrub: true,
          },
        });

        tl.to(row, {
          opacity: 1,
          x: 0,
          y: 0,
          filter: "blur(0px)",
          ease: "power2.out",
        });

        if (label) {
          tl.to(
            label,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              ease: "power2.out",
            },
            0.08
          );
        }

        // (no tocamos icon hover, solo la entrada del row)
        // icon queda con su hover y color como lo tenías
        void icon;
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
      {/* Barra */}
      <div
        ref={bandWrapRef}
        className="pointer-events-none absolute inset-x-0 top-0 z-20"
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
        <div className="flex flex-col gap-[30vh]">
          {steps.map((s) => (
            <TechRow
              key={s.id}
              side={s.side}
              label={s.label}
              icon={s.icon}
              color={s.color}
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
  icon,
  color,
}: {
  side: "left" | "right";
  label: string;
  icon: React.ReactNode;
  color: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      data-tech-step
      className={`flex items-center ${
        side === "left" ? "justify-start" : "justify-end"
      }`}
    >
      <div className="max-w-[42rem]">
        <div
          className={`flex items-center gap-8 ${
            side === "left" ? "" : "flex-row-reverse"
          }`}
        >
          <div
            data-tech-icon
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="
              relative cursor-pointer
              text-[5rem] md:text-[5rem]
              transition-all duration-300 ease-out
              hover:-translate-y-2 hover:scale-110 hover:rotate-[2deg]
            "
            style={{
              color: hovered ? color : "white",
              transition: "color 0.3s ease, filter 0.3s ease",
              filter: hovered
                ? `drop-shadow(0 0 60px ${color})`
                : "drop-shadow(0 0 35px rgba(255,255,255,0.75))",
            }}
          >
            <span
              aria-hidden="true"
              className="
                pointer-events-none absolute -inset-6 -z-10 rounded-full
                opacity-0 blur-2xl
                transition-opacity duration-300 ease-out
              "
              style={{
                opacity: hovered ? 1 : 0,
                background: `radial-gradient(circle, ${color}55 0%, transparent 70%)`,
              }}
            />
            {icon}
          </div>

          <div
            data-tech-label
            className="text-white/90 text-3xl md:text-5xl font-semibold tracking-tight"
          >
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}