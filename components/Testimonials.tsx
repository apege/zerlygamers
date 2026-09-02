"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Testimonial } from "@/types/landing";

interface TestimonialsProps {
  testimonials: Testimonial[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onOpenFaq?: () => void;
}

const getInitial = (name: string) => {
  const clean = name.replace(/^@/, "").trim();
  return clean.charAt(0).toUpperCase() || "G";
};

// Array of soft vibrant gaming gradient styles for initials
const AVATAR_GRADIENTS = [
  "from-[#FF2E88] to-[#FF55A3]",
  "from-[#9333EA] to-[#C084FC]",
  "from-[#0284C7] to-[#38BDF8]",
  "from-[#059669] to-[#34D399]",
  "from-[#EA580C] to-[#F97316]",
];

export const Testimonials: React.FC<TestimonialsProps> = ({
  testimonials,
  currentIndex,
  onPrev,
  onNext,
}) => {
  const current = testimonials[currentIndex];
  const initial = getInitial(current.username);
  const gradientClass = AVATAR_GRADIENTS[currentIndex % AVATAR_GRADIENTS.length];

  return (
    <div
      id="testimoni"
      className="lg:col-span-5 bg-white/95 backdrop-blur-md rounded-3xl border-2 border-pink-200/90 p-5 shadow-sm flex flex-col justify-between gap-3 relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between text-left">
        <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-[#FF1D7E]">
          APA KATA GAMERS?
        </h3>
      </div>

      {/* Testimonial Box with Carousel Controls */}
      <div className="flex items-center gap-2 bg-pink-50/70 border border-pink-200 rounded-2xl p-3.5 relative z-10 my-auto">
        {/* Prev Button */}
        <button
          onClick={onPrev}
          aria-label="Previous Testimonial"
          className="w-8 h-8 rounded-full bg-white border border-pink-200 text-pink-600 flex items-center justify-center hover:bg-pink-100 transition-colors shrink-0 cursor-pointer shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Review Content */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Initial Letter Avatar */}
          <div
            className={`w-11 h-11 rounded-full bg-gradient-to-tr ${gradientClass} text-white font-black text-lg flex items-center justify-center border-2 border-white shadow-sm shrink-0 select-none`}
          >
            {initial}
          </div>

          {/* Text & Rating */}
          <div className="flex flex-col text-left min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-gray-800 truncate">
                {current.username}
              </span>
              <div className="flex items-center text-amber-400">
                {[...Array(current.stars)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-[11.5px] text-gray-600 font-medium leading-snug line-clamp-2 mt-0.5">
              {current.text}
            </p>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          aria-label="Next Testimonial"
          className="w-8 h-8 rounded-full bg-white border border-pink-200 text-pink-600 flex items-center justify-center hover:bg-pink-100 transition-colors shrink-0 cursor-pointer shadow-2xs"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Subtle indicator dots */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {testimonials.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all ${
              idx === currentIndex ? "w-5 bg-[#FF2E88]" : "w-1.5 bg-pink-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
