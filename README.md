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

## API Key & Live Mode

The DeepSeek key is kept **server-side** so it is never exposed in the browser
bundle. The frontend calls a same-origin serverless proxy at `api/chat.js`,
which attaches the key and forwards the request to DeepSeek.

**Deployed (Vercel):** set `DEEPSEEK_API_KEY` in the project's environment
variables. The app auto-detects it and switches to **Live Mode**. Get a free
key at https://platform.deepseek.com

**Local:** plain `npm run dev` (Vite) does not run the serverless function, so
the app stays in **Demo Mode** with pre-written responses — no key needed. To
run live mode locally, use the Vercel CLI, which serves the function too:

```bash
npm i -g vercel
echo "DEEPSEEK_API_KEY=your-key" > .env
vercel dev
```

Without a configured key, the app runs in **Demo Mode**: it makes no network
calls, and questions about a specific vehicle are answered from the fleet data.

## Features

- AI chat agent (LMSC) powered by DeepSeek — answers routing, battery, and sustainability questions
- Fleet status table with live battery indicators
- Route energy consumption chart (Recharts)
- Fleet battery state chart with dispatch threshold reference lines
- Zone congestion panel with severity indicators and AVOID alerts
- KPI cards: avg fleet battery, CO₂ saved, on-time rate, renewable charge share
- Fully responsive (desktop + mobile)
- Fallback demo mode — works with no API key
- Serverless proxy keeps the API key off the client

## Tech Stack

React 18 · Vite · Tailwind CSS · Recharts · Lucide React · DeepSeek API · Vercel serverless functions
