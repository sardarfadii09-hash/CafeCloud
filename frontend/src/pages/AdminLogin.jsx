
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LockKeyhole, Mail, ArrowLeft } from 'lucide-react'

function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok || !data.token) {
        throw new Error(data.message || 'Login failed. Email aur password check karo.')
      }

      const storage = remember ? localStorage : sessionStorage
      const otherStorage = remember ? sessionStorage : localStorage

      otherStorage.removeItem('cafecloud-admin-token')
      otherStorage.removeItem('adminToken')
      otherStorage.removeItem('token')

      storage.setItem('cafecloud-admin-token', data.token)
      storage.setItem('adminToken', data.token)
      storage.setItem('token', data.token)

      navigate('/admin-dashboard')
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Backend band hai. Backend terminal check karo.'
          : err.message || 'Login nahi ho saka.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-login-page">
      <Link to="/" className="admin-back">
        <ArrowLeft size={17} />
        Back to CafeCloud
      </Link>

      <div className="admin-login-wrapper">
        <section className="admin-login-visual">
          <div className="admin-visual-overlay"></div>

          <div className="admin-visual-content">
            <span>CAFECLOUD ADMIN</span>

            <h1>
              Manage Your
              <br />
              Cafe With Ease.
            </h1>

            <p>
              Manage menu items, reservations, orders and
              customer messages from one powerful dashboard.
            </p>

            <div className="admin-visual-line"></div>

            <small>☕ Crafted for better cafe management.</small>
          </div>
        </section>

        <section className="admin-login-card">
          <div className="admin-login-heading">
            <div className="admin-login-icon">
              <LockKeyhole size={24} />
            </div>

            <span>WELCOME BACK</span>
            <h2>Admin Login</h2>

            <p>Sign in to access your CafeCloud dashboard.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label htmlFor="admin-email">Email Address</label>

              <div className="admin-input-wrapper">
                <Mail size={18} />

                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@cafecloud.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="admin-password">Password</label>

              <div className="admin-input-wrapper">
                <LockKeyhole size={18} />

                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="admin-login-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={() =>
                  setError('Password reset ke liye admin configuration check karni hogi.')
                }
              >
                Forgot Password?
              </button>
            </div>

            {error && (
              <p role="alert" style={{ color: '#b42318', marginBottom: 12 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="admin-login-footer">
            <span>Protected Admin Area</span>
            <span>•</span>
            <span>CafeCloud</span>
          </div>
        </section>
      </div>
    </main>
  )
}

export default AdminLogin