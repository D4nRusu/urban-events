import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadData = async () => {
      try {
        const eventsRes = await api.get('/events');
        let fetchedEvents = eventsRes.data;

        if (token) {
          const bookingsRes = await api.get('/bookings/mine');
          const myBookedIds = bookingsRes.data;

          fetchedEvents = fetchedEvents.map(event => ({
            ...event,
            isAttending: myBookedIds.includes(event.id)
          }));
        }

        setEvents(fetchedEvents);
      } catch (err) {
        console.error("Data fetch failed", err);
      }
    };

    loadData();
  }, [token]);

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

  const handleCardClick = (id) => {
    navigate(`/event/${id}`);
  };

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-8 uppercase tracking-widest text-white">Upcoming Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map(event => (
          <div key={event.id} className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500 transition group shadow-lg">
            <div className="h-48 bg-gray-900">
              <img src={event.imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png?_=20200912122019'} alt={event.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
            </div>

            <div className="p-5">
              <span className="text-purple-400 text-xs font-bold uppercase tracking-tighter">
                {event.tags && event.tags.length > 0 ? event.tags[0] : 'Event'}
              </span>
              <h2 className="text-xl font-bold mt-1 text-white group-hover:text-purple-400 transition">{event.title}</h2>
              <p className="text-gray-400 text-sm mt-2 p-4 line-clamp-2">{event.description}</p>
              <p className="text-purple-500 text-xs mt-2 flex items-center justify-center gap-2 w-full border-t border-white/5 pt-4">
                <Calendar size={12} className="text-purple-500" /> {/* Assuming you use Lucide-react */}
                {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'Date TBA'}
              </p>

              <div className="flex flex-col gap-2 mt-6">
                <button
                  onClick={() => handleAttend(event.id)}
                  className={`cursor-pointer w-full py-3 rounded-xl font-bold transition-all duration-200 ${event.isAttending
                    ? "bg-gray-800 text-gray-400 border border-gray-700 hover:border-red-500 hover:text-red-500"
                    : "bg-white text-black hover:bg-purple-600 hover:text-white shadow-lg"
                    }`}
                >
                  {event.isAttending ? "✓ Attending" : "Attend Event"}
                </button>
                <Link to={`/event/${event.id}`}>
                  <button className="cursor-pointer mt-4 w-full py-2 bg-gray-800 rounded-lg font-semibold hover:bg-white hover:text-black transition">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}