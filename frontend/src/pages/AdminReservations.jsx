import { useState } from 'react'
import {
  Link,
  Search,
  ArrowLeft,
  Check,
  X,
  Trash2,
  CalendarDays,
  Users,
  Clock,
  Phone
} from 'lucide-react'

const initialReservations = [
  {
    id: 1,
    name: 'Ahmed Khan',
    phone: '+92 300 1234567',
    date: '2026-10-08',
    time: '07:30 PM',
    guests: 4,
    request: 'Window table please.',
    status: 'Pending'
  },
  {
    id: 2,
    name: 'Sara Ali',
    phone: '+92 301 7654321',
    date: '2026-10-09',
    time: '08:00 PM',
    guests: 2,
    request: 'Birthday celebration.',
    status: 'Confirmed'
  },
  {
    id: 3,
    name: 'Bilal Khan',
    phone: '+92 312 9876543',
    date: '2026-10-10',
    time: '06:30 PM',
    guests: 6,
    request: 'Need a larger table.',
    status: 'Pending'
  },
  {
    id: 4,
    name: 'Hira Malik',
    phone: '+92 333 4567890',
    date: '2026-10-11',
    time: '09:00 PM',
    guests: 3,
    request: 'No special request.',
    status: 'Confirmed'
  }
]

function AdminReservations() {
  const [reservations, setReservations] =
    useState(initialReservations)

  const [search, setSearch] = useState('')

  const [statusFilter, setStatusFilter] =
    useState('All')

  const filteredReservations = reservations.filter(
    (reservation) => {
      const searchMatch =
        reservation.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        reservation.phone.includes(search)

      const statusMatch =
        statusFilter === 'All' ||
        reservation.status === statusFilter

      return searchMatch && statusMatch
    }
  )

  const updateStatus = (id, status) => {
    setReservations((current) =>
      current.map((reservation) =>
        reservation.id === id
          ? {
              ...reservation,
              status
            }
          : reservation
      )
    )
  }

  const handleDelete = (id) => {
    const reservation = reservations.find(
      (item) => item.id === id
    )

    if (!reservation) return

    const confirmed = window.confirm(
      `Delete reservation for "${reservation.name}"?`
    )

    if (!confirmed) return

    setReservations((current) =>
      current.filter(
        (reservation) => reservation.id !== id
      )
    )
  }

  const pendingCount = reservations.filter(
    (item) => item.status === 'Pending'
  ).length

  const confirmedCount = reservations.filter(
    (item) => item.status === 'Confirmed'
  ).length

  return (
    <div className="admin-reservations-page">

      {/* HEADER */}

      <header className="admin-reservations-header">

        <div className="admin-reservations-header-inner">

          <div>

            <Link
              to="/admin-dashboard"
              className="admin-back-link"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </Link>

            <h1>
              Reservations
            </h1>

            <p>
              Manage your CafeCloud table reservations.
            </p>

          </div>

        </div>

      </header>


      {/* MAIN */}

      <main className="admin-reservations-main">


        {/* SUMMARY */}

        <div className="admin-reservation-summary">

          <div className="admin-reservation-stat">

            <div className="admin-reservation-stat-icon">
              <CalendarDays size={21} />
            </div>

            <div>
              <strong>
                {reservations.length}
              </strong>

              <span>
                Total Reservations
              </span>
            </div>

          </div>


          <div className="admin-reservation-stat">

            <div className="admin-reservation-stat-icon">
              <Clock size={21} />
            </div>

            <div>
              <strong>
                {pendingCount}
              </strong>

              <span>
                Pending
              </span>
            </div>

          </div>


          <div className="admin-reservation-stat">

            <div className="admin-reservation-stat-icon">
              <Check size={21} />
            </div>

            <div>
              <strong>
                {confirmedCount}
              </strong>

              <span>
                Confirmed
              </span>
            </div>

          </div>

        </div>


        {/* TOOLBAR */}

        <div className="admin-reservation-toolbar">

          <div className="admin-reservation-search">

            <Search size={19} />

            <input
              type="text"
              placeholder="Search customer..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>


          <div className="admin-reservation-filters">

            {['All', 'Pending', 'Confirmed', 'Cancelled'].map(
              (status) => (

                <button
                  key={status}
                  type="button"
                  className={
                    statusFilter === status
                      ? 'admin-reservation-filter active'
                      : 'admin-reservation-filter'
                  }
                  onClick={() =>
                    setStatusFilter(status)
                  }
                >
                  {status}
                </button>

              )
            )}

          </div>

        </div>


        {/* TABLE */}

        <div className="admin-reservation-table-wrapper">

          <table className="admin-reservation-table">

            <thead>

              <tr>

                <th>
                  Customer
                </th>

                <th>
                  Date & Time
                </th>

                <th>
                  Guests
                </th>

                <th>
                  Request
                </th>

                <th>
                  Status
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredReservations.map(
                (reservation) => (

                  <tr key={reservation.id}>

                    {/* CUSTOMER */}

                    <td>

                      <div className="admin-reservation-customer">

                        <div className="admin-customer-avatar">
                          {reservation.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <strong>
                            {reservation.name}
                          </strong>

                          <span>
                            <Phone size={13} />
                            {reservation.phone}
                          </span>

                        </div>

                      </div>

                    </td>


                    {/* DATE */}

                    <td>

                      <div className="admin-reservation-datetime">

                        <strong>
                          {reservation.date}
                        </strong>

                        <span>
                          {reservation.time}
                        </span>

                      </div>

                    </td>


                    {/* GUESTS */}

                    <td>

                      <span className="admin-guests">

                        <Users size={15} />

                        {reservation.guests}

                      </span>

                    </td>


                    {/* REQUEST */}

                    <td>

                      <span className="admin-reservation-request">
                        {reservation.request}
                      </span>

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={
                          reservation.status ===
                          'Confirmed'
                            ? 'reservation-status confirmed'
                            : reservation.status ===
                              'Cancelled'
                            ? 'reservation-status cancelled'
                            : 'reservation-status pending'
                        }
                      >
                        {reservation.status}
                      </span>

                    </td>


                    {/* ACTIONS */}

                    <td>

                      <div className="admin-reservation-actions">

                        {reservation.status !==
                          'Confirmed' && (
                          <button
                            type="button"
                            className="reservation-action confirm"
                            title="Confirm"
                            onClick={() =>
                              updateStatus(
                                reservation.id,
                                'Confirmed'
                              )
                            }
                          >
                            <Check size={16} />
                          </button>
                        )}


                        {reservation.status !==
                          'Cancelled' && (
                          <button
                            type="button"
                            className="reservation-action cancel"
                            title="Cancel"
                            onClick={() =>
                              updateStatus(
                                reservation.id,
                                'Cancelled'
                              )
                            }
                          >
                            <X size={16} />
                          </button>
                        )}


                        <button
                          type="button"
                          className="reservation-action delete"
                          title="Delete"
                          onClick={() =>
                            handleDelete(
                              reservation.id
                            )
                          }
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>


          {filteredReservations.length === 0 && (

            <div className="admin-reservation-empty">

              <CalendarDays size={42} />

              <h3>
                No reservations found
              </h3>

              <p>
                Try another search or status filter.
              </p>

            </div>

          )}

        </div>

      </main>

    </div>
  )
}

export default AdminReservations