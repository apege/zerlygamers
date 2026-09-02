'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Menu,
  Search,
  LogOut,
  X,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Users,
  Tag,
  MessageCircleHeart,
  Ban,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { AdminOrder } from '@/data/adminDummyData';

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  orders?: AdminOrder[];
  onSelectOrder?: (order: AdminOrder) => void;
  onSelectTab?: (tab: string) => void;
}

export default function AdminHeader({
  onToggleSidebar,
  searchQuery = '',
  onSearchChange,
  orders = [],
  onSelectOrder,
  onSelectTab,
}: AdminHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close autocomplete on click outside or ESC
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Quick preset shortcuts
  const quickFilters = [
    { label: 'Order Masuk', tab: 'order-masuk', icon: ShoppingBag, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { label: 'Order Diproses', tab: 'order-diproses', icon: Clock, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { label: 'Order Selesai', tab: 'order-selesai', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { label: 'Pricelist Robux', tab: 'pricelist-robux', icon: Tag, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { label: 'Daftar Pelanggan', tab: 'daftar-pelanggan', icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { label: 'Blacklist Toko', tab: 'blacklist', icon: Ban, color: 'text-red-600 bg-red-50 border-red-200' },
  ];

  // Matched orders
  const matchedOrders = useMemo(() => {
    if (!searchQuery.trim()) {
      return orders.slice(0, 4); // show recent orders when search is empty
    }
    const q = searchQuery.toLowerCase();
    return orders
      .filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.username.toLowerCase().includes(q) ||
          (o.customerName && o.customerName.toLowerCase().includes(q)) ||
          o.item.toLowerCase().includes(q) ||
          o.statusLabel.toLowerCase().includes(q) ||
          (o.paymentMethod && o.paymentMethod.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [orders, searchQuery]);

  const handleSelectOrder = (ord: AdminOrder) => {
    onSelectOrder?.(ord);
    setIsOpen(false);
  };

  const handleSelectQuickTab = (tabId: string) => {
    onSelectTab?.(tabId);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 lg:px-8 py-3 bg-white/90 backdrop-blur-md border-b border-rose-100/90 shadow-2xs">
      {/* Left: Mobile Sidebar Toggle + Autocomplete Search Container */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl" ref={containerRef}>
        {/* Toggle Button for mobile */}
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className="lg:hidden p-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Search Bar Input with Autocomplete Dropdown */}
        <div className="relative flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => {
                onSearchChange?.(e.target.value);
                setIsOpen(true);
              }}
              placeholder="Cari order, username, status..."
              className="w-full pl-10 pr-9 py-2.5 bg-rose-50/40 hover:bg-rose-50/60 focus:bg-white border border-rose-200/90 rounded-full text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange?.('');
                  inputRef.current?.focus();
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-rose-500 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown Box */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-rose-100/90 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-98 duration-150 divide-y divide-rose-50">
              {/* 1. Quick Tab Filters */}
              <div className="p-3 bg-rose-50/30">
                <div className="px-2 pb-2 text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-rose-400" />
                  <span>Kategori &amp; Filter Cepat</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {quickFilters.map((qf) => {
                    const Icon = qf.icon;
                    return (
                      <button
                        key={qf.tab}
                        type="button"
                        onClick={() => handleSelectQuickTab(qf.tab)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold border transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs ${qf.color}`}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{qf.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Order Matches List */}
              <div className="p-3 space-y-1.5 max-h-72 overflow-y-auto">
                <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center justify-between">
                  <span>{searchQuery ? 'Hasil Pencarian Order' : 'Pesanan Terbaru'}</span>
                  <span>{matchedOrders.length} ditemukan</span>
                </div>

                {matchedOrders.length === 0 ? (
                  <div className="py-6 text-center text-xs text-gray-400">
                    Tidak ada pesanan yang cocok dengan <strong className="text-gray-600">&quot;{searchQuery}&quot;</strong>
                  </div>
                ) : (
                  matchedOrders.map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => handleSelectOrder(ord)}
                      className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-rose-50/60 border border-transparent hover:border-rose-100 transition-all cursor-pointer group"
                    >
                      {/* Left: Code, Username & Item */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-gradient-to-tr group-hover:from-rose-500 group-hover:to-pink-500 group-hover:text-white transition-all">
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 leading-tight">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-xs text-rose-600">
                              {ord.orderNumber}
                            </span>
                            <span className="font-extrabold text-xs text-gray-900 truncate">
                              {ord.username}
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-400 font-medium">
                            {ord.item} • {ord.priceFormatted}
                          </span>
                        </div>
                      </div>

                      {/* Right: Status Pill & Arrow */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            ord.status === 'selesai'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : ord.status === 'diproses'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : ord.status === 'dibatalkan'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {ord.statusLabel}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-rose-500 transition-colors" />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Bottom Helper Footer */}
              <div className="px-4 py-2 bg-gray-50 flex items-center justify-between text-[10px] text-gray-400 font-medium">
                <span>Klik item untuk langsung membuka detail</span>
                <span>Tekan ESC untuk menutup</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Admin Profile & Logout Button */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Profile Info */}
        <div className="flex items-center gap-2.5">
          {/* Avatar with Rose Ring */}
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-rose-500 bg-rose-100 shadow-xs shrink-0 ring-2 ring-rose-300/40">
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
            <span className="text-[11px] font-bold text-rose-600 mt-0.5">
              Super Admin
            </span>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-7 w-px bg-rose-200/90" />

        {/* Logout Pill Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full border border-rose-300/80 bg-rose-50/50 hover:bg-rose-100/80 text-rose-600 text-xs font-black shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-600" />
          <span>Logout</span>
        </Link>
      </div>
    </header>
  );
}
