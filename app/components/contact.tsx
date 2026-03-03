"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center px-8 md:px-20 lg:px-28">
        <div className="w-full max-w-md">
        <div data-contact-anim className="mb-10">
          <h2 className="text-white text-5xl md:text-6xl font-bold tracking-tight">
            Let&apos;s work
            <br />
            together
          </h2>
          <div className="w-12 h-px bg-white/20 mt-5" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md">
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
              placeholder="Tell me about your project..."
              className="
                w-full bg-transparent border-b border-white/15
                text-white text-base py-3 px-0
                placeholder:text-white/60
                focus:border-white/50 focus:outline-none
                transition-colors duration-300
                resize-y overflow-hidden
              "
            />
          </div>

          <div>
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
      </div>

      {/* Right half — free for future content */}
      <div className="hidden md:block w-1/2 h-full" />
    </section>
  );
}
