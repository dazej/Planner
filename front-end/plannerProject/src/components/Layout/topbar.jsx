import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Topbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="topbar">
      <span className="topbar-title">Planner</span>
      <div className="topbar-user">
        <button className="logout-btn" onClick={logout}>Log out</button>
        <button
          className="profile-icon-btn"
          onClick={() => navigate('/profile')}
          title="Your profile"
          aria-label="Go to profile"
        >
          {user?.name?.charAt(0).toUpperCase()}
        </button>
      </div>
    </header>
  )
}
