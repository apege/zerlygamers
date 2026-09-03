'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Download,
  HardDrive,
  ShieldCheck,
  Clock,
  Sparkles,
  RefreshCw,
  FileArchive,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface RetentionMetrics {
  retention_policy_days: number;
  warning_threshold_days: number;
  total_proofs_stored: number;
  expiring_soon_count: number;
  expiring_orders: Array<{
    id: string;
    order_code: string;
    roblox_username: string;
    created_at: string;
    age_days: number;
  }>;
  cleaned_expired_count: number;
}

export default function RetentionWarningBanner() {
  const [metrics, setMetrics] = useState<RetentionMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders/cleanup-proofs', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && json.data) {
        setMetrics(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch retention metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleDownloadZip = (expiringOnly = false) => {
    setIsDownloading(true);
    const url = expiringOnly
      ? '/api/orders/download-proofs-zip?expiring_only=true'
      : '/api/orders/download-proofs-zip';

    // Trigger direct browser download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setIsDownloading(false);
    }, 2000);
  };

  if (!metrics) return null;

  const hasExpiring = metrics.expiring_soon_count > 0;

  return (
    <div className="space-y-3">
      {/* 1. If there are proofs expiring in 7 days, show prominent warning banner */}
      {hasExpiring && (
        <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 border-2 border-amber-400/80 rounded-3xl p-4 sm:p-5 shadow-sm relative overflow-hidden animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30 animate-pulse">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10.5px] font-black uppercase tracking-wider shadow-2xs">
                    Peringatan Retensi Storage (H-7)
                  </span>
                  <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Batas Simpan 90 Hari
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-black text-gray-900 tracking-tight">
                  {metrics.expiring_soon_count} Foto Bukti Transfer Akan Dihapus Otomatis dalam 7 Hari!
                </h3>
                <p className="text-xs text-gray-600 font-medium max-w-2xl leading-relaxed">
                  Untuk menjaga kuota penyimpanan Neon (0.5GB), foto bukti transfer yang berumur 83–90 hari akan segera dibersihkan. Silakan unduh cadangan ZIP sebelum file dihapus permanen.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
              <button
                type="button"
                onClick={() => handleDownloadZip(true)}
                disabled={isDownloading}
                className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shadow-md shadow-amber-500/25 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Bukti H-7 (ZIP)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadZip(false)}
                disabled={isDownloading}
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-amber-50 text-gray-800 border border-amber-300 text-xs font-extrabold shadow-2xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <FileArchive className="w-4 h-4 text-amber-600" />
                <span>Semua Bukti (ZIP)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Compact Storage Info Bar */}
      <div className="bg-white/90 border border-pink-100 rounded-2xl px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 font-bold text-gray-700">
            <HardDrive className="w-4 h-4 text-pink-500" />
            <span>Manajemen Storage Neon:</span>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200 text-[11px] font-black">
            {metrics.total_proofs_stored} Bukti Aktif Tersimpan
          </span>

          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-black flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Auto-Cleanup 90 Hari Aktif</span>
          </span>

          <span className="text-[11px] text-gray-500 font-medium">
            (Testimoni: <strong className="text-gray-700">Permanen</strong>)
          </span>
        </div>

        {/* 1-Click ZIP Download button */}
        <button
          type="button"
          onClick={() => handleDownloadZip(false)}
          disabled={isDownloading || metrics.total_proofs_stored === 0}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-200 text-[11px] font-extrabold transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isDownloading ? 'Menyiapkan ZIP...' : 'Cadangkan Bukti Transfer (ZIP)'}</span>
        </button>
      </div>
    </div>
  );
}
