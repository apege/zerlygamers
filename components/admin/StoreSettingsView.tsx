'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Store,
  Flame,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Upload,
  RotateCcw,
  Save,
  Check,
  CheckCircle2,
  Sparkles,
  QrCode,
  Globe,
  Phone,
  Calendar,
} from 'lucide-react';
import CustomPromoDatePicker from '@/components/admin/CustomPromoDatePicker';

export default function StoreSettingsView() {
  // Accordion Sections State
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    identity: true,
    promo: true,
    media: true,
  });

  // 1. Identity & Contact State
  const [storeName, setStoreName] = useState('Zerly Gamers');
  const [whatsappNumber, setWhatsappNumber] = useState('6285624595886');

  // 2. Promo Banner State
  const [isPromoActive, setIsPromoActive] = useState(true);
  const [promoItem, setPromoItem] = useState('2.200 Robux');
  const [promoPrice, setPromoPrice] = useState('Rp 45.000');
  const [promoTagline, setPromoTagline] = useState('⚡ PROMO SPESIAL: 2.200 Robux Cuma Rp 45.000! Stok Terbatas');
  const [promoEndTime, setPromoEndTime] = useState('1 Oktober 2026, 06:59 WIB');
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);

  // 3. Media & QRIS State
  const [qrisPreview, setQrisPreview] = useState('/qris.jpeg');
  const [logoPreview, setLogoPreview] = useState('/logo.png');
  const [saveSuccessAlert, setSaveSuccessAlert] = useState(false);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAllSections = () => {
    const allOpen = Object.values(openSections).every(Boolean);
    setOpenSections({
      identity: !allOpen,
      promo: !allOpen,
      media: !allOpen,
    });
  };

  const isAllOpen = Object.values(openSections).every(Boolean);

  const handleSaveAll = () => {
    setSaveSuccessAlert(true);
    setTimeout(() => setSaveSuccessAlert(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in zoom-in-98 duration-200">
      {/* 1. Header (Matching Screenshot 1 & 2) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Pengaturan Toko &amp; Banner
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
            Konfigurasi identitas toko, nomor WhatsApp CS, barcode QRIS, dan banner promo pelanggan
          </p>
        </div>

        <button
          onClick={toggleAllSections}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-pink-50 text-gray-800 border border-pink-200 rounded-full text-xs font-extrabold shadow-2xs transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <ChevronsUpDown className="w-3.5 h-3.5 text-[#FF2A85]" />
          <span>{isAllOpen ? 'Tutup Semua Section' : 'Buka Semua Section'}</span>
        </button>
      </div>

      {/* Accordion List Container */}
      <div className="space-y-4">
        {/* ============================================================ */}
        {/* SECTION 1: IDENTITAS TOKO & KONTAK */}
        {/* ============================================================ */}
        <div className="bg-white border border-pink-100/90 rounded-3xl shadow-xs overflow-hidden transition-all">
          {/* Header Bar */}
          <div
            onClick={() => toggleSection('identity')}
            className="p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-pink-50/30 transition-colors select-none"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#FF2A85] flex items-center justify-center border border-pink-100 shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-900 truncate">
                  IDENTITAS TOKO &amp; KONTAK
                </h3>
                <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                  Nama toko di navbar pelanggan dan nomor WhatsApp CS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden md:inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-pink-50 text-[#FF2A85] border border-pink-100">
                {storeName} • WA: {whatsappNumber}
              </span>
              <div className="w-8 h-8 rounded-full bg-pink-50 text-gray-500 flex items-center justify-center">
                {openSections.identity ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </div>

          {/* Form Content */}
          {openSections.identity && (
            <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-pink-50 space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nama Toko */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">
                    Nama Toko (Navbar Pelanggan)
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Zerly Gamers"
                    className="w-full px-4 py-2.5 bg-white border border-pink-200 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400/40 focus:border-pink-400"
                  />
                  <p className="text-[10px] text-gray-400 font-medium">
                    Tampil di navbar web utama (Zerly berwarna pink, Gamers hitam).
                  </p>
                </div>

                {/* Nomor WhatsApp */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">
                    Nomor WhatsApp Admin CS (Format 62...)
                  </label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="6285624595886"
                    className="w-full px-4 py-2.5 bg-white border border-pink-200 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400/40 focus:border-pink-400"
                  />
                  <p className="text-[10px] text-gray-400 font-medium">
                    Tujuan konfirmasi order dan tombol bantuan CS pelanggan.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* SECTION 2: PENGATURAN PROMO BANNER WEB PELANGGAN */}
        {/* ============================================================ */}
        <div className="bg-white border border-pink-100/90 rounded-3xl shadow-xs overflow-hidden transition-all">
          {/* Header Bar */}
          <div
            onClick={() => toggleSection('promo')}
            className="p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-pink-50/30 transition-colors select-none"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100 shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-900 truncate">
                  PENGATURAN PROMO BANNER WEB PELANGGAN
                </h3>
                <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                  Atur paket promo yang muncul pada banner hero bagian atas website toko
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden md:inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-pink-50 text-[#FF2A85] border border-pink-100">
                {isPromoActive ? `Promo Aktif • ${promoItem} (${promoPrice})` : 'Promo Nonaktif'}
              </span>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPromoActive(!isPromoActive);
                }}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  isPromoActive ? 'bg-[#FF2A85]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isPromoActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>

              <div className="w-8 h-8 rounded-full bg-pink-50 text-gray-500 flex items-center justify-center">
                {openSections.promo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </div>

          {/* Form Content */}
          {openSections.promo && (
            <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-pink-50 space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pilihan Paket Promo */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">
                    Paket Robux yang Dipromosikan
                  </label>
                  <select
                    value={promoItem}
                    onChange={(e) => {
                      setPromoItem(e.target.value);
                      if (e.target.value === '2.200 Robux') setPromoPrice('Rp 45.000');
                      else if (e.target.value === '1.800 Robux') setPromoPrice('Rp 35.000');
                      else if (e.target.value === '3.200 Robux') setPromoPrice('Rp 60.000');
                      else if (e.target.value === '10.500 Robux') setPromoPrice('Rp 200.000');
                    }}
                    className="w-full px-4 py-2.5 bg-white border border-pink-200 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400/40 focus:border-pink-400"
                  >
                    <option value="1.800 Robux">1.800 Robux (Rp 35.000)</option>
                    <option value="2.200 Robux">2.200 Robux (Rp 45.000) - Rekomendasi</option>
                    <option value="3.200 Robux">3.200 Robux (Rp 60.000)</option>
                    <option value="10.500 Robux">10.500 Robux (Rp 200.000) - Sultan</option>
                  </select>
                </div>

                {/* Teks Tagline Banner */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">
                    Teks Slogan / Tagline Banner
                  </label>
                  <input
                    type="text"
                    value={promoTagline}
                    onChange={(e) => setPromoTagline(e.target.value)}
                    placeholder="Contoh: ⚡ PROMO SPESIAL HARI INI!"
                    className="w-full px-4 py-2.5 bg-white border border-pink-200 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400/40 focus:border-pink-400"
                  />
                </div>

                {/* Batas Waktu Berakhir Promo (Custom Date & Time Picker) */}
                <div className="space-y-1.5 sm:col-span-2 pt-2 border-t border-pink-50">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#FF2A85]" />
                      <span>Batas Waktu Berakhir Promo (Countdown Banner)</span>
                    </label>
                    <span className="text-[10px] font-extrabold text-[#FF2A85] bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
                      Aktif s/d {promoEndTime}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex-1 w-full px-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-2xl text-xs font-bold text-gray-900 flex items-center justify-between">
                      <span>{promoEndTime}</span>
                      <span className="text-[10px] text-gray-400 font-medium">(Otomatis Berakhir)</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowDatePickerModal(true)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF2A85] to-[#FF4D97] hover:opacity-95 text-white text-xs font-black shadow-md shadow-pink-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Set Tanggal &amp; Jam Promo</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* SECTION 3: BARCODE QRIS & LOGO TOKO */}
        {/* ============================================================ */}
        <div className="bg-white border border-pink-100/90 rounded-3xl shadow-xs overflow-hidden transition-all">
          {/* Header Bar */}
          <div
            onClick={() => toggleSection('media')}
            className="p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-pink-50/30 transition-colors select-none"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shrink-0">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-900 truncate">
                  BARCODE QRIS &amp; LOGO TOKO
                </h3>
                <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                  Barcode pembayaran QRIS otomatis dan logo storefront toko
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden md:inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-pink-50 text-[#FF2A85] border border-pink-100">
                QRIS: Terpasang • Logo: Terpasang
              </span>
              <div className="w-8 h-8 rounded-full bg-pink-50 text-gray-500 flex items-center justify-center">
                {openSections.media ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </div>

          {/* Form Content (Matching Screenshot 3 & 4) */}
          {openSections.media && (
            <div className="px-5 sm:px-6 pb-6 pt-4 border-t border-pink-50 space-y-6 animate-in fade-in duration-200">
              {/* 3A. Gambar QRIS Pembayaran */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-[#FF2A85]" />
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wide">
                    Gambar QRIS Pembayaran
                  </h4>
                </div>
                <p className="text-[11px] text-gray-500 font-medium">
                  Upload barcode QRIS toko untuk menerima pembayaran otomatis dari website
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Upload Box */}
                  <div className="border-2 border-dashed border-pink-200 hover:border-pink-400 bg-pink-50/20 hover:bg-pink-50/40 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group min-h-[180px]">
                    <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#FF2A85] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-extrabold text-gray-900 mt-3">
                      Upload QRIS Baru
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                      PNG / JPG / WEBP (Maks 5MB)
                    </span>
                  </div>

                  {/* Live Preview QRIS */}
                  <div className="bg-pink-50/30 border border-pink-100 rounded-3xl p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-2 border-b border-pink-100/60">
                      <span className="text-xs font-bold text-gray-700">Live Preview QRIS</span>
                      <button
                        type="button"
                        onClick={() => setQrisPreview('/qris.jpeg')}
                        className="text-[10px] font-bold text-gray-400 hover:text-[#FF2A85] flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset Default</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-center py-3">
                      <div className="relative w-40 h-48 rounded-2xl border border-pink-200 overflow-hidden shadow-xs bg-white">
                        <Image
                          src={qrisPreview}
                          alt="QRIS Barcode"
                          fill
                          sizes="160px"
                          className="object-contain p-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Path String */}
                <input
                  type="text"
                  readOnly
                  value={qrisPreview}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[11px] font-mono text-gray-500 select-all"
                />
              </div>

              {/* 3B. Logo Toko (Navbar Pelanggan) */}
              <div className="space-y-3 pt-4 border-t border-pink-50">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#FF2A85]" />
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wide">
                    Logo Toko (Navbar Pelanggan)
                  </h4>
                </div>
                <p className="text-[11px] text-gray-500 font-medium">
                  Upload logo bundar toko yang akan muncul di navbar storefront pelanggan
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Upload Box */}
                  <div className="border-2 border-dashed border-pink-200 hover:border-pink-400 bg-pink-50/20 hover:bg-pink-50/40 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group min-h-[140px]">
                    <div className="w-10 h-10 rounded-2xl bg-pink-100 text-[#FF2A85] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                      <Upload className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-extrabold text-gray-900 mt-2.5">
                      Upload Logo Toko
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                      Tarik logo ke sini atau klik browse
                    </span>
                  </div>

                  {/* Live Preview Logo */}
                  <div className="bg-pink-50/30 border border-pink-100 rounded-3xl p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-2 border-b border-pink-100/60">
                      <span className="text-xs font-bold text-gray-700">Live Preview Logo</span>
                      <button
                        type="button"
                        onClick={() => setLogoPreview('/logo.png')}
                        className="text-[10px] font-bold text-gray-400 hover:text-[#FF2A85] flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset Default</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-3 py-3">
                      <div className="w-14 h-14 rounded-full border-2 border-pink-300 p-1 bg-white shadow-xs relative overflow-hidden shrink-0">
                        <Image
                          src={logoPreview}
                          alt="Logo Preview"
                          fill
                          sizes="56px"
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-black text-gray-900">{storeName}</div>
                        <div className="text-[10px] text-gray-400 font-medium">Tampil di Navbar Toko</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Path String */}
                <input
                  type="text"
                  readOnly
                  value={logoPreview}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[11px] font-mono text-gray-500 select-all"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button (Bottom Sticky Right) */}
      <div className="flex items-center justify-end gap-3 pt-4">
        {saveSuccessAlert && (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Pengaturan berhasil disimpan!</span>
          </span>
        )}

        <button
          onClick={handleSaveAll}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF2A85] to-[#FF4D97] hover:opacity-95 text-white text-xs font-black shadow-lg shadow-pink-500/25 transition-all active:scale-95 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Semua Pengaturan</span>
        </button>
      </div>

      {/* Custom Promo Date & Time Picker Modal (Matching User Screenshot) */}
      {showDatePickerModal && (
        <CustomPromoDatePicker
          initialHour="06"
          initialMinute="59"
          onApply={(formatted) => setPromoEndTime(formatted)}
          onClose={() => setShowDatePickerModal(false)}
        />
      )}
    </div>
  );
}
