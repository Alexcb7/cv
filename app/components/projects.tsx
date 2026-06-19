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
  comingSoon?: boolean;
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
    duration: "2 weeks",
    stackGroups: [
      { label: "Frontend",   items: ["Next.js", "TypeScript", "CSS"] },
      { label: "Backend",    items: ["Supabase"] },
      { label: "Deployment", items: ["Vercel"] },
    ],
    description:
      "Sedentaris is the official website for a Catalan athletics club, completely rebuilt with a modern, marketing-focused approach. Alongside the public site — featuring a hand-crafted visual identity, club news, races, and membership information — it includes a custom backoffice (protected routes within the same Next.js app, powered by Supabase) that lets club admins manage athlete profiles, publish blog posts, and review contact form submissions without touching any code.",
    highlights: [
      "Complete visual and structural redesign, modernizing an outdated club website into a fast, marketing-focused experience",
      "Fully custom design system built with hand-written CSS (no Tailwind, no component library), including a track-line motif and a gradient color palette",
      "Custom backoffice with Supabase-backed authentication, letting non-technical club admins manage athletes, blog posts, and contact form submissions without code",
      "Privacy-conscious, opt-in athlete profile system, letting members choose whether to be publicly featured",
    ],
    challenges:
      "One challenge was building a distinctive visual identity entirely from scratch without a UI framework — every public section (hero, news grid, race cards, gear showcase) was hand-coded in CSS, including custom animations and a track-line motif tied to the club's identity. The bigger technical challenge was adding a full backoffice on top of that static-first design: protected admin routes within the same Next.js app, backed by Supabase for authentication and data storage, letting club staff manage athlete profiles, publish blog posts, and review contact form submissions — all without touching code or a database client directly.",
  },
  { id: "03", title: "Project Three", comingSoon: true },
  { id: "04", title: "Project Four",  comingSoon: true },
  { id: "05", title: "Project Five",  comingSoon: true },
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

  if (project.comingSoon) {
    return (
      <article className="w-screen h-screen shrink-0 flex items-center justify-center px-6 md:px-12 py-20">
        <div
          className="
            relative
            w-[min(88vw,980px)] h-[min(62vh,620px)]
            rounded-3xl overflow-hidden
            border border-white/10 bg-black
            shadow-[0_20px_80px_rgba(0,0,0,0.45)]
          "
        >
          <Image
            src="/images/logo_blanco.png"
            alt="logo"
            fill
            placeholder="empty"
            className="object-contain opacity-10 p-6"
            style={{ filter: "none" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/40 text-5xl md:text-7xl font-black tracking-tighter uppercase select-none">
              Coming soon...
            </p>
          </div>
        </div>
      </article>
    );
  }

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
