import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LocationPicker from '../components/LocationPicker'
import MoodSelector from '../components/MoodSelector'
import WeatherIcon from '../components/WeatherIcon'
import { useEntries } from '../hooks/useEntries'
import { useLocation } from '../hooks/useLocation'
import { useWeather } from '../hooks/useWeather'
import { formatLongDate, todayISO } from '../utils/dates'

export default function Home() {
  const date = todayISO()
  const navigate = useNavigate()
  const { find, save } = useEntries()
  const loc = useLocation()
  const { weather, status: weatherStatus, error: weatherError } = useWeather(
    loc.location,
    date,
  )
  const existing = find(date)

  const [mood, setMood] = useState(existing?.mood ?? '')
  const [memory, setMemory] = useState(existing?.memory ?? '')
  const [message, setMessage] = useState('')

  useEffect(() => {
    setMood(existing?.mood ?? '')
    setMemory(existing?.memory ?? '')
  }, [existing?.mood, existing?.memory])

  function handleSave(e) {
    e.preventDefault()
    setMessage('')
    if (!mood) {
      setMessage('Choose a mood for today.')
      return
    }
    if (!memory.trim()) {
      setMessage('Write a short memory before saving.')
      return
    }

    save({
      date,
      mood,
      memory: memory.trim(),
      weather: weather
        ? {
            temperature: weather.temperature,
            label: weather.label,
            icon: weather.icon,
            code: weather.code,
            place: weather.place,
          }
        : existing?.weather ?? null,
    })
    navigate(`/entry/${date}`)
  }

  return (
    <section className="stack">
      <div className="hero card">
        <p className="kicker">Today</p>
        <h1>{formatLongDate(date)}</h1>
        <LocationPicker {...loc} onChoose={loc.choosePlace} onGeo={loc.requestGeo} onSearch={loc.search} onChange={loc.changeLocation} />

        <div className="weather-panel">
          {weatherStatus === 'loading' && <p className="muted">Loading weather…</p>}
          {weatherStatus === 'error' && <p className="notice">{weatherError}</p>}
          {weather && (
            <div className="weather-row">
              <WeatherIcon type={weather.icon} />
              <div>
                <p className="temp">{weather.temperature}°</p>
                <p className="muted">{weather.label}</p>
              </div>
            </div>
          )}
          {weatherStatus === 'idle' && !loc.location && (
            <p className="muted">Weather appears once a location is set.</p>
          )}
        </div>
      </div>

      <form className="card stack" onSubmit={handleSave}>
        <div>
          <h2>How did today feel?</h2>
          <MoodSelector value={mood} onChange={setMood} />
        </div>
        <label className="field">
          <span>A short memory</span>
          <textarea
            value={memory}
            onChange={(e) => setMemory(e.target.value)}
            maxLength={400}
            rows={4}
            placeholder="One moment you want to keep…"
          />
          <small>{memory.length}/400</small>
        </label>
        {message ? <p className="notice">{message}</p> : null}
        {existing ? (
          <p className="muted">You already have an entry for today. Saving will update it.</p>
        ) : null}
        <button type="submit" className="btn primary">
          {existing ? 'Update today' : 'Save today'}
        </button>
      </form>
    </section>
  )
}
