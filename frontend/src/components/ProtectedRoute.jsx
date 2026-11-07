
import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoute() {
  const token =
    localStorage.getItem('cafecloud-admin-token') ||
    sessionStorage.getItem('cafecloud-admin-token')

  if (!token) {
    return <Navigate to="/admin-login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
