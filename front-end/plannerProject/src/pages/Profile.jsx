import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Topbar from '../components/Layout/topbar'
import Sidebar from '../components/Layout/sidebar'
import './Profile.css'

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="app-layout">
      <Topbar />
      <div className="main-layout">
        <Sidebar />
        <main className="profile-page">
          <div className="profile-header">
            <div className="profile-avatar-large">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1>{user?.name}</h1>
              <p className="profile-email">{user?.email}</p>
            </div>
          </div>

          {/* Account Information */}
          <section className="profile-section">
            <h2>Account Information</h2>
            <div className="profile-fields">
              <div className="profile-field">
                <label>First Name</label>
                <input type="text" placeholder="First name" disabled />
              </div>
              <div className="profile-field">
                <label>Last Name</label>
                <input type="text" placeholder="Last name" disabled />
              </div>
              <div className="profile-field">
                <label>Email</label>
                <input type="email" value={user?.email || ''} readOnly />
              </div>
              {user?.provider === 'local' && (
                <div className="profile-field">
                  <label>Password</label>
                  <input type="password" placeholder="Change password" disabled />
                </div>
              )}
            </div>
            <p className="coming-soon-note">Editing coming soon</p>
          </section>

          {/* Task Preferences */}
          <section className="profile-section coming-soon">
            <h2>Task Preferences</h2>
            <p>Default priority, due time, and sorting options for new tasks.</p>
          </section>

          {/* Reminder Preferences */}
          <section className="profile-section coming-soon">
            <h2>Reminder Preferences</h2>
            <p>Default lead time and notification settings for reminders.</p>
          </section>

          {/* Calendar Preferences */}
          <section className="profile-section coming-soon">
            <h2>Calendar Preferences</h2>
            <p>Default view (month / week / day), week start day, and time display.</p>
          </section>

          {/* Color Coding */}
          <section className="profile-section coming-soon">
            <h2>Color Coding</h2>
            <p>Assign colors to events, tasks, and reminders to keep your calendar organized at a glance.</p>
          </section>

          <div className="profile-actions">
            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
