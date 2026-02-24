"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Home from "@/app/components/Home";
import About from "@/app/components/About";
import Technologies from "@/app/components/technologies";
import Projects from "@/app/components/projects";

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const mainRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    ScrollTrigger.defaults({ scroller: el });

    ScrollTrigger.scrollerProxy(el, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) el.scrollTop = value;
        return el.scrollTop;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: el.clientWidth,
          height: el.clientHeight,
        };
      },
      pinType: "fixed",
    });

    const onScroll = () => ScrollTrigger.update();
    el.addEventListener("scroll", onScroll, { passive: true });

    ScrollTrigger.refresh();

    return () => {
      el.removeEventListener("scroll", onScroll);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      ScrollTrigger.clearScrollMemory();
      ScrollTrigger.defaults({ scroller: window as any });
    };
  }, []);

  return (
    <main
      ref={mainRef}
      className="h-screen w-screen overflow-y-scroll overflow-x-hidden overscroll-none"
    >
      <Home />
      <About scrollContainerRef={mainRef} />
      <Technologies scrollContainerRef={mainRef} />
      <Projects scrollContainerRef={mainRef} />
    </main>
  );
}