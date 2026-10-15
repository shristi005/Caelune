import { useCallback, useEffect, useState } from 'react'
import {
  getSavedLocation,
  saveLocation as persist,
} from '../utils/storage'
import { searchPlaces } from '../utils/weather'

export function useLocation() {
  const [location, setLocation] = useState(() => getSavedLocation())
  const [status, setStatus] = useState(location ? 'ready' : 'idle')
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [searching, setSearching] = useState(false)

  const apply = useCallback((next) => {
    persist(next)
    setLocation(next)
    setStatus('ready')
    setError('')
    setSuggestions([])
  }, [])

  const requestGeo = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('manual')
      setError('Geolocation is not supported. Search for a city instead.')
      return
    }
    setStatus('locating')
    setError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        apply({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          label: 'Current location',
          source: 'geo',
        })
      },
      (err) => {
        setStatus('manual')
        if (err.code === 1) {
          setError('Location permission denied. Choose a city below.')
        } else {
          setError('Could not get your location. Choose a city below.')
        }
      },
      { timeout: 10000, maximumAge: 600000 },
    )
  }, [apply])

  useEffect(() => {
    if (!location) requestGeo()
  }, [location, requestGeo])

  const search = useCallback(async (query) => {
    const q = query.trim()
    if (q.length < 2) {
      setSuggestions([])
      return
    }
    setSearching(true)
    try {
      const results = await searchPlaces(q)
      setSuggestions(results)
    } catch {
      setSuggestions([])
      setError('Could not search places. Check your connection.')
    } finally {
      setSearching(false)
    }
  }, [])

  const choosePlace = useCallback(
    (place) => {
      apply({
        latitude: place.latitude,
        longitude: place.longitude,
        label: place.label,
        source: 'manual',
      })
    },
    [apply],
  )

  const changeLocation = useCallback(() => {
    setStatus('manual')
    setSuggestions([])
  }, [])

  return {
    location,
    status,
    error,
    suggestions,
    searching,
    requestGeo,
    search,
    choosePlace,
    changeLocation,
  }
}
