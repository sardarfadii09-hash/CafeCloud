
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, CalendarDays, ShoppingBag, MessageSquare,
  Users, Search, Check, X, Trash2, RefreshCw
} from 'lucide-react'

const API = 'http://localhost:5000/api'

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

async function apiRequest(path, options = {}) {
  const token = getAdminToken()
  if (!token) throw new Error('Admin login dobara karo.')

  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || 'Request complete nahi hui.')
  }
  return data
}

function AdminManagement() {
  const [activeTab, setActiveTab] = useState('Reservations')
  const [reservations, setReservations] = useState([])
  const [orders, setOrders] = useState([])
  const [messages, setMessages] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const [r, o, m] = await Promise.all([
        apiRequest('/reservations'),
        apiRequest('/orders'),
        apiRequest('/messages')
      ])
      setReservations(r.reservations || [])
      setOrders(o.orders || [])
      setMessages(m.messages || [])
    } catch (err) {
      setError(err.message || 'Data load nahi hua.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function changeReservation(id, status) {
    try {
      await apiRequest(`/reservations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: status.toLowerCase() })
      })
      setNotice('Reservation status save ho gaya.')
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  async function changeOrder(id, status) {
    const normalized = status.toLowerCase()
    try {
      await apiRequest(`/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: normalized })
      })
      setNotice('Order status save ho gaya.')
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  async function markRead(id, isRead) {
    try {
      await apiRequest(`/messages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isRead })
      })
      setNotice('Message update ho gaya.')
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const q = search.toLowerCase()
  const filteredReservations = reservations.filter(x =>
    `${x.name} ${x.phone} ${x.email}`.toLowerCase().includes(q)
  )
  const filteredOrders = orders.filter(x =>
    `${x.customerName} ${x.email} ${x._id}`.toLowerCase().includes(q)
  )
  const filteredMessages = messages.filter(x =>
    `${x.name} ${x.email} ${x.subject} ${x.message}`.toLowerCase().includes(q)
  )

  const customersMap = new Map()
  ;[...reservations.map(x => ({
    name: x.name, email: x.email, phone: x.phone,
    reservation: true, order: false, date: x.createdAt
  })), ...orders.map(x => ({
    name: x.customerName, email: x.email, phone: x.phone,
    reservation: false, order: true, date: x.createdAt
  }))].forEach(x => {
    const key = (x.email || x.phone || x.name || '').toLowerCase()
    const previous = customersMap.get(key) || {
      ...x, orders: 0, reservations: 0
    }
    previous.orders += Number(x.order)
    previous.reservations += Number(x.reservation)
    if (!previous.date || (x.date && x.date < previous.date)) {
      previous.date = x.date
    }
    customersMap.set(key, previous)
  })
  const customers = [...customersMap.values()].filter(x =>
    `${x.name} ${x.email} ${x.phone}`.toLowerCase().includes(q)
  )

  const tabs = [
    { name: 'Reservations', icon: CalendarDays },
    { name: 'Orders', icon: ShoppingBag },
    { name: 'Messages', icon: MessageSquare },
    { name: 'Customers', icon: Users }
  ]

  const dateLabel = value => {
    if (!value) return '—'
    const d = new Date(value)
    return Number.isNaN(d.getTime())
      ? value
      : d.toLocaleDateString('en-PK', {
          day: 'numeric', month: 'short', year: 'numeric'
        })
  }

  const statusClass = value => {
    if (['confirmed', 'completed', 'read'].includes(String(value).toLowerCase())) {
      return 'management-status confirmed'
    }
    if (['cancelled'].includes(String(value).toLowerCase())) {
      return 'management-status cancelled'
    }
    return 'management-status pending'
  }

  return (
    <div className="admin-management-page">
      <header className="admin-management-header">
        <div className="admin-management-header-inner">
          <Link to="/admin-dashboard" className="admin-back-link">
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
          <span className="section-label">CAFECLOUD ADMIN</span>
          <h1>Management Center</h1>
          <p>Manage reservations, orders, messages and customers from one place.</p>
        </div>
      </header>

      <main className="admin-management-main">
        {error && (
          <div role="alert" style={{ color: '#b42318', padding: 12 }}>
            {error}
            <button type="button" onClick={loadData} style={{ marginLeft: 12 }}>
              Try Again
            </button>
          </div>
        )}
        {notice && (
          <div role="status" style={{ color: '#167647', padding: 12 }}>
            {notice}
            <button type="button" onClick={() => setNotice('')} style={{ marginLeft: 12 }}>
              Dismiss
            </button>
          </div>
        )}

        <div className="admin-management-tabs">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.name}
                type="button"
                className={activeTab === tab.name
                  ? 'admin-management-tab active'
                  : 'admin-management-tab'}
                onClick={() => {
                  setActiveTab(tab.name)
                  setSearch('')
                }}
              >
                <Icon size={18} />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </div>

        <div className="admin-management-toolbar">
          <div className="admin-management-search">
            <Search size={19} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${activeTab.toLowerCase()}...`}
            />
          </div>
          <button type="button" onClick={loadData} title="Refresh data">
            <RefreshCw size={17} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="admin-management-card" style={{ padding: 24 }}>
            Database se data load ho raha hai...
          </div>
        ) : (
          <>
            {activeTab === 'Reservations' && (
              <div className="admin-management-card">
                <div className="admin-management-card-header">
                  <div>
                    <span className="section-label">TABLE BOOKINGS</span>
                    <h2>Reservations</h2>
                  </div>
                  <span className="admin-count-badge">{reservations.length} Total</span>
                </div>
                <div className="admin-management-table-wrapper">
                  <table className="admin-management-table">
                    <thead>
                      <tr>
                        <th>Customer</th><th>Date &amp; Time</th><th>Guests</th>
                        <th>Request</th><th>Status</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReservations.map(r => (
                        <tr key={r._id}>
                          <td>
                            <div className="management-person">
                              <div className="management-avatar">{(r.name || 'C')[0].toUpperCase()}</div>
                              <div><strong>{r.name}</strong><span>{r.phone}</span></div>
                            </div>
                          </td>
                          <td><strong>{dateLabel(r.date)}</strong><span className="management-subtext">{r.time}</span></td>
                          <td><span className="management-pill"><Users size={14} /> {r.guests}</span></td>
                          <td><span className="management-request">{r.message || '—'}</span></td>
                          <td><span className={statusClass(r.status)}>{r.status || 'pending'}</span></td>
                          <td>
                            <div className="management-actions">
                              {r.status !== 'confirmed' && (
                                <button type="button" className="management-action confirm" title="Confirm"
                                  onClick={() => changeReservation(r._id, 'confirmed')}><Check size={16} /></button>
                              )}
                              {r.status !== 'cancelled' && (
                                <button type="button" className="management-action cancel" title="Cancel"
                                  onClick={() => changeReservation(r._id, 'cancelled')}><X size={16} /></button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredReservations.length === 0 && (
                        <tr><td colSpan="6">Koi reservation nahi mili.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'Orders' && (
              <div className="admin-management-card">
                <div className="admin-management-card-header">
                  <div><span className="section-label">CUSTOMER ORDERS</span><h2>Orders</h2></div>
                  <span className="admin-count-badge">{orders.length} Orders</span>
                </div>
                <div className="admin-management-table-wrapper">
                  <table className="admin-management-table">
                    <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Update</th></tr></thead>
                    <tbody>
                      {filteredOrders.map(o => (
                        <tr key={o._id}>
                          <td><strong className="management-order-id">{o._id.slice(-6)}</strong><span className="management-subtext">{dateLabel(o.createdAt)}</span></td>
                          <td><strong>{o.customerName}</strong><span className="management-subtext">{o.phone}</span></td>
                          <td><span className="management-request">{(o.items || []).map(i => `${i.quantity} × ${i.name}`).join(', ')}</span></td>
                          <td><strong>Rs. {o.total}</strong></td>
                          <td><span className={statusClass(o.status)}>{o.status}</span></td>
                          <td>
                            <select className="management-status-select" value={o.status || 'pending'}
                              onChange={e => changeOrder(o._id, e.target.value)}>
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="preparing">Preparing</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {filteredOrders.length === 0 && <tr><td colSpan="6">Koi order nahi mila.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'Messages' && (
              <div className="admin-management-card">
                <div className="admin-management-card-header">
                  <div><span className="section-label">CUSTOMER CONTACT</span><h2>Messages</h2></div>
                  <span className="admin-count-badge">{messages.length} Messages</span>
                </div>
                <div className="management-message-list">
                  {filteredMessages.map(m => (
                    <div className="management-message" key={m._id}>
                      <div className="management-message-avatar">{(m.name || 'C')[0].toUpperCase()}</div>
                      <div className="management-message-content">
                        <div className="management-message-top">
                          <div><strong>{m.name}</strong><span>{m.email}</span></div>
                          <small>{dateLabel(m.createdAt)}</small>
                        </div>
                        {m.subject && <strong>{m.subject}</strong>}
                        <p>{m.message}</p>
                        <div className="management-message-actions">
                          <span className={statusClass(m.isRead ? 'read' : 'unread')}>{m.isRead ? 'Read' : 'Unread'}</span>
                          {!m.isRead && <button type="button" onClick={() => markRead(m._id, true)}>Mark as Read</button>}
                          {m.isRead && <button type="button" onClick={() => markRead(m._id, false)}>Mark Unread</button>}
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredMessages.length === 0 && <p style={{ padding: 16 }}>Koi message nahi mila.</p>}
                </div>
              </div>
            )}

            {activeTab === 'Customers' && (
              <div className="admin-management-card">
                <div className="admin-management-card-header">
                  <div><span className="section-label">CUSTOMER DATABASE</span><h2>Customers</h2></div>
                  <span className="admin-count-badge">{customers.length} Customers</span>
                </div>
                <div className="admin-management-table-wrapper">
                  <table className="admin-management-table">
                    <thead><tr><th>Customer</th><th>Phone</th><th>Email</th><th>Orders</th><th>Reservations</th><th>Joined</th></tr></thead>
                    <tbody>
                      {customers.map((c, index) => (
                        <tr key={`${c.email}-${index}`}>
                          <td><div className="management-person"><div className="management-avatar">{(c.name || 'C')[0].toUpperCase()}</div><div><strong>{c.name}</strong></div></div></td>
                          <td>{c.phone || '—'}</td><td>{c.email || '—'}</td><td><span className="management-number">{c.orders}</span></td><td><span className="management-number">{c.reservations}</span></td><td><span className="management-subtext">{dateLabel(c.date)}</span></td>
                        </tr>
                      ))}
                      {customers.length === 0 && <tr><td colSpan="6">Abhi customer records nahi hain.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default AdminManagement
