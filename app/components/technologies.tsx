"use client";

import React, { useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaReact, FaCss3Alt, FaGithub } from "react-icons/fa";
import { SiTailwindcss, SiSupabase, SiNextdotjs, SiTypescript } from "react-icons/si";
import Ribbon from "@/app/components/ribon/ribon";

gsap.registerPlugin(ScrollTrigger);

type Step = { id: string; label: string; icon: React.ReactNode; side: "left" | "right" };

export default function Technologies({
  scrollContainerRef,
}: {
  scrollContainerRef: RefObject<HTMLElement | null>;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef   = useRef<HTMLDivElement | null>(null);

  const steps: Step[] = useMemo(() => [
    { id: "react",    label: "React",      icon: <FaReact />,       side: "right" },
    { id: "tailwind", label: "Tailwind",   icon: <SiTailwindcss />, side: "left"  },
    { id: "ts",       label: "TypeScript", icon: <SiTypescript />,  side: "right" },
    { id: "next",     label: "Next.js",    icon: <SiNextdotjs />,   side: "left"  },
    { id: "supabase", label: "Supabase",   icon: <SiSupabase />,    side: "right" },
    { id: "css",      label: "CSS",        icon: <FaCss3Alt />,     side: "left"  },
    { id: "github",   label: "GitHub",     icon: <FaGithub />,      side: "right" },
  ], []);

  useLayoutEffect(() => {
    const section  = sectionRef.current;
    const track    = trackRef.current;
    const scroller = scrollContainerRef.current;
    if (!section || !track || !scroller) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-tech-step]", section);

      gsap.set(items, { opacity: 0, y: 30, scale: 0.92, filter: "blur(10px)" });

      // ── Track scroll ──────────────────────────────────────────────────────
      gsap.fromTo(track, { y: 0 }, {
        y: () => -Math.max(0, track.scrollHeight - (scroller.clientHeight || window.innerHeight) * 0.75),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          scroller,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,   // recalc y() on resize
        },
      });

      // ── Cache item CY values — NOT per frame ──────────────────────────────
      // We read them once after layout and update on resize via invalidateOnRefresh
      let itemCYs: number[] = [];
      let scrollerH = scroller.clientHeight;

      const cacheItemCYs = () => {
        itemCYs    = items.map((el) => { const r = el.getBoundingClientRect(); return r.top + r.height / 2; });
        scrollerH  = scroller.clientHeight;
      };
      requestAnimationFrame(cacheItemCYs);
      const ro = new ResizeObserver(cacheItemCYs);
      ro.observe(scroller);

      // ── Master (reveal + active states) ──────────────────────────────────
      const revealed = new Set<number>();
      let lastActive = -1;

      ScrollTrigger.create({
        trigger: section,
        scroller,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p        = self.progress;
          const canReveal = p >= 0.08;

          // Find active via cached CY — zero getBoundingClientRect() calls here
          const scrollerTop = scroller.getBoundingClientRect().top;  // 1 single read
          const centerY     = scrollerTop + scrollerH / 2;

          let activeIdx = 0;
          let minDist   = Infinity;
          for (let i = 0; i < itemCYs.length; i++) {
            const d = Math.abs(itemCYs[i] - centerY);
            if (d < minDist) { minDist = d; activeIdx = i; }
          }

          // Skip if nothing changed
          if (!canReveal && lastActive === -1) return;
          if (canReveal && activeIdx === lastActive && revealed.has(activeIdx)) {
            // Still on same item, check if others need dim update — but only on first change
            return;
          }

          // Reveal on first encounter
          if (canReveal && !revealed.has(activeIdx)) {
            revealed.add(activeIdx);
            gsap.fromTo(items[activeIdx],
              { opacity: 0, y: 26, scale: 0.94, filter: "blur(10px)" },
              { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.45, ease: "power3.out", overwrite: "auto" }
            );
          }

          // Only update states when active item changes
          if (activeIdx !== lastActive) {
            lastActive = activeIdx;
            items.forEach((el, i) => {
              const active = canReveal && i === activeIdx;
              const seen   = canReveal && revealed.has(i);
              gsap.to(el, {
                opacity: active ? 1 : seen ? 0.16 : 0,
                y:       active ? 0 : seen ? 10   : 18,
                scale:   active ? 1 : 0.98,
                filter:  active ? "blur(0px)" : seen ? "blur(2px)" : "blur(10px)",
                duration: 0.22,
                overwrite: "auto",
                ease: "power2.out",
              });
            });
          }
        },
      });

      ScrollTrigger.refresh();
      return () => ro.disconnect();
    }, section);

    return () => ctx.revert();
  }, [scrollContainerRef]);

  return (
    <section
      ref={sectionRef}
      id="technologies"
      className="relative min-h-[360vh] w-screen bg-black"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center px-6">
        <div className="relative w-full max-w-6xl h-[90vh]">

          <div className="absolute inset-x-0 top-6 text-center z-20">
            <h3 className="text-white/90 text-xl md:text-2xl tracking-tight">Technologies I use</h3>
          </div>

          <Ribbon scrollContainerRef={scrollContainerRef} triggerRef={sectionRef} />

          <div ref={trackRef} className="absolute left-0 right-0 top-24 bottom-10 z-20">
            <div className="relative h-[220vh]">
              {steps.map((t, i) => (
                <TimelineStep key={t.id} side={t.side} label={t.label} icon={t.icon} top={`${i * 30 + 5}%`} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function TimelineStep({ side, label, icon, top }: { side: "left" | "right"; label: string; icon: React.ReactNode; top: string }) {
  return (
    <div data-tech-step data-side={side} className="absolute w-full" style={{ top }}>
      <div className={["flex items-center gap-4", side === "left" ? "justify-start" : "justify-end"].join(" ")}>
        {side === "left" ? (
          <>
            <div className="text-6xl text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.55)]">{icon}</div>
            <div className="text-white text-xl md:text-2xl font-medium tracking-tight">{label}</div>
          </>
        ) : (
          <>
            <div className="text-white text-xl md:text-2xl font-medium tracking-tight">{label}</div>
            <div className="text-6xl text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.55)]">{icon}</div>
          </>
        )}
      </div>
    </div>
  );
}