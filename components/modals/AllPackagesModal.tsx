"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, X } from "lucide-react";
import { RobuxPackage } from "@/types/landing";

interface AllPackagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  allPackages: RobuxPackage[];
  selectedPackage: RobuxPackage;
  onSelectPackage: (pkg: RobuxPackage) => void;
}

export const AllPackagesModal: React.FC<AllPackagesModalProps> = ({
  isOpen,
  onClose,
  allPackages,
  selectedPackage,
  onSelectPackage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-2 border-pink-300 w-full max-w-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col gap-4 text-left max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-pink-600 transition-colors p-1 rounded-full hover:bg-pink-50 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-pink-100 text-[#FF2E88] border border-pink-300 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-gray-900 uppercase">Daftar Lengkap Paket Robux</h3>
            <p className="text-xs text-gray-500">Pilih nominal yang kamu inginkan untuk langsung mengisi form order</p>
          </div>
        </div>

        {/* Full Grid of packages */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {allPackages.map((pkg) => {
            const isSelected = selectedPackage.id === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => {
                  onSelectPackage(pkg);
                  onClose();
                  const formElem = document.getElementById("form-order");
                  if (formElem) formElem.scrollIntoView({ behavior: "smooth" });
                }}
                className={`relative rounded-2xl flex flex-col items-center justify-between p-3.5 transition-all cursor-pointer select-none ${
                  isSelected
                    ? "bg-pink-50/70 border-2 border-[#FF2E88] shadow-md shadow-pink-200"
                    : "bg-white border-2 border-pink-200/80 hover:border-pink-300 hover:bg-pink-50/30"
                }`}
              >
                {pkg.isBestSeller && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#FF2E88] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                    BEST SELLER
                  </div>
                )}
                <span className="text-[11px] font-bold text-gray-500 uppercase">ROBUX</span>
                <span className="text-2xl font-black text-gray-900">{pkg.amount}</span>
                <div className="my-2 w-12 h-12 flex items-center justify-center">
                  <Image src="/robux.webp" alt="Robux" width={44} height={44} className="object-contain" />
                </div>
                <div className="w-full text-center py-1.5 px-2 rounded-xl text-xs font-extrabold bg-pink-50 text-[#FF2E88] border border-pink-200">
                  {pkg.priceFormatted}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
