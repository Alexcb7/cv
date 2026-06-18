"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectDetail from "./ProjectDetail";

gsap.registerPlugin(ScrollTrigger);

export type StackGroup = { label: string; items: string[] };

export type Project = {
  id: string;
  title: string;
  image?: string;
  url?: string;
  objectPosition?: string;
  stackGroups?: StackGroup[];
  description?: string;
  duration?: string;
  repo?: string;
  highlights?: string[];
  challenges?: string;
};

const PROJECTS: Project[] = [
  {
    id: "01",
    title: "Caleo",
    image: "/images/caleo_cv.png",
    url: "https://caleo-landing.vercel.app/",
    objectPosition: "center 35%",
    stackGroups: [
      { label: "Frontend",     items: ["Next.js", "TypeScript", "Tailwind", "Shadcn/ui", "Framer Motion"] },
      { label: "Backend",      items: ["FastAPI", "SQLAlchemy", "PostgreSQL"] },
      { label: "AI Resources", items: ["Claude Haiku", "Groq"] },
      { label: "Deployment",   items: ["Vercel", "Render"] },
    ],
    description:
      "Caleo is a full-stack web application that compares grocery prices between Mercadona and DIA in real time, helping users find the best deals and save on every shopping trip. Built as my final capstone project, it combines an LLM-powered product matching pipeline, an AI shopping assistant, and a freemium subscription model. The platform handles authentication, real-time price comparison, and personalized shopping lists, with the price comparator as its core feature.",
    duration: "3 months",
    repo: "https://github.com/Alxstudio/caleo-app",
    highlights: [
      "LLM-powered product normalization pipeline (Claude Haiku) achieving a 96.5% match rate across 4,000 Mercadona and 3,500 DIA products",
      "Integrated chatbot 'Paco' with real-time database context injection, powered by Groq",
      "Freemium business model at €2.99/month, including a complete business plan and investor pitch",
      "N+1 query optimization to improve comparator performance",
    ],
    challenges:
      "The biggest challenge was matching products across supermarkets: Mercadona and DIA label the same product differently. I solved this with a two-pass pipeline combining an LLM (Claude Haiku) with SequenceMatcher as a fallback, reaching a 96.5% match rate across 7,500 products. On the infrastructure side, I also had to resolve Supabase connectivity issues from home networks and a version conflict between bcrypt and passlib in the authentication system.",
  },
  {
    id: "02",
    title: "Sedentaris Page",
    url: "https://sedentaris-website.vercel.app/",
    repo: "https://github.com/Alxstudio/sedentaris-website",
    duration: "2 months",
    stackGroups: [
      { label: "Frontend",    items: ["React", "TypeScript", "Tailwind"] },
      { label: "Backend",     items: ["Supabase", "PostgreSQL"] },
      { label: "AI Resources", items: ["Claude Haiku"] },
      { label: "Deployment",  items: ["Vercel"] },
    ],
    description:
      "Sedentaris Page is a modern landing page designed to showcase a fitness and wellness brand focused on helping sedentary people build healthier habits. The project involved designing and developing a fully responsive, visually engaging web presence with smooth animations, clear calls to action, and an optimized user experience from first scroll to conversion.",
    highlights: [
      "Fully responsive layout optimized for mobile, tablet, and desktop viewports",
      "Custom animation system built with Framer Motion for smooth section transitions",
      "Integrated contact form connected to a Supabase backend for lead capture",
      "Performance-optimized with lazy loading and Next.js image optimization",
    ],
    challenges:
      "The main challenge was translating a brand identity into a cohesive digital experience without a pre-existing design system. I had to make decisions on typography, spacing, and color from scratch while keeping the result consistent and professional. Balancing visual richness with fast load times also required careful optimization of assets and animation timing.",
  },
  {
    id: "03",
    title: "Project Three",
    image: "/images/project 3.webp",
  },
  {
    id: "04",
    title: "Project Four",
    image: "/images/project 4.png",
  },
  {
    id: "05",
    title: "Project Five",
    image: "/images/pro5.avif",
  },
];

export default function Projects({
  scrollContainerRef,
}: {
  scrollContainerRef: RefObject<HTMLElement | null>;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects = useMemo<Project[]>(() => PROJECTS.slice(0, 5), []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const scroller = scrollContainerRef.current;

    if (!section || !track || !scroller || projects.length < 2) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -(window.innerWidth * (projects.length - 1)),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          scroller,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, [projects.length, scrollContainerRef]);

  return (
    <>
      <section
        ref={sectionRef}
        id="works"
        className="relative w-screen bg-black"
        style={{ height: `${projects.length * 100}vh` }}
      >
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
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
                onDetails={() => setSelectedProject(project)}
              />
            ))}
          </div>
        </div>
      </section>

      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}

function ProjectCard({
  project,
  onDetails,
}: {
  project: Project;
  index: number;
  total: number;
  onDetails: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="w-screen h-screen shrink-0 flex items-center justify-center px-6 md:px-12 py-20">
      <div
        className="
          relative cursor-pointer
          w-[min(88vw,980px)] h-[min(62vh,620px)]
          rounded-3xl overflow-hidden
          border border-white/10 bg-white/3
          shadow-[0_20px_80px_rgba(0,0,0,0.45)]
        "
        aria-label={project.title}
        onMouseEnter={() => setExpanded(true)}
      >
        {/* Image — clip-path expand, stays expanded once triggered */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 transition-[clip-path] duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] will-change-[clip-path]"
            style={{
              clipPath: expanded ? "inset(0% round 0px)" : "inset(17.5% 20% round 16px)",
            }}
          >
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                style={{
                  objectPosition: project.objectPosition ?? "center",
                  transform: expanded ? "scale(1.1)" : "scale(1)",
                }}
                sizes="(max-width: 768px) 88vw, 980px"
              />
            ) : (
              <div className="absolute inset-0 bg-black">
                <div
                  className="absolute inset-0 p-12 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                  style={{ transform: expanded ? "scale(1.15)" : "scale(1)" }}
                >
                  <Image src="/images/logo-blanco.png" alt="logo" fill className="object-contain opacity-50" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Overlay */}
        <div
          className="absolute inset-0 z-10 transition-[background-color] duration-500 pointer-events-none"
          style={{ background: expanded ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0)", pointerEvents: expanded ? "auto" : "none" }}
        >
          {/* Title */}
          <h3
            className="absolute inset-0 flex items-center justify-center text-white text-5xl md:text-7xl font-black tracking-tighter uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] transition-[opacity,transform] duration-500 will-change-transform"
            style={{
              opacity: expanded ? 1 : 0,
              transform: expanded ? "scale(1)" : "scale(0.9)",
            }}
          >
            {project.title}
          </h3>

          {/* Button right — View Project */}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                absolute bottom-6 right-6
                text-white text-sm font-semibold tracking-[0.15em] uppercase
                bg-white/15 border border-white/40 rounded-full px-7 py-3
                transition-[opacity,transform,background-color,color,border-color] duration-400
                hover:bg-white hover:text-black hover:border-white
                pointer-events-auto will-change-transform
              "
              style={{
                opacity: expanded ? 1 : 0,
                transform: expanded ? "translateY(0)" : "translateY(12px)",
              }}
            >
              View Project
            </a>
          )}

          {/* Button left — View Details */}
          <button
            onClick={onDetails}
            className="
              absolute bottom-6 left-6
              text-white text-sm font-semibold tracking-[0.15em] uppercase
              bg-white/15 border border-white/40 rounded-full px-7 py-3
              transition-[opacity,transform,background-color,color,border-color] duration-400
              hover:bg-white hover:text-black hover:border-white
              pointer-events-auto cursor-pointer will-change-transform
            "
            style={{
              opacity: expanded ? 1 : 0,
              transform: expanded ? "translateY(0)" : "translateY(12px)",
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}
