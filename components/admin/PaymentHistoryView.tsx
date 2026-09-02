'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Search,
  RefreshCw,
  TrendingUp,
  Globe,
  MessageCircle,
  Receipt,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Layers,
  Loader2,
} from 'lucide-react';
import { AdminPaymentMutation, AdminPaymentSummary } from '@/data/adminDummyData';

export default function PaymentHistoryView() {
  const [mutations, setMutations] = useState<AdminPaymentMutation[]>([]);
  const [summary, setSummary] = useState<AdminPaymentSummary>({
    totalTransactions: 0,
    totalRevenue: 0,
    totalRevenueFormatted: 'Rp 0',
    totalRobuxSold: 0,
    aov: 0,
    aovFormatted: 'Rp 0',
    websiteRevenue: 0,
    websiteRevenueFormatted: 'Rp 0',
    websiteCount: 0,
    websitePercentage: '0%',
    whatsappRevenue: 0,
    whatsappRevenueFormatted: 'Rp 0',
    whatsappCount: 0,
    whatsappPercentage: '0%',
  });
  const [activeFilterTab, setActiveFilterTab] = useState<'semua' | 'website' | 'whatsapp'>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPayments = useCallback(async () => {
    try {
      const res = await fetch('/api/payments', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();
      if (data.success && data.data) {
        const rawMutations = data.data.mutations || [];
        const rawSum = data.data.summary || {};

        const formattedMutations: AdminPaymentMutation[] = rawMutations.map((m: any) => {
          const dateObj = new Date(m.created_at);
          const dateStr = dateObj.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });
          return {
            id: String(m.id),
            orderNumber: m.order_code,
            username: m.roblox_username,
            channel: m.channel,
            paymentMethod: m.payment_method,
            date: dateStr,
            amount: Number(m.price),
            amountFormatted: '+Rp ' + Number(m.price).toLocaleString('id-ID'),
            robuxItem: `${Number(m.robux).toLocaleString('id-ID')} Robux`,
            status: 'LUNAS',
          };
        });

        const totalRev = Number(rawSum.total_revenue || 0);
        const webRev = Number(rawSum.website_revenue || 0);
        const waRev = Number(rawSum.whatsapp_revenue || 0);
        const webPct = totalRev > 0 ? ((webRev / totalRev) * 100).toFixed(1) + '%' : '0%';
        const waPct = totalRev > 0 ? ((waRev / totalRev) * 100).toFixed(1) + '%' : '0%';

        setMutations(formattedMutations);
        setSummary({
          totalTransactions: Number(rawSum.total_transactions || 0),
          totalRevenue: totalRev,
          totalRevenueFormatted: 'Rp ' + totalRev.toLocaleString('id-ID'),
          totalRobuxSold: Number(rawSum.total_robux_sold || 0),
          aov: Number(rawSum.aov || 0),
          aovFormatted: 'Rp ' + Number(rawSum.aov || 0).toLocaleString('id-ID'),
          websiteRevenue: webRev,
          websiteRevenueFormatted: 'Rp ' + webRev.toLocaleString('id-ID'),
          websiteCount: Number(rawSum.website_count || 0),
          websitePercentage: webPct,
          whatsappRevenue: waRev,
          whatsappRevenueFormatted: 'Rp ' + waRev.toLocaleString('id-ID'),
          whatsappCount: Number(rawSum.whatsapp_count || 0),
          whatsappPercentage: waPct,
        });
      }
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchPayments();
  };

  const websiteCount = mutations.filter((m) => m.channel === 'WEBSITE').length;
  const whatsappCount = mutations.filter((m) => m.channel === 'WHATSAPP').length;
  const totalCount = mutations.length;

  const filteredMutations = useMemo(() => {
    let list = mutations;
    if (activeFilterTab === 'website') {
      list = list.filter((m) => m.channel === 'WEBSITE');
    } else if (activeFilterTab === 'whatsapp') {
      list = list.filter((m) => m.channel === 'WHATSAPP');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          m.orderNumber.toLowerCase().includes(q) ||
          m.username.toLowerCase().includes(q) ||
          m.robuxItem.toLowerCase().includes(q)
      );
    }
    return list;
  }, [mutations, activeFilterTab, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in zoom-in-98 duration-200">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
              Live Database Neon
            </span>
            <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Zerly Real Financials
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
            Riwayat Pembayaran
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
            Log mutasi kas masuk dan ringkasan pembayaran pesanan Robux langsung dari database real
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-rose-50 text-gray-800 border border-rose-200/80 rounded-2xl text-xs font-black shadow-xs hover:shadow-sm transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-rose-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 2. Top 3 Highlight Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Total Dana Masuk */}
        <div className="bg-gradient-to-br from-white via-rose-50/30 to-pink-50/40 border border-rose-200/80 rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.08)] relative overflow-hidden flex flex-col justify-between group hover:border-rose-300 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-400/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between relative">
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-600/80">
              TOTAL DANA MASUK
            </span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3 relative">
            <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 bg-clip-text text-transparent tracking-tight">
              {summary.totalRevenueFormatted}
            </div>
            <p className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Dari {summary.totalTransactions} transaksi pembayaran lunas</span>
            </p>
          </div>
        </div>

        {/* Card 2: Total Robux Terjual */}
        <div className="bg-gradient-to-br from-white via-amber-50/20 to-rose-50/30 border border-amber-200/70 rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(245,158,11,0.08)] relative overflow-hidden flex flex-col justify-between group hover:border-amber-300 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between relative">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-700/80">
              TOTAL ROBUX TERJUAL
            </span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 border border-amber-200 flex items-center justify-center p-1.5 shadow-md shadow-amber-500/20">
              <div className="w-6 h-6 relative">
                <Image src="/robux.webp" alt="Robux" fill sizes="24px" className="object-contain" />
              </div>
            </div>
          </div>

          <div className="my-3 relative">
            <div className="text-2xl sm:text-3xl font-black text-amber-500 tracking-tight flex items-baseline gap-1.5">
              <span>{summary.totalRobuxSold.toLocaleString('id-ID')}</span>
              <span className="text-sm font-black text-amber-600">R$</span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Robux terkirim aman ke akun pelanggan
            </p>
          </div>
        </div>

        {/* Card 3: Rata-Rata Order (AOV) */}
        <div className="bg-gradient-to-br from-white via-emerald-50/20 to-rose-50/30 border border-emerald-200/70 rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.08)] relative overflow-hidden flex flex-col justify-between group hover:border-emerald-300 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between relative">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700/80">
              RATA-RATA ORDER
            </span>
            <span className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
              AOV METRIC
            </span>
          </div>

          <div className="my-3 relative">
            <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {summary.aovFormatted}
            </div>
            <p className="text-xs text-emerald-600 font-bold mt-1">
              Average Order Value per transaksi
            </p>
          </div>
        </div>
      </div>

      {/* 3. OMSET PER METODE PEMBAYARAN */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-rose-500" />
              <span>OMSET PER METODE PEMBAYARAN</span>
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Ringkasan total pemasukan berdasarkan kanal gateway toko
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Card A: WEBSITE */}
          <div className="bg-white border border-rose-100/90 hover:border-rose-300/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/70 shadow-2xs">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black text-sm text-gray-900 tracking-tight block">
                    WEBSITE / OTOMATIS
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">QRIS, Virtual Account, E-Wallet</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-xs">
                {summary.websitePercentage}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <div>
                <span className="text-gray-400 font-medium block">Total Omset Masuk</span>
                <span className="text-base sm:text-lg font-black text-rose-600">
                  {summary.websiteRevenueFormatted}
                </span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 font-medium block">Volume</span>
                <span className="text-sm font-extrabold text-gray-800">
                  {summary.websiteCount} transaksi
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-rose-100/60 overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 rounded-full transition-all duration-500 shadow-xs"
                style={{ width: summary.websitePercentage }}
              />
            </div>
          </div>

          {/* Card B: WHATSAPP */}
          <div className="bg-white border border-rose-100/90 hover:border-emerald-300/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/70 shadow-2xs">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black text-sm text-gray-900 tracking-tight block">
                    WHATSAPP DIRECT
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">Manual Transfer Admin CS</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xs">
                {summary.whatsappPercentage}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <div>
                <span className="text-gray-400 font-medium block">Total Omset Masuk</span>
                <span className="text-base sm:text-lg font-black text-emerald-600">
                  {summary.whatsappRevenueFormatted}
                </span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 font-medium block">Volume</span>
                <span className="text-sm font-extrabold text-gray-800">
                  {summary.whatsappCount} transaksi
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-emerald-100/60 overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 shadow-xs"
                style={{ width: summary.whatsappPercentage }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Log Mutasi Pembayaran Masuk */}
      <div className="bg-white/95 border border-rose-100/90 rounded-3xl p-5 sm:p-7 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.06)] space-y-5">
        {/* Header with Title, Subtitle, and Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-rose-100/70">
          <div>
            <h3 className="font-black text-sm sm:text-base text-gray-900 tracking-tight">
              Log Mutasi Pembayaran Masuk
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Riwayat penerimaan pembayaran yang valid dan sudah lunas
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveFilterTab('semua')}
              className={`px-4 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeFilterTab === 'semua'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-xs'
                  : 'bg-rose-50/70 hover:bg-rose-100 text-gray-700'
              }`}
            >
              Semua ({totalCount})
            </button>
            <button
              onClick={() => setActiveFilterTab('website')}
              className={`px-4 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeFilterTab === 'website'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-xs'
                  : 'bg-rose-50/70 hover:bg-rose-100 text-gray-700'
              }`}
            >
              Website ({websiteCount})
            </button>
            <button
              onClick={() => setActiveFilterTab('whatsapp')}
              className={`px-4 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeFilterTab === 'whatsapp'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-xs'
                  : 'bg-rose-50/70 hover:bg-rose-100 text-gray-700'
              }`}
            >
              WhatsApp ({whatsappCount})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode order atau username..."
            className="w-full pl-10 pr-4 py-2.5 bg-rose-50/40 border border-rose-200/80 rounded-2xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400"
          />
        </div>

        {/* Mutation Rows List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-16 text-rose-400 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-semibold">Memuat log mutasi pembayaran...</span>
            </div>
          ) : filteredMutations.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Receipt className="w-12 h-12 mx-auto mb-3 text-rose-300" />
              <p className="text-sm font-semibold text-gray-600">
                Belum ada mutasi pembayaran lunas di database.
              </p>
            </div>
          ) : (
            filteredMutations.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-rose-100/90 hover:border-rose-300/90 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Left Side: Order Code, Username, LUNAS badge, Channel & Date */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-black text-sm sm:text-base text-gray-900 tracking-tight">
                      {item.orderNumber}
                    </span>
                    <span className="font-extrabold text-sm text-rose-600">
                      {item.username}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      LUNAS
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap font-medium">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        item.channel === 'WHATSAPP'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-600 border border-rose-200'
                      }`}
                    >
                      {item.channel}
                    </span>
                    <span>•</span>
                    <span>{item.date}</span>
                    <span>•</span>
                    <span className="text-gray-400 font-normal">{item.paymentMethod}</span>
                  </div>
                </div>

                {/* Right Side: +Rp Amount & Robux Item */}
                <div className="text-left sm:text-right shrink-0 leading-tight pt-2 sm:pt-0 border-t sm:border-t-0 border-rose-50">
                  <div className="text-base sm:text-lg font-black text-emerald-600 tracking-tight">
                    {item.amountFormatted}
                  </div>
                  <div className="flex items-center sm:justify-end gap-1.5 text-xs font-bold text-amber-500 mt-0.5">
                    <div className="w-3.5 h-3.5 relative">
                      <Image src="/robux.webp" alt="Robux" fill sizes="14px" className="object-contain" />
                    </div>
                    <span>{item.robuxItem}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
