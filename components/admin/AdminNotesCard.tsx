'use client';

import React, { useState } from 'react';
import { Edit3, Check, Heart, FileEdit } from 'lucide-react';

export default function AdminNotesCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(
    'Catatan penting untuk tim admin...\nContoh: Stok Robux normal, promo weekend aktif, cek komplain pelanggan setiap hari.'
  );

  return (
    <div className="bg-white/90 border border-pink-100/90 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-pink-100 text-[#FF2A85]">
            <FileEdit className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-gray-800">Catatan Admin</h3>
        </div>
      </div>

      {/* Sticky Note Box */}
      <div className="bg-gradient-to-br from-[#FFF5F8] to-[#FFEAF2] border border-pink-200/80 rounded-2xl p-4 relative shadow-inner min-h-[110px] flex flex-col justify-between">
        {/* Heart / Bookmark Clip Icon Decoration */}
        <div className="absolute top-2.5 right-3 w-7 h-7 rounded-lg bg-white/80 border border-pink-200 shadow-xs flex items-center justify-center">
          <Heart className="w-3.5 h-3.5 text-[#FF2A85] fill-[#FF2A85]" />
        </div>

        {isEditing ? (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full text-xs text-gray-700 bg-white/70 border border-pink-300 rounded-xl p-2 focus:outline-none focus:ring-1 focus:ring-pink-400 resize-none font-medium leading-relaxed"
            autoFocus
          />
        ) : (
          <p className="text-xs text-gray-700 font-medium leading-relaxed pr-8 whitespace-pre-line">
            {notes}
          </p>
        )}

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-pink-200/50">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-pink-200 hover:bg-pink-50 text-[#FF2A85] rounded-lg text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            {isEditing ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-600">Simpan</span>
              </>
            ) : (
              <span>Edit Catatan</span>
            )}
          </button>

          <Edit3 className="w-3.5 h-3.5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
