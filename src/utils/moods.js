export const MOODS = [
  { id: 'happy', label: 'Happy', emoji: '☀️', color: '#f4c97a' },
  { id: 'calm', label: 'Calm', emoji: '🌙', color: '#9bb7e8' },
  { id: 'sad', label: 'Sad', emoji: '🌧', color: '#7a8db5' },
  { id: 'excited', label: 'Excited', emoji: '✨', color: '#c9a0e8' },
  { id: 'tired', label: 'Tired', emoji: '🌫', color: '#b8b0c8' },
]

export function getMood(id) {
  return MOODS.find((m) => m.id === id) ?? null
}
