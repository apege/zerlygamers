"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, ChevronRight, ShieldCheck, Zap, Award, Headphones } from "lucide-react";

interface HeroSectionProps {
  onOpenAllPackages: () => void;
}

const HERO_FEATURES = [
  {
    icon: ShieldCheck,
    title: "100% AMAN",
    desc: "Transaksi aman",
  },
  {
    icon: Zap,
    title: "PROSES INSTAN",
    desc: "Hitungan menit",
  },
  {
    icon: Award,
    title: "HARGA TERBAIK",
    desc: "Termurah & bersaing",
  },
  {
    icon: Headphones,
    title: "LAYANAN 24/7",
    desc: "Bantuan kapan saja",
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAllPackages }) => {
  return (
    <section id="beranda" className="w-full relative pt-1 pb-2 overflow-visible">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] lg:w-[650px] h-[300px] sm:h-[380px] lg:h-[420px] bg-gradient-to-tr from-pink-300/35 via-rose-200/40 to-pink-100/20 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Floating Sparkles & Hearts */}
      <div className="hidden sm:block absolute top-2 left-[28%] text-pink-400 text-2xl animate-float-slow select-none z-10">💕</div>
      <div className="hidden sm:block absolute top-6 right-[26%] text-pink-400 text-xl animate-sparkle select-none z-10">✨</div>
      <div className="hidden sm:block absolute bottom-6 left-[25%] text-pink-400 text-xl animate-float-slow select-none z-10">💖</div>
      <div className="hidden sm:block absolute top-[28%] right-[20%] text-pink-300 text-lg animate-sparkle select-none z-10">⭐</div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center relative z-10">
        
        {/* 1. Left Column: Headline & Call To Action */}
        <div className="lg:col-span-4 flex flex-col items-start gap-3 text-left z-20 order-1">
          {/* Badge #1 TOP UP GAME TERPERCAYA */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/95 border border-pink-300/90 text-[#FF2E88] text-[10.5px] sm:text-[11px] font-extrabold tracking-wider uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FF2E88]" />
            <span>#1 TOP UP GAME TERPERCAYA</span>
          </div>

          {/* Main Typography Header */}
          <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-black leading-[1.1] sm:leading-[1.08] tracking-tight uppercase">
            <span className="block text-[#FF1D7E] drop-shadow-[0_2px_4px_rgba(255,29,126,0.18)]">
              TOP UP GAME
            </span>
            <span className="block text-[#FF2E88] drop-shadow-[0_2px_4px_rgba(255,46,136,0.18)]">
              AMAN, CEPAT &amp;
            </span>
            <span className="block text-[#FF1D7E] drop-shadow-[0_2px_4px_rgba(255,29,126,0.18)]">
              TERPERCAYA!
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-[13px] text-gray-600 font-medium max-w-sm leading-relaxed">
            Top up game favoritmu dengan harga terbaik, proses instan, dan 100% aman di{" "}
            <span className="font-bold text-[#FF2E88]">Zerly Gamers</span>!
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-0.5 w-full sm:w-auto">
            <a
              href="#topup"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF2E88] via-[#FF3B93] to-[#FF55A3] hover:from-[#E61B75] hover:to-[#FF3B93] text-white font-extrabold text-xs px-5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-lg shadow-pink-500/35 hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wider"
            >
              <span>TOP UP SEKARANG</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </a>

            <button
              onClick={onOpenAllPackages}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white/95 hover:bg-pink-50/80 border-2 border-pink-300 text-[#FF2E88] font-extrabold text-xs px-4 sm:px-5 py-2.5 rounded-full shadow-xs hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wider cursor-pointer"
            >
              <span>LIHAT HARGA</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          {/* Status Indicators */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[10.5px] sm:text-[11px] font-bold text-gray-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF2E88] animate-ping" />
              <span>Online 24 Jam</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00C2FF]" />
              <span>Proses Instan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF2E88]" />
              <span>Legal &amp; Aman</span>
            </div>
          </div>
        </div>

        {/* 2. Feature Cards: 
               - ON MOBILE: Infinite Auto-Scrolling Marquee Ticker (Gerak sendiri ke samping)
               - ON DESKTOP: 4 Stacked Cards on the right column */}
        
        {/* Mobile View: Auto-sliding Marquee Ticker */}
        <div className="lg:hidden w-full overflow-hidden py-1 z-20 order-2">
          <div className="animate-marquee-smooth flex items-center gap-2.5 select-none">
            {/* First Set */}
            {HERO_FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={`m1-${idx}`}
                  className="bg-white/95 backdrop-blur-sm border-2 border-pink-200/90 rounded-2xl p-2.5 px-3.5 flex items-center gap-2.5 shadow-2xs shrink-0"
                >
                  <div className="w-7 h-7 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-[#FF2E88] shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <h4 className="text-[11px] font-black uppercase text-gray-800 tracking-wide whitespace-nowrap">
                      {feat.title}
                    </h4>
                    <p className="text-[9.5px] text-gray-500 font-medium leading-tight whitespace-nowrap">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Loop Duplication for seamless infinite sliding */}
            {HERO_FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={`m2-${idx}`}
                  className="bg-white/95 backdrop-blur-sm border-2 border-pink-200/90 rounded-2xl p-2.5 px-3.5 flex items-center gap-2.5 shadow-2xs shrink-0"
                >
                  <div className="w-7 h-7 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-[#FF2E88] shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <h4 className="text-[11px] font-black uppercase text-gray-800 tracking-wide whitespace-nowrap">
                      {feat.title}
                    </h4>
                    <p className="text-[9.5px] text-gray-500 font-medium leading-tight whitespace-nowrap">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop View: Stacked Cards in Column 3 */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-2.5 z-20 order-3">
          {HERO_FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={`d-${idx}`}
                className="bg-white/95 backdrop-blur-sm border-2 border-pink-200/90 rounded-2xl p-3 flex items-center gap-3 shadow-xs hover:shadow-md hover:border-pink-300 transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-[#FF2E88] group-hover:scale-110 group-hover:bg-[#FF2E88] group-hover:text-white transition-all shrink-0">
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <h4 className="text-xs font-black uppercase text-gray-800 tracking-wide truncate">
                    {feat.title}
                  </h4>
                  <p className="text-[10px] text-gray-500 font-medium leading-tight truncate">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Mascot Character & Shield Emblem */}
        <div className="lg:col-span-5 flex items-center justify-center relative min-h-[290px] sm:min-h-[350px] lg:min-h-[380px] -mb-6 sm:-mb-8 lg:-mb-14 overflow-visible order-3 lg:order-2">
          <div className="relative w-full h-[290px] sm:h-[350px] lg:h-[380px] flex items-center justify-center overflow-visible">
            
            {/* Mascot Character Image */}
            <div className="absolute z-10 w-full flex items-center justify-center lg:justify-end pr-0 sm:pr-2 lg:pr-4 animate-float-slow -top-3 sm:-top-8 lg:-top-14 translate-y-3 sm:translate-y-8 lg:translate-y-14 lg:translate-x-12">
              <Image
                src="/karakter.png"
                alt="Zerly Gamers Mascot Character"
                width={540}
                height={540}
                priority
                className="object-contain max-h-[310px] sm:max-h-[380px] lg:max-h-[480px] w-auto drop-shadow-2xl"
              />
            </div>

            {/* Big Shield Logo Emblem */}
            <div className="absolute bottom-2 sm:bottom-4 left-3 sm:-left-4 lg:-left-16 z-20 pointer-events-none">
              <Image
                src="/logo.png"
                alt="Zerly Gamers Shield Emblem"
                width={280}
                height={110}
                priority
                className="object-contain drop-shadow-[0_12px_24px_rgba(255,42,133,0.4)] w-[150px] sm:w-[200px] lg:w-[280px] h-auto"
              />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
