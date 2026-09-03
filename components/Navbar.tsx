"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, User, Menu, X, Home as HomeIcon, Gamepad2, HelpCircle, MessageSquare, PhoneCall, BookOpen } from "lucide-react";

interface NavbarProps {
  onOpenCaraOrder: () => void;
  onOpenFaq: () => void;
  storeName?: string;
  logoPath?: string;
  whatsappNumber?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCaraOrder,
  onOpenFaq,
  storeName: initialStoreName,
  logoPath: initialLogoPath,
  whatsappNumber: initialWaNumber,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storeName, setStoreName] = useState(initialStoreName || "Zerly Gamers");
  const [logoPath, setLogoPath] = useState(initialLogoPath || "/logo.webp");
  const [whatsappNumber, setWhatsappNumber] = useState(initialWaNumber || "6285624595886");

  useEffect(() => {
    if (initialStoreName) setStoreName(initialStoreName);
    if (initialLogoPath) setLogoPath(initialLogoPath);
    if (initialWaNumber) setWhatsappNumber(initialWaNumber);
  }, [initialStoreName, initialLogoPath, initialWaNumber]);

  const cleanWa = whatsappNumber.replace(/[^0-9]/g, "");
  const waContactLink = `https://wa.me/${cleanWa}?text=Halo%20Admin%20${encodeURIComponent(storeName)}%2C%20saya%20ingin%20bertanya%20seputar%20top%20up%20Robux.`;

  // Split store name into primary and secondary words if applicable
  const nameParts = storeName.trim().split(" ");
  const mainWord = nameParts[0] || "ZERLY";
  const subWord = nameParts.slice(1).join(" ") || "GAMERS";

  return (
    <>
      <header className="w-full bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border-2 border-pink-200/90 shadow-md shadow-pink-100/50 px-3.5 sm:px-6 py-0 flex items-center justify-between z-40 h-14 sm:h-16 relative">
        
        {/* 1. Left: Brand Logo & Dynamic Store Name from API */}
        <div className="flex items-center">
          <a href="/" aria-label={`${storeName} - Beranda`} className="flex items-center gap-2 sm:gap-2.5 transition-transform active:scale-95 group">
            <Image
              src={logoPath}
              alt={storeName}
              width={160}
              height={55}
              sizes="(max-width: 640px) 130px, 160px"
              priority
              className="object-contain drop-shadow-xs h-9 sm:h-11 w-auto group-hover:scale-105 transition-transform"
            />
            {/* Dynamic Store Name Display */}
            <div className="flex flex-col text-left">
              <span className="text-xs sm:text-sm lg:text-base font-black text-[#BE185D] leading-none tracking-wider uppercase">
                {mainWord}
              </span>
              <span className="text-[8.5px] sm:text-[9.5px] font-black text-gray-700 tracking-widest leading-none mt-0.5 uppercase">
                {subWord}
              </span>
            </div>
          </a>
        </div>

        {/* 2. Desktop Navigation Menu */}
        <nav aria-label="Navigasi Utama" className="hidden md:flex items-center h-full gap-2 lg:gap-5">
          
          {/* BERANDA (Slanted Pink Tab) */}
          <a
            href="#beranda"
            className="h-full bg-gradient-to-r from-[#FF3B8D] to-[#FF247D] text-white font-black text-xs lg:text-[13px] px-5 lg:px-7 flex items-center gap-1.5 uppercase tracking-wider shadow-sm transition-transform hover:brightness-105"
            style={{
              clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)",
            }}
          >
            <svg aria-hidden="true" className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span className="pr-1">BERANDA</span>
          </a>

          {/* TOP UP (with Hexagon Icon) */}
          <a
            href="#topup"
            className="flex items-center gap-1.5 text-gray-900 hover:text-[#FF2E88] font-black text-xs lg:text-[13px] uppercase tracking-wide transition-colors py-2"
          >
            <svg
              aria-hidden="true"
              className="w-4 h-4 text-gray-900 stroke-[2.5]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 2 8 4.5v11L12 22l-8-4.5v-11L12 2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>TOP UP</span>
          </a>

          {/* CARA ORDER */}
          <button
            type="button"
            onClick={onOpenCaraOrder}
            className="text-gray-900 hover:text-[#FF2E88] font-black text-xs lg:text-[13px] uppercase tracking-wide transition-colors py-2 cursor-pointer"
          >
            CARA ORDER
          </button>

          {/* TESTIMONI */}
          <a
            href="#testimoni"
            className="text-gray-900 hover:text-[#FF2E88] font-black text-xs lg:text-[13px] uppercase tracking-wide transition-colors py-2"
          >
            TESTIMONI
          </a>

          {/* FAQ */}
          <button
            type="button"
            onClick={onOpenFaq}
            className="text-gray-900 hover:text-[#FF2E88] font-black text-xs lg:text-[13px] uppercase tracking-wide transition-colors py-2 cursor-pointer"
          >
            FAQ
          </button>

          {/* KONTAK DYNAMIC WHATSAPP */}
          <a
            href={waContactLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 hover:text-[#FF2E88] font-black text-xs lg:text-[13px] uppercase tracking-wide transition-colors py-2 flex items-center gap-1"
          >
            <PhoneCall aria-hidden="true" className="w-3.5 h-3.5 text-emerald-600" />
            <span>KONTAK</span>
          </a>
        </nav>

        {/* 3. Right: Desktop HALO GAMER & Mobile Actions Group */}
        <div className="flex items-center gap-2">
          {/* Desktop Halo Gamer */}
          <div className="hidden xl:flex items-center">
            <button
              type="button"
              onClick={onOpenCaraOrder}
              aria-label="Panduan Halo Gamer"
              className="bg-pink-50/50 hover:bg-pink-100/70 border-2 border-pink-300 rounded-xl px-3.5 py-1.5 flex items-center gap-2 shadow-2xs transition-all cursor-pointer group"
            >
              <div aria-hidden="true" className="w-5 h-5 rounded-full bg-[#FF2E88] text-white flex items-center justify-center text-xs">
                <User className="w-3 h-3 fill-current" />
              </div>
              <span className="text-[11.5px] font-black text-[#D81467] tracking-wider uppercase">
                HALO, GAMER!
              </span>
              <ChevronDown aria-hidden="true" className="w-3.5 h-3.5 text-[#D81467] stroke-[3] group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Right Action Group: TOP UP CTA + Hamburger */}
          <div className="flex md:hidden items-center gap-1.5">
            <a
              href="#topup"
              className="bg-gradient-to-r from-[#FF3B8D] to-[#FF247D] text-white font-extrabold text-[11px] px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1 uppercase tracking-wide active:scale-95 transition-transform"
            >
              <Gamepad2 aria-hidden="true" className="w-3.5 h-3.5" />
              <span>TOP UP</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Buka menu navigasi"
              aria-expanded={mobileMenuOpen}
              className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-300 text-[#FF2E88] flex items-center justify-center shadow-xs cursor-pointer hover:bg-pink-100 active:scale-95 transition-all"
            >
              {mobileMenuOpen ? <X aria-hidden="true" className="w-5 h-5" /> : <Menu aria-hidden="true" className="w-5 h-5" />}
            </button>
          </div>
        </div>

      </header>

      {/* Mobile Slide-down Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-white/95 backdrop-blur-md rounded-2xl border-2 border-pink-200 shadow-xl p-4 flex flex-col gap-2 z-30 animate-in slide-in-from-top-3 duration-200 text-left mt-1">
          <a
            href="#beranda"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-pink-50 text-[#BE185D] font-bold text-xs"
          >
            <HomeIcon aria-hidden="true" className="w-4 h-4 text-[#BE185D]" />
            <span>BERANDA</span>
          </a>

          <a
            href="#topup"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-800 hover:bg-pink-50 hover:text-[#BE185D] font-bold text-xs"
          >
            <Gamepad2 aria-hidden="true" className="w-4 h-4 text-[#BE185D]" />
            <span>TOP UP ROBUX</span>
          </a>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCaraOrder();
            }}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-800 hover:bg-pink-50 hover:text-[#BE185D] font-bold text-xs text-left cursor-pointer"
          >
            <BookOpen aria-hidden="true" className="w-4 h-4 text-[#BE185D]" />
            <span>CARA ORDER</span>
          </button>

          <a
            href="#testimoni"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-800 hover:bg-pink-50 hover:text-[#BE185D] font-bold text-xs"
          >
            <MessageSquare aria-hidden="true" className="w-4 h-4 text-[#BE185D]" />
            <span>TESTIMONI</span>
          </a>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenFaq();
            }}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-800 hover:bg-pink-50 hover:text-[#BE185D] font-bold text-xs text-left cursor-pointer"
          >
            <HelpCircle aria-hidden="true" className="w-4 h-4 text-[#BE185D]" />
            <span>FAQ</span>
          </button>

          <a
            href={waContactLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-800 hover:bg-pink-50 hover:text-[#BE185D] font-bold text-xs"
          >
            <PhoneCall aria-hidden="true" className="w-4 h-4 text-emerald-600" />
            <span>KONTAK WHATSAPP</span>
          </a>
        </div>
      )}
    </>
  );
};
