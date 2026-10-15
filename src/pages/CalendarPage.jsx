import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEntries } from '../hooks/useEntries'
import {
  daysInMonth,
  isFuture,
  monthLabel,
  startWeekday,
  toISO,
  todayISO,
} from '../utils/dates'
import { getMood } from '../utils/moods'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CalendarPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const { find } = useEntries()
  const navigate = useNavigate()
  const today = todayISO()

  const cells = useMemo(() => {
    const blanks = Array.from({ length: startWeekday(year, month) }, () => null)
    const days = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1)
    return [...blanks, ...days]
  }, [year, month])

  function prevMonth() {
    if (month === 0) {
      setYear((y) => y - 1)
      setMonth(11)
    } else setMonth((m) => m - 1)
  }

  function nextMonth() {
    if (month === 11) {
      setYear((y) => y + 1)
      setMonth(0)
    } else setMonth((m) => m + 1)
  }

  function openDay(iso) {
    if (isFuture(iso)) return
    if (iso === today && !find(iso)) {
      navigate('/')
      return
    }
    navigate(`/entry/${iso}`)
  }

  return (
    <section className="stack">
      <div className="card">
        <div className="cal-head">
          <button type="button" className="btn ghost icon-btn" onClick={prevMonth} aria-label="Previous month">
            ←
          </button>
          <h1>{monthLabel(year, month)}</h1>
          <button type="button" className="btn ghost icon-btn" onClick={nextMonth} aria-label="Next month">
            →
          </button>
        </div>
        <div className="cal-grid">
          {WEEKDAYS.map((d) => (
            <div key={d} className="cal-dow">
              {d}
            </div>
          ))}
          {cells.map((day, i) => {
            if (!day) return <div key={`b-${i}`} />
            const iso = toISO(year, month, day)
            const entry = find(iso)
            const mood = entry ? getMood(entry.mood) : null
            const future = isFuture(iso)
            return (
              <button
                key={iso}
                type="button"
                className={`cal-day ${iso === today ? 'is-today' : ''} ${entry ? 'has-entry' : ''} ${future ? 'is-future' : ''}`}
                disabled={future}
                onClick={() => openDay(iso)}
                aria-label={
                  entry
                    ? `${iso}, ${mood?.label ?? 'saved'}`
                    : future
                      ? `${iso}, upcoming`
                      : `${iso}`
                }
              >
                <span>{day}</span>
                {mood ? (
                  <span className="cal-dot" style={{ background: mood.color }} />
                ) : null}
              </button>
            )
          })}
        </div>
        <p className="muted cal-hint">
          Colored dots mark saved days. Tap one to reopen its memory.
        </p>
      </div>
    </section>
  )
}
