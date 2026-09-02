'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Package,
  Users,
  Megaphone,
  Crown,
  ChevronRight,
  TrendingUp,
  Boxes,
  ArrowUpRight,
  Sparkles,
  History,
  BookOpen,
  X,
  ExternalLink,
  Search,
  Filter,
  Eye,
  Check,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  ArrowDownLeft,
  Settings,
  Save,
  ShieldCheck,
  Ban,
  Tag,
  Store,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import RobloxWarningCard from '@/components/admin/RobloxWarningCard';
import AdminNotesCard from '@/components/admin/AdminNotesCard';
import OrderDetailView from '@/components/admin/OrderDetailView';
import PricelistRobuxView from '@/components/admin/PricelistRobuxView';
import CustomerListView from '@/components/admin/CustomerListView';
import BlacklistView from '@/components/admin/BlacklistView';
import TestimonialsView from '@/components/admin/TestimonialsView';
import PaymentHistoryView from '@/components/admin/PaymentHistoryView';
import StoreSettingsView from '@/components/admin/StoreSettingsView';
import {
  DUMMY_ORDERS,
  DUMMY_PRICELIST,
  DUMMY_CUSTOMERS,
  AdminOrder,
  AdminPricelistItem,
  AdminCustomer,
} from '@/data/adminDummyData';

export default function AdminPage() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllActivitiesModal, setShowAllActivitiesModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Orders State (allows interactive status change)
  const [orders, setOrders] = useState<AdminOrder[]>(DUMMY_ORDERS);
  const [customers, setCustomers] = useState<AdminCustomer[]>(DUMMY_CUSTOMERS);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtered orders based on current tab & search
  const filteredOrders = useMemo(() => {
    let list = orders;
    if (currentTab === 'order-masuk') {
      list = list.filter((o) => o.status === 'masuk');
    } else if (currentTab === 'order-diproses') {
      list = list.filter((o) => o.status === 'diproses');
    } else if (currentTab === 'order-selesai') {
      list = list.filter((o) => o.status === 'selesai');
    } else if (currentTab === 'order-dibatalkan') {
      list = list.filter((o) => o.status === 'dibatalkan');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.username.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.item.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, currentTab, searchQuery]);

  // Handle status update
  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: AdminOrder['status'],
    newLabel?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: newStatus,
              statusLabel: newLabel || ord.statusLabel,
            }
          : ord
      )
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              statusLabel: newLabel || prev.statusLabel,
            }
          : null
      );
    }
  };

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleBlacklistCustomer = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'blacklist' } : c))
    );
  };

  const handleUnblockCustomer = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'aktif' } : c))
    );
  };

  const handleAddBlacklist = (newCust: AdminCustomer) => {
    setCustomers((prev) => [newCust, ...prev]);
  };

  // Top metric stat cards data
  const statCards = [
    {
      id: 'masuk',
      title: 'Order Masuk',
      value: orders.filter((o) => o.status === 'masuk').length.toString() || '244',
      change: '+12 dari kemarin ↑',
      isPositive: true,
      color: 'bg-pink-100 text-[#FF2A85]',
      iconType: 'bag',
    },
    {
      id: 'diproses',
      title: 'Order Diproses',
      value: orders.filter((o) => o.status === 'diproses').length.toString() || '104',
      change: '+3 dari kemarin ↑',
      isPositive: true,
      color: 'bg-purple-100 text-purple-600',
      iconType: 'box-purple',
    },
    {
      id: 'selesai',
      title: 'Order Selesai',
      value: '156',
      change: '+28 dari kemarin ↑',
      isPositive: true,
      color: 'bg-emerald-100 text-emerald-600',
      iconType: 'check-green',
    },
    {
      id: 'produk',
      title: 'Pricelist Robux',
      value: '9',
      change: 'Nominal Aktif',
      isNeutral: true,
      color: 'bg-pink-100 text-pink-600',
      iconType: 'cube-pink',
    },
    {
      id: 'pelanggan',
      title: 'Total Pelanggan',
      value: '1.289',
      change: '+37 pelanggan baru',
      isPositive: true,
      color: 'bg-pink-100 text-[#FF2A85]',
      iconType: 'users',
    },
  ];

  // Activities timeline data
  const activities = [
    {
      id: 1,
      time: '7j lalu',
      title: 'Pesanan 2.200 Robux dari @Raraa_notara',
      username: '@Raraa_notara',
      dotColor: 'bg-amber-400',
    },
    {
      id: 2,
      time: '7j lalu',
      title: 'Pesanan 2.200 Robux dari @muachiilan',
      username: '@muachiilan',
      dotColor: 'bg-amber-400',
    },
    {
      id: 3,
      time: '1h lalu',
      title: 'Pesanan 1.800 Robux dari @Kaisha2612',
      username: '@Kaisha2612',
      dotColor: 'bg-[#FF2A85]',
    },
    {
      id: 4,
      time: '1h lalu',
      title: 'Pesanan 2.200 Robux dari @crasiel',
      username: '@crasiel',
      dotColor: 'bg-[#FF2A85]',
    },
  ];

  // Top Selling Products
  const bestSellers = [
    { rank: 1, name: '2200 Robux', sold: 312, medalColor: 'from-amber-400 to-yellow-500' },
    { rank: 2, name: '3200 Robux', sold: 289, medalColor: 'from-slate-300 to-slate-400' },
    { rank: 3, name: '1700 Robux', sold: 241, medalColor: 'from-amber-600 to-amber-700' },
    { rank: 4, name: '1200 Robux', sold: 198, medalColor: 'from-pink-300 to-pink-400' },
  ];

  const renderStatIcon = (type: string) => {
    switch (type) {
      case 'bag':
        return (
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-400 to-[#FF2A85] flex items-center justify-center text-white shadow-md shadow-pink-500/20 shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
        );
      case 'box-purple':
        return (
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 shrink-0">
            <Package className="w-5 h-5" />
          </div>
        );
      case 'check-green':
        return (
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        );
      case 'cube-pink':
        return (
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-300 to-rose-400 flex items-center justify-center text-white shadow-md shadow-pink-400/20 shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
        );
      case 'users':
        return (
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF2A85] to-rose-500 flex items-center justify-center text-white shadow-md shadow-pink-500/20 shrink-0">
            <Users className="w-5 h-5" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F8] flex font-sans text-gray-800">
      {/* Sidebar Navigation */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setSelectedOrder(null);
        }}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <AdminHeader
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Dashboard Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* If an order is selected, show the OrderDetailView */}
          {selectedOrder ? (
            <OrderDetailView
              order={selectedOrder}
              onBack={() => setSelectedOrder(null)}
              onUpdateStatus={handleUpdateOrderStatus}
            />
          ) : currentTab.startsWith('order-') ? (
            /* ORDER MANAGEMENT LIST VIEW */
            <div className="space-y-5">
              {/* Header Title & Refresh Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
                      Pesanan Masuk
                    </span>
                    <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Zerly Orders
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 capitalize tracking-tight mt-1">
                    {currentTab.replace('-', ' ')}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
                    Kelola dan proses seluruh pesanan Robux baru yang masuk ke Zerly Gamers
                  </p>
                </div>

                <button
                  onClick={handleRefreshData}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-rose-50 text-gray-800 border border-rose-200/80 rounded-2xl text-xs font-black shadow-2xs transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-rose-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh Data</span>
                </button>
              </div>

              {/* Main Content Card Container */}
              <div className="bg-white/95 border border-rose-100/90 rounded-3xl p-5 sm:p-7 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.06)] space-y-5">
                {/* Search / Filter Bar & Count */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-100/70">
                  <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter order atau username..."
                      className="w-full pl-10 pr-4 py-2 bg-rose-50/40 border border-rose-200/80 rounded-2xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400"
                    />
                  </div>

                  <span className="text-xs font-bold text-gray-400 text-right">
                    Menampilkan {filteredOrders.length} pesanan
                  </span>
                </div>

                {/* List of Orders */}
                <div className="space-y-3">
                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-rose-300" />
                      <p className="text-sm font-semibold text-gray-600">
                        Tidak ada pesanan ditemukan.
                      </p>
                    </div>
                  ) : (
                    filteredOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-white border border-rose-100/90 hover:border-rose-300 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                      >
                        {/* Left Side: Order Number, Status Pill, Username, Date, Channel */}
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-black text-sm sm:text-base text-rose-600 tracking-tight">
                              {ord.orderNumber}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              {ord.statusLabel || 'Menunggu Bayar'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap font-medium">
                            <span className="font-extrabold text-gray-900">{ord.username}</span>
                            <span>•</span>
                            <span>{ord.createdAt}</span>
                            <span>•</span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                ord.orderChannel === 'WHATSAPP'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-600 border border-rose-200'
                              }`}
                            >
                              {ord.orderChannel}
                            </span>
                          </div>
                        </div>

                        {/* Middle & Right Side: Product Amount, Price & Actions */}
                        <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-rose-50">
                          {/* Item & Price */}
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-amber-50/80 border border-amber-200/90 flex items-center justify-center p-1.5 shadow-2xs shrink-0">
                              <div className="w-5 h-5 relative">
                                <Image src="/robux.webp" alt="Robux" fill sizes="20px" className="object-contain" />
                              </div>
                            </div>
                            <div className="text-left leading-tight">
                              <span className="block text-xs sm:text-sm font-extrabold text-gray-900">
                                {ord.item}
                              </span>
                              <span className="block text-xs sm:text-sm font-black text-rose-600">
                                {ord.priceFormatted}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            {ord.status === 'masuk' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, 'diproses', 'Sedang Diproses')}
                                className="px-3.5 sm:px-4 py-1.5 rounded-2xl text-xs font-extrabold bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200 transition-all cursor-pointer"
                              >
                                Proses
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-2xl text-xs font-black bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:opacity-95 text-white shadow-md shadow-rose-500/20 transition-all active:scale-95 cursor-pointer"
                            >
                              <span>Detail</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : currentTab === 'pricelist-robux' ? (
            /* PRICELIST ROBUX VIEW (Matching Screenshot 2 & 3) */
            <PricelistRobuxView />
          ) : currentTab === 'daftar-pelanggan' ? (
            /* DAFTAR PELANGGAN VIEW (Matching Screenshot 1) */
            <CustomerListView
              customers={customers}
              onBlacklistCustomer={handleBlacklistCustomer}
            />
          ) : currentTab === 'blacklist' ? (
            /* DAFTAR BLACKLIST VIEW (Matching Screenshot 2 & 3) */
            <BlacklistView
              customers={customers}
              onAddBlacklist={handleAddBlacklist}
              onUnblockCustomer={handleUnblockCustomer}
            />
          ) : currentTab === 'kelola-testimoni' ? (
            /* KELOLA TESTIMONI VIEW (Matching User Screenshots without photo upload) */
            <TestimonialsView />
          ) : (currentTab === 'riwayat-keuangan' || currentTab === 'riwayat-pembayaran') ? (
            /* RIWAYAT PEMBAYARAN VIEW (Matching User Screenshots with elevated styling) */
            <PaymentHistoryView />
          ) : (currentTab === 'pengaturan-toko' || currentTab === 'pengaturan-akun') ? (
            /* PENGATURAN TOKO & BANNER VIEW (Matching User Screenshots with 3 Accordions) */
            <StoreSettingsView />
          ) : (
            /* DEFAULT DASHBOARD VIEW */
            <>
              {/* 1. Welcome Hero Banner Card (Reference Matched) */}
              <section className="relative bg-gradient-to-r from-[#FFF0F5] via-[#FFE4EE] to-[#FFD4E5] border border-pink-200/90 rounded-3xl shadow-xs overflow-hidden">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute -top-12 right-1/4 w-72 h-72 bg-pink-300/30 rounded-full blur-2xl" />
                  <span className="absolute top-4 left-1/3 text-pink-400 text-2xl font-black drop-shadow-xs select-none">★</span>
                  <span className="absolute bottom-5 left-[42%] text-pink-300 text-lg font-black select-none">★</span>
                  <span className="absolute top-10 left-[48%] text-pink-400 text-xl font-black select-none">★</span>
                  <span className="absolute top-4 right-1/4 text-pink-300 text-lg font-black select-none">★</span>
                  <span className="absolute bottom-3 right-6 text-pink-400 text-xl font-black select-none">★</span>
                  <span className="absolute top-8 right-8 text-pink-400 text-2xl font-black select-none">★</span>

                  <div className="hidden sm:flex absolute bottom-4 left-[38%] w-14 h-10 bg-gradient-to-tr from-[#FF2A85] to-[#FF6BA8] rounded-xl rotate-[-12deg] shadow-md items-center justify-center border border-white/40">
                    <span className="text-white text-sm font-black">★</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between min-h-[140px] sm:min-h-[160px] relative z-10 px-6 sm:px-8 py-5 md:py-0">
                  <div className="space-y-1.5 text-center md:text-left py-2 md:py-6 max-w-md">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center justify-center md:justify-start gap-2">
                      <span className="text-[#FF2A85]">Halo</span>
                      <span className="text-gray-900">Admin!</span>
                      <span className="text-2xl select-none">👋</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-700 font-semibold leading-relaxed">
                      Semangat hari ini! Yuk, selesaikan semua order dan buat customer happy! 💖
                    </p>
                  </div>

                  <div className="flex items-end justify-center md:justify-end gap-2 sm:gap-4 relative w-full md:w-auto mt-4 md:mt-0">
                    <div className="relative w-48 h-36 sm:w-60 sm:h-44 md:w-72 md:h-48 -mb-1 shrink-0">
                      <Image
                        src="/karakter.png"
                        alt="Anime Gamer Girl"
                        fill
                        sizes="(max-width: 768px) 192px, 288px"
                        className="object-contain object-bottom drop-shadow-md"
                        priority
                      />
                    </div>

                    <div className="relative w-36 h-28 sm:w-48 sm:h-36 md:w-56 md:h-40 shrink-0 self-center">
                      <Image
                        src="/logo.png"
                        alt="Zerly Gamers"
                        fill
                        sizes="(max-width: 768px) 144px, 224px"
                        className="object-contain drop-shadow-sm"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Five Metric / Stat Cards Row */}
              <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
                {statCards.map((stat) => (
                  <div
                    key={stat.id}
                    onClick={() => {
                      if (stat.id === 'masuk') setCurrentTab('order-masuk');
                      else if (stat.id === 'diproses') setCurrentTab('order-diproses');
                      else if (stat.id === 'produk') setCurrentTab('pricelist-robux');
                      else if (stat.id === 'pelanggan') setCurrentTab('daftar-pelanggan');
                    }}
                    className="bg-white/90 border border-pink-100/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
                  >
                    {renderStatIcon(stat.iconType)}
                    <div className="min-w-0">
                      <span className="block text-[11px] font-semibold text-gray-500 truncate">
                        {stat.title}
                      </span>
                      <span className="block text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-none my-1">
                        {stat.value}
                      </span>
                      <span
                        className={`block text-[10px] sm:text-[11px] font-bold truncate ${
                          stat.isPositive
                            ? 'text-emerald-500'
                            : stat.isNeutral
                            ? 'text-gray-400'
                            : 'text-gray-500'
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </section>

              {/* 3. Middle 3-Column Grid (ChampionStore layout proportion: 3 / 6 / 3) */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
                {/* Left Card (col-span-3): Aktivitas Terbaru */}
                <div className="lg:col-span-3 bg-white/95 border border-pink-100/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-pink-100 text-[#FF2A85] shrink-0">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="leading-tight">
                          <span className="block text-xs font-bold text-gray-800">Aktivitas</span>
                          <span className="block text-xs font-bold text-gray-800">Terbaru</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-[#FF2A85] text-[10px] font-extrabold tracking-wide border border-pink-200">
                        Realtime
                      </span>
                    </div>

                    <div className="relative pl-5 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-pink-200/80">
                      {activities.map((item) => (
                        <div key={item.id} className="relative">
                          <div
                            className={`absolute -left-5 top-1.5 w-2 h-2 rounded-full ${item.dotColor} ring-4 ring-pink-100`}
                          />
                          <div className="text-[10px] font-semibold text-gray-400">{item.time}</div>
                          <div className="text-xs font-bold text-gray-800 mt-0.5 leading-snug">
                            {item.title}
                          </div>
                          {item.username && (
                            <div className="text-[11px] text-[#FF2A85] font-medium hover:underline cursor-pointer">
                              {item.username}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAllActivitiesModal(true)}
                    className="mt-6 w-full py-2.5 px-4 rounded-2xl bg-pink-50 hover:bg-pink-100 text-[#FF2A85] text-xs font-bold transition-all cursor-pointer border border-pink-200/80 flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <span>Lihat Semua Aktivitas</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Center Card (col-span-6): PERINGATAN! ID ROBLOX BELUM AKTIF */}
                <div className="lg:col-span-6">
                  <RobloxWarningCard />
                </div>

                {/* Right Card (col-span-3): Pengumuman */}
                <div className="lg:col-span-3 bg-white/95 border border-pink-100/90 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-1.5 rounded-xl bg-pink-100 text-[#FF2A85] shrink-0">
                          <Megaphone className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-gray-800 truncate">Pengumuman</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-pink-100 text-[#FF2A85] text-[10px] font-black tracking-wide border border-pink-200 shrink-0">
                        Penting
                      </span>
                    </div>

                    <div className="bg-pink-50/60 border border-pink-200/80 rounded-2xl p-3.5 space-y-2.5">
                      <div className="text-center">
                        <div className="text-[11px] font-black text-[#FF2A85] tracking-wide inline-flex items-center justify-center gap-1.5 whitespace-nowrap">
                          <span>⚠️</span>
                          <span>UPDATE SISTEM</span>
                          <span>⚠️</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                        Pastikan semua order diproses sesuai ketentuan toko ya! Jangan lupa cek stok &amp; promo terbaru untuk customer!
                      </p>

                      <div className="bg-white/90 border border-pink-200/90 rounded-xl p-2.5 text-left space-y-1 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-[11px] font-black text-[#FF2A85] leading-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A85] shrink-0" />
                          <span>Prioritas Order Hari Ini:</span>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-normal font-medium pl-3">
                          Selesaikan order masuk &lt; 10 menit untuk menjaga rating kepuasan.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowGuideModal(true)}
                    className="mt-3.5 w-full py-2 px-3 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#FF2A85] text-xs font-bold transition-all cursor-pointer border border-pink-200/80 flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Baca Panduan Admin</span>
                  </button>
                </div>
              </section>

              {/* 4. Bottom Row: Produk Terlaris & Catatan Admin */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
                {/* Produk Terlaris (col-span-7) */}
                <div className="lg:col-span-7 bg-white/90 border border-pink-100/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-pink-100 text-[#FF2A85]">
                          <Crown className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-800">Produk Terlaris</h3>
                      </div>
                      <button
                        onClick={() => setCurrentTab('pricelist-robux')}
                        className="text-xs font-bold text-[#FF2A85] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Lihat Semua</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {bestSellers.map((item) => (
                        <div
                          key={item.name}
                          className="bg-gradient-to-b from-pink-50/50 to-pink-100/40 border border-pink-200/80 rounded-2xl p-3 text-center flex flex-col items-center hover:scale-[1.02] transition-transform shadow-2xs"
                        >
                          <div className="relative mb-2">
                            <div className="w-12 h-12 rounded-xl bg-white border border-pink-200 flex items-center justify-center shadow-xs p-1">
                              <div className="w-8 h-8 relative">
                                <Image
                                  src="/robux.webp"
                                  alt="Robux"
                                  fill
                                  sizes="32px"
                                  className="object-contain"
                                />
                              </div>
                            </div>

                            <div
                              className={`absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-br ${item.medalColor} text-white text-[10px] font-black flex items-center justify-center shadow-xs border border-white`}
                            >
                              {item.rank}
                            </div>
                          </div>

                          <div className="text-xs font-extrabold text-gray-800 truncate w-full">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-gray-500 font-medium mt-0.5">
                            Terjual: <span className="font-bold text-[#FF2A85]">{item.sold}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Catatan Admin (col-span-5) */}
                <div className="lg:col-span-5">
                  <AdminNotesCard />
                </div>
              </section>
            </>
          )}
        </main>
      </div>

      {/* Modal Semua Aktivitas */}
      {showAllActivitiesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-pink-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#FF2A85]" />
                <h4 className="font-black text-gray-800 text-base">Semua Riwayat Aktivitas</h4>
              </div>
              <button
                onClick={() => setShowAllActivitiesModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {[
                ...activities,
                { id: 5, time: '3 jam lalu', title: 'Pesanan 2.200 Robux dari @alexa_gamer', username: '@alexa_gamer', dotColor: 'bg-[#FF2A85]' },
                { id: 6, time: '4 jam lalu', title: 'Promo Flash Sale diaktifkan', username: '', dotColor: 'bg-emerald-500' },
                { id: 7, time: '5 jam lalu', title: 'Pesanan 800 Robux dari @kazuha_main', username: '@kazuha_main', dotColor: 'bg-[#FF2A85]' },
              ].map((act) => (
                <div key={act.id} className="p-2.5 rounded-xl bg-pink-50/70 border border-pink-100 text-xs">
                  <span className="text-[10px] font-bold text-pink-600">{act.time}</span>
                  <p className="font-bold text-gray-800 mt-0.5">{act.title}</p>
                  {act.username && (
                    <p className="text-[11px] text-gray-500">User: {act.username}</p>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowAllActivitiesModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#FF2A85] text-white text-xs font-bold hover:bg-[#e02070] transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Modal Panduan Admin */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-pink-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#FF2A85]" />
                <h4 className="font-black text-gray-800 text-base">Panduan Operasional Admin</h4>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-gray-600 leading-relaxed max-h-80 overflow-y-auto">
              <div className="p-3 bg-pink-50 rounded-xl border border-pink-100">
                <strong className="text-gray-900 block mb-1">1. Pemrosesan Order Robux:</strong>
                Periksa username dan pastikan order status masuk. Jika terdapat notifikasi aktivasi ID, verifikasi terlebih dahulu sebelum mengirim paket.
              </div>
              <div className="p-3 bg-pink-50 rounded-xl border border-pink-100">
                <strong className="text-gray-900 block mb-1">2. Waktu Tanggap & Komplain:</strong>
                Balas chat customer maksimal dalam 5 menit demi kepuasan pelanggan.
              </div>
              <div className="p-3 bg-pink-50 rounded-xl border border-pink-100">
                <strong className="text-gray-900 block mb-1">3. Cek Stok Berkala:</strong>
                Pastikan saldo suplier dan kuota gift game selalu tersedia sebelum jam ramai.
              </div>
            </div>
            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#FF2A85] text-white text-xs font-bold hover:bg-[#e02070] transition-colors cursor-pointer"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
