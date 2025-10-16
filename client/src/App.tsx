import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/public/home'
import LoginPage from './pages/public/login'
import RegisterPage from './pages/public/register'
import OwnerDashboardPage from './pages/private/owner/dashboard/page'
import UserDashboardPage from './pages/private/user/dashboard'
import './index.css'
import ProtectedRoute from './ProtectedRoutes/ProtectedRoute'
import useAuth from './lib/useAuth.ts'; // Keep this for background auth checking
import { useUserStore } from './store/userStore';


function App() {
  // Use useAuth for background authentication checking
  useAuth();
  
  // Get user data from Zustand store
  const { user } = useUserStore();
  const isAuthenticated = !!user;
  const userRole = user?.role || '';

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Private Routes */}
        <Route path="/owner-dashboard" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['owner']} userRole={userRole}>
            <OwnerDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/user-dashboard" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['user']} userRole={userRole}>
            <UserDashboardPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App
