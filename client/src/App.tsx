import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/public/home'
import LoginPage from './pages/public/login'
import RegisterPage from './pages/public/register'
import OwnerDashboardPage from './pages/private/owner/dashboard/page'
import UserDashboardPage from './pages/private/user/dashboard'
import UserHomePage from './pages/private/user/homepage/userhomepage.tsx'
import AboutPage from './pages/private/user/aboutpage/aboutpage.tsx'
import SalonsPage from './pages/private/user/salons/index.tsx'
import SalonDetail from './pages/public/salons/SalonDetail';
import BookingPage from './pages/private/user/bookingpage/bookingpage';
import MyBookings from './pages/private/user/mybookings/mybookings';
import './index.css'
import ProtectedRoute from './ProtectedRoutes/ProtectedRoute'
import useAuth from './lib/useAuth.ts'; // Keep this for background auth checking
import AddSalon from './pages/private/owner/salon/addsalson.tsx'
import MySalon from './pages/private/owner/salon/mysalon.tsx'
import ShowAppointment from './pages/private/owner/showapointment/showappointment.tsx'
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
        {/* User Routes */}
        <Route path='/home' element={
          <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['user']} userRole={userRole}>
            <UserHomePage />
          </ProtectedRoute>
        } />
       
        <Route path='/salons' element={
          <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['user']} userRole={userRole}>
            <SalonsPage />
          </ProtectedRoute>
        } />

        {/* Salon detail - public */}
        <Route path="/salons/:id" element={<SalonDetail />} />

        {/* Booking - protected for users */}
        <Route path='/book/:id' element={
          <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['user']} userRole={userRole}>
            <BookingPage />
          </ProtectedRoute>
        } />

        {/* My Bookings - protected for users */}
        <Route path='/my-bookings' element={
          <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['user']} userRole={userRole}>
            <MyBookings />
          </ProtectedRoute>
        } />

        <Route path='/about' element={
          <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['user']} userRole={userRole}>
            <AboutPage />
          </ProtectedRoute>
        } />

         <Route path="/user-dashboard" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['user']} userRole={userRole}>
            <UserDashboardPage />
          </ProtectedRoute>
        } />

        {/* Owner Routes */}
        <Route path="/owner-dashboard" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['owner']} userRole={userRole}>
            <OwnerDashboardPage />
          </ProtectedRoute>
        } />
         <Route path='/addsalon' element={
          <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['owner']} userRole={userRole}>
            <AddSalon />
          </ProtectedRoute>
        } />
        <Route path='/owner/salons' element={
          <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['owner']} userRole={userRole}>
            <MySalon />
          </ProtectedRoute>
        } />
        <Route path='/owner/appointments' element={
          <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['owner']} userRole={userRole}>
            <ShowAppointment />
          </ProtectedRoute>
        } />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App
