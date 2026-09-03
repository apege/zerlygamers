'use client';

import React, { useState, useEffect } from 'react';
import {
  Lock,
  Zap,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Edit2,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Loader2,
  X,
} from 'lucide-react';
import { AdminOrder } from '@/data/adminDummyData';

interface RobloxWarningCardProps {
  pendingOrders?: AdminOrder[];
  onUpdateStatus?: (orderId: string, status: AdminOrder['status'], label: string) => void;
  onOpenOrderDetail?: (order: AdminOrder) => void;
}

export default function RobloxWarningCard({
  pendingOrders = [],
  onUpdateStatus,
  onOpenOrderDetail,
}: RobloxWarningCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [tempUser, setTempUser] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Active pending order
  const activeOrder = pendingOrders[currentIndex] || pendingOrders[0] || null;
  const targetUser = activeOrder ? activeOrder.username : '@Kaisha2612';

  useEffect(() => {
    if (activeOrder) {
      setTempUser(activeOrder.username);
    }
  }, [activeOrder]);

  // Reset activated flag if current order changes
  useEffect(() => {
    setIsActivated(false);
  }, [currentIndex, activeOrder?.id]);

  const handlePrevOrder = () => {
    if (pendingOrders.length > 0) {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : pendingOrders.length - 1));
    }
  };

  const handleNextOrder = () => {
    if (pendingOrders.length > 0) {
      setCurrentIndex((prev) => (prev < pendingOrders.length - 1 ? prev + 1 : 0));
    }
  };

  const handleSaveUser = async () => {
    let formatted = tempUser.trim();
    if (!formatted.startsWith('@') && formatted.length > 0) {
      formatted = '@' + formatted;
    }
    if (activeOrder && formatted) {
      try {
        await fetch('/api/orders', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: activeOrder.id,
            roblox_username: formatted,
          }),
        });
        activeOrder.username = formatted;
      } catch (err) {
        console.error('Failed to update username:', err);
      }
    }
    setIsEditingUser(false);
  };

  const handleActivate = async () => {
    setIsActivating(true);
    try {
      if (activeOrder) {
        // Persist activation to database
        await fetch('/api/orders', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: activeOrder.id,
            admin_notes: `[SYSTEM]: ID Roblox ${targetUser} telah diaktifkan via Dashboard Warning Card pada ${new Date().toLocaleTimeString('id-ID')}`,
          }),
        });
      }
      setIsActivating(false);
      setIsActivated(true);
      setShowConfirmModal(false);
    } catch (err) {
      console.error('Failed to activate ID:', err);
      setIsActivating(false);
    }
  };

  // If no pending orders, show verified safe state
  if (pendingOrders.length === 0) {
    return (
      <div className="bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/60 border-2 border-emerald-200/90 rounded-3xl p-5 sm:p-6 shadow-xs relative overflow-hidden flex flex-col justify-between h-full ring-2 ring-emerald-400/15">
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>STATUS AMAN</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight mt-0.5">
              SEMUA ID ROBLOX TERVERIFIKASI
            </h3>
          </div>

          <div className="bg-white/90 border border-emerald-200/80 rounded-2xl p-5 text-center space-y-2 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs text-gray-600 font-medium max-w-sm mx-auto leading-relaxed">
              Tidak ada antrean pesanan yang menunggu aktivasi ID saat ini. Semua transaksi dapat diproses seperti biasa.
            </p>
          </div>
        </div>

        <div className="pt-4 text-center">
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-100/60 px-4 py-1.5 rounded-full border border-emerald-200 inline-block">
            ✓ Sistem Berjalan Normal
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/95 border-2 border-rose-200/90 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-full ring-2 ring-rose-400/15">
        {/* Background ambient glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-300/20 rounded-full blur-xl pointer-events-none" />

        <div className="space-y-4">
          {/* Header Title with Queue Counter */}
          <div className="text-center relative">
            <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-rose-600 tracking-wide">
              <span>⚠️</span>
              <span>PERINGATAN!</span>
              <span>⚠️</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight mt-0.5">
              ID ROBLOX BELUM AKTIF
            </h3>
          </div>

          {/* Target User Bar with Next/Prev navigation if multiple pending */}
          <div className="flex items-center justify-between px-3.5 py-2 bg-rose-50/70 border border-rose-200 rounded-xl text-xs">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider shrink-0">
                TARGET USER:
              </span>
              {isEditingUser ? (
                <div className="flex items-center gap-1 flex-1">
                  <input
                    type="text"
                    value={tempUser}
                    onChange={(e) => setTempUser(e.target.value)}
                    className="px-2 py-0.5 bg-white border border-rose-300 rounded text-xs font-bold text-rose-600 focus:outline-none focus:ring-1 focus:ring-rose-400 w-full max-w-[140px]"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveUser}
                    className="p-1 rounded bg-rose-500 text-white hover:bg-rose-600 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <span className="font-black text-rose-600 font-mono truncate">{targetUser}</span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              {pendingOrders.length > 1 && (
                <div className="flex items-center gap-0.5 bg-white border border-rose-200 rounded-lg px-1 py-0.5 text-[10px] text-gray-500">
                  <button
                    onClick={handlePrevOrder}
                    className="p-0.5 hover:text-rose-600 cursor-pointer"
                    title="Order Sebelumnya"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <span className="font-bold px-1">{currentIndex + 1}/{pendingOrders.length}</span>
                  <button
                    onClick={handleNextOrder}
                    className="p-0.5 hover:text-rose-600 cursor-pointer"
                    title="Order Selanjutnya"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {!isEditingUser && (
                <button
                  onClick={() => {
                    setTempUser(targetUser);
                    setIsEditingUser(true);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-rose-600 transition-colors ml-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Ganti</span>
                </button>
              )}
            </div>
          </div>

          {/* Two Side-by-Side Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Left Box: Aktivasi Diperlukan (7 cols) */}
            <div className="sm:col-span-7 bg-rose-50/50 border border-rose-200/80 rounded-2xl p-3.5 flex flex-col justify-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-rose-600 uppercase tracking-wider">
                <div className="p-1 rounded-md bg-rose-100 text-rose-600">
                  <Lock className="w-3 h-3" />
                </div>
                <span>Aktivasi Diperlukan</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                ID Roblox pada order <strong className="text-rose-600 font-mono">{activeOrder?.orderNumber || '#ZLY'}</strong> akun <strong className="text-rose-600">{targetUser}</strong> belum aktif. Silakan aktifkan ID terlebih dahulu untuk melanjutkan prosesnya.
              </p>
            </div>

            {/* Right Box: Biaya Pengaktifan ID (5 cols) */}
            <div className="sm:col-span-5 bg-gradient-to-br from-rose-50/80 to-pink-100/60 border border-rose-200/80 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                BIAYA PENGAKTIFAN ID
              </span>
              <span className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight mt-1">
                Rp 99.000
              </span>
            </div>
          </div>

          {/* Catatan Admin Box */}
          <div className="bg-rose-100/50 border border-rose-200/70 rounded-2xl p-3 flex items-start gap-2.5">
            <div className="p-1 rounded-lg bg-white text-amber-500 shadow-2xs shrink-0 mt-0.5">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
            <div className="text-[11px] sm:text-xs text-gray-700 leading-snug">
              <strong className="text-gray-900 font-bold">Catatan Admin:</strong>{' '}
              Setelah ID <span className="font-semibold text-rose-600">{targetUser}</span> diaktifkan, order dapat langsung diproses seperti biasa.
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          {isActivated ? (
            <div className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>ID {targetUser} Berhasil Diaktifkan!</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-md shadow-rose-500/25 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Aktifkan ID {targetUser} Sekarang</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-rose-200 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto text-rose-600">
              <Zap className="w-6 h-6 fill-rose-600" />
            </div>
            <div>
              <h4 className="font-black text-gray-900 text-base">Konfirmasi Pengaktifan ID</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Lakukan pengaktifan ID Roblox untuk akun <strong className="text-rose-600">{targetUser}</strong> ({activeOrder?.orderNumber}) dengan biaya <strong className="text-gray-900">Rp 99.000</strong>?
              </p>
            </div>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleActivate}
                disabled={isActivating}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-black shadow-md shadow-rose-500/20 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isActivating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isActivating ? 'Memproses...' : 'Ya, Aktifkan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
