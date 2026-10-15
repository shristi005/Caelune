const KEY = 'caelune.entries.v1'
const LOCATION_KEY = 'caelune.location.v1'

function readAll() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeAll(map) {
  localStorage.setItem(KEY, JSON.stringify(map))
}

export function getEntries() {
  const map = readAll()
  return Object.values(map).sort((a, b) => b.date.localeCompare(a.date))
}

export function getEntry(date) {
  return readAll()[date] ?? null
}

export function saveEntry(entry) {
  const map = readAll()
  map[entry.date] = {
    ...entry,
    updatedAt: new Date().toISOString(),
    createdAt: map[entry.date]?.createdAt ?? new Date().toISOString(),
  }
  writeAll(map)
  return map[entry.date]
}

export function deleteEntry(date) {
  const map = readAll()
  delete map[date]
  writeAll(map)
}

export function getSavedLocation() {
  try {
    const raw = localStorage.getItem(LOCATION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveLocation(location) {
  localStorage.setItem(LOCATION_KEY, JSON.stringify(location))
}

export function clearSavedLocation() {
  localStorage.removeItem(LOCATION_KEY)
}
