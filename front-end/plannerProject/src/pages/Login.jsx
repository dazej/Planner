export default function Login() {
  const handleGoogleLogin = () => {
    // Redirect to back-end which kicks off the Google OAuth flow
    window.location.href = 'http://localhost:5001/api/auth/google'
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Vien Planner</h1>
        <p>Your all-in-one calendar, tasks, and reminders.</p>
        <button className="google-btn" onClick={handleGoogleLogin}>
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
