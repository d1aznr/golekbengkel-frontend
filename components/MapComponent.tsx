import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Coordinate } from '../lib/types';

// Fix for default Leaflet markers in React
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const breakdownIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const mechanicIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapComponentProps {
  origin: Coordinate | null;
  destination: Coordinate | null;
  path: Coordinate[];
  setOrigin: (coord: Coordinate | null) => void;
  setDestination: (coord: Coordinate | null) => void;
  onReset: () => void;
}

interface MapClickHandlerProps {
  origin: Coordinate | null;
  setOrigin: (coord: Coordinate) => void;
  setDestination: (coord: Coordinate) => void;
}

const MapClickHandler = ({ origin, setOrigin, setDestination }: MapClickHandlerProps) => {
  useMapEvents({
    click(e) {
      if (!origin) {
        setOrigin({ lat: e.latlng.lat, lng: e.latlng.lng });
      } else {
        setDestination({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
};

export default function MapComponent({ origin, destination, path, setOrigin, setDestination, onReset }: MapComponentProps) {
  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-white/95 backdrop-blur-md rounded-full border border-gray-200/80 shadow-md py-1.5 px-4 text-xs font-bold text-gray-700 flex items-center gap-2 pointer-events-none whitespace-nowrap">
        <span className={`w-1.5 h-1.5 rounded-full ${!origin ? 'bg-rose-500 animate-pulse' : !destination ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`}></span>
        <span>
          {!origin ? 'Klik peta untuk lokasi mogok' : !destination ? 'Klik peta untuk lokasi bengkel' : 'Lokasi asal & tujuan diset'}
        </span>
      </div>
      <button
        onClick={onReset}
        className="absolute top-4 left-4 z-[400] bg-white hover:bg-gray-50 text-gray-800 font-bold py-1.5 px-3 rounded-lg shadow-md transition-all border border-gray-200/80 text-xs cursor-pointer active:scale-95"
      >
        Reset Map
      </button>

      <MapContainer
        center={[-6.9, 111.87]}
        zoom={11}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler origin={origin} setOrigin={setOrigin} setDestination={setDestination} />

        {origin && <Marker position={[origin.lat, origin.lng]} icon={breakdownIcon} />}
        {destination && <Marker position={[destination.lat, destination.lng]} icon={mechanicIcon} />}

        {path.length > 0 && <Polyline positions={path.map(p => [p.lat, p.lng] as [number, number])} color="#3b82f6" weight={5} opacity={0.7} />}
      </MapContainer>
    </div>
  );
}
