'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  PlusCircle,
  FolderTree,
  Users,
  Ban,
  Receipt,
  BarChart3,
  Store,
  UserCog,
  MessageCircleHeart,
  X,
  Tag,
} from 'lucide-react';

interface AdminSidebarProps {
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function AdminSidebar({
  currentTab = 'dashboard',
  onSelectTab,
  isMobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const navSections = [
    {
      title: 'ORDER MANAGEMENT',
      items: [
        { id: 'order-masuk', label: 'Order Masuk', icon: ShoppingBag, badge: '24' },
        { id: 'order-diproses', label: 'Order Diproses', icon: Clock, badge: '8' },
        { id: 'order-selesai', label: 'Order Selesai', icon: CheckCircle2 },
        { id: 'order-dibatalkan', label: 'Order Dibatalkan', icon: XCircle },
      ],
    },
    {
      title: 'PRICELIST',
      items: [
        { id: 'pricelist-robux', label: 'Pricelist Robux', icon: Tag },
      ],
    },
    {
      title: 'PELANGGAN',
      items: [
        { id: 'daftar-pelanggan', label: 'Daftar Pelanggan', icon: Users },
        { id: 'blacklist', label: 'Blacklist', icon: Ban },
      ],
    },
    {
      title: 'KONTEN & ULASAN',
      items: [
        { id: 'kelola-testimoni', label: 'Kelola Testimoni', icon: MessageCircleHeart },
      ],
    },
    {
      title: 'KEUANGAN',
      items: [
        { id: 'riwayat-keuangan', label: 'Riwayat Pembayaran', icon: Receipt },
      ],
    },
    {
      title: 'PENGATURAN',
      items: [
        { id: 'pengaturan-toko', label: 'Pengaturan Toko', icon: Store },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white/95 backdrop-blur-md border-r border-pink-100/90 z-50 flex flex-col justify-between overflow-hidden transition-transform duration-300 ease-in-out shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Fixed Header: Logo Only */}
        <div className="p-4 pb-2 shrink-0 border-b border-pink-100/50">
          {/* Top Big 1:1 Centered Logo */}
          <div className="relative flex flex-col items-center justify-center pt-1 pb-1">
            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              aria-label="Tutup Menu"
              className="lg:hidden absolute top-0 right-0 p-1.5 rounded-lg text-gray-400 hover:text-pink-600 hover:bg-pink-50 transition-colors z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <Link href="/" className="group block text-center">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto transition-transform group-hover:scale-105 duration-200">
                <Image
                  src="/logo.png"
                  alt="Zerly Gamers Mascot Logo"
                  fill
                  sizes="(max-width: 768px) 112px, 128px"
                  className="object-contain drop-shadow-md"
                  priority
                />
              </div>
            </Link>
          </div>
        </div>

        {/* Middle Scrollable Navigation List (Includes Dashboard & Sections) */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {/* Dashboard Main Button */}
          <div>
            <button
              onClick={() => {
                onSelectTab?.('dashboard');
                onCloseMobile?.();
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600 border border-rose-200/90 shadow-2xs font-black'
                  : 'text-gray-600 hover:bg-rose-50/60 hover:text-rose-600'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-rose-600" />
              <span>Dashboard</span>
            </button>
          </div>
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab?.(item.id);
                        onCloseMobile?.();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-rose-100/80 text-rose-600 font-bold border border-rose-200/60'
                          : 'text-gray-600 hover:bg-rose-50/60 hover:text-rose-600'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-600' : 'text-gray-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-100 text-rose-600">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Fixed Footer: Help Box */}
        <div className="p-4 pt-2 shrink-0 border-t border-rose-100/60 bg-white/95">
          <div className="bg-gradient-to-br from-rose-50 to-pink-100/70 border border-rose-200/80 rounded-2xl p-3 text-center shadow-xs relative overflow-hidden group">
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-rose-300/30 rounded-full blur-lg pointer-events-none" />

            <div className="text-xs font-black text-rose-700">Butuh Bantuan?</div>
            <p className="text-[10px] text-gray-500 mt-0.5 leading-tight font-medium">
              Tim ZerlyGamers siap membantu kamu!
            </p>

            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-95 text-white text-xs font-bold shadow-xs transition-transform active:scale-95"
            >
              <MessageCircleHeart className="w-3.5 h-3.5" />
              <span>Chat Admin</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
