import { useEffect, useState } from 'react'
import { todayISO } from '../utils/dates'
import {
  fetchCurrentWeather,
  fetchHistoricalWeather,
} from '../utils/weather'

export function useWeather(location, date) {
  const [weather, setWeather] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!location) {
      setWeather(null)
      setStatus('idle')
      return
    }

    let cancelled = false
    const load = async () => {
      setStatus('loading')
      setError('')
      try {
        const isToday = date === todayISO()
        const data = isToday
          ? await fetchCurrentWeather(location.latitude, location.longitude)
          : await fetchHistoricalWeather(
              location.latitude,
              location.longitude,
              date,
            )
        if (!cancelled) {
          setWeather({
            ...data,
            place: location.label,
          })
          setStatus('ready')
        }
      } catch {
        if (!cancelled) {
          setWeather(null)
          setStatus('error')
          setError(
            navigator.onLine === false
              ? 'You appear to be offline. Weather will load when you reconnect.'
              : 'Weather could not be loaded right now.',
          )
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [location, date])

  return { weather, status, error }
}
