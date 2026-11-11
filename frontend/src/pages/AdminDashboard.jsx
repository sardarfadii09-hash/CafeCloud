
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Coffee,
  CalendarDays,
  ShoppingBag,
  MessageSquare,
  LogOut,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  CircleAlert
} from 'lucide-react'

import API_BASE_URL from '../services/api'

const API = `${API_BASE_URL}/api`

function getAdminToken() {
  return (
    localStorage.getItem('cafecloud-admin-token') ||
    localStorage.getItem('adminToken') ||
    localStorage.getItem('token') ||
    sessionStorage.getItem('cafecloud-admin-token') ||
    sessionStorage.getItem('adminToken') ||
    sessionStorage.getItem('token')
  )
}

function AdminDashboard() {
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    menuCount: 0,
    reservationCount: 0,
    orderCount: 0,
    messageCount: 0,
    pendingReservations: 0,
    pendingOrders: 0,
    unreadMessages: 0
  })

  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const handleLogout = () => {
    ;['cafecloud-admin-token', 'adminToken', 'token'].forEach((key) => {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    })

    navigate('/admin-login')
  }

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      setLoading(true)
      setError('')

      try {
        const token = getAdminToken()

        if (!token) {
          throw new Error('Admin token nahi mila. Dobara Admin Login karo.')
        }

        const headers = {
          Authorization: `Bearer ${token}`
        }

        const [statsResponse, reservationsResponse] = await Promise.all([
          fetch(`${API}/admin/stats`, { headers }),
          fetch(`${API}/reservations`, { headers })
        ])

        const statsData = await statsResponse.json().catch(() => ({}))
        const reservationsData = await reservationsResponse.json().catch(() => ({}))

        if (!statsResponse.ok) {
          throw new Error(statsData.message || 'Dashboard stats load nahi huay.')
        }

        if (!reservationsResponse.ok) {
          throw new Error(
            reservationsData.message || 'Reservations load nahi huin.'
          )
        }

        if (!active) return

        setStats((current) => ({
          ...current,
          ...(statsData.stats || statsData.data || statsData)
        }))

        const list =
          reservationsData.reservations ||
          reservationsData.data ||
          reservationsData.items ||
          []

        setReservations(
          (Array.isArray(list) ? list : [])
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt || b.date || 0) -
                new Date(a.createdAt || a.date || 0)
            )
            .slice(0, 4)
        )
      } catch (err) {
        if (active) {
          setError(err.message || 'Dashboard load nahi ho saka.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [])

  const formatDate = (reservation) => {
    if (!reservation.date) return 'Date not provided'

    const date = new Date(reservation.date)

    if (Number.isNaN(date.getTime())) return reservation.date

    return date.toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (time) => {
    if (!time) return ''
    return time
  }

  const statusClass = (status) => {
    const value = (status || 'pending').toLowerCase()

    if (value === 'confirmed') return 'confirmed'
    if (value === 'cancelled') return 'cancelled'

    return 'pending'
  }

  const count = (value) => Number(value || 0)

  return (
    <div className="admin-dashboard-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <Link to="/admin-dashboard" className="admin-logo">
            <span className="admin-logo-icon">☕</span>
            <span>CafeCloud</span>
          </Link>

          <div className="admin-profile">
            <div className="admin-profile-avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <span>CafeCloud Admin</span>
            </div>
          </div>

          <nav className="admin-sidebar-nav">
            <Link to="/admin-dashboard" className="admin-sidebar-link active">
              <LayoutDashboard size={19} />
              <span>Dashboard</span>
            </Link>

            <Link to="/admin-menu" className="admin-sidebar-link">
              <Coffee size={19} />
              <span>Menu Items</span>
            </Link>

            <Link to="/admin-management" className="admin-sidebar-link">
              <CalendarDays size={19} />
              <span>Management</span>
            </Link>
          </nav>
        </div>

        <button type="button" className="admin-logout" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="admin-dashboard-main">
        <header className="admin-dashboard-header">
          <div>
            <span className="section-label">ADMIN PANEL</span>
            <h1>Dashboard</h1>
            <p>Welcome back. Here's what's happening at CafeCloud today.</p>
          </div>

          <Link to="/" className="admin-view-site">
            View Website
            <ArrowUpRight size={17} />
          </Link>
        </header>

        {error && (
          <div
            role="alert"
            style={{ padding: 12, marginBottom: 16, color: '#b42318' }}
          >
            {error}
          </div>
        )}

        <section className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Coffee size={21} />
            </div>
            <div>
              <span>Menu Items</span>
              <strong>{loading ? '—' : count(stats.menuCount)}</strong>
              <small>Items in database</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <CalendarDays size={21} />
            </div>
            <div>
              <span>Reservations</span>
              <strong>{loading ? '—' : count(stats.reservationCount)}</strong>
              <small>Saved reservations</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <ShoppingBag size={21} />
            </div>
            <div>
              <span>Orders</span>
              <strong>{loading ? '—' : count(stats.orderCount)}</strong>
              <small>Saved orders</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <MessageSquare size={21} />
            </div>
            <div>
              <span>Messages</span>
              <strong>{loading ? '—' : count(stats.messageCount)}</strong>
              <small>{count(stats.unreadMessages)} unread messages</small>
            </div>
          </div>
        </section>

        <section className="admin-dashboard-content">
          <div className="admin-dashboard-card">
            <div className="admin-card-header">
              <div>
                <span className="section-label">RECENT ACTIVITY</span>
                <h2>Recent Reservations</h2>
              </div>

              <Link to="/admin-management" className="admin-card-link">
                View All
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="admin-reservation-list">
              {loading ? (
                <p style={{ padding: 16 }}>Reservations load ho rahi hain...</p>
              ) : reservations.length === 0 ? (
                <p style={{ padding: 16 }}>
                  Abhi database mein koi reservation nahi hai.
                </p>
              ) : (
                reservations.map((reservation) => {
                  const name = reservation.name || 'Customer'
                  const status = reservation.status || 'pending'

                  return (
                    <div
                      className="admin-reservation-row"
                      key={reservation._id || reservation.id}
                    >
                      <div className="admin-row-avatar">
                        {name.charAt(0).toUpperCase()}
                      </div>

                      <div className="admin-row-info">
                        <strong>{name}</strong>
                        <span>
                          {count(reservation.guests)} Guests · {formatDate(reservation)}
                          {reservation.time ? ` · ${formatTime(reservation.time)}` : ''}
                        </span>
                      </div>

                      <span className={`admin-mini-status ${statusClass(status)}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div className="admin-dashboard-card admin-quick-card">
            <div className="admin-card-header">
              <div>
                <span className="section-label">MANAGEMENT</span>
                <h2>Quick Actions</h2>
              </div>
            </div>

            <div className="admin-quick-actions">
              <Link to="/admin-menu" className="admin-quick-action">
                <div className="admin-quick-icon">
                  <Coffee size={20} />
                </div>
                <div>
                  <strong>Manage Menu</strong>
                  <span>Add, edit or remove items</span>
                </div>
                <ArrowUpRight size={17} />
              </Link>

              <Link to="/admin-management" className="admin-quick-action">
                <div className="admin-quick-icon">
                  <CalendarDays size={20} />
                </div>
                <div>
                  <strong>Management Center</strong>
                  <span>Reservations, orders, messages & customers</span>
                </div>
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        <section className="admin-bottom-grid">
          <div className="admin-info-card">
            <div className="admin-info-card-icon">
              <Clock size={20} />
            </div>
            <div>
              <strong>Cafe Hours</strong>
              <p>Open daily from 10:00 AM — 11:00 PM</p>
            </div>
          </div>

          <div className="admin-info-card">
            <div className="admin-info-card-icon">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <strong>System Status</strong>
              <p>
                {error
                  ? 'Dashboard data connection needs attention.'
                  : loading
                    ? 'Checking database connection...'
                    : 'Dashboard data loaded from the backend.'}
              </p>
            </div>
          </div>

          <div className="admin-info-card">
            <div className="admin-info-card-icon">
              <CircleAlert size={20} />
            </div>
            <div>
              <strong>Attention Needed</strong>
              <p>
                {count(stats.pendingReservations)} reservations awaiting
                confirmation; {count(stats.pendingOrders)} orders pending.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default AdminDashboard
