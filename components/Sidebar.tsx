import React, { useState, useEffect } from 'react';
import { RouteMode, RouteData } from '../lib/types';

interface SidebarProps {
  mode: RouteMode;
  setMode: (mode: RouteMode) => void;
  onCalculate: () => void;
  routeData: RouteData | null;
  isLoading: boolean;
  canCalculate: boolean;
}

export default function Sidebar({ mode, setMode, onCalculate, routeData, isLoading, canCalculate }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarExpanded');
    if (savedState !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsExpanded(savedState === 'true');
    }
  }, []);

  const toggleExpanded = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem('sidebarExpanded', String(newState));
  };

  return (
    <div className={`bg-white/90 backdrop-blur-lg border border-white/40 shadow-2xl rounded-md animate-in fade-in slide-in-from-left duration-700 transition-all ${isExpanded ? 'w-80 p-6' : 'w-auto p-4'} flex flex-col gap-8`}>
      <section className="flex justify-between items-center cursor-pointer" onClick={toggleExpanded}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-4 bg-blue-400 rounded-md"></div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">Pengaturan Rute</h2>
            {isExpanded && <p className="text-[10px] text-gray-500 font-medium">Konfigurasi parameter perjalanan.</p>}
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg className={`w-4 h-4 text-gray-600 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </section>

      {isExpanded && (
        <>
          <section className="space-y-4 animate-in fade-in duration-300">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Parameter Lambda</label>
              <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold">{mode}</span>
            </div>

            <div className="relative pt-2 px-1">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={mode}
                onChange={(e) => setMode(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-600 transition-all"
              />
              <div className="flex justify-between mt-3 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                <span>Shortest</span>
                <span>Balanced</span>
                <span>Flatest</span>
              </div>
            </div>

            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
              <p className="text-[10px] leading-relaxed text-blue-700/80 font-medium">
                <span className="font-bold text-blue-800">Tips:</span> Nilai tinggi (Darurat) sangat menghindari jalan menanjak, cocok untuk motor yang mogok atau beban berat.
              </p>
            </div>
          </section>

          <button
            onClick={onCalculate}
            disabled={!canCalculate || isLoading}
            className="group relative w-full py-4 bg-linear-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold rounded-2xl shadow-[0_10px_20px_-10px_rgba(59,130,246,0.5)] transition-all transform active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden animate-in fade-in duration-300"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide">
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  Cari Rute Optimal
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300"></div>
          </button>

          {routeData && (
            <section className="mt-2 space-y-3 animate-in fade-in slide-in-from-bottom duration-500">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider px-1">Ringkasan Perjalanan</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50/60 backdrop-blur-sm p-4 rounded-2xl border border-emerald-100 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">Jarak</span>
                  <span className="text-xl font-black text-emerald-900">{routeData.distance} <span className="text-xs font-bold">KM</span></span>
                </div>
                <div className="bg-amber-50/60 backdrop-blur-sm p-4 rounded-2xl border border-amber-100 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-tight">Elevasi</span>
                  <span className="text-xl font-black text-amber-900">{routeData.elevationGain} <span className="text-xs font-bold">M</span></span>
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
