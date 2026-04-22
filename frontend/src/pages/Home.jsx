import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get('/events')
      .then(res => setEvents(res.data))
      .catch(err => console.error("Failed to fetch events", err));
  }, []);

  const handleAttend = async (eventId) => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    try {
      const response = await api.post(`/bookings/event/${eventId}`);
      setEvents(prevEvents => prevEvents.map(event => {
        if (event.id === eventId) {
          return { ...event, isAttending: !event.isAttending };
        }
        return event;
      }));

    } catch (err) {
      const errorMsg = typeof err.response?.data === 'string'
        ? err.response.data
        : err.response?.data?.message || "Error";
      alert(errorMsg);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-8 uppercase tracking-widest text-white">Upcoming Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map(event => (
          <div key={event.id} className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500 transition group shadow-lg">
            <div className="h-48 bg-gray-900">
              <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
            </div>

            <div className="p-5">
              <span className="text-purple-400 text-xs font-bold uppercase tracking-tighter">
                {event.tags && event.tags.length > 0 ? event.tags[0] : 'Event'}
              </span>
              <h2 className="text-xl font-bold mt-1 text-white group-hover:text-purple-400 transition">{event.title}</h2>
              <p className="text-gray-400 text-sm mt-2 line-clamp-2">{event.description}</p>

              <div className="flex flex-col gap-2 mt-6">
                <button
                  onClick={() => handleAttend(event.id)}
                  className="w-full py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-500 transition transform active:scale-95"
                >
                  {event.isAttending ? 'Unattend Event' : 'Attend Event'}
                </button>
                <button className="w-full py-2 bg-transparent border border-gray-700 text-gray-300 rounded-lg font-semibold hover:bg-white hover:text-black transition">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}