import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadData = async () => {
      try {
        // Parallel fetch for speed
        const [upRes, pastRes] = await Promise.all([
          api.get('/events/upcoming'),
          api.get('/events/past')
        ]);

        let upcomingData = upRes.data;
        let pastData = pastRes.data;

        // If logged in, check which ones we are attending
        if (token) {
          const bookingsRes = await api.get('/bookings/mine');
          const myBookedIds = bookingsRes.data;

          const markAttending = (list) => list.map(event => ({
            ...event,
            isAttending: myBookedIds.includes(event.id)
          }));

          upcomingData = markAttending(upcomingData);
          pastData = markAttending(pastData);
        }

        setUpcoming(upcomingData);
        setPast(pastData);
      } catch (err) {
        console.error("Data fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  // Helper to identify events happening today
  const isToday = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  };

  const handleAttend = async (eventId) => {
    if (!token) { navigate('/login'); return; }
    try {
      await api.post(`/bookings/event/${eventId}`);
      const updateList = (list) => list.map(e => e.id === eventId ? { ...e, isAttending: !e.isAttending } : e);
      setUpcoming(updateList(upcoming));
      setPast(updateList(past));
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-500 animate-pulse uppercase tracking-widest font-black">Loading Feed...</div>;

  const todayEvents = upcoming.filter(e => isToday(e.eventDate));
  const trulyUpcoming = upcoming.filter(e => !isToday(e.eventDate));

  return (
    <main className="p-8 max-w-7xl mx-auto space-y-24">
      
      {todayEvents.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Happening <span className="text-red-500">Today</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {todayEvents.map(event => (
              <EventCard key={event.id} event={event} handleAttend={handleAttend} variant="today" />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-4xl font-black mb-8 uppercase tracking-tighter text-white">Upcoming <span className="text-purple-500">Events</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trulyUpcoming.map(event => (
            <EventCard key={event.id} event={event} handleAttend={handleAttend} variant="upcoming" />
          ))}
        </div>
      </section>

      {past.length > 0 && (
        <section className="pb-20">
          <h2 className="text-2xl font-black mb-8 uppercase tracking-widest text-gray-600">Past Archives</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {past.map(event => (
              <EventCard key={event.id} event={event} handleAttend={handleAttend} variant="past" />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function EventCard({ event, handleAttend, variant }) {
  const isPast = variant === 'past';
  const isToday = variant === 'today';

  return (
    <div className={`relative bg-[#1a1a1a] rounded-2xl overflow-hidden border transition-all duration-300 group shadow-2xl ${
      isToday ? 'border-red-500/30' : isPast ? 'border-white/5 opacity-60 grayscale' : 'border-white/5 hover:border-purple-500'
    }`}>
      
      {/* Image Header */}
      <div className="h-48 overflow-hidden relative">
        <img 
          src={event.imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png'} 
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110" 
        />
        {isToday && (
          <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter animate-pulse">
            Live Now
          </div>
        )}
      </div>

      <div className="p-6">
        <span className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-red-500' : 'text-purple-500'}`}>
          {event.tags?.[0] || 'Urban'}
        </span>
        
        <h3 className="text-xl font-bold text-white mt-1 group-hover:text-purple-400 transition">{event.title}</h3>
        <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">{event.description}</p>

        {/* Info Row */}
        <div className={`flex items-center gap-4 mt-6 pt-6 border-t border-white/5 text-[11px] font-mono uppercase tracking-widest ${isToday ? 'text-red-400' : 'text-gray-400'}`}>
          <span className="flex items-center gap-1.5"><Calendar size={13}/> {new Date(event.eventDate).toLocaleDateString()}</span>
          <span className="flex items-center gap-1.5"><Clock size={13}/> {new Date(event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        {(
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => handleAttend(event.id)}
              className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                event.isAttending 
                ? 'bg-transparent border border-white/10 text-gray-500 hover:border-red-500 hover:text-red-500' 
                : 'bg-white text-black hover:bg-purple-600 hover:text-white'
              }`}
            >
              {event.isAttending ? '✓ Booked' : 'Attend'}
            </button>
            <Link 
              to={`/event/${event.id}`} 
              className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-gray-500 hover:text-white transition"
            >
              View Details <ArrowRight size={14}/>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}