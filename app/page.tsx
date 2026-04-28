"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '../components/Sidebar';
import { calculateRoute } from '../lib/api';
import { Coordinate, RouteMode, RouteData } from '../lib/types';

// Dynamically import MapComponent to prevent SSR issues with Leaflet
const MapComponent = dynamic(() => import('../components/MapComponent'), { ssr: false });

export default function Home() {
  const [origin, setOrigin] = useState<Coordinate | null>(null);
  const [destination, setDestination] = useState<Coordinate | null>(null);
  const [mode, setMode] = useState<RouteMode>(0);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = async () => {
    if (!origin || !destination) return;
    setIsLoading(true);
    try {
      const data = await calculateRoute(origin, destination, mode);
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
      {/* Full width header, not elevated */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/40 p-4 md:px-6 shadow-sm z-20 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-200 to-indigo-200 rounded-md flex items-center justify-center shadow-inner">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight leading-none">GolekBengkel</h1>
              <p className="text-[10px] md:text-xs text-blue-500 font-medium uppercase tracking-widest mt-1">Optimal Route Finder</p>
            </div>
          </div>
          <div className="hidden md:flex gap-4 items-center">
            <div className="text-[10px] md:text-xs text-gray-500 font-medium">
              &copy; {new Date().getFullYear()} Diaz Nuraji
            </div>
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

        {/* Elevated Sidebar */}
        <div className="absolute top-4 left-4 md:top-3 md:left-12 z-10">
          <Sidebar
            mode={mode}
            setMode={setMode}
            onCalculate={handleCalculate}
            routeData={routeData}
            isLoading={isLoading}
            canCalculate={!!origin && !!destination}
          />
        </div>
      </main>
    </div>
  );
}
