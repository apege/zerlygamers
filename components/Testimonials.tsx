"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Star, ShieldCheck } from "lucide-react";
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

const getAdminReplyText = (reply: any): string | null => {
  if (!reply) return null;
  if (typeof reply === "string") return reply;
  if (typeof reply === "object") {
    return reply.message || reply.text || reply.content || (typeof reply === "string" ? reply : null);
  }
  return null;
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
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const safeIndex = currentIndex >= testimonials.length ? 0 : currentIndex;
  const current = testimonials[safeIndex];
  const initial = getInitial(current.username);
  const gradientClass = AVATAR_GRADIENTS[safeIndex % AVATAR_GRADIENTS.length];
  const adminReplyText = getAdminReplyText(current.adminReply);

  return (
    <div
      id="testimoni"
      className="lg:col-span-5 bg-white/95 backdrop-blur-md rounded-3xl border-2 border-pink-200/90 p-4 sm:p-5 shadow-sm flex flex-col gap-3.5 relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between text-left">
        <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-[#BE185D]">
          APA KATA GAMERS?
        </h3>
      </div>

      {/* Testimonial Box with Carousel Controls */}
      <div className="flex items-center gap-2 bg-pink-50/70 border border-pink-200 rounded-2xl p-3 sm:p-3.5 relative z-10">
        {/* Prev Button */}
        <button
          type="button"
          onClick={onPrev}
          aria-label="Ulasan Sebelumnya"
          className="w-8 h-8 rounded-full bg-white border border-pink-200 text-[#BE185D] flex items-center justify-center hover:bg-pink-100 transition-colors shrink-0 cursor-pointer shadow-2xs"
        >
          <ChevronLeft aria-hidden="true" className="w-4 h-4" />
        </button>

        {/* Review Content */}
        <div className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0">
          {/* Initial Letter Avatar */}
          <div
            aria-hidden="true"
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr ${gradientClass} text-white font-black text-base sm:text-lg flex items-center justify-center border-2 border-white shadow-sm shrink-0 select-none mt-0.5`}
          >
            {initial}
          </div>

          {/* Text & Rating & Optional Admin Reply */}
          <div className="flex flex-col text-left min-w-0 flex-1">
            {/* Username & Rating Stars */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-gray-800 truncate">
                {current.username}
              </span>
              <div aria-label={`Rating ${current.stars} dari 5 bintang`} className="flex items-center text-amber-400 shrink-0">
                {[...Array(current.stars)].map((_, i) => (
                  <Star key={i} aria-hidden="true" className="w-3 h-3 fill-amber-400" />
                ))}
              </div>
            </div>

            {/* Customer Review Text */}
            <p className="text-[11px] sm:text-[11.5px] text-gray-700 font-medium leading-snug line-clamp-2 mt-0.5">
              {current.text}
            </p>

            {/* Admin Reply (Compact, Clean & Layout-Safe) */}
            {adminReplyText && (
              <div className="mt-1.5 pt-1.5 border-t border-pink-200/60 flex items-start gap-1 text-[10.5px]">
                <div className="flex items-center gap-1 text-[#BE185D] font-black shrink-0 text-[10px] bg-pink-100/90 border border-pink-200 px-1.5 py-0.2 rounded-md">
                  <ShieldCheck aria-hidden="true" className="w-3 h-3 text-[#BE185D]" />
                  <span>Admin:</span>
                </div>
                <p className="text-gray-800 italic font-medium leading-tight truncate">
                  &ldquo;{adminReplyText}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={onNext}
          aria-label="Ulasan Berikutnya"
          className="w-8 h-8 rounded-full bg-white border border-pink-200 text-[#BE185D] flex items-center justify-center hover:bg-pink-100 transition-colors shrink-0 cursor-pointer shadow-2xs"
        >
          <ChevronRight aria-hidden="true" className="w-4 h-4" />
        </button>
      </div>

      {/* Subtle indicator dots */}
      <div aria-hidden="true" className="flex items-center justify-center gap-1.5 pt-0.5">
        {testimonials.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all ${
              idx === safeIndex ? "w-5 bg-[#FF2E88]" : "w-1.5 bg-pink-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
