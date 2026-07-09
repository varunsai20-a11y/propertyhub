# 🏠 PropertyHub

> **Transparency and Speed** — A modern rental property discovery platform for Bangalore.

PropertyHub helps renters find their next home without broker fees, hidden costs, or information asymmetry. Every listing shows real price history, a walkability score, neighborhood quotes from owners, and an interactive map — all in one place.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗺️ **Interactive Map** | Leaflet/OpenStreetMap map with price markers on listings and embedded pin on detail pages |
| 📊 **Price Trend Chart** | 6-month price history per property vs locality average |
| 🚶 **Walk Score** | Grocery, metro, and hospital proximity scores for every listing |
| 🏘️ **Co-Living Match** | PG listings show current occupant profiles for better roommate matching |
| 🔔 **Smart Alerts** | Save a property and view it 3× to get notified if the price drops |
| 📅 **Book a Visit** | Authenticated users can submit visit requests with date and contact info |
| 📞 **Contact Owner** | Reveals owner phone, email, and a pre-filled WhatsApp message link |
| 🔍 **Filters** | Filter by type, budget, furnishing, availability, amenities, and locality |
| 🔐 **Auth** | Email/password registration + mock Google sign-in, persisted in localStorage |
| 📋 **Dashboard** | Personal shortlist with price-drop alerts and recently viewed properties |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS v3 |
| **Routing** | React Router v6 |
| **State** | Zustand |
| **Maps** | Leaflet + React Leaflet |
| **Charts** | Recharts |
| **Package Manager** | pixi (workspace) + npm (Node deps) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- pixi (optional, for task runner)

### Install & Run

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/propertyhub.git
cd propertyhub

# Install Node dependencies
npm install

# Start the development server
npm run dev
```

App will be available at **http://localhost:5173** (or next available port).

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Production build (TypeScript check + Vite bundle) |
| `npm run preview` | Preview the production build locally |

### Pixi Tasks

```bash
pixi run dev      # Start dev server
pixi run build    # Build for production
pixi run push     # Commit and push to GitHub
```

---

## 📁 Project Structure

```
propertyhub/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── pixi.toml                  # Pixi workspace & task definitions
├── src/
│   ├── main.tsx               # App entry point
│   ├── App.tsx                # Router + global modals
│   ├── index.css              # Tailwind base + custom design tokens
│   ├── types/index.ts         # Shared TypeScript types
│   ├── data/properties.json   # 58 mock property listings (Bangalore)
│   ├── api/propertiesApi.ts   # Data access layer
│   ├── store/
│   │   ├── authStore.ts       # Zustand: auth, login, register
│   │   └── shortlistStore.ts  # Zustand: saved properties, alerts
│   ├── lib/format.ts          # INR formatter, timeAgo helpers
│   ├── components/            # Reusable UI components
│   └── pages/                 # Route-level page components
└── dist/                      # Production build output (git-ignored)
```

---

## 🗺️ Areas Covered

PropertyHub lists properties across **11 Bangalore localities**:

Indiranagar · Koramangala · Whitefield · HSR Layout · Jayanagar · JP Nagar · Electronic City · Marathahalli · BTM Layout · Bellandur · MG Road

Each area has listings spanning the **full price spectrum**:

| Type | Price Range |
|---|---|
| PG | ₹7,000 – ₹18,000 / month |
| 1RK | ₹9,000 – ₹16,000 / month |
| 1BHK | ₹14,000 – ₹22,000 / month |
| 2BHK | ₹22,000 – ₹55,000 / month |
| 3BHK | ₹38,000 – ₹95,000 / month |
| 4BHK / Villa | ₹1,20,000 / month |

---

## 🔐 Demo Credentials

This is a frontend-only demo. Register any email/password or use the **"Continue with Google"** mock button.

> No real backend — all data lives in `localStorage` and `src/data/properties.json`.

---

## 📦 Deployment

The `dist/` folder can be deployed to any static host:
- **Vercel** — `vercel --prod`
- **Netlify** — drag and drop `dist/`
- **GitHub Pages** — push `dist/` to `gh-pages` branch

---

## 📄 License

MIT © Varun — built with React, Vite, Leaflet, and Tailwind CSS.
