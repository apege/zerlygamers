'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  Receipt,
  User,
  FileText,
  Copy,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Check,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Zap,
  X,
  Loader2,
  CheckCheck,
  Edit2,
  Save,
  Heart,
} from 'lucide-react';
import { AdminOrder } from '@/data/adminDummyData';
import TestimonialTokenModal from '@/components/admin/TestimonialTokenModal';

interface OrderDetailViewProps {
  order: AdminOrder;
  onBack: () => void;
  onUpdateStatus: (orderId: string, status: AdminOrder['status'], label: string) => void;
}

export default function OrderDetailView({ order, onBack, onUpdateStatus }: OrderDetailViewProps) {
  const [adminNote, setAdminNote] = useState(order.adminNote || '');
  const [currentUsername, setCurrentUsername] = useState(order.username);
  const [currentRobloxUserId, setCurrentRobloxUserId] = useState(order.robloxUserId || '');
  
  // Inline edit username state
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState(order.username);
  const [isSavingUsername, setIsSavingUsername] = useState(false);

  const [isCopiedId, setIsCopiedId] = useState(false);
  const [isCopiedPhone, setIsCopiedPhone] = useState(false);
  const [noteSavedAlert, setNoteSavedAlert] = useState(false);

  // ID Activation Workflow State
  const [isIdActive, setIsIdActive] = useState(
    order.status === 'diproses' || order.status === 'selesai' || order.robloxIdStatus === 'aktif'
  );
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [activationSuccessAlert, setActivationSuccessAlert] = useState(false);

  // Synchronize state when selected order changes
  useEffect(() => {
    setCurrentUsername(order.username);
    setUsernameInput(order.username);
    setCurrentRobloxUserId(order.robloxUserId || '');
    setAdminNote(order.adminNote || '');
    setIsIdActive(
      order.status === 'diproses' || order.status === 'selesai' || order.robloxIdStatus === 'aktif'
    );
    setIsEditingUsername(false);
  }, [order.id, order.username, order.robloxUserId, order.adminNote, order.status, order.robloxIdStatus]);

  const copyToClipboard = (text: string, type: 'id' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setIsCopiedId(true);
      setTimeout(() => setIsCopiedId(false), 2000);
    } else {
      setIsCopiedPhone(true);
      setTimeout(() => setIsCopiedPhone(false), 2000);
    }
  };

  const handleSaveNote = async () => {
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: order.id,
          admin_notes: adminNote,
        }),
      });
      setNoteSavedAlert(true);
      setTimeout(() => setNoteSavedAlert(false), 2500);
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  };

  // Change / Edit Username in database
  const handleSaveUsername = async () => {
    if (!usernameInput.trim()) return;
    const cleanUsername = usernameInput.startsWith('@') ? usernameInput.trim() : `@${usernameInput.trim()}`;
    
    setIsSavingUsername(true);
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: order.id,
          roblox_username: cleanUsername,
        }),
      });
      setCurrentUsername(cleanUsername);
      setIsEditingUsername(false);
    } catch (err) {
      console.error('Failed to update username:', err);
    } finally {
      setIsSavingUsername(false);
    }
  };

  // Confirm Activation Handler
  const handleConfirmActivation = async () => {
    setIsActivating(true);
    try {
      // 1. Persist activation note / verified state to database
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: order.id,
          admin_notes: (adminNote ? adminNote + '\n' : '') + `[SYSTEM]: ID Roblox ${currentUsername} telah diaktifkan & diverifikasi oleh Admin pada ${new Date().toLocaleTimeString('id-ID')}`,
        }),
      });

      // 2. Set ID to Active Green
      setIsIdActive(true);
      setShowActivationModal(false);
      setActivationSuccessAlert(true);
      setTimeout(() => setActivationSuccessAlert(false), 4000);
    } catch (err) {
      console.error('Failed to activate ID:', err);
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in zoom-in-98 duration-200 pb-12">
      {/* Back Button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-rose-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Order</span>
        </button>
      </div>

      {/* Order Title Header & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
              Detail Transaksi
            </span>
            <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Zerly Gamers
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 bg-clip-text text-transparent tracking-tight mt-1">
            ORDER {order.orderNumber}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">{order.fullDateString}</p>
        </div>

        <div>
          <span
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-2xs ${
              order.status === 'selesai'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : order.status === 'diproses'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : order.status === 'dibatalkan'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{order.statusLabel}</span>
          </span>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="bg-white/95 border border-rose-100/90 rounded-3xl p-4 sm:p-5 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.06)] flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => onUpdateStatus(order.id, 'diproses', 'Sedang Diproses')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:opacity-95 text-white text-xs font-black shadow-md shadow-rose-500/20 transition-all active:scale-95 cursor-pointer"
        >
          <Clock className="w-4 h-4" />
          <span>Proses Pesanan</span>
        </button>

        <button
          onClick={() => onUpdateStatus(order.id, 'selesai', 'Transaksi Sukses')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Selesaikan Order</span>
        </button>

        {order.status === 'selesai' && (
          <button
            type="button"
            onClick={() => setShowTestimonialModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-95 text-white text-xs font-black shadow-md shadow-rose-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Kirim Link Testimoni</span>
          </button>
        )}

        <button
          onClick={() => onUpdateStatus(order.id, 'dibatalkan', 'Pesanan Dibatalkan')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all active:scale-95 cursor-pointer"
        >
          <XCircle className="w-4 h-4" />
          <span>Batalkan</span>
        </button>

        {order.whatsappNumber && (
          <a
            href={`https://wa.me/${order.whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-emerald-200 hover:bg-emerald-50 text-emerald-700 text-xs font-bold transition-all active:scale-95 cursor-pointer sm:ml-auto"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Chat Pelanggan</span>
          </a>
        )}
      </div>

      {/* ============================================================ */}
      {/* FLOW CARD: AKTIVASI ID ROBLOX CUSTOMER */}
      {/* ============================================================ */}
      <div
        className={`rounded-3xl p-5 sm:p-6 border transition-all relative overflow-hidden shadow-xs ${
          isIdActive
            ? 'bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 border-emerald-200'
            : 'bg-gradient-to-br from-rose-50/60 via-white to-amber-50/40 border-rose-200'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Detection Info */}
          <div className="flex items-start gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md ${
                isIdActive
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-emerald-500/25'
                  : 'bg-gradient-to-tr from-rose-500 to-pink-500 shadow-rose-500/25 animate-pulse'
              }`}
            >
              {isIdActive ? <ShieldCheck className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                  STATUS AKTIVASI ID ROBLOX
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs ${
                    isIdActive
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}
                >
                  {isIdActive ? 'AKTIF ✓' : 'MENUNGGU AKTIVASI'}
                </span>
              </div>

              {/* Username detected with Edit Option */}
              <div className="flex items-center gap-2 flex-wrap">
                {isEditingUsername ? (
                  <div className="flex items-center gap-1.5 my-0.5">
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="@username"
                      className="px-3 py-1 bg-white border border-rose-300 rounded-xl text-xs font-black text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                    <button
                      type="button"
                      disabled={isSavingUsername}
                      onClick={handleSaveUsername}
                      className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      {isSavingUsername ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingUsername(false)}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-base sm:text-lg font-black text-gray-900">
                      Username Terdeteksi: <span className="text-rose-600 font-mono">{currentUsername}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditingUsername(true)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Ganti / Edit Username"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Ganti Akun</span>
                    </button>
                  </>
                )}

                {currentRobloxUserId && (
                  <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                    (ID: {currentRobloxUserId})
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-600 font-medium">
                {isIdActive
                  ? `✓ Akun Roblox ${currentUsername} telah diaktifkan & terverifikasi. Pesanan siap dikirim ke pembeli!`
                  : `Sistem telah mendeteksi akun ${currentUsername}. Klik tombol di samping untuk mengaktifkan akun.`}
              </p>
            </div>
          </div>

          {/* Right: Trigger Button */}
          <div className="shrink-0 flex items-center gap-2 pt-2 md:pt-0">
            {isIdActive ? (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black">
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                <span>ID Siap Diproses</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowActivationModal(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:opacity-95 text-white text-xs font-black shadow-lg shadow-rose-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Aktifkan ID {currentUsername} Sekarang</span>
              </button>
            )}
          </div>
        </div>

        {/* Success Alert Banner */}
        {activationSuccessAlert && (
          <div className="mt-3 p-3 rounded-2xl bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>ID Roblox {currentUsername} berhasil diaktifkan! Status akun kini AKTIF ✓ dan pesanan siap diproses.</span>
          </div>
        )}
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Card 1: Detail Pesanan */}
        <div className="bg-white border border-rose-100/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-rose-100">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <Receipt className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-900">
              DETAIL PESANAN
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-rose-50">
              <span className="text-gray-400 font-medium">Game</span>
              <span className="font-extrabold text-gray-900">{order.game}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-rose-50">
              <span className="text-gray-400 font-medium">Item &amp; Nominal</span>
              <div className="flex items-center gap-1.5 font-black text-amber-500">
                <div className="w-4 h-4 relative">
                  <Image src="/robux.webp" alt="Robux" fill sizes="16px" className="object-contain" />
                </div>
                <span>{order.item}</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-rose-50">
              <span className="text-gray-400 font-medium">Harga</span>
              <span className="font-black text-sm text-rose-600">{order.priceFormatted}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-rose-50">
              <span className="text-gray-400 font-medium">Metode Pembayaran</span>
              <span className="font-extrabold text-gray-900">{order.paymentMethod}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-rose-50">
              <span className="text-gray-400 font-medium">Channel Pemesanan</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  order.orderChannel === 'WHATSAPP'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {order.orderChannel}
              </span>
            </div>

            {order.customerNote && (
              <div className="pt-2">
                <span className="text-gray-400 font-medium block mb-1">Catatan Pembeli:</span>
                <p className="p-3 bg-rose-50/50 rounded-2xl text-xs text-gray-700 italic border border-rose-100">
                  “{order.customerNote}”
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Informasi Pelanggan */}
        <div className="bg-white border border-rose-100/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-rose-100">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-900">
              INFORMASI PELANGGAN
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            {/* Username Roblox */}
            <div className="flex items-center justify-between py-1.5 border-b border-rose-50">
              <span className="text-gray-400 font-medium">Username Roblox</span>
              <span className="font-black text-rose-600 text-sm tracking-tight">
                {currentUsername}
              </span>
            </div>

            {/* Roblox User ID & Copy */}
            {currentRobloxUserId && (
              <div className="flex items-center justify-between py-1.5 border-b border-rose-50">
                <span className="text-gray-400 font-medium">Roblox User ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-gray-800">{currentRobloxUserId}</span>
                  <button
                    onClick={() => copyToClipboard(currentRobloxUserId, 'id')}
                    className="p-1 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Copy ID"
                  >
                    {isCopiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Status Akun Roblox */}
            <div className="flex items-center justify-between py-1.5 border-b border-rose-50">
              <span className="text-gray-400 font-medium">Status ID Roblox</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  isIdActive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {isIdActive ? 'AKTIF ✓' : 'Belum Aktif'}
              </span>
            </div>

            {/* WhatsApp Number & Copy */}
            {order.whatsappNumber && (
              <div className="flex items-center justify-between py-1.5 border-b border-rose-50">
                <span className="text-gray-400 font-medium">WhatsApp</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">{order.whatsappNumber}</span>
                  <button
                    onClick={() => copyToClipboard(order.whatsappNumber!, 'phone')}
                    className="p-1 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Copy WhatsApp"
                  >
                    {isCopiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card 3: Catatan Internal Admin */}
      <div className="bg-white border border-rose-100/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-rose-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-900">
              CATATAN INTERNAL ADMIN
            </h2>
          </div>
          {noteSavedAlert && (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 animate-in fade-in">
              Catatan tersimpan!
            </span>
          )}
        </div>

        <div className="space-y-3">
          <textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            rows={3}
            placeholder="Tulis catatan operasional untuk order ini (hanya dapat dilihat oleh admin)..."
            className="w-full p-3.5 bg-rose-50/30 border border-rose-200 rounded-2xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400 resize-none font-medium"
          />

          <div className="flex justify-end">
            <button
              onClick={handleSaveNote}
              className="px-5 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all active:scale-95 cursor-pointer"
            >
              Simpan Catatan
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* POPUP MODAL KONFIRMASI AKTIVASI ID ROBLOX */}
      {/* ============================================================ */}
      {showActivationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-rose-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
                  <Zap className="w-5 h-5 fill-rose-600" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-base">Konfirmasi Aktivasi ID</h3>
                  <p className="text-[11px] text-gray-400 font-medium">Verifikasi Akun Roblox Pelanggan</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowActivationModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Account Details Preview */}
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Username Roblox:</span>
                <span className="font-black text-rose-600 font-mono text-sm">{currentUsername}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Nomor Invoice:</span>
                <span className="font-bold text-gray-800 font-mono">{order.orderNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Paket Item:</span>
                <span className="font-extrabold text-gray-900">{order.item} ({order.priceFormatted})</span>
              </div>
            </div>

            {/* Information Alert */}
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              Apakah Anda yakin ingin memverifikasi dan mengaktifkan akun Roblox ini? Status akun akan berubah menjadi <strong className="text-emerald-600">AKTIF ✓</strong> dan pesanan siap diproses.
            </p>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-rose-100">
              <button
                type="button"
                onClick={() => setShowActivationModal(false)}
                className="px-5 py-2.5 rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold text-xs transition-all cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={isActivating}
                onClick={handleConfirmActivation}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                {isActivating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>{isActivating ? 'Mengaktifkan...' : 'Konfirmasi Aktivasi'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Kirim Testimoni dengan Token */}
      {showTestimonialModal && (
        <TestimonialTokenModal
          order={order}
          onClose={() => setShowTestimonialModal(false)}
        />
      )}
    </div>
  );
}
