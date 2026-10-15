import { NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" end className="brand">
          <span className="brand-mark" aria-hidden>
            ◌
          </span>
          Caelune
        </NavLink>
        <p className="tagline">Remember what a day felt like.</p>
        <nav className="nav">
          <NavLink to="/" end>
            Today
          </NavLink>
          <NavLink to="/calendar">Calendar</NavLink>
          <NavLink to="/memories">Memories</NavLink>
        </nav>
      </header>
      <main className="page">
        <Outlet />
      </main>
    </div>
  )
}
