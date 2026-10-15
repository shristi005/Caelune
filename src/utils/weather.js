const WMO = {
  0: { label: 'Clear sky', icon: 'sun' },
  1: { label: 'Mostly clear', icon: 'sun' },
  2: { label: 'Partly cloudy', icon: 'partly' },
  3: { label: 'Overcast', icon: 'cloud' },
  45: { label: 'Fog', icon: 'fog' },
  48: { label: 'Rime fog', icon: 'fog' },
  51: { label: 'Light drizzle', icon: 'drizzle' },
  53: { label: 'Drizzle', icon: 'drizzle' },
  55: { label: 'Heavy drizzle', icon: 'rain' },
  56: { label: 'Freezing drizzle', icon: 'drizzle' },
  57: { label: 'Freezing drizzle', icon: 'drizzle' },
  61: { label: 'Light rain', icon: 'rain' },
  63: { label: 'Rain', icon: 'rain' },
  65: { label: 'Heavy rain', icon: 'rain' },
  66: { label: 'Freezing rain', icon: 'rain' },
  67: { label: 'Freezing rain', icon: 'rain' },
  71: { label: 'Light snow', icon: 'snow' },
  73: { label: 'Snow', icon: 'snow' },
  75: { label: 'Heavy snow', icon: 'snow' },
  77: { label: 'Snow grains', icon: 'snow' },
  80: { label: 'Rain showers', icon: 'rain' },
  81: { label: 'Rain showers', icon: 'rain' },
  82: { label: 'Violent showers', icon: 'rain' },
  85: { label: 'Snow showers', icon: 'snow' },
  86: { label: 'Snow showers', icon: 'snow' },
  95: { label: 'Thunderstorm', icon: 'storm' },
  96: { label: 'Thunderstorm', icon: 'storm' },
  99: { label: 'Thunderstorm', icon: 'storm' },
}

export function describeWeather(code) {
  return WMO[code] ?? { label: 'Unknown', icon: 'cloud' }
}

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Weather request failed')
  return res.json()
}

export async function fetchCurrentWeather(lat, lon) {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(lat))
  url.searchParams.set('longitude', String(lon))
  url.searchParams.set('current', 'temperature_2m,weather_code')
  url.searchParams.set('timezone', 'auto')
  const data = await fetchJson(url)
  const current = data.current
  if (!current) throw new Error('No current weather')
  const info = describeWeather(current.weather_code)
  return {
    temperature: Math.round(current.temperature_2m),
    code: current.weather_code,
    label: info.label,
    icon: info.icon,
    source: 'current',
  }
}

export async function fetchHistoricalWeather(lat, lon, date) {
  const url = new URL('https://archive-api.open-meteo.com/v1/archive')
  url.searchParams.set('latitude', String(lat))
  url.searchParams.set('longitude', String(lon))
  url.searchParams.set('start_date', date)
  url.searchParams.set('end_date', date)
  url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_mean')
  url.searchParams.set('timezone', 'auto')
  const data = await fetchJson(url)
  const daily = data.daily
  if (!daily?.time?.length) throw new Error('No historical weather')
  const code = daily.weather_code[0]
  const temp =
    daily.temperature_2m_mean?.[0] ?? daily.temperature_2m_max?.[0]
  const info = describeWeather(code)
  return {
    temperature: Math.round(temp),
    code,
    label: info.label,
    icon: info.icon,
    source: 'historical',
  }
}

export async function searchPlaces(query) {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search')
  url.searchParams.set('name', query)
  url.searchParams.set('count', '6')
  url.searchParams.set('language', 'en')
  url.searchParams.set('format', 'json')
  const data = await fetchJson(url)
  return (data.results ?? []).map((r) => ({
    name: r.name,
    country: r.country,
    admin: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
    label: [r.name, r.admin1, r.country].filter(Boolean).join(', '),
  }))
}
