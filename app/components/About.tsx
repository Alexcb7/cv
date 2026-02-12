"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content,
        {
          y: 80,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-screen h-screen bg-[#d07a3a] flex items-center justify-center px-8"
    >
      <div
        ref={contentRef}
        className="max-w-4xl text-center text-black"
      >
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-black/60">
          ABOUT
        </p>

        <h2 className="text-5xl md:text-6xl font-semibold leading-tight">
          Diseño y desarrollo experiencias digitales limpias.
        </h2>

        <p className="mt-8 text-lg md:text-xl text-black/80">
          Trabajo con Next.js, TypeScript y tecnologías modernas para crear
          productos rápidos, escalables y visualmente cuidados.
        </p>
      </div>
    </section>
  );
}
