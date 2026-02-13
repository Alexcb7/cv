"use client";

import Header from "@/app/components/Header";
import SplineScene from "@/app/components/SplineScene";
import { FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import Image from "next/image";

export default function Home() {
  return (
    <section
      id="home"
      className="relative isolate w-screen min-h-screen overflow-hidden bg-black"
    >
      {/* Header SOLO en Home */}
      <div className="absolute top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* Background 3D */}
      <SplineScene />

      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-black/35" />

      {/* Lateral izquierdo: logo + línea + redes */}
      <div className="absolute left-6 top-8 z-30 hidden md:flex flex-col items-center gap-6">
        {/* LOGO */}
        <div className="mb-4">
          <Image
            src="/images/logo_blanco.png"
            alt="Alex Logo"
            width={60}
            height={60}
            className="object-contain"
          />
        </div>

        {/* línea decorativa */}
        <span className="h-46 w-px bg-white" />

        {/* redes */}
        <a
          href="https://instagram.com/"
          target="_blank"
          rel="noreferrer"
          className="text-white/60 hover:text-white transition-colors"
          aria-label="Instagram"
        >
          <FaInstagram size={24} />
        </a>

        <a
          href="https://linkedin.com/"
          target="_blank"
          rel="noreferrer"
          className="text-white/60 hover:text-white transition-colors"
          aria-label="LinkedIn"
        >
          <FaLinkedinIn size={24} />
        </a>

        <a
          href="https://github.com/"
          target="_blank"
          rel="noreferrer"
          className="text-white/60 hover:text-white transition-colors"
          aria-label="GitHub"
        >
          <FaGithub size={24} />
        </a>
      </div>

      {/* Contenido */}
      <div className="relative z-20 flex min-h-screen items-center justify-center px-8 text-center text-white">
        <div>
          <p className="mb-4 text-sm uppercase tracking-widest text-white/70">
            Alex Cortell
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
