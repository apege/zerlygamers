"use client";

import React from "react";
import { HelpCircle, X } from "lucide-react";

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-2 border-pink-300 w-full max-w-lg p-6 shadow-2xl relative flex flex-col gap-4 text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-pink-600 transition-colors p-1 rounded-full hover:bg-pink-50 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-pink-100 text-[#FF2E88] border border-pink-300 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-gray-900 uppercase">Pertanyaan Umum (FAQ)</h3>
        </div>

        <div className="flex flex-col gap-2.5 text-xs text-gray-700 max-h-[60vh] overflow-y-auto">
          <div className="border border-pink-200 rounded-2xl p-3 bg-pink-50/40">
            <h4 className="font-black text-gray-900">Berapa lama proses pengiriman Robux?</h4>
            <p className="text-gray-600 mt-1">Proses otomatis rata-rata hanya 1-5 menit setelah pembayaran terkonfirmasi.</p>
          </div>
          <div className="border border-pink-200 rounded-2xl p-3 bg-pink-50/40">
            <h4 className="font-black text-gray-900">Apakah aman dan legal?</h4>
            <p className="text-gray-600 mt-1">100% legal dan aman, menggunakan metode resmi tanpa memerlukan password akun kamu.</p>
          </div>
          <div className="border border-pink-200 rounded-2xl p-3 bg-pink-50/40">
            <h4 className="font-black text-gray-900">Bagaimana jika transaksi tertunda?</h4>
            <p className="text-gray-600 mt-1">Admin Customer Service kami aktif 24/7 siap membantu melalui tombol kontak WhatsApp.</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#FF2E88] hover:bg-[#E61B75] text-white font-bold py-2.5 rounded-full text-xs uppercase cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
