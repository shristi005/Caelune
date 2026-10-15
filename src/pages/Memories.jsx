import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import WeatherIcon from '../components/WeatherIcon'
import { useEntries } from '../hooks/useEntries'
import { formatShortDate } from '../utils/dates'
import { getMood, MOODS } from '../utils/moods'

export default function Memories() {
  const { entries } = useEntries()
  const [query, setQuery] = useState('')
  const [mood, setMood] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return entries.filter((e) => {
      if (mood !== 'all' && e.mood !== mood) return false
      if (!q) return true
      const hay = `${e.memory} ${e.weather?.label ?? ''} ${e.weather?.place ?? ''}`.toLowerCase()
      return hay.includes(q)
    })
  }, [entries, query, mood])

  return (
    <section className="stack">
      <div className="card stack">
        <h1>Memories</h1>
        <label className="field">
          <span>Search</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by words, weather, or place"
          />
        </label>
        <div className="filter-row">
          <button
            type="button"
            className={`chip ${mood === 'all' ? 'is-active' : ''}`}
            onClick={() => setMood('all')}
          >
            All
          </button>
          {MOODS.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`chip ${mood === m.id ? 'is-active' : ''}`}
              onClick={() => setMood(m.id)}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card empty">
          <p>No memories match yet.</p>
          <Link to="/" className="btn primary">
            Write today
          </Link>
        </div>
      ) : (
        <ul className="memory-list">
          {filtered.map((entry) => {
            const moodMeta = getMood(entry.mood)
            return (
              <li key={entry.date}>
                <Link to={`/entry/${entry.date}`} className="memory-card card">
                  <div className="memory-meta">
                    <strong>{formatShortDate(entry.date)}</strong>
                    <span className="pill" style={{ '--mood': moodMeta?.color }}>
                      {moodMeta?.emoji} {moodMeta?.label}
                    </span>
                  </div>
                  <p>{entry.memory}</p>
                  {entry.weather ? (
                    <div className="memory-weather">
                      <WeatherIcon type={entry.weather.icon} size={28} />
                      <span>
                        {entry.weather.temperature}° · {entry.weather.label}
                      </span>
                    </div>
                  ) : (
                    <p className="muted">Weather was unavailable when this was saved.</p>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
