# Last-Mile Sustainability Coach (LMSC)

AI-powered EV fleet operations dashboard for urban last-mile delivery optimisation.

**Live demo:** https://lmsc-deepseek.vercel.app

## Quick Start

```bash
npm install
npm run dev
```

App runs at http://localhost:3000

## Production Build

```bash
npm run build       # compile to dist/
npm run preview     # serve the built dist/ locally
```

## API Key (Optional)

For live AI responses, create a `.env` file:

```
VITE_DEEPSEEK_API_KEY=your-deepseek-key-here
```

Get a free key at https://platform.deepseek.com

Without an API key, the app runs in **Demo Mode** with pre-written expert responses.

## Features

- AI chat agent (LMSC) powered by DeepSeek — answers routing, battery, and sustainability questions
- Fleet status table with live battery indicators
- Route energy consumption chart (Recharts)
- Fleet battery state chart with dispatch threshold reference lines
- Zone congestion panel with severity indicators and AVOID alerts
- KPI cards: avg fleet battery, CO₂ saved, on-time rate, renewable charge share
- Fully responsive (desktop + mobile)
- Fallback demo mode — works with no API key

## Tech Stack

React 18 · Vite · Tailwind CSS · Recharts · Lucide React · DeepSeek API
