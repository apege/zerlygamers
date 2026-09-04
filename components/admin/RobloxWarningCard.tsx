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
  User,
  Plus,
  RefreshCw,
  Sparkles,
  DollarSign,
  History,
} from 'lucide-react';
import { AdminOrder } from '@/data/adminDummyData';

interface RobloxWarningCardProps {
  pendingOrders?: AdminOrder[];
  onUpdateStatus?: (orderId: string, status: AdminOrder['status'], label: string) => void;
  onOpenOrderDetail?: (order: AdminOrder) => void;
}

interface ActivationLog {
  id: string;
  username: string;
  fee: string;
  activatedAt: string;
  source: 'manual' | 'order';
  orderCode?: string;
}

export default function RobloxWarningCard({
  pendingOrders = [],
  onUpdateStatus,
  onOpenOrderDetail,
}: RobloxWarningCardProps) {
  // Mode Selection: 'manual' | 'order'
  const [mode, setMode] = useState<'manual' | 'order'>('manual');

  // Manual Input State
  const [manualUsername, setManualUsername] = useState('@Kaisha2612');
  const [manualFee, setManualFee] = useState('99.000');
  const [isEditingManualUser, setIsEditingManualUser] = useState(false);
  const [tempManualUser, setTempManualUser] = useState('@Kaisha2612');

  // Order Queue State
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);

  // Activation & Modal State
  const [isActivating, setIsActivating] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [recentActivations, setRecentActivations] = useState<ActivationLog[]>([]);

  // Automatically switch to 'order' mode if pending orders exist and user hasn't toggled
  useEffect(() => {
    if (pendingOrders.length > 0 && mode === 'manual' && manualUsername === '@Kaisha2612') {
      // Optional: keep manual as default or auto-detect
    }
  }, [pendingOrders, mode, manualUsername]);

  const activeOrder = pendingOrders[currentOrderIndex] || pendingOrders[0] || null;

  // Active Target User based on selected mode
  const currentTargetUser = mode === 'order' && activeOrder
    ? (activeOrder.username.startsWith('@') ? activeOrder.username : `@${activeOrder.username}`)
    : (manualUsername.startsWith('@') ? manualUsername : `@${manualUsername}`);

  const currentOrderCode = mode === 'order' && activeOrder
    ? activeOrder.orderNumber
    : 'Input Manual Admin';

  const currentFee = 'Rp 99.000';

  const handlePrevOrder = () => {
    if (pendingOrders.length > 0) {
      setCurrentOrderIndex((prev) => (prev > 0 ? prev - 1 : pendingOrders.length - 1));
      setIsActivated(false);
    }
  };

  const handleNextOrder = () => {
    if (pendingOrders.length > 0) {
      setCurrentOrderIndex((prev) => (prev < pendingOrders.length - 1 ? prev + 1 : 0));
      setIsActivated(false);
    }
  };

  const handleSaveManualUser = () => {
    let formatted = tempManualUser.trim();
    if (!formatted) {
      formatted = '@UserRoblox';
    } else if (!formatted.startsWith('@')) {
      formatted = '@' + formatted;
    }
    setManualUsername(formatted);
    setIsEditingManualUser(false);
    setIsActivated(false);
  };

  const handleActivate = async () => {
    setIsActivating(true);
    try {
      const timestampStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';

      if (mode === 'order' && activeOrder) {
        // Persist activation to database
        await fetch('/api/orders', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: activeOrder.id,
            admin_notes: `[SYSTEM]: ID Roblox ${currentTargetUser} telah diaktifkan via Dashboard pada ${timestampStr}`,
          }),
        });
      }

      // Add to recent activation history
      const newLog: ActivationLog = {
        id: String(Date.now()),
        username: currentTargetUser,
        fee: currentFee,
        activatedAt: timestampStr,
        source: mode,
        orderCode: mode === 'order' && activeOrder ? activeOrder.orderNumber : undefined,
      };

      setRecentActivations((prev) => [newLog, ...prev.slice(0, 4)]);
      setIsActivating(false);
      setIsActivated(true);
      setShowConfirmModal(false);
      setShowSuccessBanner(true);
    } catch (err) {
      console.error('Failed to activate ID:', err);
      setIsActivating(false);
    }
  };

  const handleResetForNextAccount = () => {
    setIsActivated(false);
    setShowSuccessBanner(false);
    setTempManualUser('');
    setIsEditingManualUser(true);
  };

  return (
    <>
      <div className="bg-white/95 border-2 border-rose-200/90 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-full ring-2 ring-rose-400/15">
        {/* Ambient background glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-300/20 rounded-full blur-xl pointer-events-none" />

        <div className="space-y-4">
          {/* Header Title with Mode Switch Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-rose-600 tracking-wide uppercase">
                <span className="animate-pulse">⚠️</span>
                <span>PERINGATAN!</span>
                <span className="animate-pulse">⚠️</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight leading-tight">
                ID ROBLOX BELUM AKTIF
              </h3>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center bg-rose-50 p-1 rounded-2xl border border-rose-200 text-[11px] font-bold self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setMode('manual');
                  setIsActivated(false);
                }}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  mode === 'manual'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-gray-600 hover:text-rose-600'
                }`}
              >
                <User className="w-3 h-3" />
                <span>Input Manual</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('order');
                  setIsActivated(false);
                }}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  mode === 'order'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-gray-600 hover:text-rose-600'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Dari Pesanan ({pendingOrders.length})</span>
              </button>
            </div>
          </div>

          {/* Target User & Control Bar */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-rose-50/70 border border-rose-200 rounded-2xl text-xs">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider shrink-0">
                TARGET USER:
              </span>

              {mode === 'manual' ? (
                isEditingManualUser ? (
                  <div className="flex items-center gap-1.5 flex-1">
                    <input
                      type="text"
                      value={tempManualUser}
                      onChange={(e) => setTempManualUser(e.target.value)}
                      placeholder="Contoh: @Kaisha2612"
                      className="px-2.5 py-1 bg-white border-2 border-rose-400 rounded-xl text-xs font-black text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400/30 w-full max-w-[180px]"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleSaveManualUser}
                      className="p-1.5 rounded-xl bg-rose-500 text-white hover:bg-rose-600 cursor-pointer shadow-xs"
                      title="Simpan Username"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-black text-rose-600 font-mono text-sm tracking-tight truncate">
                      {manualUsername}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setTempManualUser(manualUsername);
                        setIsEditingManualUser(true);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-rose-600 transition-colors bg-white px-2 py-0.5 rounded-lg border border-rose-200 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Ganti</span>
                    </button>
                  </div>
                )
              ) : (
                /* Order Mode Display */
                <div className="flex items-center gap-2 truncate">
                  {activeOrder ? (
                    <>
                      <span className="font-black text-rose-600 font-mono truncate">
                        {activeOrder.username}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 bg-white px-1.5 py-0.5 rounded border border-rose-200">
                        {activeOrder.orderNumber}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-400 italic text-[11px]">
                      Belum ada pesanan masuk di antrean
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Pagination for Order Mode */}
            {mode === 'order' && pendingOrders.length > 1 && (
              <div className="flex items-center gap-1 shrink-0 ml-2 bg-white border border-rose-200 rounded-xl px-2 py-1 text-[11px] text-gray-500">
                <button
                  type="button"
                  onClick={handlePrevOrder}
                  className="p-0.5 hover:text-rose-600 cursor-pointer"
                  title="Order Sebelumnya"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold px-1 text-rose-600">
                  {currentOrderIndex + 1}/{pendingOrders.length}
                </span>
                <button
                  type="button"
                  onClick={handleNextOrder}
                  className="p-0.5 hover:text-rose-600 cursor-pointer"
                  title="Order Selanjutnya"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
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
                ID Roblox <strong className="text-rose-600">{currentTargetUser}</strong> ({currentOrderCode}) terdeteksi belum aktif. Silakan lakukan proses aktivasi untuk melanjutkan transaksi.
              </p>
            </div>

            {/* Right Box: Biaya Pengaktifan ID (5 cols) */}
            <div className="sm:col-span-5 bg-gradient-to-br from-rose-50/80 to-pink-100/60 border border-rose-200/80 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                BIAYA PENGAKTIFAN ID
              </span>
              <span className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight mt-1">
                {currentFee}
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
              ID <span className="font-semibold text-rose-600">{currentTargetUser}</span> dapat diaktifkan kapan saja secara manual oleh admin tanpa harus menunggu orderan masuk.
            </div>
          </div>
        </div>

        {/* Action Button & Activated State */}
        <div className="pt-4 space-y-2">
          {isActivated ? (
            <div className="space-y-2">
              <div className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-500/20 animate-in zoom-in-95">
                <CheckCircle2 className="w-5 h-5" />
                <span>ID {currentTargetUser} Berhasil Diaktifkan! ✓</span>
              </div>

              <button
                type="button"
                onClick={handleResetForNextAccount}
                className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors cursor-pointer border border-rose-200 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Aktifkan Akun Roblox Lainnya (Input Manual)</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-md shadow-rose-500/25 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Aktifkan ID {currentTargetUser} Sekarang</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-rose-200 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center mx-auto text-rose-600 shadow-xs animate-bounce">
              <Zap className="w-7 h-7 fill-rose-600" />
            </div>

            <div className="space-y-1">
              <h4 className="font-black text-gray-900 text-base">Konfirmasi Pengaktifan ID</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Lakukan pengaktifan ID Roblox untuk akun <strong className="text-rose-600">{currentTargetUser}</strong> ({currentOrderCode}) dengan biaya <strong className="text-gray-900">Rp 99.000</strong>?
              </p>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleActivate}
                disabled={isActivating}
                className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-black shadow-md shadow-rose-500/20 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
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
