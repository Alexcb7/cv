"use client";

import { useRef, type RefObject } from "react";
import ScrollFloat from "@/app/components/reactbits/scrollfloat";
import ScrollReveal from "@/app/components/reactbits/scrollreveal";

export default function About({
  scrollContainerRef,
}: {
  scrollContainerRef: RefObject<HTMLElement | null>;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="min-h-[130vh] w-screen bg-black flex items-center justify-center px-6"
    >
      <div className="text-center max-w-5xl mx-auto">
        <div className="font-semibold text-white leading-[0.95] tracking-tight">
          <div className="font-[Bungee] text-[clamp(3.5rem,9vw,10rem)] [&_*]:text-inherit">
            <ScrollFloat
              scrollContainerRef={scrollContainerRef}
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=50%"
              stagger={0.03}
            >
              Hi, I’m Alex
            </ScrollFloat>
          </div>
        </div>

        <ScrollReveal
          scrollContainerRef={scrollContainerRef}
          baseOpacity={0.1}
          enableBlur
          baseRotation={3}
          blurStrength={4}
          textClassName="font-['Playfair_Display'] mt-20 font-bold text-xl md:text-4xl text-white/90 max-w-3xl mx-auto"
        >
          I develop modern web interfaces that transform ideas into solid digital experiences.
          I combine design, performance, and technical precision to help businesses and small
          companies grow in the digital environment.
        </ScrollReveal>
      </div>
    </section>
  );
}