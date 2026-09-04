"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Gamepad2, ChevronRight, Globe, MessageCircle, Sparkles, CheckCircle2, Loader2, Search, AlertCircle } from "lucide-react";
import { RobuxPackage, RobloxUser } from "@/types/landing";

interface FormOrderProps {
  selectedPackage: RobuxPackage;
  onSelectPackage?: (pkg: RobuxPackage) => void;
  allPackages?: RobuxPackage[];
  userId: string;
  onUserIdChange: (val: string) => void;
  robloxUser: RobloxUser | null;
  onRobloxUserChange: (user: RobloxUser | null) => void;
  orderMethod: "website" | "whatsapp";
  onOrderMethodChange: (method: "website" | "whatsapp") => void;
  formError: string;
  onSubmit: (e: React.FormEvent) => void;
}

export const FormOrder: React.FC<FormOrderProps> = ({
  selectedPackage,
  userId,
  onUserIdChange,
  robloxUser,
  onRobloxUserChange,
  orderMethod,
  onOrderMethodChange,
  formError,
  onSubmit,
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [checkError, setCheckError] = useState("");

  const handleCheckUser = async () => {
    if (!userId.trim()) {
      setCheckError("Masukkan username Roblox terlebih dahulu.");
      return;
    }

    setIsChecking(true);
    setCheckError("");

    try {
      const res = await fetch("/api/roblox/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userId.trim() }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        onRobloxUserChange(data.user);
        onUserIdChange(data.user.name); // Normalize username
        setCheckError("");
      } else {
        onRobloxUserChange(null);
        setCheckError(data.message || "Username Roblox tidak ditemukan!");
      }
    } catch {
      onRobloxUserChange(null);
      setCheckError("Gagal memeriksa akun Roblox. Cek koneksi internet.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div
      id="form-order"
      className="lg:col-span-4 bg-white/95 backdrop-blur-md rounded-3xl border-2 border-pink-300 shadow-sm overflow-hidden flex flex-col"
    >
      {/* Header Strip */}
      <div className="bg-gradient-to-r from-[#FF2E88] to-[#FF4E98] text-white px-5 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-white" />
          <h3 className="text-sm sm:text-base font-black uppercase tracking-wider">
            FORM ORDER
          </h3>
        </div>
        <div className="flex items-center gap-1 text-pink-200 text-xs">
          <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200" />
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={onSubmit} className="p-5 flex flex-col gap-3.5">
        
        {/* 1. USERNAME ROBLOX (FIRST FIELD) with Live API Check */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-[11px] font-black text-gray-700 uppercase tracking-wider flex items-center justify-between">
            <span>1. USERNAME ROBLOX</span>
            <span className="text-[10px] text-gray-400 font-semibold">Wajib diisi</span>
          </label>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={userId}
              onChange={(e) => {
                onUserIdChange(e.target.value);
                if (robloxUser) onRobloxUserChange(null);
                if (checkError) setCheckError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCheckUser();
                }
              }}
              placeholder="Masukkan Username Roblox..."
              className="flex-1 bg-white border-2 border-pink-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF2E88] transition-colors"
            />
            
            <button
              type="button"
              onClick={handleCheckUser}
              disabled={isChecking || !userId.trim()}
              className="px-3.5 py-2.5 bg-gradient-to-r from-[#FF2E88] to-[#FF4E98] disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer disabled:cursor-not-allowed"
            >
              {isChecking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>CEK</span>
                </>
              )}
            </button>
          </div>

          {robloxUser && (
            <div className="bg-emerald-50/90 border border-emerald-300 rounded-2xl p-2.5 flex items-center gap-2.5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 overflow-hidden shrink-0 flex items-center justify-center">
                {robloxUser.avatarUrl ? (
                  <img src={robloxUser.avatarUrl} alt={robloxUser.name} className="w-full h-full object-cover" />
                ) : (
                  <Gamepad2 className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black text-emerald-950 truncate">{robloxUser.displayName}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold">@{robloxUser.name} (ID: {robloxUser.id})</span>
              </div>
            </div>
          )}

          {/* Check Error Banner */}
          {checkError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{checkError}</span>
            </div>
          )}
        </div>

        {/* 2. NOMINAL ROBUX (DISPLAY CARD - WITH OFFICIAL ROBUX IMAGE) */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-[11px] font-black text-gray-700 uppercase tracking-wider flex items-center justify-between">
            <span>2. NOMINAL ROBUX</span>
            <span className="text-[10px] text-[#FF2E88] font-bold">Pilih di katalog sebelah</span>
          </label>
          
          <div className="w-full bg-pink-50/70 border-2 border-pink-200 rounded-2xl px-3.5 py-2.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 relative flex items-center justify-center shrink-0">
                <Image
                  src="/robux.webp"
                  alt="Robux Icon"
                  width={28}
                  height={28}
                  className="object-contain drop-shadow-xs"
                />
              </div>
              <span className="text-xs sm:text-sm font-black text-gray-900">
                {selectedPackage.amount} Robux
              </span>
            </div>
            <span className="text-xs sm:text-sm font-black text-[#FF1D7E] bg-white px-2.5 py-1 rounded-xl border border-pink-200 shadow-2xs">
              {selectedPackage.priceFormatted}
            </span>
          </div>
        </div>

        {/* 3. METODE PEMBAYARAN */}
        <div className="flex flex-col gap-1.5 text-left pt-0.5">
          <label className="text-[11px] font-black text-gray-700 uppercase tracking-wider">
            3. METODE PEMBAYARAN
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Option 1: Via Website */}
            <button
              type="button"
              onClick={() => onOrderMethodChange("website")}
              className={`p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer select-none ${
                orderMethod === "website"
                  ? "border-[#FF2E88] bg-pink-50/80 text-[#FF2E88] shadow-xs scale-[1.02]"
                  : "border-gray-200 bg-white text-gray-600 hover:border-pink-200 hover:bg-pink-50/30"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Globe className={`w-4 h-4 ${orderMethod === "website" ? "text-[#FF2E88]" : "text-gray-500"}`} />
                <span className="text-xs font-black uppercase">Via Website</span>
              </div>
              <span className="text-[9.5px] font-semibold text-gray-500">QRIS / E-Wallet</span>
            </button>

            {/* Option 2: Via WhatsApp */}
            <button
              type="button"
              onClick={() => onOrderMethodChange("whatsapp")}
              className={`p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer select-none ${
                orderMethod === "whatsapp"
                  ? "border-[#25D366] bg-emerald-50 text-[#075E54] shadow-xs scale-[1.02]"
                  : "border-gray-200 bg-white text-gray-600 hover:border-emerald-200 hover:bg-emerald-50/30"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <MessageCircle className={`w-4 h-4 ${orderMethod === "whatsapp" ? "text-[#25D366]" : "text-gray-500"}`} />
                <span className="text-xs font-black uppercase">Via WhatsApp</span>
              </div>
              <span className="text-[9.5px] font-semibold text-gray-500">Admin 24/7</span>
            </button>
          </div>
        </div>

        {/* Form Validation Warning */}
        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-xl text-left font-medium">
            {formError}
          </div>
        )}

        {/* Submit Action Button */}
        <button
          type="submit"
          className={`w-full mt-1 text-white font-black text-xs sm:text-sm py-3.5 rounded-full shadow-lg hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
            orderMethod === "whatsapp"
              ? "bg-gradient-to-r from-[#25D366] to-[#128C7E] shadow-emerald-500/35 hover:shadow-emerald-500/50"
              : "bg-gradient-to-r from-[#FF2E88] via-[#FF3B93] to-[#FF55A3] shadow-pink-500/35 hover:shadow-pink-500/50"
          }`}
        >
          <span>
            {orderMethod === "whatsapp" ? "ORDER VIA WHATSAPP" : "ORDER SEKARANG"}
          </span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>
      </form>
    </div>
  );
};
