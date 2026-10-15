import { useCallback, useSyncExternalStore } from 'react'
import {
  deleteEntry as remove,
  getEntries,
  getEntry,
  saveEntry,
} from '../utils/storage'

const listeners = new Set()

function emit() {
  listeners.forEach((fn) => fn())
}

function subscribe(fn) {
  listeners.add(fn)
  window.addEventListener('storage', fn)
  return () => {
    listeners.delete(fn)
    window.removeEventListener('storage', fn)
  }
}

function snapshot() {
  return JSON.stringify(getEntries())
}

export function useEntries() {
  const json = useSyncExternalStore(subscribe, snapshot, () => '[]')
  const entries = JSON.parse(json)

  const save = useCallback((entry) => {
    const saved = saveEntry(entry)
    emit()
    return saved
  }, [])

  const removeEntry = useCallback((date) => {
    remove(date)
    emit()
  }, [])

  const find = useCallback((date) => getEntry(date), [])

  return { entries, save, removeEntry, find }
}
