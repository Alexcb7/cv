"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Logo3D() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const floatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = floatRef.current;
    if (!el) return;
    gsap.to(el, {
      y: -18,
      duration: 2.4,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * -30, y: (x - 0.5) * 30 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div ref={floatRef}>
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-80 h-80"
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
      {/* Left half — form */}
      <div className="w-full md:w-[58%] h-full flex flex-col justify-center px-10 md:px-20 lg:px-28">
        <div data-contact-anim className="mb-10">
          <h2 className="text-white text-5xl md:text-6xl font-bold tracking-tight">
            Let&apos;s work
            <br />
            together
          </h2>
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
                w-full bg-transparent border-b border-white/15
                text-white text-base py-3 px-0
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
                w-full bg-transparent border-b border-white/15
                text-white text-base py-3 px-0
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
                w-full bg-transparent border-b border-white/15
                text-white text-base py-3 px-0 resize-none
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

      {/* Right half — 3D logo */}
      <div className="hidden md:block w-[42%] h-full">
        <Logo3D />
      </div>
    </section>
  );
}
