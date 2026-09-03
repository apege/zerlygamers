"use client";

import React from "react";
import Image from "next/image";
import {
  MessageCircle,
  X,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Gamepad2,
  ShieldCheck,
} from "lucide-react";
import { RobuxPackage, RobloxUser } from "@/types/landing";

interface WhatsAppSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: RobuxPackage;
  userId: string;
  robloxUser: RobloxUser | null;
  invoiceNumber: string;
  whatsappLink: string;
  storeName?: string;
}

export const WhatsAppSuccessModal: React.FC<WhatsAppSuccessModalProps> = ({
  isOpen,
  onClose,
  selectedPackage,
  userId,
  robloxUser,
  invoiceNumber,
  whatsappLink,
  storeName = "Zerly Gamers",
}) => {
  if (!isOpen) return null;

  const handleOpenWa = () => {
    if (whatsappLink) {
      window.open(whatsappLink, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-2 border-emerald-300 w-full max-w-lg p-5 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col gap-4 text-left max-h-[92vh] overflow-y-auto">
        {/* Background glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-300/20 rounded-full blur-xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-emerald-600 transition-colors p-1.5 rounded-full hover:bg-emerald-50 cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Icon */}
        <div className="flex flex-col items-center text-center gap-2 pt-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 animate-bounce">
            <MessageCircle className="w-8 h-8 fill-white/20" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-600">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pesanan Siap Dikirim ke WhatsApp</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Lanjutkan Order di WhatsApp! 💬
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 font-medium max-w-sm mx-auto leading-relaxed">
              Format pesanan telah dibuat. Silakan kirimkan chat ke Admin <strong className="text-emerald-700">{storeName}</strong> untuk menyelesaikan order.
            </p>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex flex-col gap-2.5 text-xs">
          {/* Invoice */}
          <div className="flex justify-between items-center py-1 border-b border-emerald-200/60">
            <span className="text-gray-500 font-medium">No. Invoice</span>
            <span className="font-mono font-black text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
              {invoiceNumber}
            </span>
          </div>

          {/* Account */}
          <div className="flex justify-between items-center py-1 border-b border-emerald-200/60">
            <span className="text-gray-500 font-medium">Akun Roblox</span>
            <div className="flex items-center gap-1.5">
              {robloxUser?.avatarUrl ? (
                <img
                  src={robloxUser.avatarUrl}
                  alt={userId}
                  className="w-5 h-5 rounded-full object-cover border border-emerald-300"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Gamepad2 className="w-3 h-3" />
                </div>
              )}
              <span className="font-black text-gray-900 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                {robloxUser ? `${robloxUser.displayName} (@${robloxUser.name})` : userId}
              </span>
            </div>
          </div>

          {/* Package */}
          <div className="flex justify-between items-center py-1 border-b border-emerald-200/60">
            <span className="text-gray-500 font-medium">Paket Item</span>
            <div className="flex items-center gap-1.5 font-black text-emerald-700">
              <Image src="/robux.webp" alt="Robux" width={18} height={18} className="object-contain" />
              <span>{selectedPackage.amount} Robux</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex justify-between items-center py-1 border-b border-emerald-200/60">
            <span className="text-gray-500 font-medium">Total Pembayaran</span>
            <span className="text-base font-black text-emerald-700">
              {selectedPackage.priceFormatted}
            </span>
          </div>

          {/* Method */}
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-500 font-medium">Metode Pemesanan</span>
            <span className="font-extrabold text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct WhatsApp Admin 24/7</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={handleOpenWa}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide"
          >
            <MessageCircle className="w-4 h-4 fill-white/20" />
            <span>Buka Chat WhatsApp Sekarang</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 font-bold text-xs transition-colors cursor-pointer"
          >
            Tutup &amp; Kembali ke Toko
          </button>
        </div>
      </div>
    </div>
  );
};
