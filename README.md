# GolekBengkel Frontend

Antarmuka pengguna berbasis web (Web GIS) untuk sistem pencarian rute bengkel optimal di Kabupaten Tuban. Aplikasi ini dirancang untuk memvisualisasikan rute topografi-aware yang dihitung oleh backend, dengan fokus pada pengalaman pengguna yang imersif dan modern.

## Fitur Utama

- **Interactive Web GIS** — Peta interaktif menggunakan Leaflet.js dengan kemampuan pemilihan titik asal (origin) dan tujuan (destination) secara langsung via klik.
- **Dual Route Mode** — Dua mode pencarian rute: *Rute Tercepat* (optimasi waktu) dan *Rute Terpendek* (optimasi jarak).
- **Multiple Velocity Models** — Pilihan model kecepatan untuk mode rute tercepat: GLM (Wood et al., 2023), Tobler's Hiking Function, dan Naismith's Hiking Rule.
- **Slope Multiplier Control** — Slider parameter pengali lereng ($\lambda$) yang memungkinkan pengguna menyesuaikan tingkat penalti tanjakan secara real-time.
- **Ignore Downhill Option** — Opsi untuk mengabaikan efek downhill (turunan) dalam perhitungan rute.
- **Topographical Insights** — Visualisasi ringkasan rute yang mencakup total jarak (KM), waktu tempuh, serta karakteristik lereng rinci (kemiringan rata-rata/maksimum, rasio tanjakan/turunan/datar).
- **Modern Immersive UI** — Desain antarmuka menggunakan prinsip *Glassmorphism* dengan palet warna pastel untuk memberikan kesan profesional dan modern.
- **Persistent State** — Penyimpanan preferensi pengguna (seperti status lipatan sidebar) menggunakan `localStorage` untuk konsistensi pengalaman antar sesi.

## Arsitektur Desain

Aplikasi ini mengadopsi pendekatan **Immersive Map Layout**, di mana peta bukan sekadar elemen latar belakang, melainkan pusat interaksi utama. Komponen UI lainnya (Sidebar, Header, Footer) dirancang sebagai elemen melayang (*floating elements*) dengan efek *backdrop blur* untuk menjaga fokus pengguna pada data spasial.

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Mapping**: React Leaflet & Leaflet.js
- **State Management**: React Hooks (useState, useEffect)
- **API Fetching**: Native Fetch API (berkomunikasi dengan Flask Backend)

## Instalasi & Penggunaan

### Prasyarat

- Node.js 20+
- Backend GolekBengkel yang sudah berjalan (default di `http://127.0.0.1:5000`)

### Langkah-langkah

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Aplikasi akan tersedia di [http://localhost:3000](http://localhost:3000).
> **Note**: Pastikan backend berjalan di `http://127.0.0.1:5000` sebelum menggunakan fitur pencarian rute.

## Integrasi Backend

Frontend ini terintegrasi dengan **GolekBengkel Backend API** (`http://127.0.0.1:5000/api`) melalui endpoint berikut:

- `POST /api/route` — Menghitung rute optimal berdasarkan parameter berikut:
  - `start`, `end`: Koordinat `[lat, lon]`
  - `mode`: `'time'` (tercepat) atau `'distance'` (terpendek)
  - `model`: `'glm'`, `'tobler'`, atau `'naismith'` (hanya untuk mode time)
  - `ignore_downhill`: Abaikan efek downhill dalam perhitungan
  - `slope_multiplier`: Pengali penalti lereng

Response mencakup path koordinat, jarak tempuh (meter), waktu perjalanan, gain elevasi, serta karakteristik lereng rinci (kemiringan rata-rata/maksimum, panjang tanjakan/turunan/datar beserta rasionya).

## Struktur Proyek

```
├── app/
│   ├── layout.tsx          # Root layout & font configuration
│   ├── page.tsx            # Main page logic, state management & UI structure
│   └── globals.css         # Global styles & design system (Tailwind 4)
├── components/
│   ├── MapComponent.tsx    # Leaflet integration & event handlers
│   └── Sidebar.tsx         # Floating control panel with route mode, velocity model & slope settings
├── lib/
│   ├── api.ts              # API client, fetch logic & response mapping
│   └── types.ts            # TypeScript interfaces (Coordinate, RouteMode, VelocityModel, RouteData, SlopeCharacteristics)
├── public/                 # Static assets
├── next.config.ts          # Next.js configuration
└── tsconfig.json           # TypeScript configuration
```

---