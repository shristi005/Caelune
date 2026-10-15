import { MOODS } from '../utils/moods'

export default function MoodSelector({ value, onChange }) {
  return (
    <div className="mood-grid" role="radiogroup" aria-label="Mood">
      {MOODS.map((mood) => (
        <button
          key={mood.id}
          type="button"
          role="radio"
          aria-checked={value === mood.id}
          className={`mood-chip ${value === mood.id ? 'is-active' : ''}`}
          style={{ '--mood': mood.color }}
          onClick={() => onChange(mood.id)}
        >
          <span className="mood-emoji" aria-hidden>
            {mood.emoji}
          </span>
          {mood.label}
        </button>
      ))}
    </div>
  )
}
