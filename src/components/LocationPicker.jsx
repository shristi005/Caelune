import { useState } from 'react'

export default function LocationPicker({
  location,
  status,
  error,
  suggestions,
  searching,
  onSearch,
  onChoose,
  onGeo,
  onChange,
}) {
  const [query, setQuery] = useState('')

  return (
    <div className="location-block">
      {location && status === 'ready' ? (
        <div className="location-ready">
          <span>{location.label}</span>
          <button type="button" className="text-link" onClick={onChange}>
            Change
          </button>
        </div>
      ) : null}

      {status === 'locating' ? (
        <p className="muted">Finding your location… you can also search for a city.</p>
      ) : null}

      {error ? <p className="notice">{error}</p> : null}

      {(status === 'manual' || status === 'idle' || status === 'locating') && (
        <div className="location-search">
          <label htmlFor="place-search">City or place</label>
          <div className="search-row">
            <input
              id="place-search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                onSearch(e.target.value)
              }}
              placeholder="Search for a city"
            />
            <button type="button" className="btn ghost" onClick={onGeo}>
              Use my location
            </button>
          </div>
          {searching ? <p className="muted">Searching…</p> : null}
          {!searching && query.trim().length >= 2 && suggestions.length === 0 ? (
            <p className="muted">No matching places. Try a city name.</p>
          ) : null}
          {suggestions.length > 0 && (
            <ul className="suggest-list">
              {suggestions.map((place) => (
                <li key={`${place.latitude}-${place.longitude}-${place.label}`}>
                  <button type="button" onClick={() => onChoose(place)}>
                    {place.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
