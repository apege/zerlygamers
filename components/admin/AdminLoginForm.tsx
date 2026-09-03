'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  AlertCircle,
  KeyRound,
  Gamepad2,
} from 'lucide-react';

interface AdminLoginFormProps {
  onLoginSuccess: (user: { username: string; role: string }) => void;
}

export default function AdminLoginForm({ onLoginSuccess }: AdminLoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage('Silakan isi username dan password admin!');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password,
          rememberMe,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Username atau password admin salah!');
        setIsLoading(false);
        return;
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      setErrorMessage('Terjadi kendala koneksi ke server. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F8] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white/95 border-2 border-rose-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_-8px_rgba(244,63,94,0.12)] relative z-10 backdrop-blur-sm">
        {/* Header */}
        <div className="flex flex-col items-center text-center relative pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#FF2A85] border border-rose-200 text-xs font-black uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Panel Keamanan Admin</span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Image
              src="/logo.png"
              alt="Zerly Gamers"
              width={160}
              height={50}
              className="object-contain"
              priority
            />
          </div>

          <p className="text-xs text-gray-500 font-semibold max-w-xs mt-1">
            Masuk untuk mengakses dan mengelola seluruh transaksi toko Zerly Gamers 💖
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Username Input */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-black text-gray-700 uppercase tracking-wide">
              Username Admin
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4 text-rose-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Masukkan username admin..."
                autoComplete="username"
                className="w-full pl-10 pr-4 py-3 bg-rose-50/40 border border-rose-200/80 rounded-2xl text-xs sm:text-sm text-gray-900 font-bold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF2A85]/30 focus:border-[#FF2A85] transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-black text-gray-700 uppercase tracking-wide">
              Password Admin
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4 text-rose-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Masukkan password admin..."
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-3 bg-rose-50/40 border border-rose-200/80 rounded-2xl text-xs sm:text-sm text-gray-900 font-bold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF2A85]/30 focus:border-[#FF2A85] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#FF2A85] focus:ring-[#FF2A85] border-rose-300 accent-[#FF2A85]"
              />
              <span className="font-bold text-gray-600 text-xs">Ingat Saya (30 Hari)</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FF2A85] via-pink-500 to-[#FF2A85] hover:opacity-95 text-white text-xs sm:text-sm font-black shadow-lg shadow-pink-500/25 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Masuk ke Panel Admin</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-rose-100 text-center">
          <p className="text-[11px] text-gray-400 font-medium">
            Zerly Gamers Official Admin Gate &bull; 2026
          </p>
        </div>
      </div>
    </div>
  );
}
