# القرآن الكريم — Quran PWA

A fully offline-capable, production-ready Quran Progressive Web Application with audio recitation, full-text search, bookmarking, and surah downloads. Built with React 19, Vite, Tailwind CSS 4, and the [AlQuran.cloud](https://alquran.cloud) API.

## Features

### 📖 Reading
- All 114 surahs with Arabic (Uthmani) text
- Ayah-by-ayah display with configurable **font** (6 Arabic fonts) and **font size** (5 levels)
- Surah details page with header info (name, English name, revelation type, ayah count)
- **Last-read position** auto-scroll and highlight

### 🔊 Audio Recitation
- **Full-surah streaming** from Islamic Network CDN
- Global mini-player with play/pause/stop, progress bar, seek, volume control, mute
- **Repeat modes**: normal, repeat ayah, repeat surah, repeat all
- Next/previous surah navigation
- Audio powered by native `<audio>` element (no CORS issues for playback)

### 🔍 Search
- **Full Quran text search** — searches Arabic ayah text, surah names, and surah numbers
- Debounced input (300ms) for smooth UX
- Results cached in IndexedDB (1-hour TTL)
- Highlights matching text in results
- Navigate directly to any ayah from search results

### 📑 Bookmarks
- Bookmark any ayah with one click
- All bookmarks stored in `localStorage`
- Full CRUD: add, remove, clear all
- Navigate to bookmarked ayah directly
- Truncated ayah preview (3 lines) in bookmark list

### 📥 Offline Downloads
- Download full surahs as MP3 for offline listening
- **3 CORS proxy fallbacks** — tries direct fetch first, then falls back through proxy chain
- Streaming download with **progress tracking** and pause/resume/cancel
- Batch download support (max 3 concurrent)
- Blob storage in IndexedDB
- Manage all downloads: view status, delete individual, clear all
- Storage usage summary (count + total MB)

### 📂 Navigation
- **Juz' list** (30 ajzaa) with Arabic names and links to first surah
- **Hizb list** (60 ahzab) with links to first surah
- Previous/next surah navigation on detail pages

### 🎨 Themes
- **Dark mode** (default) — slate/teal palette
- **Mushaf Arabesque Light mode** — warm parchment background, golden-brown accents, inspired by classical Quran manuscripts
- Toggle via navbar button (sun/moon icon) or Settings page
- Setting persists in `localStorage`

### ⚙️ Settings
- Theme switch (dark/light)
- 6 Arabic fonts: Amiri, Scheherazade New, Noto Naskh Arabic, Lateef, Reem Kufi, Traditional Arabic
- 5 font sizes
- Storage info (downloaded count + total size)

### 📱 PWA
- **Installable** — add to home screen (Android/iOS/Desktop)
- **Offline support** — API responses cached via service worker (NetworkFirst), audio cached via CacheFirst
- Service worker auto-registered with `vite-plugin-pwa`
- 8 SVG icons (72px–512px) for all device sizes
- Standalone mode with `#0F766E` theme color

### UI/UX
- **Glassmorphism** design (backdrop-blur, semi-transparent backgrounds)
- **RTL** layout optimized for Arabic
- **Mobile-first** responsive design
- Toast notification system (success/error/warning/info)
- Loading spinners, 404 page
- Smooth animations and transitions
- Custom scrollbars
- Accessible (`aria-label`, `role` attributes)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| HTTP | Axios |
| Icons | React Icons (Font Awesome) |
| Storage | localStorage + IndexedDB |
| PWA | vite-plugin-pwa (Workbox) |
| Audio | Native `<audio>` API |
| Linting | ESLint 10 |
| Fonts | Google Fonts (Amiri, Scheherazade New, Noto Naskh Arabic, Lateef, Reem Kufi) |

## Project Structure

```
src/
├── api/              # AlQuran.cloud API functions
│   └── quranApi.js
├── components/       # Reusable UI components
│   ├── AudioPlayer.jsx       # Global audio mini-player
│   ├── AyahCard.jsx          # Single ayah display
│   ├── BookmarkButton.jsx    # Bookmark toggle
│   ├── DownloadButton.jsx    # Download state button
│   ├── DownloadManager.jsx   # Downloaded surahs list
│   ├── Footer.jsx
│   ├── InstallPWAButton.jsx  # PWA install prompt
│   ├── LoadingSpinner.jsx
│   ├── Navbar.jsx            # Top nav + theme toggle
│   ├── SearchBar.jsx         # Home page search
│   ├── SearchInput.jsx       # Search page input
│   ├── SearchResults.jsx     # Search results list
│   ├── SurahCard.jsx         # Surah link card
│   ├── ThemeToggle.jsx       # Standalone theme toggle
│   └── Toast.jsx             # Toast notification system
├── context/          # React context providers
│   ├── AudioContext.jsx      # Global audio state
│   ├── BookmarkContext.jsx
│   ├── QuranContext.jsx      # Surah data state
│   └── ThemeContext.jsx      # Theme/settings state
├── hooks/            # Custom React hooks
│   ├── useAudioPlayer.js
│   ├── useBookmarks.js
│   ├── useLocalStorage.js
│   └── useSearch.js
├── layouts/
│   └── MainLayout.jsx        # Shell layout (Navbar + Outlet + AudioPlayer)
├── pages/            # Route pages
│   ├── Bookmarks.jsx
│   ├── Downloads.jsx
│   ├── HizbList.jsx
│   ├── Home.jsx
│   ├── JuzList.jsx
│   ├── NotFound.jsx
│   ├── Search.jsx
│   ├── Settings.jsx
│   └── SurahDetails.jsx
├── routes/
│   └── AppRoutes.jsx         # Lazy-loaded route definitions
├── services/         # Core service modules
│   ├── audioService.js       # Low-level audio API
│   ├── downloadManager.js    # Download queue + CORS proxy
│   └── indexedDB.js          # IndexedDB wrapper
├── utils/
│   ├── constants.js          # App-wide constants
│   └── helpers.js            # Utility functions
├── App.jsx           # Root component (provider hierarchy)
├── index.css         # Global styles + themes
└── main.jsx          # Entry point
```

## API

Data is fetched from [AlQuran.cloud API](https://alquran.cloud/api) v1:

| Endpoint | Usage |
|----------|-------|
| `/surah` | List all surahs |
| `/surah/{id}` | Single surah with ayahs |
| `/surah/{id}/{edition}` | Surah audio metadata |
| `/juz` | List all juz |
| `/juz/{id}` | Single juz with ayahs |
| `/hizb` | List all hizb |
| `/hizb/{id}` | Single hizb with ayahs |
| `/ayah/{surah}:{ayah}` | Single ayah |
| `/quran/quran-uthmani` | Full Quran (Uthmani) text |
| `/search/{query}/all/{language}` | Full-text search |

### Audio CDN

Full surah MP3s served from a custom WebDAV CDN:

```
https://khorasan.mamluk.net/public.php/dav/files/{token}/audio-surah/128/{reciter}/{surah}.mp3
```

**Note on CORS:** The CDN does not send `Access-Control-Allow-Origin` headers. The `<audio>` element plays files without CORS, but direct `fetch()` downloads fail. The download manager automatically falls back through a chain of CORS proxy services.

## Getting Started

### Prerequisites
- Node.js ≥ 18

### Install & Run

```bash
npm install
npm run dev        # Development server at http://localhost:5173
```

### Build for Production

```bash
npm run build       # Outputs to dist/ with PWA service worker
npm run preview     # Preview production build locally
```

### Lint

```bash
npm run lint        # ESLint check
```

## PWA Deployment

The production build generates:
- `dist/` — static assets
- `dist/sw.js` — service worker (35 precached entries)
- `dist/manifest.webmanifest` — web app manifest

Deploy `dist/` to any static hosting (Vercel, Netlify, Cloudflare Pages, GitHub Pages, etc.).

### Service Worker Caching Strategy

| Pattern | Strategy | Cache | TTL |
|---------|----------|-------|-----|
| `api.alquran.cloud/v1/` | NetworkFirst | `quran-api-cache` | 30 days |
| `cdn.islamic.network/` | CacheFirst | `quran-audio-cache` | 365 days |

## Offline Audio Downloads

The download manager (`src/services/downloadManager.js`) is a singleton class handling:

1. **Direct fetch** — tries the CDN URL directly
2. **CORS proxy fallback** — on CORS error, cycles through:
   - `corsproxy.io/?`
   - `api.allorigins.win/raw?url=`
   - `corsproxy.deno.dev/`
3. **Streaming** — uses `ReadableStream` for progress tracking
4. **Storage** — saves MP3 blobs in IndexedDB (`quran-offline` db, version 2)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for personal and educational use. The Quran text and audio are provided by [AlQuran.cloud](https://alquran.cloud) and [Every Ayah](https://everyayah.com). Audio CDN hosted by Khorasan Mamluk.

---

**القرآن الكريم** — Read, listen, and cherish the Holy Quran.
