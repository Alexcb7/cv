"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Home from "@/app/components/Home";
import About from "@/app/components/About";
import Technologies from "@/app/components/technologies";
// import Projects from "@/app/components/projects";

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const mainRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    // ✅ Set this div as the default scroller for ALL ScrollTriggers
    ScrollTrigger.defaults({ scroller: el });

    // ✅ Proxy for overflow scroll containers
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

    // ✅ Keep ScrollTrigger synced
    const onScroll = () => ScrollTrigger.update();
    el.addEventListener("scroll", onScroll, { passive: true });

    // ✅ Refresh after proxy is set
    ScrollTrigger.refresh();

    return () => {
      el.removeEventListener("scroll", onScroll);

      // ✅ Kill ONLY triggers created in this page
      ScrollTrigger.getAll().forEach((t) => t.kill());
      ScrollTrigger.clearScrollMemory();

      // ✅ Restore defaults
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
      {/* <Projects scrollContainerRef={mainRef} /> */}
    </main>
  );
}