"use client";

import React from "react";
import { CheckCircle2, X } from "lucide-react";

interface CaraOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CaraOrderModal: React.FC<CaraOrderModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cara-order-title"
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl border-2 border-pink-300 w-full max-w-lg p-6 shadow-2xl relative flex flex-col gap-4 text-left">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup panduan cara order"
          className="absolute top-4 right-4 text-gray-500 hover:text-pink-600 transition-colors p-1 rounded-full hover:bg-pink-50 cursor-pointer"
        >
          <X aria-hidden="true" className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-pink-100 text-[#FF2E88] border border-pink-300 flex items-center justify-center">
            <CheckCircle2 aria-hidden="true" className="w-5 h-5" />
          </div>
          <h3 id="cara-order-title" className="text-base font-black text-gray-900 uppercase">Cara Order di Zerly Gamers</h3>
        </div>

        <div className="flex flex-col gap-3 text-xs text-gray-800">
          <div className="flex items-start gap-2.5 bg-pink-50/50 p-3 rounded-2xl border border-pink-200/70">
            <span aria-hidden="true" className="w-6 h-6 rounded-full bg-[#FF2E88] text-white flex items-center justify-center font-black shrink-0 text-xs">1</span>
            <div>
              <strong className="text-gray-900 block font-bold">Pilih Nominal Robux</strong>
              <p className="text-gray-700">Klik kartu nominal Robux yang kamu inginkan pada daftar paket.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-pink-50/50 p-3 rounded-2xl border border-pink-200/70">
            <span aria-hidden="true" className="w-6 h-6 rounded-full bg-[#FF2E88] text-white flex items-center justify-center font-black shrink-0 text-xs">2</span>
            <div>
              <strong className="text-gray-900 block font-bold">Masukkan User ID / Username Roblox</strong>
              <p className="text-gray-700">Isi username akun Roblox kamu dengan teliti (tidak perlu password).</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-pink-50/50 p-3 rounded-2xl border border-pink-200/70">
            <span aria-hidden="true" className="w-6 h-6 rounded-full bg-[#FF2E88] text-white flex items-center justify-center font-black shrink-0 text-xs">3</span>
            <div>
              <strong className="text-gray-900 block font-bold">Pilih Pembayaran &amp; Selesaikan Order</strong>
              <p className="text-gray-700">Pilih QRIS, E-Wallet (DANA/OVO/GoPay), atau Transfer Bank. Item akan masuk dalam 1-3 menit!</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-[#FF2E88] hover:bg-[#E61B75] text-white font-bold py-2.5 rounded-full text-xs uppercase cursor-pointer"
        >
          Mengerti &amp; Mulai Order
        </button>
      </div>
    </div>
  );
};
