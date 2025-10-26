import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import UserNavBar from '@/components/UserNavBar';
import { bookingAPI } from '@/lib/api';
import type { Booking } from '@/types/booking';

function UserDashboardPage() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingAPI.getMyBookings();
      const data = res?.data ?? res;
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load bookings', err);
      // Don't show error toast on dashboard, just log it
    } finally {
      setLoading(false);
    }
  };

  const isUpcoming = (booking: Booking) => {
    const bookingDateTime = new Date(`${new Date(booking.date).toISOString().split('T')[0]}T${booking.time}`);
    return bookingDateTime > new Date() && booking.status !== 'cancelled' && booking.status !== 'completed';
  };

  const upcomingBookings = bookings.filter(isUpcoming);
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5); // Show last 5 bookings

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
      completed: 'bg-blue-100 text-blue-800 border-blue-300',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-green-700">
      {/* Navigation Menu */}
      <UserNavBar />

      {/* Main Content */}
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-green-900">My Profile</h1>
          </div>
          
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">
            <h2 className="text-2xl font-semibold text-green-900 mb-4">Welcome back, {user?.name || 'User'}!</h2>
            {user ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-green-900">{user.name}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Email Address</p>
                  <p className="text-lg font-semibold text-green-900">{user.email}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Account Type</p>
                  <p className="text-lg font-semibold text-green-900 capitalize">{user.role}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">User ID</p>
                  <p className="text-lg font-semibold text-green-900">{user.id}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Loading user information...</p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div 
              onClick={() => navigate('/my-bookings')}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">My Appointments</h3>
                  <p className="text-4xl font-bold text-blue-600">{upcomingBookings.length}</p>
                  <p className="text-sm text-gray-500 mt-1">Upcoming bookings</p>
                </div>
                <div className="text-5xl">📅</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Bookings</h3>
                  <p className="text-4xl font-bold text-green-600">{bookings.length}</p>
                  <p className="text-sm text-gray-500 mt-1">All time</p>
                </div>
                <div className="text-5xl">📊</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Visits</h3>
                  <p className="text-4xl font-bold text-purple-600">{completedBookings.length}</p>
                  <p className="text-sm text-gray-500 mt-1">Completed appointments</p>
                </div>
                <div className="text-5xl">✨</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-green-900">Recent Activity</h3>
              {bookings.length > 0 && (
                <button
                  onClick={() => navigate('/my-bookings')}
                  className="text-green-700 hover:text-green-900 font-medium text-sm"
                >
                  View All →
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">⏳</div>
                <p className="text-gray-600 text-lg">Loading your bookings...</p>
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-600 text-lg">No recent activity</p>
                <p className="text-gray-500 mt-2">Your appointments and bookings will appear here</p>
                <button
                  onClick={() => navigate('/salons')}
                  className="mt-4 px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-semibold"
                >
                  Browse Salons
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => {
                  const bookingDate = new Date(booking.date);
                  const isUpcomingBooking = isUpcoming(booking);
                  
                  return (
                    <div
                      key={booking._id}
                      onClick={() => navigate('/my-bookings')}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-3xl">
                          {isUpcomingBooking ? '📅' : booking.status === 'completed' ? '✅' : '📋'}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{booking.salonName}</h4>
                          <p className="text-sm text-gray-600">
                            {bookingDate.toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })} at {booking.time}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.services.slice(0, 2).join(', ')}
                            {booking.services.length > 2 && ` +${booking.services.length - 2} more`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {booking.totalAmount !== undefined && booking.totalAmount > 0 && (
                          <span className="text-green-700 font-semibold hidden sm:block">
                            ${booking.totalAmount.toFixed(2)}
                          </span>
                        )}
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h3 className="text-2xl font-semibold text-green-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => navigate('/salons')}
                className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <span>🔍</span>
                Browse Salons
              </button>
              <button 
                onClick={() => navigate('/home')}
                className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <span>📅</span>
                Book Appointment
              </button>
              <button 
                onClick={() => navigate('/my-bookings')}
                className="bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <span>📝</span>
                My Bookings
              </button>
              <button className="bg-gray-600 text-white px-6 py-4 rounded-lg hover:bg-gray-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <span>⚙️</span>
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboardPage;
