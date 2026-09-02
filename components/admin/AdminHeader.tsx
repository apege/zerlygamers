'use client';

import React from 'react';
import Image from 'next/image';
import { Menu, Search, LogOut } from 'lucide-react';
import Link from 'next/link';

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export default function AdminHeader({
  onToggleSidebar,
  searchQuery = '',
  onSearchChange,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 lg:px-8 py-3.5 bg-white/85 backdrop-blur-md border-b border-pink-100/90 shadow-xs">
      {/* Left: Mobile Sidebar Toggle + Search Box */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        {/* Toggle Button for mobile */}
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className="lg:hidden p-2.5 rounded-xl bg-gradient-to-r from-[#FF2A85] to-[#FF4D97] text-white shadow-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Cari order, username, email, status..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-pink-200/90 rounded-2xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/40 focus:border-pink-400 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Right: Admin Profile & Logout Button (ChampionStore Style) */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Profile Info */}
        <div className="flex items-center gap-2.5">
          {/* Avatar with Pink Ring */}
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-[#FF2A85] bg-pink-100 shadow-xs shrink-0 ring-2 ring-pink-300/40">
            <Image
              src="/karakter.png"
              alt="Admin Zerly"
              fill
              sizes="40px"
              className="object-cover object-top scale-125"
            />
          </div>

          {/* Name & Role */}
          <div className="hidden sm:flex flex-col text-left leading-tight">
            <span className="text-xs sm:text-sm font-extrabold text-gray-900 tracking-tight">
              Admin Zerly
            </span>
            <span className="text-[11px] font-bold text-[#FF2A85] mt-0.5">
              Super Admin
            </span>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-7 w-px bg-pink-200/90" />

        {/* Logout Pill Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full border border-pink-300/80 bg-pink-50/50 hover:bg-pink-100/80 text-[#FF2A85] text-xs font-extrabold shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 text-[#FF2A85]" />
          <span>Logout</span>
        </Link>
      </div>
    </header>
  );
}
