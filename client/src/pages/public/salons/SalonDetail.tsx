import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { salonAPI } from '@/lib/api';
import UserNavBar from '@/components/UserNavBar';
import toast from 'react-hot-toast';
import { useUserStore } from '@/store/userStore';
import type { Salon, OpeningHours } from '@/types/salon';

export default function SalonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUserStore();

  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchSalon = async () => {
      try {
        setLoading(true);
        const res = await salonAPI.getById(id);
        // API may return { data: salon } or the salon object directly
        const data = res?.data ?? res;
        setSalon(data || null);
      } catch (err) {
        console.error('Failed to load salon', err);
        toast.error('Failed to load salon');
      } finally {
        setLoading(false);
      }
    };

    fetchSalon();
  }, [id]);

  const handleBook = () => {
    if (!salon) return;
    if (user) {
      navigate(`/book/${salon._id}`);
    } else {
      navigate('/login', { state: { from: `/salons/${id}` } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-700">
        <UserNavBar />
        <main className="p-8 text-center text-white">Loading salon...</main>
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
            <p className="text-gray-600 mb-4">We couldn't find the requested salon.</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => navigate('/salons')}
                className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
              >
                Back to salons
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-700">
      <UserNavBar />

      <main className="p-6 md:p-12 max-w-5xl mx-auto">
        <div className="bg-white rounded-lg p-6 md:p-8 shadow">
          <h1 className="text-3xl font-bold text-green-900 mb-3">{salon.name}</h1>
          {salon.description && (
            <p className="text-gray-700 mb-4">{salon.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-green-800">Contact</h3>
              {salon.phone && <p className="text-gray-700">📞 {salon.phone}</p>}
              {salon.email && <p className="text-gray-700">✉️ {salon.email}</p>}

              {salon.services && salon.services.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-green-800 mb-2">Services</h4>
                  <ul className="flex flex-wrap gap-2">
                    {salon.services.map((s, i) => (
                      <li key={i} className="bg-green-50 text-green-800 px-3 py-1 rounded text-sm">
                        {typeof s === 'string' ? s : `${s.name}${s.price !== undefined ? ` - $${s.price.toFixed(2)}` : ''}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-green-800">Location</h3>
              {salon.address && <p className="text-gray-700">{salon.address}</p>}
              <p className="text-gray-700">{salon.city}{salon.province ? `, ${salon.province}` : ''}</p>

              {salon.openingHours && (
                <div className="mt-4">
                  <h4 className="font-semibold text-green-800 mb-2">Opening Hours</h4>
                  <ul className="text-sm text-gray-700">
                    {(Object.entries(salon.openingHours) as Array<[keyof OpeningHours, OpeningHours[keyof OpeningHours]]>).map(([day, hours]) => (
                      <li key={String(day)}>{String(day)}: {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleBook}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
            >
              Book Appointment
            </button>

            <button
              onClick={() => navigate('/salons')}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded"
            >
              Back to Salons
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
