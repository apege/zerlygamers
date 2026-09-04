'use client';

import React, { useState } from 'react';
import {
  Lock,
  Zap,
  Lightbulb,
  CheckCircle2,
  Edit2,
  Check,
  Loader2,
  Plus,
} from 'lucide-react';

export default function RobloxWarningCard() {
  // Manual Input State
  const [manualUsername, setManualUsername] = useState('@Kaisha2612');
  const [isEditingManualUser, setIsEditingManualUser] = useState(false);
  const [tempManualUser, setTempManualUser] = useState('@Kaisha2612');

  // Activation & Modal State
  const [isActivating, setIsActivating] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const currentTargetUser = manualUsername.startsWith('@') ? manualUsername : `@${manualUsername}`;
  const currentFee = 'Rp 99.000';

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
      // Simulate / process activation
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsActivating(false);
      setIsActivated(true);
      setShowConfirmModal(false);
    } catch (err) {
      console.error('Failed to activate ID:', err);
      setIsActivating(false);
    }
  };

  const handleResetForNextAccount = () => {
    setIsActivated(false);
    setTempManualUser('');
    setIsEditingManualUser(true);
  };

  return (
    <>
      <div className="bg-white/95 border-2 border-rose-200/90 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-full ring-2 ring-rose-400/15">
        {/* Ambient background glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-300/20 rounded-full blur-xl pointer-events-none" />

        <div className="space-y-4">
          {/* Header Title */}
          <div className="border-b border-rose-100 pb-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-rose-600 tracking-wide uppercase">
              <span className="animate-pulse">⚠️</span>
              <span>PERINGATAN!</span>
              <span className="animate-pulse">⚠️</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight leading-tight mt-0.5">
              ID ROBLOX BELUM AKTIF
            </h3>
          </div>

          {/* Target User Control Bar */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-rose-50/70 border border-rose-200 rounded-2xl text-xs">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider shrink-0">
                TARGET USER:
              </span>

              {isEditingManualUser ? (
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
                ID Roblox <strong className="text-rose-600">{currentTargetUser}</strong> (Input Manual Admin) terdeteksi belum aktif. Silakan lakukan proses aktivasi untuk melanjutkan transaksi.
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
                Lakukan pengaktifan ID Roblox untuk akun <strong className="text-rose-600">{currentTargetUser}</strong> dengan biaya <strong className="text-gray-900">Rp 99.000</strong>?
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
