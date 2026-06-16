"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '../components/Sidebar';
import { calculateRoute } from '../lib/api';
import { Coordinate, RouteMode, RouteData, VelocityModel } from '../lib/types';

// Dynamically import MapComponent to prevent SSR issues with Leaflet
const MapComponent = dynamic(() => import('../components/MapComponent'), { ssr: false });

export default function Home() {
  const [origin, setOrigin] = useState<Coordinate | null>(null);
  const [destination, setDestination] = useState<Coordinate | null>(null);
  const [mode, setMode] = useState<RouteMode>('time');
  const [model, setModel] = useState<VelocityModel>('glm');
  const [ignoreDownhill, setIgnoreDownhill] = useState<boolean>(false);
  const [slopeMultiplier, setSlopeMultiplier] = useState<number>(3.0);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleCalculate = async () => {
    if (!origin || !destination) return;
    setIsLoading(true);
    try {
      const data = await calculateRoute(origin, destination, mode, model, ignoreDownhill, slopeMultiplier);
      setRouteData(data);
    } catch (error) {
      console.error('Failed to calculate route', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setOrigin(null);
    setDestination(null);
    setRouteData(null);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#F0F4F8] text-gray-800 font-sans overflow-hidden">
      {/* Thinner full width header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/40 py-2 px-4 shadow-sm z-30 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-linear-to-br from-blue-200 to-indigo-200 rounded-md flex items-center justify-center shadow-inner">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900 tracking-tight leading-none">GolekBengkel</h1>
              <p className="text-[9px] text-blue-500 font-medium uppercase tracking-widest mt-0.5">Optimal Route Finder</p>
            </div>
          </div>

          {/* Settings Menu Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                isSettingsOpen
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                  : 'bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100/80'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>Pengaturan Rute</span>
            </button>

            {/* Floating popover/dropdown settings */}
            {isSettingsOpen && (
              <div className="absolute right-0 mt-2 z-[999] shadow-2xl">
                <Sidebar
                  mode={mode}
                  setMode={setMode}
                  model={model}
                  setModel={setModel}
                  ignoreDownhill={ignoreDownhill}
                  setIgnoreDownhill={setIgnoreDownhill}
                  slopeMultiplier={slopeMultiplier}
                  setSlopeMultiplier={setSlopeMultiplier}
                  onCalculate={handleCalculate}
                  routeData={routeData}
                  isLoading={isLoading}
                  canCalculate={!!origin && !!destination}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content area containing map and floating sidebar */}
      <main className="flex-1 relative overflow-hidden">
        {/* Map inside container */}
        <div className="w-full h-full z-0">
          <MapComponent
            origin={origin}
            destination={destination}
            path={routeData?.path || []}
            setOrigin={setOrigin}
            setDestination={setDestination}
            onReset={handleReset}
          />
        </div>

        {/* Floating Credits in lower left corner */}
        <div className="absolute bottom-4 left-4 z-10 bg-white/40 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] text-gray-600/90 font-medium border border-white/20 pointer-events-none select-none">
          &copy; {new Date().getFullYear()} Diaz Nuraji
        </div>
      </main>
    </div>
  );
}

