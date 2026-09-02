'use client';

import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  MessageCircle,
  Sparkles,
  Share2,
  Heart,
  Key,
  ExternalLink,
} from 'lucide-react';
import { AdminOrder } from '@/data/adminDummyData';

interface TestimonialTokenModalProps {
  order: AdminOrder;
  onClose: () => void;
}

export default function TestimonialTokenModal({ order, onClose }: TestimonialTokenModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const cleanToken = order.orderNumber.replace('#', '').trim();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://zerlygamers.com';
  const testimonialUrl = `${origin}/?review_token=${cleanToken}`;

  const messageTemplate = `Halo kak ${order.username}, terima kasih sudah order ${order.item} di Zerly Gamers! ✨\n\nPesanan ${order.orderNumber} telah berhasil kami kirimkan. Boleh minta tolong luangkan waktu sebentar untuk memberikan ulasan & rating bintang kamu? 💖\n\n🔗 Link Ulasan Khusus:\n${testimonialUrl}\n\nToken Order: ${cleanToken}\n\nTerima kasih banyak kak, sukses selalu! 🌸`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(testimonialUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(messageTemplate);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const cleanPhone = order.whatsappNumber ? order.whatsappNumber.replace(/[^0-9]/g, '') : '';
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageTemplate)}`
    : `https://wa.me/?text=${encodeURIComponent(messageTemplate)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-rose-200 shadow-2xl space-y-5 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-base">Kirim Link Testimoni</h3>
              <p className="text-[11px] text-gray-400 font-medium">
                Token Khusus Order {order.orderNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer & Token Preview */}
        <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">Customer:</span>
            <span className="font-black text-rose-600 font-mono text-sm">{order.username}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">Item &amp; Total:</span>
            <span className="font-extrabold text-gray-900">
              {order.item} ({order.priceFormatted})
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-rose-100">
            <span className="text-gray-500 font-medium flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-rose-400" />
              <span>Token Unik:</span>
            </span>
            <span className="font-mono font-black text-xs text-gray-900 bg-white px-2.5 py-0.5 rounded-md border border-rose-200">
              {cleanToken}
            </span>
          </div>
        </div>

        {/* Generated Token Link */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 block">Link Testimoni Customer</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={testimonialUrl}
              className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-rose-200 rounded-2xl text-xs text-gray-800 font-mono focus:outline-none select-all"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-2xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer shadow-2xs"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Message Preview */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-700">Preview Pesan WhatsApp</label>
            <button
              type="button"
              onClick={handleCopyMessage}
              className="text-[11px] text-rose-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              {copiedMessage ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedMessage ? 'Tersalin' : 'Salin Pesan'}</span>
            </button>
          </div>
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-700 font-mono whitespace-pre-line leading-relaxed max-h-32 overflow-y-auto">
            {messageTemplate}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-rose-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold text-xs transition-all cursor-pointer"
          >
            Tutup
          </button>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all active:scale-95 cursor-pointer inline-flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Kirim via WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
