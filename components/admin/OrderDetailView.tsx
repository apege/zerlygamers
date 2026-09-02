'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { AdminOrder } from '@/data/adminDummyData';

interface OrderDetailViewProps {
  order: AdminOrder;
  onBack: () => void;
  onUpdateStatus: (orderId: string, status: AdminOrder['status'], label: string) => void;
}

export default function OrderDetailView({ order, onBack, onUpdateStatus }: OrderDetailViewProps) {
  const [adminNote, setAdminNote] = useState(order.adminNote || '');
  const [isCopiedId, setIsCopiedId] = useState(false);
  const [isCopiedPhone, setIsCopiedPhone] = useState(false);
  const [noteSavedAlert, setNoteSavedAlert] = useState(false);

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

  const handleSaveNote = () => {
    setNoteSavedAlert(true);
    setTimeout(() => setNoteSavedAlert(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in zoom-in-98 duration-200">
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
                {order.username}
              </span>
            </div>

            {/* Roblox User ID & Copy */}
            {order.robloxUserId && (
              <div className="flex items-center justify-between py-1.5 border-b border-rose-50">
                <span className="text-gray-400 font-medium">Roblox User ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-gray-800">{order.robloxUserId}</span>
                  <button
                    onClick={() => copyToClipboard(order.robloxUserId!, 'id')}
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
                  order.robloxIdStatus === 'aktif' || order.robloxIdStatus === 'terverifikasi'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {order.robloxIdStatus === 'aktif' || order.robloxIdStatus === 'terverifikasi'
                  ? 'Aktif'
                  : 'Belum Aktif'}
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
    </div>
  );
}
