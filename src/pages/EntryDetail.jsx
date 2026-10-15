import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import MoodSelector from '../components/MoodSelector'
import WeatherIcon from '../components/WeatherIcon'
import { useEntries } from '../hooks/useEntries'
import { formatLongDate, isFuture } from '../utils/dates'
import { getMood } from '../utils/moods'

export default function EntryDetail() {
  const { date } = useParams()
  const navigate = useNavigate()
  const { find, save, removeEntry } = useEntries()
  const entry = find(date)
  const [editing, setEditing] = useState(false)
  const [mood, setMood] = useState(entry?.mood ?? '')
  const [memory, setMemory] = useState(entry?.memory ?? '')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setMood(entry?.mood ?? '')
    setMemory(entry?.memory ?? '')
    setEditing(false)
  }, [entry?.mood, entry?.memory, date])

  if (!date || isFuture(date)) {
    return (
      <div className="card empty">
        <p>That date is not available.</p>
        <Link to="/calendar" className="btn ghost">
          Back to calendar
        </Link>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="card empty">
        <h1>{formatLongDate(date)}</h1>
        <p>No memory was saved for this day.</p>
        <Link to="/" className="btn primary">
          Go to today
        </Link>
      </div>
    )
  }

  const moodMeta = getMood(entry.mood)

  function handleUpdate(e) {
    e.preventDefault()
    if (!mood || !memory.trim()) {
      setMessage('Mood and memory are both needed.')
      return
    }
    save({
      ...entry,
      mood,
      memory: memory.trim(),
    })
    setEditing(false)
    setMessage('')
  }

  function handleDelete() {
    removeEntry(date)
    setConfirmOpen(false)
    navigate('/memories')
  }

  return (
    <section className="stack">
      <article className="card stack">
        <p className="kicker">{moodMeta?.label}</p>
        <h1>{formatLongDate(date)}</h1>
        {entry.weather ? (
          <div className="weather-row">
            <WeatherIcon type={entry.weather.icon} />
            <div>
              <p className="temp">{entry.weather.temperature}°</p>
              <p className="muted">
                {entry.weather.label}
                {entry.weather.place ? ` · ${entry.weather.place}` : ''}
              </p>
            </div>
          </div>
        ) : (
          <p className="muted">No weather was stored for this day.</p>
        )}

        {editing ? (
          <form className="stack" onSubmit={handleUpdate}>
            <MoodSelector value={mood} onChange={setMood} />
            <label className="field">
              <span>Memory</span>
              <textarea
                value={memory}
                onChange={(e) => setMemory(e.target.value)}
                rows={5}
                maxLength={400}
              />
            </label>
            {message ? <p className="notice">{message}</p> : null}
            <div className="row-actions">
              <button type="button" className="btn ghost" onClick={() => setEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="btn primary">
                Save changes
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="memory-body">{entry.memory}</p>
            <div className="row-actions">
              <button type="button" className="btn ghost" onClick={() => setEditing(true)}>
                Edit
              </button>
              <button type="button" className="btn danger" onClick={() => setConfirmOpen(true)}>
                Delete
              </button>
            </div>
          </>
        )}
      </article>

      <Link to="/calendar" className="text-link">
        ← Calendar
      </Link>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this day?"
        message="This memory will be removed from this device. You cannot undo this."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </section>
  )
}
