"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type Project = {
  id: string;
  title: string;
  image: string;
  url?: string;
};

const PROJECTS: Project[] = [
  {
    id: "01",
    title: "Project One",
    image: "/images/project 1.jpg",
    url: "https://example.com",
  },
  {
    id: "02",
    title: "Project Two",
    image: "/images/project 2.webp",
    url: "https://example.com",
  },
  {
    id: "03",
    title: "Project Three",
    image: "/images/project 3.webp",
    url: "https://example.com",
  },
  {
    id: "04",
    title: "Project Four",
    image: "/images/project 4.png",
    url: "https://example.com",
  },
  {
    id: "05",
    title: "Project Five",
    image: "/images/pro5.avif",
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
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  return (
    <article className="w-screen h-screen shrink-0 flex items-center justify-center px-6 md:px-12 py-20">
      <div
        className="
          group relative cursor-pointer
          w-[min(88vw,980px)] h-[min(62vh,620px)]
          rounded-3xl overflow-hidden
          border border-white/10 bg-white/[0.03]
          shadow-[0_20px_80px_rgba(0,0,0,0.45)]
        "
        aria-label={project.title}
      >
        {/* Image — centered, partial size by default, fills card on hover */}
        <div
          className="
            absolute inset-0 flex items-center justify-center
            transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
          "
        >
          <div
            className="
              relative
              w-[60%] h-[65%]
              rounded-2xl overflow-hidden
              transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
              group-hover:w-full group-hover:h-full group-hover:rounded-none
            "
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="
                object-cover
                transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
                scale-100 group-hover:scale-110
              "
              sizes="(max-width: 768px) 88vw, 980px"
            />
          </div>
        </div>

        {/* Overlay — appears on hover */}
        <div
          className="
            absolute inset-0 z-10
            bg-black/0 group-hover:bg-black/55
            transition-all duration-600
            pointer-events-none group-hover:pointer-events-auto
          "
        >
          {/* Title — centered, big & impactful */}
          <h3
            className="
              absolute inset-0 flex items-center justify-center
              text-white text-5xl md:text-7xl font-black tracking-tighter uppercase
              opacity-0 scale-90
              group-hover:opacity-100 group-hover:scale-100
              transition-all duration-600 delay-100
              drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]
            "
          >
            {project.title}
          </h3>

          {/* Button — bottom-right corner, visible & bold */}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                absolute bottom-6 right-6
                text-white text-sm font-semibold tracking-[0.15em] uppercase
                bg-white/15 backdrop-blur-sm
                border border-white/40 rounded-full px-7 py-3
                opacity-0 translate-y-3
                group-hover:opacity-100 group-hover:translate-y-0
                transition-all duration-500 delay-200
                hover:bg-white hover:text-black hover:border-white
                pointer-events-auto
              "
            >
              View Project
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
