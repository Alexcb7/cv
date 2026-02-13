"use client";

import { useRef } from "react";
import Home from "@/app/components/Home";
import About from "@/app/components/About";
import Technologies from "@/app/components/technologies";

export default function Page() {
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <main
      ref={mainRef}
      className="h-screen w-screen overflow-y-scroll overflow-x-hidden scroll-smooth overscroll-contain"
    >
      <Home />
      <About scrollContainerRef={mainRef} />
      <Technologies scrollContainerRef={mainRef} />
    </main>
  );
}