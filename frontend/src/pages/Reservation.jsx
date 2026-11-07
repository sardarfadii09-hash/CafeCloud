
import { useState } from 'react'
import Navbar from '../components/Navbar'
import {
  CalendarDays,
  Clock3,
  Users,
  Phone,
  User,
  MessageSquare,
  Mail
} from 'lucide-react'

function Reservation() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    message: ''
  })

  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState({
    type: '',
    message: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setFeedback({ type: '', message: '' })

    try {
      const response = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          guests: Number(formData.guests)
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Reservation could not be submitted.')
      }

      setFeedback({
        type: 'success',
        message: 'Your reservation has been submitted successfully!'
      })

      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '',
        message: ''
      })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message || 'Unable to connect to the server.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <main className="reservation-page">

        <section
          className="reservation-hero"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=2000&q=85')"
          }}
        >
          <div className="reservation-hero-overlay"></div>

          <div className="container reservation-hero-content">
            <span>RESERVATION</span>
            <h1>
              Reserve Your
              <br />
              Perfect Table.
            </h1>
            <p>
              Plan your next coffee, meal or special moment
              with us. We will have your table ready.
            </p>
          </div>
        </section>

        <section className="reservation-section section">
          <div className="container reservation-layout">

            <div className="reservation-form-card">

              <div className="reservation-heading">
                <span className="section-label">
                  BOOK A TABLE
                </span>

                <h2 className="section-title">
                  Make a Reservation
                </h2>

                <p className="section-text">
                  Fill in the details below and reserve
                  your table at CafeCloud.
                </p>
              </div>

              <form onSubmit={handleSubmit}>

                <div className="reservation-form-grid">

                  <div className="form-group">
                    <label>
                      <User size={16} />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <Mail size={16} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <Phone size={16} />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="03XX XXXXXXX"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <CalendarDays size={16} />
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <Clock3 size={16} />
                      Time
                    </label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>Select time</option>
                      <option>10:00 AM</option>
                      <option>11:00 AM</option>
                      <option>12:00 PM</option>
                      <option>01:00 PM</option>
                      <option>02:00 PM</option>
                      <option>04:00 PM</option>
                      <option>05:00 PM</option>
                      <option>06:00 PM</option>
                      <option>07:00 PM</option>
                      <option>08:00 PM</option>
                      <option>09:00 PM</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      <Users size={16} />
                      Guests
                    </label>
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>Number of guests</option>
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5 Guests</option>
                      <option value="6">6 Guests</option>
                      <option value="7">7 Guests</option>
                      <option value="8">8+ Guests</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      <MessageSquare size={16} />
                      Special Request
                    </label>
                    <input
                      type="text"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Optional request"
                    />
                  </div>

                </div>

                {feedback.message && (
                  <p
                    role="status"
                    style={{
                      color: feedback.type === 'success' ? 'green' : 'red',
                      marginTop: '15px'
                    }}
                  >
                    {feedback.message}
                  </p>
                )}

                <button
                  type="submit"
                  className="reservation-submit"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Reserve My Table'}
                </button>

              </form>
            </div>

            <div className="reservation-side">

              <div className="reservation-image">
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=85"
                  alt="CafeCloud interior"
                />
              </div>

              <div className="reservation-info">

                <span className="section-label">
                  CAFE MOMENTS
                </span>

                <h3>
                  Your Table,
                  <br />
                  Your Moment.
                </h3>

                <p>
                  Whether it is a casual coffee, dinner
                  with friends or a special celebration,
                  CafeCloud is ready to make your visit
                  memorable.
                </p>

                <div className="reservation-features">
                  <div>
                    <strong>01</strong>
                    <span>Cozy Atmosphere</span>
                  </div>

                  <div>
                    <strong>02</strong>
                    <span>Fresh Food & Coffee</span>
                  </div>

                  <div>
                    <strong>03</strong>
                    <span>Friendly Service</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

      </main>
    </>
  )
}

export default Reservation
