"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  year: string;
  url?: string;
};

const PROJECTS: Project[] = [
  {
    id: "01",
    title: "Project One",
    description: "A full-stack web application built with Next.js and TypeScript.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    year: "2024",
    url: "https://example.com",
  },
  {
    id: "02",
    title: "Project Two",
    description: "Mobile-first design system and component library.",
    tags: ["React", "Storybook", "SCSS"],
    year: "2024",
    url: "https://example.com",
  },
  {
    id: "03",
    title: "Project Three",
    description: "Real-time dashboard with WebSockets and data visualization.",
    tags: ["Node.js", "Socket.io", "D3.js"],
    year: "2023",
    url: "https://example.com",
  },
  {
    id: "04",
    title: "Project Four",
    description: "E-commerce platform with headless CMS and payment integration.",
    tags: ["Next.js", "Stripe", "Sanity"],
    year: "2023",
    url: "https://example.com",
  },
  {
    id: "05",
    title: "Project Five",
    description: "AI-powered content generator using OpenAI API.",
    tags: ["Python", "FastAPI", "OpenAI"],
    year: "2024",
    url: "https://example.com",
  },
];

export default function Projects({
  scrollContainerRef,
}: {
  scrollContainerRef: RefObject<HTMLElement | null>;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const projects = useMemo<Project[]>(() => PROJECTS.slice(0, 5), []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const scroller = scrollContainerRef.current;

    if (!section || !track || !scroller || projects.length < 2) return;

    const ctx = gsap.context(() => {
      // Only animate the track horizontally — the viewport is sticky via CSS (no CLS)
      gsap.to(track, {
        x: () => -(window.innerWidth * (projects.length - 1)),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          scroller,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, [projects.length, scrollContainerRef]);

  return (
    <section
      ref={sectionRef}
      id="works"
      className="relative w-screen bg-black"
      style={{ height: `${projects.length * 100}vh` }}
    >
      {/* sticky instead of JS fixed/absolute toggling = zero CLS */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        <div className="absolute top-8 left-6 md:left-12 z-10">
          <h2 className="text-white text-4xl md:text-6xl font-bold tracking-tight">
            Projects
          </h2>
        </div>

        <div
          ref={trackRef}
          className="flex h-full will-change-transform"
          style={{ width: `${projects.length * 100}vw` }}
        >
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              total={projects.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  return (
    <article className="w-screen h-screen shrink-0 flex items-center justify-center px-6 md:px-12 py-20">
      <div
        className="
          w-[min(88vw,980px)] h-[min(62vh,620px)]
          rounded-3xl border border-white/20 bg-white/[0.03]
          shadow-[0_20px_80px_rgba(0,0,0,0.45)]
          flex flex-col items-center justify-center gap-6
          group cursor-pointer
          transition-all duration-500
          hover:border-white/40 hover:bg-white/[0.06]
          relative
        "
        aria-label={project.title}
      >
        <span className="absolute top-6 left-8 text-white/20 text-xs tracking-[0.3em] uppercase font-mono">
          {project.id} / {String(total).padStart(2, "0")}
        </span>

        <span className="absolute top-6 right-8 text-white/20 text-xs tracking-[0.2em]">
          {project.year}
        </span>

        <h3 className="text-white/80 text-2xl md:text-4xl font-bold tracking-tight group-hover:text-white transition-colors duration-500">
          {project.title}
        </h3>

        <p className="text-white/30 text-sm md:text-base max-w-md text-center group-hover:text-white/50 transition-colors duration-500">
          {project.description}
        </p>

        <div className="flex gap-3 mt-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-white/25 text-xs tracking-[0.15em] uppercase border border-white/10 rounded-full px-3 py-1 group-hover:text-white/50 group-hover:border-white/20 transition-colors duration-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
