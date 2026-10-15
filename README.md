# Caelune

Remember what a day felt like — a personal diary of mood, memory, and weather.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Notes

- Weather comes from the public [Open-Meteo](https://open-meteo.com/) APIs. No API key is required.
- Entries are stored in your browser with `localStorage`.
- Location uses the browser geolocation prompt, with a city search fallback.
