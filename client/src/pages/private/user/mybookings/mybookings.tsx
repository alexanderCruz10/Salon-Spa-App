import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '@/lib/api';
import UserNavBar from '@/components/UserNavBar';
import toast from 'react-hot-toast';
import type { Booking } from '@/types/booking';

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all');
  const [cancelling, setCancelling] = useState<string | null>(null);

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
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    const reason = prompt('Please provide a reason for cancellation (optional):');
    
    try {
      setCancelling(bookingId);
      await bookingAPI.cancel(bookingId, reason || undefined);
      toast.success('Booking cancelled successfully');
      fetchBookings(); // Refresh the list
    } catch (err) {
      console.error('Failed to cancel booking', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel booking';
      toast.error(errorMessage);
    } finally {
      setCancelling(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
      completed: 'bg-blue-100 text-blue-800 border-blue-300',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const isUpcoming = (booking: Booking) => {
    const bookingDateTime = new Date(`${new Date(booking.date).toISOString().split('T')[0]}T${booking.time}`);
    return bookingDateTime > new Date() && booking.status !== 'cancelled' && booking.status !== 'completed';
  };

  const isPast = (booking: Booking) => {
    const bookingDateTime = new Date(`${new Date(booking.date).toISOString().split('T')[0]}T${booking.time}`);
    return bookingDateTime <= new Date() || booking.status === 'completed';
  };

  const canCancel = (booking: Booking) => {
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return false;
    }
    const bookingDateTime = new Date(`${new Date(booking.date).toISOString().split('T')[0]}T${booking.time}`);
    return bookingDateTime > new Date();
  };

  const filteredBookings = bookings.filter(booking => {
    switch (filter) {
      case 'upcoming':
        return isUpcoming(booking);
      case 'past':
        return isPast(booking);
      case 'cancelled':
        return booking.status === 'cancelled';
      default:
        return true;
    }
  });

  const upcomingCount = bookings.filter(isUpcoming).length;
  const pastCount = bookings.filter(isPast).length;
  const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-green-700">
        <UserNavBar />
        <main className="p-8 text-center text-white">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-lg">Loading your bookings...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-700">
      <UserNavBar />

      <main className="p-6 md:p-12 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Bookings</h1>
          <p className="text-green-100">View and manage your salon appointments</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6 p-2 flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'all'
                ? 'bg-green-700 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'upcoming'
                ? 'bg-green-700 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Upcoming ({upcomingCount})
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'past'
                ? 'bg-green-700 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Past ({pastCount})
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'cancelled'
                ? 'bg-green-700 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Cancelled ({cancelledCount})
          </button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
            </h2>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Start exploring salons and book your first appointment!'
                : `You don't have any ${filter} bookings.`}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => navigate('/salons')}
                className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-semibold"
              >
                Browse Salons
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const salonData = typeof booking.salonId === 'object' ? booking.salonId : null;
              
              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {booking.salonName}
                        </h3>
                        {booking.salonAddress && (
                          <p className="text-gray-600 text-sm">📍 {booking.salonAddress}</p>
                        )}
                      </div>
                      <div>{getStatusBadge(booking.status)}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Date & Time */}
                      <div className="flex items-start gap-2">
                        <span className="text-2xl">📅</span>
                        <div>
                          <p className="text-sm text-gray-500">Date & Time</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(booking.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                          <p className="text-gray-700">{booking.time}</p>
                        </div>
                      </div>

                      {/* Services */}
                      <div className="flex items-start gap-2">
                        <span className="text-2xl">✨</span>
                        <div>
                          <p className="text-sm text-gray-500">Services</p>
                          <p className="font-semibold text-gray-900">
                            {booking.services.join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Total Amount */}
                    {booking.totalAmount !== undefined && booking.totalAmount > 0 && (
                      <div className="mb-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Estimated Total</p>
                        <p className="text-2xl font-bold text-green-700">
                          ${booking.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    )}

                    {/* Notes */}
                    {booking.notes && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Your Notes</p>
                        <p className="text-gray-700">{booking.notes}</p>
                      </div>
                    )}

                    {/* Cancellation Info */}
                    {booking.status === 'cancelled' && booking.cancelledAt && (
                      <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm text-red-600 font-semibold mb-1">
                          Cancelled on {new Date(booking.cancelledAt).toLocaleDateString()}
                        </p>
                        {booking.cancellationReason && (
                          <p className="text-sm text-red-700">
                            Reason: {booking.cancellationReason}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Contact Info */}
                    {booking.salonPhone && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="text-gray-700">📞 {booking.salonPhone}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      {salonData && (
                        <button
                          onClick={() => navigate(`/salons/${salonData._id}`)}
                          className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                          View Salon
                        </button>
                      )}
                      
                      {canCancel(booking) && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={cancelling === booking._id}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancelling === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                      )}
                    </div>

                    {/* Booking ID (small text at bottom) */}
                    <p className="text-xs text-gray-400 mt-3">
                      Booking ID: {booking._id}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyBookings;
