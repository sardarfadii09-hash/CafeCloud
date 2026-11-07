
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Reservation from './pages/Reservation'
import About from './pages/About'
import Contact from './pages/Contact'

import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminMenu from './pages/AdminMenu'
import AdminReservations from './pages/AdminReservations'
import AdminManagement from './pages/AdminManagement'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin Login */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected Admin Pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-menu" element={<AdminMenu />} />
          <Route path="/admin-reservations" element={<AdminReservations />} />
          <Route path="/admin-management" element={<AdminManagement />} />
        </Route>
      </Routes>

      <Footer />
    </BrowserRouter>
  )
}

export default App
