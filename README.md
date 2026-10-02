# When Will I Get Paid? 💸

A modern, offline-first Progressive Web Application (PWA) that calculates exactly when your next paycheck will arrive based on your browser's current date and time, with smart working day and weekend adjustments.

Built without any backend, designed for seamless hosting on **Cloudflare Pages**, and stores all user preferences securely on device using **IndexedDB**.

---

## ✨ Features

- **Smart Payday Calculator**:
  - Automatically calculates the next payday from the browser's current date and time.
  - Accommodates months with varying lengths (28, 29, 30, 31 days).
  - Handles non-working days / weekends with customizable rules:
    - **Next working day (Default / Recommended)**: If payday falls on a Saturday or Sunday, moves forward to Monday.
    - **Previous working day**: Moves back to Friday.
    - **Exact calendar day**: Keeps the calendar date regardless of weekends.
- **Dynamic Countdown Displays**:
  - **Days format**: Direct count of days remaining (e.g. *"25 days until payday!"* / *"25 jours avant de recevoir sa paie !"*).
  - **Weeks + Days format**: E.g. *"3 weeks and 4 days until payday!"*.
  - **Live Chronometer**: Live ticking days, hours, minutes, and seconds.
- **Pay Cycle Progress**:
  - Realtime visual progress bar tracking the percentage of the monthly pay cycle completed between the previous payday and the next payday.
- **Upcoming Paydays Schedule**:
  - Preview of the next 4 upcoming paydays with day of the week and weekend shift badges.
- **Payday Celebration Mode**:
  - Automatic confetti explosion and celebratory hero banner when visiting on payday!
- **Multilingual Support (6 Languages)**:
  - 🇫🇷 Français
  - 🇬🇧 English (UK)
  - 🇩🇪 Deutsch
  - 🇮🇹 Italiano
  - 🇵🇹 Português
  - 🇳🇱 Nederlands
  - Automatic detection of the browser's preferred language on first launch, with persistent storage in IndexedDB.
- **Progressive Web App (PWA)**:
  - Responsive design across desktop, tablet, and mobile screens.
  - Installable to home screen / desktop with custom high-resolution icons (192x192, 512x512, SVG favicon, and Apple Touch Icon).
  - Works 100% offline via Service Worker precaching.
- **Zero Backend / Privacy First**:
  - All data is saved on the client device using IndexedDB (with `localStorage` fallback). No user tracking, no backend servers.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Storage**: [IndexedDB via idb-keyval](https://github.com/jakearchibald/idb-keyval)
- **PWA**: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- **Testing**: [Vitest](https://vitest.dev/)
- **Celebrations**: [canvas-confetti](https://github.com/catdad/canvas-confetti)
- **Linter**: [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v9+)

### Installation

```bash
# Clone the repository
git clone https://github.com/Louis3797/when-will-I-get-paid.git
cd when-will-I-get-paid

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Production Build

```bash
npm run build
```

The static output will be generated inside the `dist/` directory. You can preview the production build locally with:

```bash
npm run preview
```

---

## ☁️ Deployment on Cloudflare Pages

This application is ready for direct deployment on Cloudflare Pages:

1. **Connect Repository**: Link this repository in the [Cloudflare Pages Dashboard](https://dash.cloudflare.com/).
2. **Build Settings**:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: `20` or higher (configured via environment variable `NODE_VERSION=20` if needed)
3. **SPA & Caching Rules**:
   - Cloudflare Pages will automatically pick up `public/_redirects` (`/* /index.html 200`) for single-page routing.
   - Security headers and cache policies are defined in `public/_headers`.

---

## 📱 PWA & Offline Support

- Manifest file: `dist/manifest.webmanifest`
- Service Worker: `dist/sw.js` (managed by Workbox)
- The app can be installed directly from Chromium browsers (Chrome, Edge, Brave), Safari iOS ("Add to Home Screen"), and Android.

---

## 📄 License

MIT
