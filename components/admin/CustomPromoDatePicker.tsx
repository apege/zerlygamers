'use client';

import React, { useState } from 'react';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Calendar as CalendarIcon,
} from 'lucide-react';

interface CustomPromoDatePickerProps {
  initialDate?: Date;
  initialHour?: string;
  initialMinute?: string;
  onApply: (formattedDateTime: string, rawDate: Date) => void;
  onClose: () => void;
}

export default function CustomPromoDatePicker({
  initialDate = new Date(2026, 9, 1), // 1 Oktober 2026
  initialHour = '06',
  initialMinute = '59',
  onApply,
  onClose,
}: CustomPromoDatePickerProps) {
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear() || 2026);
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth()); // 0-indexed (9 = Oktober)
  const [selectedDay, setSelectedDay] = useState(initialDate.getDate() || 1);
  const [selectedHour, setSelectedHour] = useState(initialHour);
  const [selectedMinute, setSelectedMinute] = useState(initialMinute);
  const [activePreset, setActivePreset] = useState<'3hari' | '7hari' | '14hari' | 'akhirbulan' | 'custom'>('akhirbulan');

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Minggu
  const prevMonthDays = daysInMonth(currentYear, currentMonth - 1);
  const totalDays = daysInMonth(currentYear, currentMonth);

  // Preset Handlers
  const handlePreset = (preset: '3hari' | '7hari' | '14hari' | 'akhirbulan') => {
    setActivePreset(preset);
    const now = new Date();
    if (preset === '3hari') {
      const target = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      setCurrentYear(target.getFullYear());
      setCurrentMonth(target.getMonth());
      setSelectedDay(target.getDate());
    } else if (preset === '7hari') {
      const target = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      setCurrentYear(target.getFullYear());
      setCurrentMonth(target.getMonth());
      setSelectedDay(target.getDate());
    } else if (preset === '14hari') {
      const target = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      setCurrentYear(target.getFullYear());
      setCurrentMonth(target.getMonth());
      setSelectedDay(target.getDate());
    } else if (preset === 'akhirbulan') {
      const lastDay = daysInMonth(currentYear, currentMonth);
      setSelectedDay(lastDay);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleApply = () => {
    const formattedDate = `${selectedDay} ${monthNames[currentMonth]} ${currentYear}, ${selectedHour}:${selectedMinute} WIB`;
    const targetDateObj = new Date(currentYear, currentMonth, selectedDay, parseInt(selectedHour, 10), parseInt(selectedMinute, 10));
    onApply(formattedDate, targetDateObj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-[32px] p-6 sm:p-7 max-w-sm w-full border border-pink-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 select-none relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. Quick Presets (Matching Screenshot) */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <button
            type="button"
            onClick={() => handlePreset('3hari')}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              activePreset === '3hari'
                ? 'bg-[#FF2A85] text-white shadow-xs'
                : 'bg-pink-50/80 hover:bg-pink-100 text-[#FF2A85]'
            }`}
          >
            +3 Hari
          </button>
          <button
            type="button"
            onClick={() => handlePreset('7hari')}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              activePreset === '7hari'
                ? 'bg-[#FF2A85] text-white shadow-xs'
                : 'bg-pink-50/80 hover:bg-pink-100 text-[#FF2A85]'
            }`}
          >
            +7 Hari
          </button>
          <button
            type="button"
            onClick={() => handlePreset('14hari')}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              activePreset === '14hari'
                ? 'bg-[#FF2A85] text-white shadow-xs'
                : 'bg-pink-50/80 hover:bg-pink-100 text-[#FF2A85]'
            }`}
          >
            +14 Hari
          </button>
          <button
            type="button"
            onClick={() => handlePreset('akhirbulan')}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              activePreset === 'akhirbulan'
                ? 'bg-[#FF2A85] text-white shadow-xs'
                : 'bg-pink-50/80 hover:bg-pink-100 text-[#FF2A85]'
            }`}
          >
            Akhir Bulan
          </button>
        </div>

        {/* 2. Month & Year Title with Navigation (Matching Screenshot) */}
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-lg font-black text-gray-900 tracking-tight">
            {monthNames[currentMonth]} {currentYear}
          </h2>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-8 h-8 rounded-xl border border-pink-100 hover:bg-pink-50 flex items-center justify-center text-pink-500 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="w-8 h-8 rounded-xl border border-pink-100 hover:bg-pink-50 flex items-center justify-center text-pink-500 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3. Calendar Grid (Matching Screenshot) */}
        <div className="space-y-2.5">
          {/* Day Names Row */}
          <div className="grid grid-cols-7 text-center">
            {dayNames.map((name, i) => (
              <span
                key={name}
                className={`text-xs font-black ${i === 0 ? 'text-[#FF2A85]' : 'text-gray-400'}`}
              >
                {name}
              </span>
            ))}
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-bold">
            {/* Previous Month Dates (Greyed Out) */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => {
              const dayNum = prevMonthDays - firstDayIndex + idx + 1;
              return (
                <div key={`prev-${idx}`} className="py-1.5 text-gray-300 select-none">
                  {dayNum}
                </div>
              );
            })}

            {/* Current Month Dates */}
            {Array.from({ length: totalDays }).map((_, idx) => {
              const day = idx + 1;
              const isSelected = day === selectedDay;
              return (
                <div key={`curr-${day}`} className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDay(day);
                      setActivePreset('custom');
                    }}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF2A85] text-white shadow-md shadow-pink-500/30 scale-105'
                        : 'text-gray-800 hover:bg-pink-50 hover:text-[#FF2A85]'
                    }`}
                  >
                    {day}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Divider */}
        <div className="border-t border-pink-100" />

        {/* 5. Atur Jam & Menit Berakhir (Matching Screenshot) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <Clock className="w-4 h-4 text-[#FF2A85]" />
              <span>Atur Jam &amp; Menit Berakhir</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-pink-50 text-[#FF2A85] border border-pink-200">
              {selectedHour}:{selectedMinute} WIB
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Jam Selector */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 block">Jam (00 - 23)</span>
              <select
                value={selectedHour}
                onChange={(e) => setSelectedHour(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-pink-200 rounded-2xl font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-pink-400 cursor-pointer"
              >
                {Array.from({ length: 24 }).map((_, i) => {
                  const val = i.toString().padStart(2, '0');
                  return (
                    <option key={val} value={val}>
                      {val} : 00
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Menit Selector */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 block">Menit (00 - 59)</span>
              <select
                value={selectedMinute}
                onChange={(e) => setSelectedMinute(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-pink-200 rounded-2xl font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-pink-400 cursor-pointer"
              >
                {Array.from({ length: 60 }).map((_, i) => {
                  const val = i.toString().padStart(2, '0');
                  return (
                    <option key={val} value={val}>
                      Menit {val}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        {/* 6. CTA Button (Matching Screenshot) */}
        <button
          type="button"
          onClick={handleApply}
          className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#FF2A85] via-[#FF3B88] to-[#FF4D97] hover:opacity-95 text-white text-xs font-black shadow-md shadow-pink-500/25 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Terapkan Waktu Promo</span>
        </button>
      </div>
    </div>
  );
}
