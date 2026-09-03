"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Gamepad2,
  X,
  CheckCircle2,
  ChevronRight,
  UploadCloud,
  Phone,
  FileText,
  AlertCircle,
  Clock,
} from "lucide-react";
import { RobuxPackage, RobloxUser } from "@/types/landing";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: RobuxPackage;
  userId: string;
  robloxUser: RobloxUser | null;
  orderSuccess: boolean;
  qrisImagePath?: string;
  storeName?: string;
  onConfirmOrder: (orderDetails: {
    whatsappNumber: string;
    notes: string;
    proofFile: File | null;
    proofUrl: string | null;
  }) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  selectedPackage,
  userId,
  robloxUser,
  orderSuccess,
  qrisImagePath,
  storeName = "Zerly Gamers",
  onConfirmOrder,
}) => {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrorMsg("Harap upload file gambar (JPG, PNG, atau JPEG).");
        return;
      }
      setProofFile(file);
      setErrorMsg("");
      const reader = new FileReader();
      reader.onload = (event) => {
        setProofPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setProofFile(null);
    setProofPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsappNumber.trim()) {
      setErrorMsg("Harap masukkan nomor WhatsApp aktif kamu.");
      return;
    }
    if (!proofFile && !proofPreview) {
      setErrorMsg("Harap upload bukti pembayaran transfer/QRIS.");
      return;
    }
    setErrorMsg("");
    onConfirmOrder({
      whatsappNumber,
      notes,
      proofFile,
      proofUrl: proofPreview,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-2 border-pink-300 w-full max-w-lg p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col gap-4 text-left max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-pink-600 transition-colors p-1.5 rounded-full hover:bg-pink-50 cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 text-[#FF2E88] border border-pink-300 flex items-center justify-center shrink-0 shadow-xs">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-gray-900 uppercase tracking-wide">
              PEMBAYARAN QRIS INSTAN
            </h3>
            <p className="text-xs text-gray-500">Scan QRIS &amp; upload bukti untuk proses otomatis</p>
          </div>
        </div>

        {orderSuccess ? (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center flex flex-col items-center gap-3 my-2 animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
            <div className="text-base font-black text-emerald-900">
              Pesanan Berhasil Dikirim!
            </div>
            <p className="text-xs text-emerald-700 leading-relaxed max-w-sm">
              Bukti pembayaran kamu telah diterima. Admin Zerly Gamers sedang memverifikasi dan mengirim Robux ke akun <strong>@{robloxUser ? robloxUser.name : userId}</strong>.
            </p>
            <div className="w-full bg-white rounded-xl p-3 border border-emerald-200 text-xs text-left flex flex-col gap-1 text-gray-700">
              <div className="flex justify-between">
                <span>No. WhatsApp:</span>
                <span className="font-bold">{whatsappNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Bayar:</span>
                <span className="font-bold text-[#FF1D7E]">{selectedPackage.priceFormatted}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="mt-2 w-full bg-[#059669] hover:bg-[#047857] text-white font-bold py-2.5 rounded-full text-xs uppercase cursor-pointer"
            >
              Selesai &amp; Tutup
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* 1. Order Summary (NO GAME ROW) */}
            <div className="bg-pink-50/70 border border-pink-200 rounded-2xl p-3.5 flex flex-col gap-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-pink-200/60">
                <span className="text-gray-500 font-medium">Akun Roblox</span>
                <div className="flex items-center gap-1.5">
                  {robloxUser?.avatarUrl && (
                    <img
                      src={robloxUser.avatarUrl}
                      alt={userId}
                      className="w-5 h-5 rounded-full object-cover border border-pink-300"
                    />
                  )}
                  <span className="font-black text-gray-900 bg-white px-2 py-0.5 rounded-md border border-pink-200">
                    {robloxUser ? `${robloxUser.displayName} (@${robloxUser.name})` : userId}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-pink-200/60">
                <span className="text-gray-500 font-medium">Paket Item</span>
                <div className="flex items-center gap-1.5 font-black text-[#FF2E88]">
                  <Image src="/robux.webp" alt="Robux" width={18} height={18} className="object-contain" />
                  <span>{selectedPackage.amount} Robux</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500 font-medium">Total Pembayaran</span>
                <span className="text-base font-black text-[#FF1D7E]">{selectedPackage.priceFormatted}</span>
              </div>
            </div>

            {/* 2. QRIS Code Display */}
            <div className="bg-gradient-to-b from-white to-pink-50/40 border-2 border-pink-300 rounded-2xl p-4 flex flex-col items-center text-center gap-2.5 shadow-xs">
              <div className="flex items-center gap-2 w-full justify-between pb-1 border-b border-pink-100">
                <div className="flex items-center gap-1.5">
                  <img src="/payments/qris.png" alt="QRIS" className="h-4.5 object-contain" />
                  <span className="text-[10px] font-bold text-gray-500">Scan Semua Pembayaran</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">
                  <Clock className="w-3 h-3" />
                  <span>Proses Cepat</span>
                </div>
              </div>

              {/* QRIS Code Image Container */}
              <div className="bg-white p-3 rounded-2xl border-2 border-gray-800 shadow-md relative group flex flex-col items-center">
                <div className="w-48 h-48 bg-white flex items-center justify-center relative p-1">
                  {qrisImagePath ? (
                    <img
                      src={qrisImagePath}
                      alt={`QRIS Toko ${storeName}`}
                      className="w-full h-full object-contain rounded-xl"
                    />
                  ) : (
                    <>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=00020101021126570011ID.ZERLYGAMERS.WWW0118936009110022345678520458125303360540${selectedPackage.priceNumber}5802ID5912ZERLY_GAMERS6007JAKARTA6304ABCD`}
                        alt="QRIS Code Pembayaran"
                        className="w-full h-full object-contain"
                      />
                      {/* Center QRIS logo badge */}
                      <div className="absolute inset-0 m-auto w-9 h-9 bg-white rounded-lg p-1 shadow-sm border border-gray-200 flex items-center justify-center">
                        <img src="/payments/qris.png" alt="QRIS" className="w-full h-full object-contain" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Supported payment icons under QRIS */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 opacity-85">
                <img src="/payments/dana.png" alt="DANA" className="h-3.5 object-contain" />
                <img src="/payments/gopay.png" alt="GoPay" className="h-3.5 object-contain" />
                <img src="/payments/ovo.png" alt="OVO" className="h-3.5 object-contain" />
                <img src="/payments/shopeepay.png" alt="ShopeePay" className="h-3.5 object-contain" />
                <img src="/payments/bca.png" alt="BCA" className="h-3.5 object-contain" />
                <img src="/payments/mandiri.png" alt="Mandiri" className="h-3.5 object-contain" />
              </div>

              <p className="text-[10.5px] text-gray-500">
                Buka aplikasi BCA, Mandiri, DANA, GoPay, OVO, atau ShopeePay lalu scan QRIS di atas dengan nominal pas <strong>{selectedPackage.priceFormatted}</strong>
              </p>
            </div>

            {/* 3. Upload Bukti Pembayaran */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-black text-gray-700 uppercase tracking-wider flex items-center justify-between">
                <span>UPLOAD BUKTI PEMBAYARAN</span>
                <span className="text-[10px] text-[#FF2E88] font-bold">Wajib diupload</span>
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="proof-upload"
              />

              {proofPreview ? (
                <div className="relative border-2 border-emerald-300 bg-emerald-50/60 rounded-2xl p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <img
                      src={proofPreview}
                      alt="Bukti Transfer"
                      className="w-12 h-12 rounded-xl object-cover border border-emerald-400 shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-emerald-900 truncate">
                        {proofFile?.name || "Bukti Transfer Terpilih"}
                      </span>
                      <span className="text-[10px] text-emerald-700">Gambar siap dikirim</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="proof-upload"
                  className="border-2 border-dashed border-pink-300 hover:border-[#FF2E88] bg-pink-50/40 hover:bg-pink-50/70 rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <UploadCloud className="w-6 h-6 text-[#FF2E88]" />
                  <span className="text-xs font-bold text-gray-700">
                    Klik untuk Upload Screenshot Bukti Transfer
                  </span>
                  <span className="text-[10px] text-gray-400">Format: JPG, PNG, JPEG (Maks. 5MB)</span>
                </label>
              )}
            </div>

            {/* 4. Nomor WhatsApp Pembeli */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-black text-gray-700 uppercase tracking-wider flex items-center justify-between">
                <span>NOMOR WHATSAPP KAMU</span>
                <span className="text-[10px] text-gray-400 font-semibold">Untuk info pesanan</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => {
                    setWhatsappNumber(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder="Contoh: 081234567890"
                  className="w-full bg-white border-2 border-pink-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF2E88] transition-colors pl-9"
                />
                <Phone className="w-4 h-4 text-pink-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 5. Catatan (Opsional) */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-black text-gray-700 uppercase tracking-wider flex items-center justify-between">
                <span>CATATAN PESANAN</span>
                <span className="text-[10px] text-gray-400 font-semibold">Opsional</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tulis catatan jika ada..."
                  className="w-full bg-white border-2 border-pink-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF2E88] transition-colors pl-9"
                />
                <FileText className="w-4 h-4 text-pink-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 font-medium text-left">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-1 bg-gradient-to-r from-[#FF2E88] via-[#FF3B93] to-[#FF55A3] hover:from-[#E61B75] hover:to-[#FF3B93] text-white font-black text-xs sm:text-sm py-3.5 rounded-full shadow-lg shadow-pink-500/35 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>KIRIM BUKTI PEMBAYARAN</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>

          </form>
        )}
      </div>
    </div>
  );
};
