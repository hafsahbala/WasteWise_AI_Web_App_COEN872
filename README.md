# WasteWise AI

An integration-ready frontend prototype for **“An AI-Based Waste Hotspot Prediction and Collection Optimization System for Sustainable Municipal Waste Management in Nigeria.”**

WasteWise AI provides a responsible interface for future waste-record management, hotspot monitoring, demand forecasting, collection planning, and reporting. The current version is a frontend only: **it does not train AI models, connect to a backend, contain a dataset, or produce real predictions or operational results.**

## Implemented

- Responsive React and TypeScript application with seven routed pages.
- Overview dashboard with honest empty states and system-readiness status.
- OpenStreetMap navigation map with map controls and attribution; no hotspot markers appear without typed, real hotspot inputs.
- Waste-record form with required-field, quantity, and coordinate validation. Added records exist only in the current page session and disappear on refresh.
- Forecasting controls, route-planning settings, analytics views, and setup checklist.
- Explicit integration-required service errors when `VITE_API_BASE_URL` is unset.
- Typed interfaces for observations, hotspots, forecasts, vehicles, collection stops, optimized routes, and report outputs.

## Awaiting integration

- Verified waste observations and hotspot locations.
- A backend API and persistent record storage.
- Dataset-specific preprocessing and a trained/evaluated forecasting model.
- Road-network data and a route-optimization service.
- Real report data, evaluation metrics, and export files.

No sample waste records or fabricated charts, performance metrics, predictions, distances, or savings are included.

## Technology

- React 18, TypeScript, Vite, React Router
- Leaflet and React Leaflet with OpenStreetMap tiles
- Lucide React
- Responsive custom CSS

## Project structure

```text
src/
  services/       Typed API client and integration service boundaries
  types/          Waste, forecast, and routing contracts
  App.tsx         Routes, shared layout, and page workflows
  main.tsx        Application entry point
  styles.css      Responsive design system
index.html
.env.example
vite.config.ts
```

## Run locally

Install Node.js 20 or newer, then from the project directory:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Environment configuration

Copy `.env.example` to `.env` when a real backend is ready:

```env
VITE_API_BASE_URL=
```

The application starts without an API URL. Its services fail explicitly with an integration-required error instead of returning demo data. Do not put credentials or secrets in client-side environment variables.

## Testing the interface

- Visit each sidebar page and resize the browser to check the desktop and mobile layouts.
- Use the hotspot map search and severity controls; the map remains navigation-only until data is connected.
- Add an observation from **Waste records** to exercise form validation, filtering, and pagination. The record is clearly marked as session-only, is not persisted, and disappears on refresh.
- Try **Generate forecast** and **Optimize collection routes**. Both show an integration-required message and do not fabricate results.
- Review the reports empty states and the system setup checklist.
- Run `npm run build` for TypeScript checking and a production build.

## Future service integration

Service boundaries are in `src/services/`. The interfaces cover waste-observation and hotspot retrieval, forecasting requests, route optimization, and report retrieval. They explicitly reject calls until a real backend and its contract are implemented; no placeholder API endpoints are assumed. Keep forecasting and routing independent. Forecast responses can return timestamps, location identifiers, observed and predicted values, and optional uncertainty intervals; routing responses can return vehicles, ordered stops, distances, durations, capacity utilization, and objective metrics.

Model selection, evaluation, input validation, data provenance, and known limitations must be documented against the actual dataset. The current frontend does not train AI models and does not produce real predictions.
