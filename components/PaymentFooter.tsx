"use client";

import React from "react";
import { PaymentMethod } from "@/types/landing";

interface PaymentFooterProps {
  paymentMethods: PaymentMethod[];
}

export const PaymentFooter: React.FC<PaymentFooterProps> = ({ paymentMethods }) => {
  return (
    <>
      <footer className="w-full bg-white/95 backdrop-blur-md rounded-3xl border-2 border-pink-200/90 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Left: METODE PEMBAYARAN with Large Direct Official Logos (No tiny cards) */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="text-xs font-black text-[#FF1D7E] uppercase tracking-wider shrink-0 mr-1">
            METODE PEMBAYARAN
          </span>

          <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
            {paymentMethods.map((method, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center hover:scale-110 transition-transform duration-200 select-none"
                title={method.name}
              >
                {method.logo ? (
                  <img
                    src={method.logo}
                    alt={method.name}
                    className="h-6 sm:h-7 max-w-[78px] object-contain drop-shadow-2xs"
                  />
                ) : (
                  <span className="text-xs font-black text-gray-800">{method.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: TRUSTED BY GAMERS */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              TRUSTED BY GAMERS
            </span>
          </div>

          {/* Overlapping Colorful Initial Badges */}
          <div className="flex -space-x-2 overflow-hidden items-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF2E88] to-[#FF55A3] ring-2 ring-white flex items-center justify-center text-white text-[10px] font-black">
              G
            </div>
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#9333EA] to-[#C084FC] ring-2 ring-white flex items-center justify-center text-white text-[10px] font-black">
              R
            </div>
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] ring-2 ring-white flex items-center justify-center text-white text-[10px] font-black">
              Z
            </div>
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#059669] to-[#34D399] ring-2 ring-white flex items-center justify-center text-white text-[10px] font-black">
              A
            </div>
          </div>

          {/* 10.000+ Transaksi Berhasil Badge */}
          <div className="bg-gradient-to-r from-[#FF2E88] to-[#FF4E98] text-white px-3 py-1 rounded-full text-[11px] font-black tracking-wide uppercase shadow-xs flex items-center gap-1">
            <span>10.000+</span>
            <span className="text-[9.5px] font-semibold opacity-90">Transaksi Berhasil</span>
          </div>
        </div>
      </footer>

      {/* Bottom Credits & Copyright */}
      <div className="text-center text-gray-400 text-[11px] font-medium py-1">
        &copy; {new Date().getFullYear()} Zerly Gamers. All rights reserved. Platform Top Up Game Terpercaya di Indonesia.
      </div>
    </>
  );
};
