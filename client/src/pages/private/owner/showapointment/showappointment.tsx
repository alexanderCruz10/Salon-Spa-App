import { useState, useEffect } from 'react';
import OwnerNavBar from '@/components/OwnerNavBar';
import { salonAPI, bookingAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import type { Booking } from '@/types/booking';

function ShowAppointment() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Loading owner salons and bookings...');
      
      // Get salons owned by this owner
      const salonsRes = await salonAPI.getOwnerSalons();
      console.log('Salons response:', salonsRes);
      
      const salonsData = salonsRes?.data ?? salonsRes ?? [];
      console.log('Salons data:', salonsData);

      // For each salon, fetch bookings and merge
      const allBookings: Booking[] = [];
      if (Array.isArray(salonsData) && salonsData.length > 0) {
        console.log(`Fetching bookings for ${salonsData.length} salon(s)...`);
        
        for (const s of salonsData) {
          try {
            const salonId = (s as { _id?: string; id?: string })._id || (s as { _id?: string; id?: string }).id;
            if (!salonId) {
              console.warn('Salon missing ID:', s);
              continue;
            }
            
            console.log(`Fetching bookings for salon ${salonId}...`);
            const res = await bookingAPI.getSalonBookings(salonId);
            console.log(`Bookings for salon ${salonId}:`, res);
            
            const data = res?.data ?? res ?? [];
            if (Array.isArray(data)) {
              // Attach salon snapshot if missing
              data.forEach((b: Booking) => {
                if (!b.salonName && (s as { name?: string }).name) {
                  b.salonName = (s as { name: string }).name;
                }
                allBookings.push(b);
              });
            }
          } catch (err) {
            console.error('Failed to load bookings for salon', s, err);
          }
        }
      } else {
        console.log('No salons found for this owner');
      }

      // Sort by date then time
      allBookings.sort((a, b) => {
        const da = new Date(a.date).getTime();
        const db = new Date(b.date).getTime();
        if (da !== db) return da - db;
        return a.time.localeCompare(b.time);
      });

      console.log(`Total bookings loaded: ${allBookings.length}`);
      setBookings(allBookings);
    } catch (err) {
      console.error('Failed to load owner data', err);
      toast.error('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = bookings.filter((b) => (filter === 'all' ? true : b.status === filter));

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
      completed: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${map[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    let reason: string | undefined;
    if (status === 'cancelled') {
      reason = prompt('Provide a cancellation reason (optional):') || undefined;
    }

    try {
      setActionLoading(bookingId);
      await bookingAPI.updateStatus(bookingId, status, reason);
      toast.success(`Booking ${status} successfully`);
      await loadData();
    } catch (err) {
      console.error('Failed to update booking status', err);
      const msg = err instanceof Error ? err.message : 'Failed to update booking';
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <OwnerNavBar />
        <main className="p-8 text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-lg text-gray-700">Loading appointments...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <OwnerNavBar />
      <main className="p-6 md:p-12 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-600">Manage bookings for your salon(s)</p>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 rounded-md ${filter === 'all' ? 'bg-green-700 text-white' : 'bg-white text-gray-700 border'}`}
          >All ({bookings.length})</button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-2 rounded-md ${filter === 'pending' ? 'bg-green-700 text-white' : 'bg-white text-gray-700 border'}`}
          >Pending ({bookings.filter(b => b.status === 'pending').length})</button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-3 py-2 rounded-md ${filter === 'confirmed' ? 'bg-green-700 text-white' : 'bg-white text-gray-700 border'}`}
          >Confirmed ({bookings.filter(b => b.status === 'confirmed').length})</button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-2 rounded-md ${filter === 'completed' ? 'bg-green-700 text-white' : 'bg-white text-gray-700 border'}`}
          >Completed ({bookings.filter(b => b.status === 'completed').length})</button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-3 py-2 rounded-md ${filter === 'cancelled' ? 'bg-green-700 text-white' : 'bg-white text-gray-700 border'}`}
          >Cancelled ({bookings.filter(b => b.status === 'cancelled').length})</button>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-800">No appointments</h3>
            <p className="text-gray-600 mt-2">You currently have no appointments for your salons.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((b) => (
              <div key={b._id} className="bg-white rounded-lg shadow p-4 flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{b.salonName}</h4>
                      <p className="text-sm text-gray-600">{b.customerName} • {b.customerEmail}</p>
                    </div>
                    <div>{statusBadge(b.status)}</div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-semibold text-gray-900">{new Date(b.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-700">{b.time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Services</p>
                      <p className="font-semibold text-gray-900">{b.services.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-semibold text-green-700">{b.totalAmount ? `$${b.totalAmount.toFixed(2)}` : '—'}</p>
                    </div>
                  </div>

                  {b.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <p className="text-sm text-gray-700">Notes: {b.notes}</p>
                    </div>
                  )}
                </div>

                <div className="ml-4 flex flex-col gap-2">
                  {b.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(b._id, 'confirmed')}
                      disabled={actionLoading === b._id}
                      className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {actionLoading === b._id ? 'Processing...' : 'Confirm'}
                    </button>
                  )}

                  {b.status !== 'cancelled' && (
                    <button
                      onClick={() => handleUpdateStatus(b._id, 'cancelled')}
                      disabled={actionLoading === b._id}
                      className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      {actionLoading === b._id ? 'Processing...' : 'Cancel'}
                    </button>
                  )}

                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(b._id, 'completed')}
                      disabled={actionLoading === b._id}
                      className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {actionLoading === b._id ? 'Processing...' : 'Mark Completed'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ShowAppointment;
