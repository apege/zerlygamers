"use client";

import React from "react";
import { ShieldCheck, Zap, Award, Headphones, Wallet } from "lucide-react";

export const WhyChooseUs: React.FC = () => {
  return (
    <div className="lg:col-span-7 bg-white/95 backdrop-blur-md rounded-3xl border-2 border-pink-200/90 p-4 sm:p-5 shadow-sm flex flex-col gap-3.5">
      {/* Header with matching hexagon icon */}
      <div className="flex items-center gap-2.5 text-left">
        <div className="w-7 h-7 rounded-xl bg-pink-100 text-[#BE185D] border border-pink-300 flex items-center justify-center shadow-xs">
          <svg
            aria-hidden="true"
            className="w-4 h-4 text-[#BE185D] stroke-[2.5]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 2 8 4.5v11L12 22l-8-4.5v-11L12 2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <h3 className="text-xs sm:text-sm md:text-base font-black uppercase tracking-wide text-[#BE185D]">
          KENAPA PILIH ZERLY GAMERS?
        </h3>
      </div>

      {/* 5 Features Row (Compact & Tightly Spaced) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 pt-0.5">
        {/* Feature 1 */}
        <div className="flex flex-col items-center text-center gap-1.5 p-2.5 rounded-2xl bg-pink-50/40 border border-pink-100/80">
          <div className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-[#FF2E88]">
            <ShieldCheck aria-hidden="true" className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-800 uppercase leading-tight">
              AMAN &amp; RESMI
            </span>
            <span className="text-[9px] text-gray-600 font-medium leading-tight mt-0.5">
              100% legal terjamin
            </span>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center text-center gap-1.5 p-2.5 rounded-2xl bg-pink-50/40 border border-pink-100/80">
          <div className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-[#FF2E88]">
            <Zap aria-hidden="true" className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-800 uppercase leading-tight">
              PROSES CEPAT
            </span>
            <span className="text-[9px] text-gray-600 font-medium leading-tight mt-0.5">
              Hitungan menit
            </span>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center text-center gap-1.5 p-2.5 rounded-2xl bg-pink-50/40 border border-pink-100/80">
          <div className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-[#FF2E88]">
            <Award aria-hidden="true" className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-800 uppercase leading-tight">
              HARGA TERBAIK
            </span>
            <span className="text-[9px] text-gray-600 font-medium leading-tight mt-0.5">
              Murah &amp; bersaing
            </span>
          </div>
        </div>

        {/* Feature 4 */}
        <div className="flex flex-col items-center text-center gap-1.5 p-2.5 rounded-2xl bg-pink-50/40 border border-pink-100/80">
          <div className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-[#FF2E88]">
            <Headphones aria-hidden="true" className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-800 uppercase leading-tight">
              LAYANAN 24/7
            </span>
            <span className="text-[9px] text-gray-600 font-medium leading-tight mt-0.5">
              Admin fast respon
            </span>
          </div>
        </div>

        {/* Feature 5 */}
        <div className="col-span-2 sm:col-span-1 flex flex-col items-center text-center gap-1.5 p-2.5 rounded-2xl bg-pink-50/40 border border-pink-100/80">
          <div className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-[#FF2E88]">
            <Wallet aria-hidden="true" className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-800 uppercase leading-tight">
              BANYAK METODE
            </span>
            <span className="text-[9px] text-gray-600 font-medium leading-tight mt-0.5">
              QRIS &amp; E-Wallet
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
