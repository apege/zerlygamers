'use client';

import React, { useState, useEffect } from 'react';
import { Edit3, Check, Heart, FileEdit, Loader2 } from 'lucide-react';

export default function AdminNotesCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(
    'Catatan penting untuk tim admin...\nContoh: Stok Robux normal, promo weekend aktif, cek komplain pelanggan setiap hari.'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load saved admin notes from database on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        });
        const json = await res.json();
        if (json.success && json.data && json.data.admin_notes) {
          setNotes(json.data.admin_notes);
        }
      } catch (err) {
        console.error('Failed to load admin notes:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  // Save notes to database
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: notes }),
      });
      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Failed to save admin notes:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white/90 border border-rose-100/90 rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.06)] flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-100 text-rose-600">
            <FileEdit className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-gray-800">Catatan Admin</h3>
        </div>
        {saveSuccess && (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 animate-in fade-in">
            Tersimpan ke database!
          </span>
        )}
      </div>

      {/* Sticky Note Box */}
      <div className="bg-gradient-to-br from-[#FFF5F8] to-[#FFEAF2] border border-rose-200/80 rounded-2xl p-4 relative shadow-inner min-h-[110px] flex flex-col justify-between">
        {/* Heart / Bookmark Clip Icon Decoration */}
        <div className="absolute top-2.5 right-3 w-7 h-7 rounded-lg bg-white/80 border border-rose-200 shadow-xs flex items-center justify-center">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-6 text-rose-400 gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-semibold">Memuat catatan...</span>
          </div>
        ) : isEditing ? (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full text-xs text-gray-700 bg-white/90 border border-rose-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none font-medium leading-relaxed"
            autoFocus
          />
        ) : (
          <p className="text-xs text-gray-700 font-medium leading-relaxed pr-8 whitespace-pre-line">
            {notes}
          </p>
        )}

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-rose-200/50">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white rounded-lg text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3 text-white" />}
                <span>{isSaving ? 'Menyimpan...' : 'Simpan Catatan'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-2.5 py-1 bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-lg text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              <span>Edit Catatan</span>
            </button>
          )}

          <Edit3 className="w-3.5 h-3.5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
