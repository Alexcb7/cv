"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { FaGithub, FaReact, FaJsSquare, FaHourglassHalf } from "react-icons/fa";
import {
  SiNextdotjs, SiTailwindcss, SiSupabase, SiTypescript,
  SiFastapi, SiSqlalchemy, SiPostgresql, SiFramer,
  SiShadcnui, SiAnthropic, SiVercel, SiRender,
} from "react-icons/si";
import type { Project } from "./projects";

const TECH_META: Record<string, { icon: React.ReactNode; color: string }> = {
  React:           { icon: <FaReact />,       color: "#61DAFB" },
  "Next.js":       { icon: <SiNextdotjs />,   color: "#ffffff" },
  TypeScript:      { icon: <SiTypescript />,  color: "#3178C6" },
  JavaScript:      { icon: <FaJsSquare />,    color: "#F7DF1E" },
  Tailwind:        { icon: <SiTailwindcss />, color: "#38BDF8" },
  Supabase:        { icon: <SiSupabase />,    color: "#3ECF8E" },
  FastAPI:         { icon: <SiFastapi />,     color: "#009688" },
  SQLAlchemy:      { icon: <SiSqlalchemy />,  color: "#D71F00" },
  PostgreSQL:      { icon: <SiPostgresql />,  color: "#4169E1" },
  "Framer Motion": { icon: <SiFramer />,      color: "#BB4B96" },
  "Shadcn/ui":     { icon: <SiShadcnui />,    color: "#ffffff" },
  "Claude Haiku":  { icon: <SiAnthropic />,   color: "#D4621D" },
  Groq:            { icon: null,              color: "#F55036" },
  Vercel:          { icon: <SiVercel />,      color: "#ffffff" },
  Render:          { icon: <SiRender />,      color: "#46E3B7" },
};

const LABEL = "text-white/60 text-xs uppercase tracking-[0.25em] mb-5 block";

interface Props {
  project: Project;
  onClose: () => void;
}

export default function ProjectDetail({ project, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);

    // Block background scroll while modal is open
    const stopWheel = (e: WheelEvent) => e.stopPropagation();
    const overlay = overlayRef.current;
    overlay?.addEventListener("wheel", stopWheel, { passive: true });

    requestAnimationFrame(() => {
      if (modalRef.current) {
        modalRef.current.style.opacity = "1";
        modalRef.current.style.transform = "scale(1) translateY(0)";
      }
    });

    return () => {
      document.removeEventListener("keydown", onKey);
      overlay?.removeEventListener("wheel", stopWheel);
    };
  }, [onClose]);

  const hasHighlights = project.highlights && project.highlights.length > 0;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-8">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl max-h-[88vh] bg-[#0c0c0c] border border-white/10 rounded-3xl overflow-hidden flex shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
        style={{
          opacity: 0,
          transform: "scale(0.96) translateY(12px)",
          transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      >
        {/* ── Left: image + stack ── */}
        <div className="w-[38%] shrink-0 flex flex-col border-r border-white/8">

          {/* Image */}
          <div className="relative w-full h-55 shrink-0">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              style={{ objectPosition: project.objectPosition ?? "center" }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
            {project.duration && (
              <span className="absolute bottom-5 right-6 flex items-center gap-1.5 text-white text-[10px] font-mono tracking-[0.2em] uppercase">
                <FaHourglassHalf size={11} />
                {project.duration}
              </span>
            )}
          </div>

          {/* Stack — two columns */}
          {project.stackGroups && project.stackGroups.length > 0 && (
            <div className="flex-1 px-6 py-6 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <span className={LABEL}>Stack</span>
              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                {project.stackGroups.map((group) => (
                  <div key={group.label}>
                    <p className="text-white/50 text-[11px] uppercase tracking-[0.2em] mb-2.5">
                      {group.label}
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {group.items.map((tech) => {
                        const meta = TECH_META[tech];
                        return (
                          <li
                            key={tech}
                            className="flex items-center gap-2 text-sm font-medium"
                            style={{ color: "white" }}
                          >
                            {meta?.icon && <span className="text-base shrink-0">{meta.icon}</span>}
                            {tech}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: details ── */}
        <div className="flex-1 flex flex-col min-h-0">

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-6 text-white/30 hover:text-white transition-colors duration-200 text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex flex-col gap-7 px-9 pt-9 pb-4 min-h-0">

            {project.description && (
              <div>
                <span className={LABEL}>About</span>
                <p className="text-white text-sm leading-[1.85]">
                  {project.description}
                </p>
              </div>
            )}

            {hasHighlights && (
              <div>
                <span className={LABEL}>Highlights</span>
                <ul className="flex flex-col gap-2">
                  {project.highlights!.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-white/30 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.challenges && (
              <div>
                <span className={LABEL}>Challenges & lessons learned</span>
                <p className="text-white text-sm leading-[1.85]">
                  {project.challenges}
                </p>
              </div>
            )}
          </div>

          {/* Buttons — anchored at bottom */}
          <div className="flex gap-3 px-9 py-5 border-t border-white/8 shrink-0">
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-white border border-white/20 rounded-full px-6 py-3 text-xs font-semibold tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-[background-color,color] duration-300"
              >
                <FaGithub size={15} />
                Repository
              </a>
            )}
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-black bg-white rounded-full px-6 py-3 text-xs font-semibold tracking-[0.15em] uppercase hover:bg-white/80 transition-[background-color] duration-300"
              >
                View Live
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
