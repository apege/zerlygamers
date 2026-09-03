'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Loader2,
} from 'lucide-react';
import CustomPromoDatePicker from '@/components/admin/CustomPromoDatePicker';

export default function StoreSettingsView() {
  // Accordion Sections State
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    identity: true,
    promo: true,
    media: true,
  });

  // File Input Refs & Upload State
  const qrisInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingQris, setIsUploadingQris] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // 1. Identity & Contact State
  const [storeName, setStoreName] = useState('Zerly Gamers');
  const [whatsappNumber, setWhatsappNumber] = useState('6285624595886');

  // 2. Promo Banner State
  const [productsList, setProductsList] = useState<Array<{ id: number; robux: number; price: number; badge?: string }>>([]);
  const [isPromoActive, setIsPromoActive] = useState(true);
  const [promoItem, setPromoItem] = useState('2.200 Robux');
  const [promoAmount, setPromoAmount] = useState(2200);
  const [promoPrice, setPromoPrice] = useState('Rp 45.000');
  const [promoDiscountPrice, setPromoDiscountPrice] = useState(45000);
  const [promoTagline, setPromoTagline] = useState('⚡ PROMO SPESIAL: 2.200 Robux Cuma Rp 45.000! Stok Terbatas');
  const [promoEndTime, setPromoEndTime] = useState('1 Oktober 2026, 06:59 WIB');
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);

  // 3. Media & QRIS State
  const [qrisPreview, setQrisPreview] = useState('/qris.jpeg');
  const [logoPreview, setLogoPreview] = useState('/logo.png');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessAlert, setSaveSuccessAlert] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProductsList(json.data.filter((p: any) => p.is_active !== false));
      }
    } catch (err) {
      console.error('Failed to load products for promo dropdown:', err);
    }
  }, []);

  // Handle file upload to /api/upload
  const handleFileUpload = async (file: File, type: 'qris' | 'logo') => {
    if (type === 'qris') setIsUploadingQris(true);
    else setIsUploadingLogo(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (type === 'qris') {
          setQrisPreview(data.url);
        } else {
          setLogoPreview(data.url);
        }
      } else {
        alert(data.error || 'Gagal mengunggah file!');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      alert('Terjadi kesalahan saat mengunggah gambar.');
    } finally {
      if (type === 'qris') setIsUploadingQris(false);
      else setIsUploadingLogo(false);
    }
  };

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();
      if (data.success && data.data) {
        const s = data.data;
        if (s.store_name) setStoreName(s.store_name);
        if (s.whatsapp_number) setWhatsappNumber(s.whatsapp_number);
        if (s.qris_image_path) setQrisPreview(s.qris_image_path);
        if (s.logo_image_path) setLogoPreview(s.logo_image_path);
        if (s.promo_active !== undefined) setIsPromoActive(s.promo_active);
        if (s.promo_subtitle) setPromoTagline(s.promo_subtitle);
        if (s.promo_robux_amount) {
          setPromoAmount(s.promo_robux_amount);
          setPromoItem(`${Number(s.promo_robux_amount).toLocaleString('id-ID')} Robux`);
        }
        if (s.promo_discount_price) {
          setPromoDiscountPrice(s.promo_discount_price);
          setPromoPrice(`Rp ${Number(s.promo_discount_price).toLocaleString('id-ID')}`);
        }
        if (s.promo_end_date) {
          const d = new Date(s.promo_end_date);
          const dateStr = d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
          const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} WIB`;
          setPromoEndTime(`${dateStr}, ${timeStr}`);
        }
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchProducts();
  }, [fetchSettings, fetchProducts]);

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

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          store_name: storeName,
          whatsapp_number: whatsappNumber,
          qris_image_path: qrisPreview,
          logo_image_path: logoPreview,
          promo_active: isPromoActive,
          promo_subtitle: promoTagline,
          promo_robux_amount: promoAmount,
          promo_discount_price: promoDiscountPrice,
        }),
      });

      if (res.ok) {
        setSaveSuccessAlert(true);
        setTimeout(() => setSaveSuccessAlert(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in zoom-in-98 duration-200">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
              Live Database Neon
            </span>
            <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Zerly Real Configuration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
            Pengaturan Toko &amp; Banner
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
            Konfigurasi identitas toko, nomor WhatsApp CS, barcode QRIS, dan banner promo pelanggan
          </p>
        </div>

        <button
          onClick={toggleAllSections}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-rose-50 text-gray-800 border border-rose-200/80 rounded-2xl text-xs font-black shadow-2xs transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <ChevronsUpDown className="w-3.5 h-3.5 text-rose-600" />
          <span>{isAllOpen ? 'Tutup Semua Section' : 'Buka Semua Section'}</span>
        </button>
      </div>

      {/* Accordion List Container */}
      <div className="space-y-4">
        {/* ============================================================ */}
        {/* SECTION 1: IDENTITAS TOKO & KONTAK */}
        {/* ============================================================ */}
        <div className="bg-white border border-rose-100/90 rounded-3xl shadow-[0_4px_20px_-4px_rgba(244,63,94,0.06)] overflow-hidden transition-all">
          {/* Header Bar */}
          <div
            onClick={() => toggleSection('identity')}
            className="p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-rose-50/30 transition-colors select-none"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
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
              <span className="hidden md:inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                {storeName} • WA: {whatsappNumber}
              </span>
              <div className="w-8 h-8 rounded-full bg-rose-50 text-gray-500 flex items-center justify-center">
                {openSections.identity ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </div>

          {/* Form Content */}
          {openSections.identity && (
            <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-rose-50 space-y-4 animate-in fade-in duration-200">
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
                    className="w-full px-4 py-2.5 bg-white border border-rose-200 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400"
                  />
                  <p className="text-[10px] text-gray-400 font-medium">
                    Tampil di navbar web utama.
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
                    className="w-full px-4 py-2.5 bg-white border border-rose-200 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400"
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
        <div className="bg-white border border-rose-100/90 rounded-3xl shadow-[0_4px_20px_-4px_rgba(244,63,94,0.06)] overflow-hidden transition-all">
          {/* Header Bar */}
          <div
            onClick={() => toggleSection('promo')}
            className="p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-rose-50/30 transition-colors select-none"
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
              <span className="hidden md:inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
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
                  isPromoActive ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isPromoActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>

              <div className="w-8 h-8 rounded-full bg-rose-50 text-gray-500 flex items-center justify-center">
                {openSections.promo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </div>

          {/* Form Content */}
          {openSections.promo && (
            <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-rose-50 space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pilihan Paket Promo */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">
                    Paket Robux yang Dipromosikan
                  </label>
                  <select
                    value={promoAmount}
                    onChange={(e) => {
                      const selectedRobux = Number(e.target.value);
                      setPromoAmount(selectedRobux);
                      const found = productsList.find((p) => p.robux === selectedRobux);
                      if (found) {
                        setPromoDiscountPrice(found.price);
                        setPromoPrice(`Rp ${Number(found.price).toLocaleString('id-ID')}`);
                        setPromoItem(`${Number(found.robux).toLocaleString('id-ID')} Robux`);
                      } else {
                        setPromoItem(`${Number(selectedRobux).toLocaleString('id-ID')} Robux`);
                      }
                    }}
                    className="w-full px-4 py-2.5 bg-white border border-rose-200 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400 cursor-pointer"
                  >
                    {productsList.length === 0 ? (
                      <option value={promoAmount}>
                        {Number(promoAmount).toLocaleString('id-ID')} Robux ({promoPrice})
                      </option>
                    ) : (
                      productsList.map((p) => (
                        <option key={p.id} value={p.robux}>
                          {Number(p.robux).toLocaleString('id-ID')} Robux (Rp {Number(p.price).toLocaleString('id-ID')}) {p.badge ? `• ${p.badge}` : ''}
                        </option>
                      ))
                    )}
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
                    className="w-full px-4 py-2.5 bg-white border border-rose-200 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400"
                  />
                </div>

                {/* Batas Waktu Berakhir Promo (Custom Date & Time Picker) */}
                <div className="space-y-1.5 sm:col-span-2 pt-2 border-t border-rose-50">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-rose-500" />
                      <span>Batas Waktu Berakhir Promo (Countdown Banner)</span>
                    </label>
                    <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      Aktif s/d {promoEndTime}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex-1 w-full px-4 py-2.5 bg-rose-50/40 border border-rose-200 rounded-2xl text-xs font-bold text-gray-900 flex items-center justify-between">
                      <span>{promoEndTime}</span>
                      <span className="text-[10px] text-gray-400 font-medium">(Otomatis Berakhir)</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowDatePickerModal(true)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:opacity-95 text-white text-xs font-black shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0"
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
        <div className="bg-white border border-rose-100/90 rounded-3xl shadow-[0_4px_20px_-4px_rgba(244,63,94,0.06)] overflow-hidden transition-all">
          {/* Header Bar */}
          <div
            onClick={() => toggleSection('media')}
            className="p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-rose-50/30 transition-colors select-none"
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
              <span className="hidden md:inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                QRIS: Terpasang • Logo: Terpasang
              </span>
              <div className="w-8 h-8 rounded-full bg-rose-50 text-gray-500 flex items-center justify-center">
                {openSections.media ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </div>

          {/* Form Content */}
          {openSections.media && (
            <div className="px-5 sm:px-6 pb-6 pt-4 border-t border-rose-50 space-y-6 animate-in fade-in duration-200">
              {/* 3A. Gambar QRIS Pembayaran */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-rose-600" />
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wide">
                    Gambar QRIS Pembayaran
                  </h4>
                </div>
                <p className="text-[11px] text-gray-500 font-medium">
                  Upload barcode QRIS toko untuk menerima pembayaran otomatis dari website
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Hidden File Input QRIS */}
                  <input
                    type="file"
                    ref={qrisInputRef}
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0], 'qris');
                      }
                    }}
                  />

                  {/* Upload Box */}
                  <div
                    onClick={() => qrisInputRef.current?.click()}
                    className="border-2 border-dashed border-rose-200 hover:border-rose-400 bg-rose-50/20 hover:bg-rose-50/40 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group min-h-[180px]"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                      {isUploadingQris ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Upload className="w-5 h-5" />
                      )}
                    </div>
                    <span className="text-xs font-extrabold text-gray-900 mt-3">
                      {isUploadingQris ? 'Mengunggah QRIS...' : 'Upload QRIS Baru'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                      Klik untuk memilih file (PNG / JPG / WEBP Maks 5MB)
                    </span>
                  </div>

                  {/* Live Preview QRIS */}
                  <div className="bg-rose-50/30 border border-rose-100 rounded-3xl p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-2 border-b border-rose-100/60">
                      <span className="text-xs font-bold text-gray-700">Live Preview QRIS</span>
                      <button
                        type="button"
                        onClick={() => setQrisPreview('/qris.jpeg')}
                        className="text-[10px] font-bold text-gray-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset Default</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-center py-3">
                      <div className="relative w-40 h-48 rounded-2xl border border-rose-200 overflow-hidden shadow-xs bg-white">
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
              <div className="space-y-3 pt-4 border-t border-rose-50">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-rose-600" />
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wide">
                    Logo Toko (Navbar Pelanggan)
                  </h4>
                </div>
                <p className="text-[11px] text-gray-500 font-medium">
                  Upload logo bundar toko yang akan muncul di navbar storefront pelanggan
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Hidden File Input Logo */}
                  <input
                    type="file"
                    ref={logoInputRef}
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0], 'logo');
                      }
                    }}
                  />

                  {/* Upload Box */}
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className="border-2 border-dashed border-rose-200 hover:border-rose-400 bg-rose-50/20 hover:bg-rose-50/40 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group min-h-[140px]"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                      {isUploadingLogo ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-xs font-extrabold text-gray-900 mt-2.5">
                      {isUploadingLogo ? 'Mengunggah Logo...' : 'Upload Logo Toko'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                      Klik untuk memilih file logo baru (PNG / JPG / WEBP)
                    </span>
                  </div>

                  {/* Live Preview Logo */}
                  <div className="bg-rose-50/30 border border-rose-100 rounded-3xl p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-2 border-b border-rose-100/60">
                      <span className="text-xs font-bold text-gray-700">Live Preview Logo</span>
                      <button
                        type="button"
                        onClick={() => setLogoPreview('/logo.png')}
                        className="text-[10px] font-bold text-gray-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset Default</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-3 py-3">
                      <div className="w-14 h-14 rounded-full border-2 border-rose-300 p-1 bg-white shadow-xs relative overflow-hidden shrink-0">
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

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-4">
        {saveSuccessAlert && (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Pengaturan berhasil disimpan ke database!</span>
          </span>
        )}

        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:opacity-95 text-white text-xs font-black shadow-lg shadow-rose-500/25 transition-all active:scale-95 cursor-pointer"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}</span>
        </button>
      </div>

      {/* Custom Promo Date & Time Picker Modal */}
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
