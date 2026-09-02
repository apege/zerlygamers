'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  RefreshCw,
  Plus,
  Star,
  CheckCircle,
  Eye,
  EyeOff,
  Edit2,
  CornerDownRight,
  Trash2,
  X,
  MessageSquare,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';
import { AdminTestimonial, DUMMY_TESTIMONIALS } from '@/data/adminDummyData';

export default function TestimonialsView() {
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>(DUMMY_TESTIMONIALS);
  const [activeFilterTab, setActiveFilterTab] = useState<'semua' | 'aktif' | 'sembunyi' | 'perlu-balasan'>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal State for Add / Edit
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminTestimonial | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [packageInput, setPackageInput] = useState('');

  // Modal State for Reply
  const [replyingItem, setReplyingItem] = useState<AdminTestimonial | null>(null);
  const [replyInput, setReplyInput] = useState('');

  // Computed Metrics
  const totalCount = testimonials.length;
  const activeCount = testimonials.filter((t) => t.status === 'tampil').length;
  const hiddenCount = testimonials.filter((t) => t.status === 'sembunyi').length;
  const needReplyCount = testimonials.filter((t) => !t.adminReply || t.adminReply.trim() === '').length;

  const averageRating = useMemo(() => {
    if (testimonials.length === 0) return '5.0';
    const sum = testimonials.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / testimonials.length).toFixed(1);
  }, [testimonials]);

  // Filtered Testimonials
  const filteredTestimonials = useMemo(() => {
    let list = testimonials;
    if (activeFilterTab === 'aktif') {
      list = list.filter((t) => t.status === 'tampil');
    } else if (activeFilterTab === 'sembunyi') {
      list = list.filter((t) => t.status === 'sembunyi');
    } else if (activeFilterTab === 'perlu-balasan') {
      list = list.filter((t) => !t.adminReply || t.adminReply.trim() === '');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.username.toLowerCase().includes(q) ||
          t.comment.toLowerCase().includes(q) ||
          t.itemPackage.toLowerCase().includes(q)
      );
    }
    return list;
  }, [testimonials, activeFilterTab, searchQuery]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setUsernameInput('');
    setRatingInput(5);
    setCommentInput('');
    setPackageInput('');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (item: AdminTestimonial) => {
    setEditingItem(item);
    setUsernameInput(item.username.replace('@', ''));
    setRatingInput(item.rating);
    setCommentInput(item.comment);
    setPackageInput(item.itemPackage);
    setShowAddModal(true);
  };

  const handleToggleStatus = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'tampil' ? 'sembunyi' : 'tampil' } : t
      )
    );
  };

  const handleDeleteTestimonial = (id: string) => {
    if (confirm('Hapus testimoni ini?')) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim() || !commentInput.trim()) {
      alert('Harap isi username dan ulasan testimoni!');
      return;
    }

    const cleanUsername = usernameInput.startsWith('@') ? usernameInput.trim() : `@${usernameInput.trim()}`;
    const cleanPackage = packageInput.trim() || '2.200 Robux';

    if (editingItem) {
      setTestimonials((prev) =>
        prev.map((t) =>
          t.id === editingItem.id
            ? {
                ...t,
                username: cleanUsername,
                rating: ratingInput,
                comment: commentInput.trim(),
                itemPackage: cleanPackage,
              }
            : t
        )
      );
    } else {
      const newItem: AdminTestimonial = {
        id: 't-' + Date.now(),
        username: cleanUsername,
        rating: ratingInput,
        timeAgo: 'Baru saja',
        itemPackage: cleanPackage,
        comment: commentInput.trim(),
        isVerified: true,
        status: 'tampil',
        adminReply: '',
      };
      setTestimonials((prev) => [newItem, ...prev]);
    }
    setShowAddModal(false);
  };

  const handleOpenReplyModal = (item: AdminTestimonial) => {
    setReplyingItem(item);
    setReplyInput(item.adminReply || '');
  };

  const handleSaveReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingItem) return;

    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === replyingItem.id ? { ...t, adminReply: replyInput.trim() } : t
      )
    );
    setReplyingItem(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in zoom-in-98 duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
              Social Proof
            </span>
            <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Zerly Testimonials
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
            Kelola Testimoni &amp; Ulasan
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
            Moderasi ulasan pembeli, tambah ulasan manual, balas testimoni, dan kontrol publikasi di website
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:opacity-95 text-white text-xs font-black shadow-md shadow-rose-500/25 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Testimoni</span>
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

      {/* 4 Summary Stat Mini Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white border border-rose-100/90 rounded-3xl p-4 sm:p-5 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.06)]">
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-rose-600/70">
            TOTAL ULASAN
          </span>
          <div className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
            {totalCount}
          </div>
        </div>

        <div className="bg-white border border-rose-100/90 rounded-3xl p-4 sm:p-5 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.06)]">
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-600/80">
            RATING RATA-RATA
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-500 flex items-center gap-1 mt-1">
            <span>{averageRating}</span>
            <span className="text-lg">★</span>
          </div>
        </div>

        <div className="bg-white border border-rose-100/90 rounded-3xl p-4 sm:p-5 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.06)]">
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-emerald-600/80">
            AKTIF (TAMPIL)
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
            {activeCount}
          </div>
        </div>

        <div className="bg-white border border-rose-100/90 rounded-3xl p-4 sm:p-5 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.06)]">
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-rose-600">
            PERLU BALASAN
          </span>
          <div className="text-xl sm:text-2xl font-black text-rose-600 mt-1">
            {needReplyCount}
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white/95 border border-rose-100/90 rounded-3xl p-5 sm:p-7 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.06)] space-y-5">
        {/* Filter Tabs and Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-rose-100/70">
          {/* Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveFilterTab('semua')}
              className={`px-4 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeFilterTab === 'semua'
                  ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-xs'
                  : 'bg-rose-50/70 hover:bg-rose-100 text-gray-700'
              }`}
            >
              Semua ({totalCount})
            </button>
            <button
              onClick={() => setActiveFilterTab('aktif')}
              className={`px-4 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeFilterTab === 'aktif'
                  ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-xs'
                  : 'bg-rose-50/70 hover:bg-rose-100 text-gray-700'
              }`}
            >
              Aktif ({activeCount})
            </button>
            <button
              onClick={() => setActiveFilterTab('sembunyi')}
              className={`px-4 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeFilterTab === 'sembunyi'
                  ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-xs'
                  : 'bg-rose-50/70 hover:bg-rose-100 text-gray-700'
              }`}
            >
              Disembunyikan ({hiddenCount})
            </button>
            <button
              onClick={() => setActiveFilterTab('perlu-balasan')}
              className={`px-4 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeFilterTab === 'perlu-balasan'
                  ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-xs'
                  : 'bg-rose-50/70 hover:bg-rose-100 text-gray-700'
              }`}
            >
              Perlu Balasan ({needReplyCount})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari username atau ulasan..."
              className="w-full pl-10 pr-4 py-2 bg-rose-50/40 border border-rose-200/80 rounded-2xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400"
            />
          </div>
        </div>

        {/* List of Testimonials */}
        <div className="space-y-3.5">
          {filteredTestimonials.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-rose-300" />
              <p className="text-sm font-semibold text-gray-600">
                Tidak ada testimoni yang sesuai filter.
              </p>
            </div>
          ) : (
            filteredTestimonials.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-rose-100/90 hover:border-rose-300/80 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all space-y-3 group"
              >
                {/* Top Section: Avatar, User Details, Rating, and Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Left: Avatar + Details */}
                  <div className="flex items-start gap-3">
                    {/* Rose Initial Circle */}
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                      {item.username.replace('@', '').charAt(0).toUpperCase() || 'U'}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm sm:text-base text-gray-900 tracking-tight">
                          {item.username}
                        </span>

                        {item.isVerified && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Terverifikasi</span>
                          </span>
                        )}

                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-200">
                          {item.itemPackage}
                        </span>
                      </div>

                      {/* Rating Stars & Timestamp */}
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                        <div className="flex items-center text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={star <= item.rating ? 'text-amber-400' : 'text-gray-200'}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span>•</span>
                        <span>{item.timeAgo}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 self-start">
                    {/* Toggle Tampil / Sembunyikan */}
                    <button
                      onClick={() => handleToggleStatus(item.id)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        item.status === 'tampil'
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-300'
                      }`}
                    >
                      {item.status === 'tampil' ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tampil</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-gray-500" />
                          <span>Sembunyi</span>
                        </>
                      )}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    {/* Balas */}
                    <button
                      onClick={() => handleOpenReplyModal(item)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all cursor-pointer"
                    >
                      <CornerDownRight className="w-3 h-3" />
                      <span>Balas</span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteTestimonial(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Testimoni"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Review Comment Text */}
                <div className="pl-13 text-xs sm:text-sm text-gray-700 font-medium leading-relaxed italic">
                  “{item.comment}”
                </div>

                {/* Admin Reply */}
                {item.adminReply && item.adminReply.trim() !== '' && (
                  <div className="ml-13 p-3 rounded-2xl bg-rose-50/70 border border-rose-200/70 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-rose-600">
                      <CornerDownRight className="w-3.5 h-3.5" />
                      <span>Balasan Admin Zerly Gamers:</span>
                    </div>
                    <p className="text-gray-700 font-medium pl-5 leading-relaxed">
                      {item.adminReply}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Tambah / Edit Testimoni */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-rose-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <h3 className="font-black text-gray-900 text-base">
                {editingItem ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-4 text-xs">
              {/* Username */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Username Roblox *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-bold text-rose-500">
                    @
                  </div>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Contoh: APG_Channel11"
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-rose-200 rounded-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400"
                    required
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Rating Kepuasan (1 - 5 Bintang)</label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingInput(star)}
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center text-lg transition-all cursor-pointer ${
                          star <= ratingInput
                            ? 'bg-amber-50 border-amber-300 text-amber-400 shadow-2xs'
                            : 'bg-gray-50 border-gray-200 text-gray-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-600 ml-1">{ratingInput} Bintang</span>
                </div>
              </div>

              {/* Ulasan */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Isi Ulasan Testimoni *</label>
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  rows={3}
                  placeholder="Tuliskan pengalaman / ulasan kepuasan pembeli..."
                  className="w-full p-3.5 bg-white border border-rose-200 rounded-2xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400 resize-none"
                  required
                />
              </div>

              {/* Paket */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Paket Robux / Kode Order (Opsional)</label>
                <input
                  type="text"
                  value={packageInput}
                  onChange={(e) => setPackageInput(e.target.value)}
                  placeholder="Contoh: 2.200 Robux atau #ZLY86344363"
                  className="w-full px-4 py-2.5 bg-white border border-rose-200 rounded-2xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400"
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:opacity-95 text-white font-bold shadow-md shadow-rose-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambah Testimoni'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Balas Testimoni */}
      {replyingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-rose-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div>
                <h3 className="font-black text-gray-900 text-base">Balas Testimoni</h3>
                <p className="text-xs font-bold text-rose-600">{replyingItem.username}</p>
              </div>
              <button
                onClick={() => setReplyingItem(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs italic text-gray-600">
              “{replyingItem.comment}”
            </div>

            <form onSubmit={handleSaveReply} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Balasan Admin</label>
                <textarea
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  rows={3}
                  placeholder="Tulis balasan untuk ulasan ini..."
                  className="w-full p-3.5 bg-white border border-rose-200 rounded-2xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyingItem(null)}
                  className="px-5 py-2.5 rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:opacity-95 text-white font-bold shadow-md shadow-rose-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  Kirim Balasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
