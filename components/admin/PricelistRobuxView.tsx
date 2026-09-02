'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, X, Zap, Crown, Flame, Check, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { AdminPricelistItem } from '@/data/adminDummyData';

export default function PricelistRobuxView() {
  const [pricelist, setPricelist] = useState<AdminPricelistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminPricelistItem | null>(null);

  // Form State
  const [amountInput, setAmountInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [isActiveChecked, setIsActiveChecked] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-format numbers with thousand separator dots (e.g. 1.000, 100.000)
  const formatNumberWithDots = (val: string | number): string => {
    if (val === undefined || val === null || val === '') return '';
    const digits = String(val).replace(/\D/g, '');
    if (!digits) return '';
    return Number(digits).toLocaleString('id-ID');
  };

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const formatted: AdminPricelistItem[] = data.data.map((p: any) => ({
          id: String(p.id),
          amount: Number(p.robux),
          name: p.name || `${Number(p.robux).toLocaleString('id-ID')} Robux`,
          price: Number(p.price),
          priceFormatted: 'Rp ' + Number(p.price).toLocaleString('id-ID'),
          status: p.is_active ? 'aktif' : 'nonaktif',
          badge: p.badge || undefined,
        }));
        setPricelist(formatted);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchProducts();
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setAmountInput('');
    setPriceInput('');
    setIsActiveChecked(true);
    setShowModal(true);
  };

  const handleOpenEditModal = (item: AdminPricelistItem) => {
    setEditingItem(item);
    setAmountInput(formatNumberWithDots(item.amount));
    setPriceInput(formatNumberWithDots(item.price));
    setIsActiveChecked(item.status === 'aktif');
    setShowModal(true);
  };

  const handleToggleStatus = async (item: AdminPricelistItem) => {
    const nextStatus = item.status === 'aktif' ? false : true;
    try {
      const res = await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, is_active: nextStatus }),
      });
      if (res.ok) {
        setPricelist((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, status: nextStatus ? 'aktif' : 'nonaktif' } : p))
        );
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Hapus nominal Robux ini dari database?')) {
      try {
        const res = await fetch(`/api/products?id=${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setPricelist((prev) => prev.filter((p) => p.id !== id));
        }
      } catch (err) {
        console.error('Failed to delete product:', err);
      }
    }
  };

  const handleSaveNominal = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(amountInput.replace(/[^0-9]/g, ''), 10) || 0;
    const priceNum = parseInt(priceInput.replace(/[^0-9]/g, ''), 10) || 0;

    if (amountNum <= 0 || priceNum <= 0) {
      alert('Harap masukkan nominal dan harga yang valid!');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        const res = await fetch('/api/products', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem.id,
            robux: amountNum,
            name: `${amountNum.toLocaleString('id-ID')} Robux`,
            price: priceNum,
            is_active: isActiveChecked,
          }),
        });
        if (res.ok) {
          fetchProducts();
          setShowModal(false);
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            robux: amountNum,
            name: `${amountNum.toLocaleString('id-ID')} Robux`,
            price: priceNum,
            is_active: isActiveChecked,
          }),
        });
        if (res.ok) {
          fetchProducts();
          setShowModal(false);
        }
      }
    } catch (err) {
      console.error('Failed to save product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in zoom-in-98 duration-200">
      {/* Header: Title, Subtitle, and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
              Live Database
            </span>
            <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Zerly Real Products
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
            Pricelist Robux
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
            Kelola daftar nominal Robux, harga jual, dan status ketersediaan di database real
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:opacity-95 text-white text-xs font-black shadow-md shadow-rose-500/25 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Nominal Baru</span>
          </button>

          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-rose-50 text-gray-800 border border-rose-200/80 rounded-2xl text-xs font-black shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-rose-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Grid of Pricelist Cards */}
      {isLoading ? (
        <div className="text-center py-20 text-rose-400 flex items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-sm font-semibold">Memuat data pricelist dari Neon DB...</span>
        </div>
      ) : pricelist.length === 0 ? (
        <div className="text-center py-16 bg-white border border-rose-100 rounded-3xl p-8 text-gray-400">
          <p className="text-sm font-semibold text-gray-600">Belum ada produk pricelist di database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {pricelist.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-rose-100/90 hover:border-rose-300/80 rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.06)] hover:shadow-md transition-all flex flex-col justify-between relative group"
            >
              {/* Top Row: Coin Icon, Name & Badges, Price & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Hex Gold Robux Coin Badge */}
                  <div className="w-12 h-12 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex items-center justify-center p-2 shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                    <div className="w-8 h-8 relative">
                      <Image src="/robux.webp" alt="Robux Coin" fill sizes="32px" className="object-contain" />
                    </div>
                  </div>

                  {/* Amount, Badge & Price */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-base font-black text-gray-900 tracking-tight">
                        {item.name}
                      </span>
                      {item.badge === 'POPULER' && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-2xs">
                          <Flame className="w-2.5 h-2.5 fill-white" />
                          <span>POPULER</span>
                        </span>
                      )}
                      {item.badge === 'PROMO' && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-2xs">
                          <Zap className="w-2.5 h-2.5 fill-white" />
                          <span>PROMO</span>
                        </span>
                      )}
                      {item.badge === 'SULTAN' && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-400 text-white shadow-2xs">
                          <Crown className="w-2.5 h-2.5 fill-white" />
                          <span>SULTAN</span>
                        </span>
                      )}
                    </div>

                    <div className="text-sm font-black text-rose-600 tracking-tight">
                      {item.priceFormatted}
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wide border shrink-0 ${
                    item.status === 'aktif'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}
                >
                  {item.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>

              {/* Bottom Row: Toggle Status & Action Buttons */}
              <div className="flex items-center justify-between mt-5 pt-3 border-t border-rose-50">
                <button
                  onClick={() => handleToggleStatus(item)}
                  className="text-xs font-bold text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  {item.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    title="Edit Nominal"
                    className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    title="Hapus"
                    className="p-1.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah / Edit Nominal Robux */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-rose-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <h3 className="font-black text-gray-900 text-base">
                {editingItem ? 'Edit Nominal Robux' : 'Tambah Nominal Robux'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveNominal} className="space-y-4 text-xs">
              {/* Nominal Input */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Nominal Robux *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-bold text-amber-500">
                    R$
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amountInput}
                    onChange={(e) => setAmountInput(formatNumberWithDots(e.target.value))}
                    placeholder="Contoh: 2.200"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-rose-200 rounded-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400"
                    required
                  />
                </div>
              </div>

              {/* Harga Jual Input */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Harga Jual (Rupiah) *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-bold text-rose-500">
                    Rp
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={priceInput}
                    onChange={(e) => setPriceInput(formatNumberWithDots(e.target.value))}
                    placeholder="Contoh: 45.000"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-rose-200 rounded-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400"
                    required
                  />
                </div>
              </div>

              {/* Status Aktif Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActiveChecked}
                  onChange={(e) => setIsActiveChecked(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-400 accent-rose-500 cursor-pointer"
                />
                <label htmlFor="isActive" className="font-bold text-gray-700 cursor-pointer">
                  Aktifkan nominal ini langsung di pricelist web
                </label>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-rose-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:opacity-95 text-white font-bold shadow-md shadow-rose-500/20 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? 'Simpan Perubahan' : 'Tambah ke Pricelist'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
