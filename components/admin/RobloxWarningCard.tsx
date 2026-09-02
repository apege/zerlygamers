'use client';

import React, { useState } from 'react';
import { Lock, Zap, Lightbulb, CheckCircle2, AlertTriangle, Edit2, Check } from 'lucide-react';

export default function RobloxWarningCard() {
  const [targetUser, setTargetUser] = useState('@muachiilan');
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [tempUser, setTempUser] = useState('@muachiilan');
  const [isActivating, setIsActivating] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSaveUser = () => {
    let formatted = tempUser.trim();
    if (!formatted.startsWith('@') && formatted.length > 0) {
      formatted = '@' + formatted;
    }
    setTargetUser(formatted || '@muachiilan');
    setIsEditingUser(false);
  };

  const handleActivate = () => {
    setIsActivating(true);
    setTimeout(() => {
      setIsActivating(false);
      setIsActivated(true);
      setShowConfirmModal(false);
    }, 1000);
  };

  return (
    <>
      <div className="bg-white/95 border-2 border-pink-200/90 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-full ring-2 ring-pink-400/15">
        {/* Background ambient glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-pink-300/20 rounded-full blur-xl pointer-events-none" />

        <div className="space-y-4">
          {/* Header Title */}
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#FF2A85] tracking-wide">
              <span>⚠️</span>
              <span>PERINGATAN!</span>
              <span>⚠️</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight mt-0.5">
              ID ROBLOX BELUM AKTIF
            </h3>
          </div>

          {/* Target User Bar */}
          <div className="flex items-center justify-between px-3.5 py-2 bg-pink-50/70 border border-pink-150 rounded-xl text-xs">
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
                    className="px-2 py-0.5 bg-white border border-pink-300 rounded text-xs font-bold text-pink-600 focus:outline-none focus:ring-1 focus:ring-pink-400 w-full max-w-[140px]"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveUser}
                    className="p-1 rounded bg-pink-500 text-white hover:bg-pink-600 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <span className="font-extrabold text-[#FF2A85] truncate">{targetUser}</span>
              )}
            </div>

            {!isEditingUser && (
              <button
                onClick={() => {
                  setTempUser(targetUser);
                  setIsEditingUser(true);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-pink-600 transition-colors ml-2 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Ganti</span>
              </button>
            )}
          </div>

          {/* Two Side-by-Side Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Left Box: Aktivasi Diperlukan (7 cols) */}
            <div className="sm:col-span-7 bg-pink-50/50 border border-pink-200/80 rounded-2xl p-3.5 flex flex-col justify-center space-y-2">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#FF2A85] uppercase tracking-wider">
                <div className="p-1 rounded-md bg-pink-100 text-[#FF2A85]">
                  <Lock className="w-3 h-3" />
                </div>
                <span>Aktivasi Diperlukan</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                ID Roblox pada order akun <strong className="text-pink-600">{targetUser}</strong> belum aktif. Silakan aktifkan ID terlebih dahulu untuk melanjutkan prosesnya.
              </p>
            </div>

            {/* Right Box: Biaya Pengaktifan ID (5 cols) */}
            <div className="sm:col-span-5 bg-gradient-to-br from-pink-50/80 to-pink-100/60 border border-pink-200/80 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                BIAYA PENGAKTIFAN ID
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#FF2A85] tracking-tight mt-1">
                Rp 97.000
              </span>
            </div>
          </div>

          {/* Catatan Admin Box */}
          <div className="bg-pink-100/50 border border-pink-200/70 rounded-2xl p-3 flex items-start gap-2.5">
            <div className="p-1 rounded-lg bg-white text-amber-500 shadow-2xs shrink-0 mt-0.5">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
            <div className="text-[11px] sm:text-xs text-gray-700 leading-snug">
              <strong className="text-gray-900 font-bold">Catatan Admin:</strong>{' '}
              Setelah ID <span className="font-semibold text-pink-600">{targetUser}</span> diaktifkan, order dapat langsung diproses seperti biasa.
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          {isActivated ? (
            <div className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
              <span>ID {targetUser} Berhasil Diaktifkan!</span>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FF2A85] via-[#FF3B88] to-[#FF559F] hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-pink-500/25 transition-all active:scale-[0.98] cursor-pointer"
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
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-pink-200 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mx-auto text-[#FF2A85]">
              <Zap className="w-6 h-6 fill-[#FF2A85]" />
            </div>
            <div>
              <h4 className="font-black text-gray-800 text-base">Konfirmasi Pengaktifan ID</h4>
              <p className="text-xs text-gray-600 mt-1">
                Lakukan pengaktifan ID Roblox untuk akun <strong>{targetUser}</strong> dengan biaya <strong>Rp 97.000</strong>?
              </p>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Kembali
              </button>
              <button
                onClick={handleActivate}
                disabled={isActivating}
                className="flex-1 py-2.5 rounded-xl bg-[#FF2A85] text-white text-xs font-bold hover:bg-[#e02070] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isActivating ? 'Memproses...' : 'Ya, Aktifkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
