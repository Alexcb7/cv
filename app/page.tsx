"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import Home from "@/app/components/Home";
import About from "@/app/components/About";

const Technologies = dynamic(() => import("@/app/components/technologies"));
const Projects = dynamic(() => import("@/app/components/projects"));
const Contact = dynamic(() => import("@/app/components/contact"));

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const mainRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    ScrollTrigger.defaults({ scroller: el });

    let cachedWidth = el.clientWidth;
    let cachedHeight = el.clientHeight;
    let cachedScrollHeight = el.scrollHeight;

    const ro = new ResizeObserver(() => {
      cachedWidth = el.clientWidth;
      cachedHeight = el.clientHeight;
      cachedScrollHeight = el.scrollHeight;
    });
    ro.observe(el);

    ScrollTrigger.scrollerProxy(el, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) el.scrollTop = value;
        return el.scrollTop;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: cachedWidth,
          height: cachedHeight,
        };
      },
      pinType: "fixed",
    });

    let targetScroll = 0;
    let currentScroll = 0;
    let smoothing = false;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return;
      e.preventDefault();
      smoothing = true;
      targetScroll = Math.max(
        0,
        Math.min(targetScroll + e.deltaY, cachedScrollHeight - cachedHeight)
      );
    };

    const tick = () => {
      if (!smoothing) return;
      const diff = targetScroll - currentScroll;
      if (Math.abs(diff) < 0.5) {
        currentScroll = targetScroll;
        smoothing = false;
      } else {
        currentScroll += diff * 0.1;
      }
      el.scrollTop = currentScroll;
      ScrollTrigger.update();
    };

    const onScroll = () => {
      if (!smoothing) {
        targetScroll = el.scrollTop;
        currentScroll = el.scrollTop;
      }
      ScrollTrigger.update();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", onScroll, { passive: true });
    gsap.ticker.add(tick);

    ScrollTrigger.refresh();

    return () => {
      ro.disconnect();
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", onScroll);
      gsap.ticker.remove(tick);
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
      <div className="h-[60vh] bg-black" />
      <Contact scrollContainerRef={mainRef} />
    </main>
  );
}
