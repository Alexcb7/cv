import SplineScene from "@/app/components/SplineScene";
import { FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import Image from "next/image";


export default function Home() {
  return (
    <section
      id="home"
       className="snap-start relative isolate w-screen h-screen overflow-hidden bg-black"
    >
      {/* Background 3D */}
      <SplineScene />

      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-black/35" />

      {/* Lateral izquierdo: logo + línea + redes */}
      <div className="fixed left-6 top-8 z-30 hidden md:flex flex-col items-center gap-6">

        {/* LOGO */}
        <div className="mb-4">
          <Image
            src="/images/logo_blanco.png"
            alt="Alex Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>

        {/* línea decorativa */}
        <span className="h-16 w-px bg-white/30" />

        {/* redes */}
        <a
          href="https://instagram.com/"
          target="_blank"
          rel="noreferrer"
          className="text-white/60 hover:text-white transition-colors"
          aria-label="Instagram"
        >
          <FaInstagram size={18} />
        </a>

        <a
          href="https://linkedin.com/"
          target="_blank"
          rel="noreferrer"
          className="text-white/60 hover:text-white transition-colors"
          aria-label="LinkedIn"
        >
          <FaLinkedinIn size={18} />
        </a>

        <a
          href="https://github.com/"
          target="_blank"
          rel="noreferrer"
          className="text-white/60 hover:text-white transition-colors"
          aria-label="GitHub"
        >
          <FaGithub size={18} />
        </a>
      </div>



      {/* Contenido */}
      <div className="relative z-20 flex h-full items-center justify-center px-8 text-center text-white">
        <div>
          <p className="mb-4 text-sm uppercase tracking-widest text-white/70">
            Hi, I’m Alex
          </p>

          <h1 className="text-6xl md:text-7xl font-bold leading-tight">
            Full-Stack Developer
          </h1>

          <p className="mt-4 text-2xl md:text-3xl text-white/80">
            UI & UX Designer
          </p>
        </div>
      </div>
    </section>
  );
}
