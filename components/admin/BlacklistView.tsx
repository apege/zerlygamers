'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, RefreshCw, ShieldAlert, Plus, X, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { AdminCustomer } from '@/data/adminDummyData';

export default function BlacklistView() {
  const [blacklists, setBlacklists] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [usernameInput, setUsernameInput] = useState('');
  const [waInput, setWaInput] = useState('');
  const [idInput, setIdInput] = useState('');
  const [reasonInput, setReasonInput] = useState('Indikasi penipuan atau penyalahgunaan');

  const fetchBlacklists = useCallback(async () => {
    try {
      const res = await fetch('/api/blacklists', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setBlacklists(data.data);
      }
    } catch (err) {
      console.error('Failed to load blacklists:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBlacklists();
  }, [fetchBlacklists]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBlacklists();
  };

  const handleOpenAddModal = () => {
    setUsernameInput('');
    setWaInput('');
    setIdInput('');
    setReasonInput('Indikasi penipuan atau penyalahgunaan');
    setShowModal(true);
  };

  const handleSubmitBlacklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      alert('Harap masukkan Username Roblox!');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/blacklists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roblox_username: usernameInput.trim(),
          phone: waInput.trim() || undefined,
          roblox_user_id: idInput.trim() || undefined,
          reason: reasonInput.trim() || 'Indikasi penipuan atau penyalahgunaan',
        }),
      });

      if (res.ok) {
        fetchBlacklists();
        setShowModal(false);
      }
    } catch (err) {
      console.error('Failed to add blacklist:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnblockCustomer = async (id: number | string) => {
    if (confirm('Buka blokir akun ini dari blacklist?')) {
      try {
        const res = await fetch(`/api/blacklists?id=${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setBlacklists((prev) => prev.filter((b) => b.id !== id));
        }
      } catch (err) {
        console.error('Failed to unblock:', err);
      }
    }
  };

  const filteredBlacklists = useMemo(() => {
    let list = blacklists;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.roblox_username?.toLowerCase().includes(q) ||
          (c.roblox_user_id && c.roblox_user_id.includes(q)) ||
          (c.phone && c.phone.includes(q))
      );
    }
    return list;
  }, [blacklists, searchQuery]);

  return (
    <div className="space-y-5 max-w-7xl mx-auto animate-in fade-in zoom-in-98 duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">
              Live Database Neon
            </span>
            <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Zerly Real Blacklists
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
            Daftar Blacklist
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
            Daftar akun yang diblokir dari checkout toko langsung di database real
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-95 text-white text-xs font-black shadow-md shadow-red-500/25 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Blacklist</span>
          </button>

          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-rose-50 text-gray-800 border border-rose-200/80 rounded-2xl text-xs font-black shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-rose-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Content Container Card */}
      <div className="bg-white/95 border border-rose-100/90 rounded-3xl p-5 sm:p-7 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.06)] space-y-5">
        {/* Search Bar & Total Display */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-100/70">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari akun terblokir..."
              className="w-full pl-10 pr-4 py-2 bg-rose-50/40 border border-rose-200/80 rounded-2xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400"
            />
          </div>

          <span className="text-xs font-bold text-gray-400 text-right">
            {filteredBlacklists.length} akun terdaftar dalam blacklist database
          </span>
        </div>

        {/* List of Blacklisted Users */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-16 text-rose-400 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-semibold">Memuat data blacklist...</span>
            </div>
          ) : filteredBlacklists.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
              <p className="text-sm font-semibold text-gray-600">
                Tidak ada akun yang di-blacklist saat ini di database.
              </p>
            </div>
          ) : (
            filteredBlacklists.map((customer) => (
              <div
                key={customer.id}
                className="bg-white border border-red-100 hover:border-red-300 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Left: Username, Badge & Details */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-sm sm:text-base text-red-600 tracking-tight">
                      {customer.roblox_username}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">
                      BLACKLISTED
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap font-medium">
                    {customer.phone ? (
                      <span>WA: <strong className="text-gray-800">{customer.phone}</strong></span>
                    ) : (
                      <span className="text-gray-400 italic">WA: -</span>
                    )}

                    <span>•</span>

                    {customer.roblox_user_id ? (
                      <span>ID: <strong className="font-mono text-gray-800">{customer.roblox_user_id}</strong></span>
                    ) : (
                      <span className="text-gray-400 italic">ID Roblox: -</span>
                    )}
                  </div>

                  {customer.reason && (
                    <p className="text-xs text-red-500 font-semibold mt-1">
                      Alasan: {customer.reason}
                    </p>
                  )}
                </div>

                {/* Right: Unblock Action */}
                <div className="flex items-center justify-end gap-5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-rose-50">
                  <button
                    onClick={() => handleUnblockCustomer(customer.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Buka Blokir</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Tambah Blacklist */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-red-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-red-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-100">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <h3 className="font-black text-gray-900 text-base">Tambah ke Blacklist</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitBlacklist} className="space-y-4 text-xs">
              {/* Username */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Username Roblox *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-bold text-red-500">
                    @
                  </div>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Contoh: Perusuh"
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-red-200 rounded-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400"
                    required
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Nomor WhatsApp (Opsional)</label>
                <input
                  type="text"
                  value={waInput}
                  onChange={(e) => setWaInput(e.target.value)}
                  placeholder="Contoh: 081234566789"
                  className="w-full px-4 py-2.5 bg-white border border-red-200 rounded-2xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400"
                />
                <p className="text-[10px] text-gray-400 font-medium">
                  Jika diisi, nomor ini akan otomatis dicegah saat checkout pesanan.
                </p>
              </div>

              {/* Roblox ID */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Roblox User ID (Opsional)</label>
                <input
                  type="text"
                  value={idInput}
                  onChange={(e) => setIdInput(e.target.value)}
                  placeholder="Contoh: 123456789"
                  className="w-full px-4 py-2.5 bg-white border border-red-200 rounded-2xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400"
                />
              </div>

              {/* Alasan */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Alasan Blokir *</label>
                <input
                  type="text"
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  placeholder="Contoh: Indikasi penipuan atau spam order"
                  className="w-full px-4 py-2.5 bg-white border border-red-200 rounded-2xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400"
                  required
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-red-100">
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
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-95 text-white font-bold shadow-md shadow-red-500/20 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Blokir Akun</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
