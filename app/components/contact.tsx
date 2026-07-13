"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Logo3D({ sizeClass = "w-80 h-80", float = true }: { sizeClass?: string; float?: boolean }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const floatRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const cachedRect = useRef<DOMRect | null>(null);

  useEffect(() => {
    if (!float) return;
    const el = floatRef.current;
    if (!el) return;
    gsap.to(el, {
      y: -8,
      duration: 2.4,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, [float]);

  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      cachedRect.current = el.getBoundingClientRect();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleMouseEnter = () => {
    if (tiltRef.current) cachedRect.current = tiltRef.current.getBoundingClientRect();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cachedRect.current;
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * -30, y: (x - 0.5) * 30 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div ref={floatRef} className="flex items-center">
      <div
        ref={tiltRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative shrink-0 ${sizeClass}`}
        style={{
          transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: tilt.x === 0 && tilt.y === 0
            ? "transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)"
            : "transform 0.1s ease",
        }}
      >
        <Image src="/images/logo_blanco.png" alt="logo" fill className="object-contain" />
      </div>
    </div>
  );
}

export default function Contact({
  scrollContainerRef,
}: {
  scrollContainerRef: RefObject<HTMLElement | null>;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const scroller = scrollContainerRef.current;
    if (!section || !scroller) return;

    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>("[data-contact-anim]");

      elements.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              scroller,
              start: "top 85%",
              end: "top 55%",
              scrub: true,
            },
            delay: i * 0.05,
          }
        );
      });

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, [scrollContainerRef]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-screen h-screen bg-black flex items-center"
    >
      <div className="flex flex-col gap-8 pl-[19%] w-[62%]">


        {/* Title + small 3D logo */}
        <div data-contact-anim>
          <div className="flex items-center gap-12">
            <h2 className="text-white text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Let&apos;s work
              <br />
              together
            </h2>
            <div className="mt-6">
              <Logo3D sizeClass="w-36 h-36" float={false} />
            </div>
          </div>
          <div className="w-12 h-px bg-white/20 mt-5" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div data-contact-anim>
            <label
              htmlFor="name"
              className="block text-white text-sm tracking-[0.2em] uppercase mb-2"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="off"
              placeholder="Your name"
              className="
                w-3/4 bg-transparent border-b border-white/15
                text-white text-base py-2 px-0
                placeholder:text-white/60
                focus:border-white/50 focus:outline-none
                transition-colors duration-300
              "
            />
          </div>

          <div data-contact-anim>
            <label
              htmlFor="email"
              className="block text-white text-sm tracking-[0.2em] uppercase mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="off"
              placeholder="your@email.com"
              className="
                w-3/4 bg-transparent border-b border-white/15
                text-white text-base py-2 px-0
                placeholder:text-white/60
                focus:border-white/50 focus:outline-none
                transition-colors duration-300
              "
            />
          </div>

          <div data-contact-anim>
            <label
              htmlFor="message"
              className="block text-white text-sm tracking-[0.2em] uppercase mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={3}
              autoComplete="off"
              placeholder="Tell me about your project..."
              className="
                w-3/4 bg-transparent border-b border-white/15
                text-white text-base py-2 px-0 resize-y min-h-18 max-h-40
                placeholder:text-white/60
                focus:border-white/50 focus:outline-none
                transition-colors duration-300
              "
            />
          </div>

          <div data-contact-anim>
            <button
              type="submit"
              disabled={sent}
              className={`
                text-sm font-semibold tracking-[0.15em] uppercase
                rounded-full px-8 py-3.5
                transition-all duration-500
                ${
                  sent
                    ? "bg-white/10 text-white/50 border border-white/10 cursor-default"
                    : "bg-black text-white border-2 border-white hover:bg-white hover:text-black"
                }
              `}
            >
              {sent ? "Sent!" : "Send Message"}
            </button>
          </div>
        </form>
      </div>

      {/* Right side card */}
      <div className="flex-1 flex items-center justify-center pr-[15%]">
        <div className="group duration-500 -rotate-12 hover:rotate-0 hover:skew-x-1 hover:translate-x-6 hover:translate-y-12 transition-all cursor-default">
          <div className="relative rounded-2xl w-96 h-52 bg-zinc-800 text-gray-50 flex flex-col justify-center items-center gap-2
            before:-skew-x-12 before:rounded-2xl before:absolute before:content-[''] before:bg-neutral-700 before:right-4 before:top-0 before:w-96 before:h-48 before:-z-10">
            <span className="text-5xl font-bold">Alex Cortell</span>
            <p className="text-white font-thin text-lg">— App Web Developer —</p>
          </div>
        </div>
      </div>
    </section>
  );
}
