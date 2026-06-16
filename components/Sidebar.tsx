import React from 'react';
import { RouteMode, RouteData, VelocityModel } from '../lib/types';

const formatTime = (seconds?: number) => {
  if (seconds === undefined) return '-';
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins === 0) return `${secs} detik`;
  return `${mins} menit ${secs} detik`;
};

interface SidebarProps {
  mode: RouteMode;
  setMode: (mode: RouteMode) => void;
  model: VelocityModel;
  setModel: (model: VelocityModel) => void;
  ignoreDownhill: boolean;
  setIgnoreDownhill: (val: boolean) => void;
  slopeMultiplier: number;
  setSlopeMultiplier: (val: number) => void;
  onCalculate: () => void;
  routeData: RouteData | null;
  isLoading: boolean;
  canCalculate: boolean;
}

export default function Sidebar({
  mode,
  setMode,
  model,
  setModel,
  ignoreDownhill,
  setIgnoreDownhill,
  slopeMultiplier,
  setSlopeMultiplier,
  onCalculate,
  routeData,
  isLoading,
  canCalculate
}: SidebarProps) {
  return (
    <div className="w-80 bg-white/95 backdrop-blur-lg border border-gray-200/80 shadow-2xl rounded-2xl p-5 flex flex-col gap-4 max-h-[calc(100vh-80px)] overflow-y-auto transition-all animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100 shrink-0">
        <div className="w-1.5 h-3.5 bg-blue-500 rounded-md"></div>
        <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Konfigurasi Rute</h2>
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider px-1">Metode Pencarian</span>
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setMode('time')}
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-all border border-transparent cursor-pointer ${
                mode === 'time'
                  ? 'bg-white text-blue-600 shadow-sm font-bold border-gray-200/50'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/50 text-[10px] font-medium'
              }`}
            >
              <svg className="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[9px] tracking-tight">Rute Tercepat</span>
            </button>
            <button
              onClick={() => setMode('distance')}
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-all border border-transparent cursor-pointer ${
                mode === 'distance'
                  ? 'bg-white text-blue-600 shadow-sm font-bold border-gray-200/50'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/50 text-[10px] font-medium'
              }`}
            >
              <svg className="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L16 4m0 13V4m0 0L9 7" />
              </svg>
              <span className="text-[9px] tracking-tight">Rute Terpendek</span>
            </button>
          </div>
        </div>

        {/* Sub-settings for Fastest (Time) Mode */}
        {mode === 'time' && (
          <div className="space-y-3.5 p-3 bg-gray-50 rounded-xl border border-gray-100/80">
            {/* Velocity Model Selector */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Model Kecepatan</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as VelocityModel)}
                className="w-full text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg p-2 focus:outline-hidden focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="glm">GLM (Wood et al., 2023)</option>
                <option value="tobler">Tobler's Hiking Function</option>
                <option value="naismith">Naismith's Hiking Rule</option>
              </select>
            </div>

            {/* Slope Multiplier Slider */}
            <div className="space-y-1 border-t border-gray-200/50 pt-2.5">
              <div className="flex justify-between items-center text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                <span>Faktor Beban (Pushing)</span>
                <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-sm text-[9px] font-bold">{slopeMultiplier.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={slopeMultiplier}
                onChange={(e) => setSlopeMultiplier(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-600 transition-all"
              />
              <div className="flex justify-between text-[8px] text-gray-400 font-bold uppercase tracking-tight">
                <span>1.0x (Normal)</span>
                <span>3.0x (Motor Mogok)</span>
                <span>5.0x (Berat)</span>
              </div>
            </div>

            {/* Ignore Downhill Speed Override Toggle */}
            <div className="flex items-center justify-between border-t border-gray-200/50 pt-2.5">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-gray-700 uppercase tracking-wide">Abaikan Batas Turunan</span>
                <span className="text-[8px] text-gray-400 font-medium">Batas 5 km/jam dinonaktifkan</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={ignoreDownhill}
                  onChange={(e) => setIgnoreDownhill(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-gray-200 rounded-full peer peer-focus:outline-hidden peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        )}

        <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/50">
          <p className="text-[9px] leading-relaxed text-blue-700/80 font-medium">
            {mode === 'time' ? (
              <>
                {model === 'glm' && (
                  <>
                    <span className="font-bold text-blue-800">Model GLM:</span> Estimasi waktu berdasarkan kelandaian & kondisi jalan. Menghindari tanjakan ekstrem.
                  </>
                )}
                {model === 'tobler' && (
                  <>
                    <span className="font-bold text-blue-800">Formula Tobler:</span> Model eksponensial empiris untuk jalan kaki, memperkirakan kecepatan puncak pada kemiringan -2.86°.
                  </>
                )}
                {model === 'naismith' && (
                  <>
                    <span className="font-bold text-blue-800">Aturan Naismith:</span> Kecepatan dasar 5 km/jam dengan penalti tambahan waktu 10 menit per 100 meter kenaikan elevasi.
                  </>
                )}
                {slopeMultiplier > 1.0 && (
                  <span className="block mt-0.5 text-blue-800 font-semibold">• Penalti tanjakan diperbesar {slopeMultiplier.toFixed(1)}x untuk menyimulasikan dorong motor.</span>
                )}
                {ignoreDownhill && (
                  <span className="block mt-0.5 font-semibold text-rose-700">• Batas kecepatan turun bukit dinonaktifkan (kecepatan dihitung sesuai rumus murni).</span>
                )}
              </>
            ) : (
              <>
                <span className="font-bold text-blue-800">Jarak Terpendek:</span> Rute berdasarkan jarak geometris murni, mengabaikan kelandaian tanjakan/turunan dan kondisi jalan.
              </>
            )}
          </p>
        </div>
      </section>

      <button
        onClick={onCalculate}
        disabled={!canCalculate || isLoading}
        className="group relative w-full py-3.5 bg-linear-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md transition-all transform active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden shrink-0 cursor-pointer"
      >
        <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide">
          {isLoading ? (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              Cari Rute Optimal
              <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </span>
        <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300"></div>
      </button>

      {routeData && (
        <section className="space-y-3 pt-2 border-t border-gray-100 animate-in fade-in slide-in-from-bottom duration-500 shrink-0">
          <h3 className="text-[10px] font-bold text-gray-700 uppercase tracking-wider px-1">Ringkasan Perjalanan</h3>
          
          {/* Core metrics cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-emerald-50/60 backdrop-blur-sm p-3 rounded-xl border border-emerald-100 flex flex-col gap-0.5">
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tight">Jarak</span>
              <span className="text-base font-black text-emerald-900">
                {routeData.distance} <span className="text-[10px] font-bold">KM</span>
              </span>
            </div>
            <div className="bg-amber-50/60 backdrop-blur-sm p-3 rounded-xl border border-amber-100 flex flex-col gap-0.5">
              <span className="text-[9px] font-bold text-amber-600 uppercase tracking-tight">Elevasi Naik</span>
              <span className="text-base font-black text-amber-900">
                {routeData.elevationGain} <span className="text-[10px] font-bold">M</span>
              </span>
            </div>
          </div>

          {/* Travel time */}
          {routeData.travelTime !== undefined && (
            <div className="bg-blue-50/60 backdrop-blur-sm p-3 rounded-xl border border-blue-100 flex flex-col gap-1 animate-in fade-in duration-300">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-tight">Estimasi Waktu Tempuh</span>
                <span className="text-base font-black text-blue-900">
                  {formatTime(routeData.travelTime)}
                </span>
              </div>
              {(routeData.modelType || routeData.slopeMultiplier) && (
                <div className="flex flex-wrap gap-1 pt-1 border-t border-blue-100/50 text-[8px] font-bold uppercase tracking-wider text-blue-700/80">
                  {routeData.modelType && <span>Model: {routeData.modelType}</span>}
                  {routeData.modelType && <span>•</span>}
                  {routeData.slopeMultiplier !== undefined && <span>Beban: {routeData.slopeMultiplier.toFixed(1)}x</span>}
                  {routeData.slopeMultiplier !== undefined && <span>•</span>}
                  <span>Downhill: {routeData.ignoreDownhill ? 'Murni' : 'Maks 5 km/jam'}</span>
                </div>
              )}
            </div>
          )}

          {/* Slope breakdown characteristics */}
          {routeData.slopeCharacteristics && (
            <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100 space-y-2">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tight block">Karakteristik Lintasan</span>
              
              {/* Distribution Bar */}
              <div className="space-y-1">
                {/* Visual Segmented Bar */}
                <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden flex">
                  {routeData.slopeCharacteristics.uphill_meters > 0 && (
                    <div
                      style={{ width: `${(routeData.slopeCharacteristics.uphill_ratio * 100).toFixed(1)}%` }}
                      className="h-full bg-rose-500"
                      title={`Tanjakan: ${(routeData.slopeCharacteristics.uphill_ratio * 100).toFixed(1)}%`}
                    ></div>
                  )}
                  {routeData.slopeCharacteristics.flat_meters > 0 && (
                    <div
                      style={{ width: `${(routeData.slopeCharacteristics.flat_ratio * 100).toFixed(1)}%` }}
                      className="h-full bg-gray-400"
                      title={`Datar: ${(routeData.slopeCharacteristics.flat_ratio * 100).toFixed(1)}%`}
                    ></div>
                  )}
                  {routeData.slopeCharacteristics.downhill_meters > 0 && (
                    <div
                      style={{ width: `${(routeData.slopeCharacteristics.downhill_ratio * 100).toFixed(1)}%` }}
                      className="h-full bg-emerald-500"
                      title={`Turunan: ${(routeData.slopeCharacteristics.downhill_ratio * 100).toFixed(1)}%`}
                    ></div>
                  )}
                </div>

                {/* Breakdown labels */}
                <div className="flex flex-col gap-0.5 text-[8px] font-medium text-gray-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                      <span>Tanjakan</span>
                    </div>
                    <span className="font-bold text-gray-700">{Math.round(routeData.slopeCharacteristics.uphill_meters)}m ({Math.round(routeData.slopeCharacteristics.uphill_ratio * 100)}%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                      <span>Datar</span>
                    </div>
                    <span className="font-bold text-gray-700">{Math.round(routeData.slopeCharacteristics.flat_meters)}m ({Math.round(routeData.slopeCharacteristics.flat_ratio * 100)}%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      <span>Turunan</span>
                    </div>
                    <span className="font-bold text-gray-700">{Math.round(routeData.slopeCharacteristics.downhill_meters)}m ({Math.round(routeData.slopeCharacteristics.downhill_ratio * 100)}%)</span>
                  </div>
                </div>
              </div>

              {/* Slope values */}
              <div className="border-t border-gray-200/50 pt-1.5 grid grid-cols-2 gap-1 text-[8px] font-semibold text-gray-600">
                <div>
                  Rerata Slope: <span className="font-extrabold text-gray-800">{routeData.slopeCharacteristics.average_slope_deg.toFixed(1)}°</span>
                </div>
                <div className="text-right">
                  Slope Maks: <span className="font-extrabold text-gray-800">{routeData.slopeCharacteristics.max_slope_deg.toFixed(1)}°</span>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}



