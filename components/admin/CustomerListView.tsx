'use client';

import React, { useState, useMemo } from 'react';
import { Search, RefreshCw, Users, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import { AdminCustomer } from '@/data/adminDummyData';

interface CustomerListViewProps {
  customers: AdminCustomer[];
  onBlacklistCustomer: (id: string) => void;
}

export default function CustomerListView({
  customers,
  onBlacklistCustomer,
}: CustomerListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeCustomers = useMemo(() => {
    let list = customers.filter((c) => c.status === 'aktif');
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.username.toLowerCase().includes(q) ||
          (c.robloxUserId && c.robloxUserId.includes(q)) ||
          (c.whatsappNumber && c.whatsappNumber.includes(q))
      );
    }
    return list;
  }, [customers, searchQuery]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto animate-in fade-in zoom-in-98 duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
              Database Akun
            </span>
            <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Zerly Gamers
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
            Daftar Pelanggan
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
            Kelola seluruh data akun pelanggan aktif dan riwayat belanja Robux
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-rose-50 text-gray-800 border border-rose-200/80 rounded-2xl text-xs font-black shadow-2xs transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-rose-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
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
              placeholder="Cari username, ID Roblox, atau WhatsApp..."
              className="w-full pl-10 pr-4 py-2 bg-rose-50/40 border border-rose-200/80 rounded-2xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400"
            />
          </div>

          <span className="text-xs font-bold text-gray-400 text-right">
            Menampilkan {activeCustomers.length} pelanggan
          </span>
        </div>

        {/* List of Customers */}
        <div className="space-y-3">
          {activeCustomers.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-3 text-rose-300" />
              <p className="text-sm font-semibold text-gray-600">
                Tidak ada pelanggan aktif ditemukan.
              </p>
            </div>
          ) : (
            activeCustomers.map((customer) => (
              <div
                key={customer.id}
                className="bg-white border border-rose-100/90 hover:border-rose-300/90 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Left: Username, Roblox ID & WhatsApp info */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm sm:text-base text-rose-600 tracking-tight">
                      {customer.username}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <UserCheck className="w-3 h-3" />
                      <span>Aktif</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap font-medium">
                    {customer.robloxUserId ? (
                      <span>ID: <strong className="font-mono text-gray-800">{customer.robloxUserId}</strong></span>
                    ) : (
                      <span className="text-gray-400 italic">ID Roblox: -</span>
                    )}

                    <span>•</span>

                    {customer.whatsappNumber ? (
                      <span>WA: <strong className="text-gray-800">{customer.whatsappNumber}</strong></span>
                    ) : (
                      <span className="text-gray-400 italic">WA: -</span>
                    )}
                  </div>
                </div>

                {/* Right: Stats & Blacklist Action */}
                <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-rose-50">
                  <div className="text-left sm:text-right text-xs">
                    <span className="text-gray-400 font-medium block">
                      Total {customer.totalOrders}x order
                    </span>
                    <span className="font-black text-rose-600 text-sm">
                      {customer.totalSpent}
                    </span>
                  </div>

                  <button
                    onClick={() => onBlacklistCustomer(customer.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span>Blacklist</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
