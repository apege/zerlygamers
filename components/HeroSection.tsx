"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, ChevronRight, ShieldCheck, Zap, Award, Headphones, Flame } from "lucide-react";

export interface PromoData {
  isActive: boolean;
  robuxAmount: number;
  discountPrice: number;
  originalPrice?: number;
  tagline?: string;
  endDateFormatted?: string;
}

interface HeroSectionProps {
  onOpenAllPackages: () => void;
  promoData?: PromoData;
  onSelectPromoPackage?: (amount: number) => void;
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

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenAllPackages,
  promoData,
  onSelectPromoPackage,
}) => {
  const isPromoActive = Boolean(promoData?.isActive && promoData.robuxAmount > 0);

  return (
    <section id="beranda" className="w-full relative pt-1 pb-2 overflow-visible">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] lg:w-[650px] h-[300px] sm:h-[380px] lg:h-[420px] bg-gradient-to-tr from-pink-300/35 via-rose-200/40 to-pink-100/20 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Floating Sparkles & Hearts */}
      <div aria-hidden="true" className="hidden sm:block absolute top-2 left-[28%] text-pink-400 text-2xl animate-float-slow select-none z-10">💕</div>
      <div aria-hidden="true" className="hidden sm:block absolute top-6 right-[26%] text-pink-400 text-xl animate-sparkle select-none z-10">✨</div>
      <div aria-hidden="true" className="hidden sm:block absolute bottom-6 left-[25%] text-pink-400 text-xl animate-float-slow select-none z-10">💖</div>
      <div aria-hidden="true" className="hidden sm:block absolute top-[28%] right-[20%] text-pink-300 text-lg animate-sparkle select-none z-10">⭐</div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center relative z-10">
        
        {/* 1. Left Column: Headline, Promo Banner & Call To Action */}
        <div className="lg:col-span-4 flex flex-col items-start gap-2.5 text-left z-20 order-1">
          {/* Badge Top Headline (Promo vs #1 Top Up) */}
          {isPromoActive ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-100 via-rose-100 to-amber-100 border border-pink-300/90 text-[#BE185D] text-[10.5px] sm:text-[11px] font-black tracking-wider uppercase shadow-xs">
              <Flame aria-hidden="true" className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
              <span>PROMO SPESIAL HARI INI</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/95 border border-pink-300/90 text-[#BE185D] text-[10.5px] sm:text-[11px] font-extrabold tracking-wider uppercase shadow-xs">
              <Sparkles aria-hidden="true" className="w-3.5 h-3.5 text-[#BE185D]" />
              <span>#1 TOP UP GAME TERPERCAYA</span>
            </div>
          )}

          {/* Main Typography Header */}
          <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-black leading-[1.1] sm:leading-[1.08] tracking-tight uppercase">
            <span className="block text-[#BE185D] drop-shadow-[0_2px_4px_rgba(255,29,126,0.18)]">
              TOP UP GAME
            </span>
            <span className="block text-[#D81467] drop-shadow-[0_2px_4px_rgba(255,46,136,0.18)]">
              AMAN, CEPAT &amp; TERPERCAYA
            </span>
          </h1>

          {/* Promo Highlight Banner or Standard Subtitle */}
          {isPromoActive && promoData ? (
            <div className="w-full max-w-sm p-3 rounded-2xl bg-gradient-to-r from-pink-50/95 via-rose-50/85 to-amber-50/70 border border-pink-200/90 shadow-xs space-y-1 animate-in fade-in">
              <div className="flex items-start gap-1.5">
                <div className="w-5 h-5 rounded-md bg-rose-100 text-[#BE185D] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Zap aria-hidden="true" className="w-3 h-3 fill-[#BE185D]" />
                </div>
                <p className="text-[11.5px] sm:text-xs text-gray-800 font-medium leading-snug">
                  Dapatkan promo spesial{" "}
                  <strong className="font-black text-gray-900">
                    {promoData.robuxAmount.toLocaleString("id-ID")} Robux
                  </strong>{" "}
                  cuma{" "}
                  <span className="font-black text-[#BE185D] text-[13px]">
                    Rp {promoData.discountPrice.toLocaleString("id-ID")}
                  </span>{" "}
                  {promoData.originalPrice && promoData.originalPrice > promoData.discountPrice && (
                    <span className="line-through text-gray-600 font-bold text-[10px] ml-0.5">
                      Rp {promoData.originalPrice.toLocaleString("id-ID")}
                    </span>
                  )}
                  .{" "}
                  {promoData.endDateFormatted && (
                    <span>
                      Berlaku s/d{" "}
                      <strong className="font-black text-amber-800">
                        {promoData.endDateFormatted}
                      </strong>
                    </span>
                  )}
                </p>
              </div>

              {promoData.tagline && (
                <p className="text-[10px] text-gray-600 font-medium italic pl-6.5 truncate">
                  “{promoData.tagline}”
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs sm:text-[13px] text-gray-700 font-medium max-w-sm leading-relaxed">
              Top up game favoritmu dengan harga terbaik, proses instan, dan 100% aman di{" "}
              <span className="font-bold text-[#BE185D]">Zerly Gamers</span>!
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5 w-full sm:w-auto">
            <a
              href="#topup"
              onClick={() => {
                if (isPromoActive && promoData && onSelectPromoPackage) {
                  onSelectPromoPackage(promoData.robuxAmount);
                }
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#FF2E88] via-[#FF3B93] to-[#FF55A3] hover:from-[#E61B75] hover:to-[#FF3B93] text-white font-extrabold text-xs px-5 py-2.5 sm:py-3 rounded-full shadow-lg shadow-pink-500/35 hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wider cursor-pointer"
            >
              <span>{isPromoActive ? "AMBIL PROMO" : "TOP UP SEKARANG"}</span>
              <ChevronRight aria-hidden="true" className="w-4 h-4 stroke-[3]" />
            </a>

            <button
              type="button"
              onClick={onOpenAllPackages}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-white/95 hover:bg-pink-50/80 border-2 border-pink-300 text-[#BE185D] font-extrabold text-xs px-4 py-2.5 rounded-full shadow-xs hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wider cursor-pointer"
            >
              <span>LIHAT SEMUA HARGA</span>
              <ChevronRight aria-hidden="true" className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          {/* Status Indicators */}
          <div className="flex flex-wrap items-center gap-3 pt-0.5 text-[10.5px] sm:text-[11px] font-bold text-gray-700">
            <div className="flex items-center gap-1.5">
              <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-[#FF2E88] animate-ping" />
              <span>Online 24 Jam</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-[#0088CC]" />
              <span>Proses Instan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-[#FF2E88]" />
              <span>Legal &amp; Aman</span>
            </div>
          </div>
        </div>

        {/* 2. Feature Cards: 
               - ON MOBILE: Infinite Auto-Scrolling Marquee Ticker
               - ON DESKTOP: 4 Stacked Cards on right column */}
        
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
                    <Icon aria-hidden="true" className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] font-black uppercase text-gray-800 tracking-wide whitespace-nowrap">
                      {feat.title}
                    </span>
                    <p className="text-[9.5px] text-gray-600 font-medium leading-tight whitespace-nowrap">
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
                    <Icon aria-hidden="true" className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] font-black uppercase text-gray-800 tracking-wide whitespace-nowrap">
                      {feat.title}
                    </span>
                    <p className="text-[9.5px] text-gray-600 font-medium leading-tight whitespace-nowrap">
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
                  <Icon aria-hidden="true" className="w-4.5 h-4.5" />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-xs font-black uppercase text-gray-800 tracking-wide truncate">
                    {feat.title}
                  </span>
                  <p className="text-[10px] text-gray-600 font-medium leading-tight truncate">
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
                src="/karakter.webp"
                alt="Zerly Gamers Mascot Character"
                width={540}
                height={540}
                sizes="(max-width: 640px) 310px, (max-width: 1024px) 380px, 540px"
                priority
                className="object-contain max-h-[310px] sm:max-h-[380px] lg:max-h-[480px] w-auto drop-shadow-2xl"
              />
            </div>

            {/* Big Shield Logo Emblem */}
            <div className="absolute bottom-2 sm:bottom-4 left-3 sm:-left-4 lg:-left-16 z-20 pointer-events-none">
              <Image
                src="/logo.webp"
                alt="Zerly Gamers Shield Emblem"
                width={280}
                height={110}
                sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 280px"
                className="object-contain drop-shadow-[0_12px_24px_rgba(255,42,133,0.4)] w-[150px] sm:w-[200px] lg:w-[280px] h-auto"
              />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
