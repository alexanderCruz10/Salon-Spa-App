

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { salonAPI, bookingAPI } from '@/lib/api';
import UserNavBar from '@/components/UserNavBar';
import toast from 'react-hot-toast';
import { useUserStore } from '@/store/userStore';
import type { Salon } from '@/types/salon';

interface BookingFormData {
  salonId: string;
  services: string[];
  date: string;
  time: string;
  notes: string;
}

function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUserStore();
  
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<BookingFormData>({
    salonId: id || '',
    services: [],
    date: '',
    time: '',
    notes: '',
  });

  useEffect(() => {
    if (!id) {
      toast.error('Salon ID is required');
      navigate('/salons');
      return;
    }
    fetchSalon();
  }, [id]);

  const fetchSalon = async () => {
    try {
      setLoading(true);
      const res = await salonAPI.getById(id!);
      const data = res?.data ?? res;
      setSalon(data || null);
    } catch (err) {
      console.error('Failed to load salon', err);
      toast.error('Failed to load salon');
      navigate('/salons');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceToggle = (serviceName: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceName)
        ? prev.services.filter((s) => s !== serviceName)
        : [...prev.services, serviceName],
    }));
  };

  const calculateTotal = () => {
    if (!salon) return 0;
    let total = 0;
    formData.services.forEach((serviceName) => {
      const service = salon.services.find((s) => 
        typeof s === 'string' ? s === serviceName : s.name === serviceName
      );
      if (service && typeof service !== 'string' && service.price) {
        total += service.price;
      }
    });
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.services.length === 0) {
      toast.error('Please select at least one service');
      return;
    }
    if (!formData.date) {
      toast.error('Please select a date');
      return;
    }
    if (!formData.time) {
      toast.error('Please select a time');
      return;
    }

    setSubmitting(true);
    try {
      const total = calculateTotal();
      
      await bookingAPI.create({
        salonId: formData.salonId,
        services: formData.services,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        totalAmount: total
      });
      
      toast.success('Booking request submitted successfully!');
      navigate('/my-bookings');
    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit booking. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-700">
        <UserNavBar />
        <main className="p-8 text-center text-white">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-lg">Loading booking details...</p>
        </main>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-green-700">
        <UserNavBar />
        <main className="p-8 text-center">
          <div className="bg-white rounded-lg p-8 shadow max-w-xl mx-auto">
            <h2 className="text-xl font-semibold text-green-900 mb-2">Salon not found</h2>
            <button
              onClick={() => navigate('/salons')}
              className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
            >
              Back to Salons
            </button>
          </div>
        </main>
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-green-700">
      <UserNavBar />

      <main className="p-6 md:p-12 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 md:p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Book Appointment</h1>
            <p className="text-green-100">{salon.name}</p>
            <p className="text-green-100 text-sm">
              📍 {salon.address}, {salon.city}, {salon.province}
            </p>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {/* User Info */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-green-900 mb-4">Your Information</h2>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <span className="font-semibold">Name:</span> {user?.name || 'Guest'}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span> {user?.email || 'Not provided'}
                </p>
              </div>
            </div>

            {/* Services Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-green-900 mb-4">
                Select Services *
              </h2>
              {salon.services && salon.services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {salon.services.map((service, idx) => {
                    const serviceName = typeof service === 'string' ? service : service.name;
                    const servicePrice = typeof service === 'string' ? null : service.price;
                    const isSelected = formData.services.includes(serviceName);

                    return (
                      <label
                        key={idx}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleServiceToggle(serviceName)}
                            className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                          />
                          <span className="font-medium text-gray-800">{serviceName}</span>
                        </div>
                        {servicePrice !== null && servicePrice !== undefined && (
                          <span className="text-green-700 font-semibold">
                            ${servicePrice.toFixed(2)}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-600">No services available</p>
              )}
            </div>

            {/* Date Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-green-900 mb-4">Select Date *</h2>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={getMinDate()}
                max={getMaxDate()}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Time Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-green-900 mb-4">Select Time *</h2>
              <select
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Choose a time slot</option>
                <option value="09:00">9:00 AM</option>
                <option value="09:30">9:30 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="10:30">10:30 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="11:30">11:30 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="12:30">12:30 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="13:30">1:30 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="14:30">2:30 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="15:30">3:30 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="16:30">4:30 PM</option>
                <option value="17:00">5:00 PM</option>
                <option value="17:30">5:30 PM</option>
              </select>
            </div>

            {/* Additional Notes */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-green-900 mb-4">
                Additional Notes (Optional)
              </h2>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                placeholder="Any special requests or preferences..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Summary */}
            {formData.services.length > 0 && (
              <div className="mb-8 bg-green-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-green-900 mb-4">Booking Summary</h2>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-semibold">Selected Services:</span>{' '}
                    {formData.services.join(', ')}
                  </p>
                  {formData.date && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Date:</span>{' '}
                      {new Date(formData.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                  {formData.time && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Time:</span> {formData.time}
                    </p>
                  )}
                  {total > 0 && (
                    <p className="text-lg font-bold text-green-700 pt-2 border-t border-green-200">
                      Estimated Total: ${total.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(`/salons/${salon._id}`)}
                className="flex-1 bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || formData.services.length === 0}
                className="flex-1 bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default BookingPage;


