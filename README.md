# GolekBengkel Frontend

Antarmuka pengguna berbasis web (Web GIS) untuk sistem pencarian rute bengkel optimal di Kabupaten Tuban. Aplikasi ini dirancang untuk memvisualisasikan rute topografi-aware yang dihitung oleh backend, dengan fokus pada pengalaman pengguna yang imersif dan modern.

## Fitur Utama

- **Interactive Web GIS** — Peta interaktif menggunakan Leaflet.js dengan kemampuan pemilihan titik asal (origin) dan tujuan (destination) secara langsung via klik.
- **Dynamic Lambda Control** — Slider parameter $\lambda$ (uphill penalty) yang memungkinkan pengguna menyesuaikan tingkat "darurat" atau kesulitan jalan secara real-time.
- **Topographical Insights** — Visualisasi ringkasan rute yang mencakup total jarak horizontal (KM) dan akumulasi elevasi tanjakan (meter).
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
- Backend GolekBengkel yang sudah berjalan (default di `http://localhost:3000`)

### Langkah-langkah

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Aplikasi akan tersedia di [http://localhost:3000](http://localhost:3000).

## Integrasi Backend

Frontend ini terintegrasi dengan **GolekBengkel Backend API** melalui endpoint berikut:

- `POST /api/route`: Mengirimkan koordinat `[lat, lon]` dan nilai `lambda` untuk mendapatkan path graf.
- `GET /api/graph-info`: (Optional) Menampilkan statistik graf pada antarmuka.

Data rute diproses dari koordinat mentah backend menjadi komponen `<Polyline />` Leaflet dengan penyesuaian sumbu koordinat yang akurat.

## Struktur Proyek

```
├── app/
│   ├── layout.tsx          # Root layout & font configuration
│   ├── page.tsx            # Main page logic & UI structure
│   └── globals.css         # Global styles & design system (Tailwind 4)
├── components/
│   ├── MapComponent.tsx    # Leaflet integration & event handlers
│   └── Sidebar.tsx         # Floating control panel & lambda slider
├── lib/
│   ├── api.ts              # API client & fetch logic
│   └── types.ts            # TypeScript interfaces & types
├── public/                 # Static assets
├── tailwind.config.ts      # Tailwind configuration
└── tsconfig.json           # TypeScript configuration
```

---