export default function WeatherIcon({ type = 'cloud', size = 56 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 64 64',
    fill: 'none',
    'aria-hidden': true,
  }

  if (type === 'sun') {
    return (
      <svg {...common}>
        <circle cx="32" cy="32" r="12" fill="#F6D27A" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180
          const x1 = 32 + Math.cos(rad) * 18
          const y1 = 32 + Math.sin(rad) * 18
          const x2 = 32 + Math.cos(rad) * 24
          const y2 = 32 + Math.sin(rad) * 24
          return (
            <line
              key={deg}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#F4C97A"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )
        })}
      </svg>
    )
  }

  if (type === 'partly') {
    return (
      <svg {...common}>
        <circle cx="24" cy="24" r="10" fill="#F6D27A" />
        <ellipse cx="36" cy="38" rx="16" ry="11" fill="#E8EEF8" />
        <ellipse cx="24" cy="40" rx="12" ry="9" fill="#D7E3F5" />
      </svg>
    )
  }

  if (type === 'rain' || type === 'drizzle') {
    return (
      <svg {...common}>
        <ellipse cx="34" cy="28" rx="16" ry="11" fill="#C9D6EC" />
        <ellipse cx="22" cy="30" rx="11" ry="8" fill="#B7C7E4" />
        <line x1="22" y1="42" x2="18" y2="52" stroke="#7A9BC8" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="44" x2="28" y2="54" stroke="#7A9BC8" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="42" y1="42" x2="38" y2="52" stroke="#7A9BC8" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'snow') {
    return (
      <svg {...common}>
        <ellipse cx="34" cy="28" rx="16" ry="11" fill="#E8EEF8" />
        <ellipse cx="22" cy="30" rx="11" ry="8" fill="#D7E3F5" />
        <circle cx="22" cy="48" r="2" fill="#F7F4EE" />
        <circle cx="32" cy="52" r="2" fill="#F7F4EE" />
        <circle cx="42" cy="48" r="2" fill="#F7F4EE" />
      </svg>
    )
  }

  if (type === 'storm') {
    return (
      <svg {...common}>
        <ellipse cx="34" cy="26" rx="16" ry="11" fill="#9AA8C4" />
        <ellipse cx="22" cy="28" rx="11" ry="8" fill="#8A99B8" />
        <path d="M34 38 L26 48 H32 L28 56 L42 44 H34 Z" fill="#F4C97A" />
      </svg>
    )
  }

  if (type === 'fog') {
    return (
      <svg {...common}>
        <ellipse cx="32" cy="26" rx="16" ry="10" fill="#D8D4E4" />
        <line x1="14" y1="42" x2="50" y2="42" stroke="#C9C4D6" strokeWidth="3" strokeLinecap="round" />
        <line x1="18" y1="50" x2="46" y2="50" stroke="#D8D4E4" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <ellipse cx="36" cy="34" rx="16" ry="11" fill="#D7E3F5" />
      <ellipse cx="24" cy="36" rx="12" ry="9" fill="#C9D6EC" />
    </svg>
  )
}
