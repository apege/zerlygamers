"use client";

import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { RobuxPackage } from "@/types/landing";

interface TopUpRobuxProps {
  packages: RobuxPackage[];
  selectedPackage: RobuxPackage;
  onSelectPackage: (pkg: RobuxPackage) => void;
  onOpenAllPackages: () => void;
}

export const TopUpRobux: React.FC<TopUpRobuxProps> = ({
  packages,
  selectedPackage,
  onSelectPackage,
  onOpenAllPackages,
}) => {
  const handleCardClick = (pkg: RobuxPackage) => {
    onSelectPackage(pkg);

    // Auto-scroll to form order on mobile / tablet devices
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setTimeout(() => {
        const formElem = document.getElementById("form-order");
        if (formElem) {
          formElem.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  return (
    <div className="lg:col-span-8 bg-white/95 backdrop-blur-md rounded-3xl border-2 border-pink-200/90 p-4 sm:p-5 shadow-sm flex flex-col gap-4">
      {/* 1. Header with Hexagon Robux Gaming Icon */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-xl bg-pink-100 text-[#FF2E88] border border-pink-300 flex items-center justify-center shadow-xs">
          <svg
            aria-hidden="true"
            className="w-4 h-4 text-[#FF2E88] stroke-[2.5]"
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
        <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-[#FF1D7E]">
          TOP UP ROBUX
        </h2>
      </div>

      {/* 2. Responsive Grid Layout (2 cols on mobile -> 3 cols tablet -> 6 cols desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-2.5 items-end pt-2">
        {packages.map((pkg) => {
          const isSelected = selectedPackage.id === pkg.id;
          const isBestSeller = pkg.isBestSeller;

          return (
            <div
              key={pkg.id}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              aria-label={`Paket ${pkg.amount} Robux, harga ${pkg.priceFormatted}${isBestSeller ? ", Best Seller" : ""}`}
              onClick={() => handleCardClick(pkg)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick(pkg);
                }
              }}
              className={`relative rounded-2xl flex flex-col items-center justify-between p-2.5 pb-3 transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#FF2E88] ${
                isBestSeller || isSelected
                  ? "bg-pink-50/50 border-2 border-[#FF2E88] shadow-md shadow-pink-200 -translate-y-1 ring-2 ring-pink-300/40"
                  : "bg-white border-2 border-pink-200/80 hover:border-pink-300 hover:bg-pink-50/30"
              }`}
            >
              {/* BEST SELLER BADGE */}
              {isBestSeller && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF2E88] to-[#FF4E98] text-white text-[8.5px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1 whitespace-nowrap">
                  <span>&lt; BEST SELLER &gt;</span>
                </div>
              )}

              {/* Title & Amount */}
              <div className="text-center pt-1">
                <span
                  className={`text-[10.5px] font-black uppercase tracking-wider block ${
                    isBestSeller ? "text-[#D81467]" : "text-gray-800"
                  }`}
                >
                  ROBUX
                </span>
                <span className="text-2xl font-black text-gray-900 leading-none italic block mt-0.5">
                  {pkg.amount}
                </span>
              </div>

              {/* Robux Coin Graphic */}
              <div className="my-2.5 w-12 h-12 relative flex items-center justify-center">
                <Image
                  src="/robux.webp"
                  alt={`Koin Robux ${pkg.amount}`}
                  width={46}
                  height={46}
                  className={`object-contain transition-transform duration-300 drop-shadow-md ${
                    isSelected ? "scale-110" : "hover:scale-105"
                  }`}
                />
              </div>

              {/* Price Pill */}
              <div
                className={`w-full text-center py-1.5 px-1 rounded-xl text-[11px] sm:text-xs font-black transition-all shadow-xs ${
                  isBestSeller || isSelected
                    ? "bg-gradient-to-r from-[#FF2E88] to-[#FF4E98] text-white"
                    : "bg-[#FF2E88] text-white hover:bg-[#E61B75]"
                }`}
              >
                {pkg.priceFormatted}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Bottom Pill Button: LIHAT SEMUA PAKET */}
      <div className="w-full flex justify-center pt-1">
        <button
          type="button"
          onClick={onOpenAllPackages}
          className="inline-flex items-center gap-1.5 px-6 py-2 rounded-full border-2 border-pink-300 bg-white hover:bg-pink-50 text-[#D81467] font-black text-xs uppercase tracking-wider shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span>LIHAT SEMUA PAKET</span>
          <ChevronRight aria-hidden="true" className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
