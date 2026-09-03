'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Star,
  Heart,
  Sparkles,
  CheckCircle2,
  X,
  Send,
  Loader2,
  Gamepad2,
  MessageSquareHeart,
  Check,
} from 'lucide-react';

interface CustomerReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewToken: string;
  onReviewSubmitted?: () => void;
}

const QUICK_TAGS = [
  '⚡ Proses Super Kilat',
  '💖 Admin Sangat Ramah',
  '🔒 Aman & Terpercaya',
  '🎉 Harga Termurah',
  '⭐ Langganan Terus',
  '💎 Robux Langsung Masuk',
];

const RATING_LABELS: { [key: number]: string } = {
  5: '⭐⭐⭐⭐⭐ Luar Biasa Cepat! (5/5)',
  4: '⭐⭐⭐⭐ Sangat Puas & Bagus (4/5)',
  3: '⭐⭐⭐ Cukup Baik (3/5)',
  2: '⭐⭐ Kurang Memuaskan (2/5)',
  1: '⭐ Sangat Kecewa (1/5)',
};

export default function CustomerReviewModal({
  isOpen,
  onClose,
  reviewToken,
  onReviewSubmitted,
}: CustomerReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [username, setUsername] = useState<string>('');
  const [itemPackage, setItemPackage] = useState<string>('Paket Robux');
  const [comment, setComment] = useState<string>('');
  const [isLoadingOrder, setIsLoadingOrder] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const [alreadyReviewedData, setAlreadyReviewedData] = useState<{
    rating: number;
    comment: string;
    username: string;
  } | null>(null);

  // Fetch order details and check existing review by review_token
  useEffect(() => {
    if (!isOpen || !reviewToken) return;

    const fetchOrderAndReviewStatus = async () => {
      setIsLoadingOrder(true);
      try {
        // 1. Check if this token was already used to review
        const checkRes = await fetch(`/api/testimonials?token=${encodeURIComponent(reviewToken)}`, {
          cache: 'no-store',
        });
        const checkData = await checkRes.json();
        if (checkData.success && checkData.has_reviewed && checkData.data) {
          setAlreadyReviewedData({
            rating: Number(checkData.data.rating) || 5,
            comment: checkData.data.comment || '',
            username: checkData.data.username || '',
          });
        }

        // 2. Fetch order details
        const res = await fetch(`/api/orders?token=${encodeURIComponent(reviewToken)}`, {
          cache: 'no-store',
        });
        const data = await res.json();
        if (data.success && data.data) {
          const ord = data.data;
          setUsername(ord.roblox_username || '');
          if (ord.robux) {
            setItemPackage(`${Number(ord.robux).toLocaleString('id-ID')} Robux`);
          }
        } else {
          const cleanToken = reviewToken.replace(/[^a-zA-Z0-9]/g, '');
          setItemPackage(`Order #${cleanToken}`);
        }
      } catch (err) {
        console.error('Failed to fetch order for review:', err);
      } finally {
        setIsLoadingOrder(false);
      }
    };

    fetchOrderAndReviewStatus();
  }, [isOpen, reviewToken]);

  if (!isOpen) return null;

  const handleAddTag = (tag: string) => {
    if (comment.includes(tag)) return;
    setComment((prev) => (prev ? `${prev}, ${tag}` : tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('Harap masukkan username Roblox kamu.');
      return;
    }
    if (!comment.trim()) {
      setErrorMsg('Harap tuliskan ulasan atau pengalaman top up kamu.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: username.trim(),
          message: comment.trim(),
          rating,
          order_code: itemPackage,
          token: reviewToken,
          status: 'approved',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      } else {
        setErrorMsg(data.error || 'Gagal mengirim ulasan.');
      }
    } catch (err: any) {
      console.error('Submit review error:', err);
      setErrorMsg('Terjadi kesalahan saat mengirim ulasan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="customer-review-title"
      className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl border-2 border-pink-300 w-full max-w-lg p-5 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col gap-4 text-left max-h-[92vh] overflow-y-auto">
        {/* Background glow */}
        <div aria-hidden="true" className="absolute -top-12 -right-12 w-36 h-36 bg-pink-300/20 rounded-full blur-xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup form ulasan"
          className="absolute top-4 right-4 text-gray-500 hover:text-pink-600 transition-colors p-1.5 rounded-full hover:bg-pink-50 cursor-pointer z-10"
        >
          <X aria-hidden="true" className="w-5 h-5" />
        </button>

        {alreadyReviewedData ? (
          /* Already Reviewed Screen */
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
              <CheckCircle2 aria-hidden="true" className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 id="customer-review-title" className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Ulasan Sudah Pernah Dikirim ✨
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 max-w-sm mx-auto font-medium leading-relaxed">
                Kamu sudah memberikan ulasan untuk pesanan ini. Terima kasih banyak atas kepercayaanmu berbelanja di <strong className="text-[#D81467]">ZerlyGamers</strong>! 💖
              </p>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl max-w-sm mx-auto text-xs space-y-1 text-left">
              <div aria-label={`Rating ${alreadyReviewedData.rating} dari 5 bintang`} className="flex text-amber-400 gap-1 mb-1">
                {Array.from({ length: alreadyReviewedData.rating }).map((_, i) => (
                  <Star key={i} aria-hidden="true" className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="font-bold text-gray-800">“{alreadyReviewedData.comment}”</p>
              <p className="text-[11px] text-emerald-800 font-extrabold">{alreadyReviewedData.username} • {itemPackage}</p>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-pink-500/25 transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        ) : isSuccess ? (
          /* Success Screen */
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-pink-500/30 animate-bounce">
              <MessageSquareHeart aria-hidden="true" className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 id="customer-review-title" className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Terima Kasih Atas Ulasanmu! 💖
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 max-w-sm mx-auto font-medium leading-relaxed">
                Ulasan kamu sangat berharga dan telah berhasil dipublikasikan di halaman testimoni <strong className="text-[#D81467]">ZerlyGamers</strong>.
              </p>
            </div>

            <div className="p-4 bg-pink-50/70 border border-pink-200 rounded-2xl max-w-sm mx-auto text-xs space-y-1">
              <div aria-label={`Rating ${rating} dari 5 bintang`} className="flex justify-center text-amber-400 gap-1 mb-1">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} aria-hidden="true" className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="font-bold text-gray-800">“{comment}”</p>
              <p className="text-[11px] text-[#D81467] font-extrabold">{username} • {itemPackage}</p>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-pink-500/25 transition-all cursor-pointer"
              >
                Selesai &amp; Kembali ke Toko
              </button>
            </div>
          </div>
        ) : (
          /* Review Form */
          <>
            {/* Header */}
            <div className="space-y-1 pr-6">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#D81467]">
                <Sparkles aria-hidden="true" className="w-3.5 h-3.5" />
                <span>Ulasan Kepuasan Pelanggan</span>
              </div>
              <h3 id="customer-review-title" className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                Beri Testimoni Pesanan Kamu ✨
              </h3>
              <p className="text-xs text-gray-600 font-medium">
                Bagikan pengalaman top up Robux kamu di ZerlyGamers
              </p>
            </div>

            {/* Order Preview Badge */}
            <div className="p-3 bg-pink-50/60 border border-pink-200/80 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-[#D81467] flex items-center justify-center shrink-0">
                  <Gamepad2 aria-hidden="true" className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-black text-gray-900 truncate">{itemPackage}</div>
                  <div className="text-[10px] text-gray-600 font-mono font-medium truncate">
                    Invoice: #{reviewToken.replace(/[^a-zA-Z0-9]/g, '')}
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase border border-emerald-200 shrink-0">
                Selesai ✓
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Star Rating */}
              <div className="space-y-1.5 text-center p-3.5 bg-gradient-to-br from-amber-50/50 to-pink-50/30 border border-amber-200/60 rounded-2xl">
                <span className="font-black text-gray-800 block">
                  Berapa Bintang Kepuasan Kamu? *
                </span>
                <div className="flex items-center justify-center gap-1.5 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`Beri nilai ${star} bintang`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-2xl transition-transform hover:scale-125 active:scale-95 cursor-pointer focus:outline-none"
                    >
                      <Star
                        aria-hidden="true"
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          star <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-[11px] font-black text-[#D81467]">
                  {RATING_LABELS[hoverRating || rating]}
                </div>
              </div>

              {/* Username Roblox */}
              <div className="space-y-1.5">
                <label htmlFor="review-username" className="font-bold text-gray-800">Username / Nama Kamu *</label>
                <input
                  id="review-username"
                  name="review-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: @muachiilan"
                  className="w-full px-4 py-2.5 bg-white border border-pink-200 rounded-2xl font-bold text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400/40 focus:border-pink-400"
                  required
                />
              </div>

              {/* Review Comment */}
              <div className="space-y-1.5">
                <label htmlFor="review-comment" className="font-bold text-gray-800">Tulis Ulasan / Testimoni Kamu *</label>
                <textarea
                  id="review-comment"
                  name="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Ceritakan pengalaman kamu top up di ZerlyGamers (contoh: Fast respon banget, robux langsung masuk dalam hitungan menit!)..."
                  className="w-full p-3.5 bg-white border border-pink-200 rounded-2xl text-xs font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400/40 focus:border-pink-400 resize-none leading-relaxed"
                  required
                />
              </div>

              {/* Quick Tag Pills */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">
                  Pilihan Cepat (Klik untuk Tambah):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddTag(tag)}
                      className="px-2.5 py-1 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#D81467] text-[10px] font-bold border border-pink-200 transition-all active:scale-95 cursor-pointer"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold">
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-pink-500/25 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 aria-hidden="true" className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send aria-hidden="true" className="w-4 h-4" />
                  )}
                  <span>{isSubmitting ? 'Mengirim Ulasan...' : 'Kirim Ulasan Sekarang'}</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
