"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Home from "@/app/components/Home";
import About from "@/app/components/About";
import Technologies from "@/app/components/technologies";

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const mainRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    // Tell ScrollTrigger that THIS div is the scroller, not the window
    ScrollTrigger.defaults({ scroller: el });

    // Needed so ScrollTrigger reads scrollTop from the div correctly
    ScrollTrigger.scrollerProxy(el, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          el.scrollTop = value;
        }
        return el.scrollTop;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: el.clientWidth, height: el.clientHeight };
      },
      // Important: pinType must be "fixed" for overflow scroll containers
      pinType: el.style.transform ? "transform" : "fixed",
    });

    // Sync ScrollTrigger when the div scrolls
    const onScroll = () => ScrollTrigger.update();
    el.addEventListener("scroll", onScroll, { passive: true });

    ScrollTrigger.refresh();

    return () => {
      el.removeEventListener("scroll", onScroll);
      ScrollTrigger.defaults({ scroller: window });
    };
  }, []);

  return (
    <main
      ref={mainRef}
      // Remove scroll-smooth — it fights with scrub
      className="h-screen w-screen overflow-y-scroll overflow-x-hidden overscroll-none"
    >
      <Home />
      <About scrollContainerRef={mainRef} />
      <Technologies scrollContainerRef={mainRef} />
    </main>
  );
}