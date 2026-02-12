"use client";

import { useRef } from "react";
import Header from "@/app/components/Header";
import Home from "@/app/components/Home";
import About from "@/app/components/About";

export default function Page() {
  const mainRef = useRef<HTMLElement | null>(null);

  const scrollToId = (id: string) => {
    const el = mainRef.current?.querySelector<HTMLElement>(`#${id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Header onNavigate={scrollToId} />

      <main
        ref={mainRef}
        className="h-screen w-screen overflow-y-scroll overflow-x-hidden snap-y snap-mandatory"
      >
        <Home />
        <About />
      </main>
    </>
  );
}
