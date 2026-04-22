import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Calendar, MapPin, User, ArrowLeft } from 'lucide-react';

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAttending, setIsAttending] = useState(false);
    const token = localStorage.getItem('token');
    const isPast = event?.eventDate ? new Date(event.eventDate) < new Date() : false;

    useEffect(() => {
        const loadEventData = async () => {
            try {
                // 1. Fetch Event Details
                const res = await api.get(`/events/${id}`);
                setEvent(res.data);

                // 2. Sync Booking State if logged in
                if (token) {
                    const bookingsRes = await api.get('/bookings/mine');
                    const myBookedIds = bookingsRes.data;
                    setIsAttending(myBookedIds.includes(parseInt(id)));
                }
                setLoading(false);
            } catch (err) {
                navigate('/');
            }
        };
        loadEventData();
    }, [id, token, navigate]);

    const handleToggleAttend = async () => {
        if (!token) {
            navigate('/login', { state: { from: `/event/${id}` } });
            return;
        }

        try {
            await api.post(`/bookings/event/${id}`);
            setIsAttending(!isAttending); // Flip the state locally
        } catch (err) {
            console.error("Toggle failed", err);
        }
    };

    if (loading || !event) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <main className="max-w-5xl mx-auto p-6 md:p-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition"
            >
                <ArrowLeft size={20} /> Back to Browse
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left Side: Image */}
                <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[400px]">
                    <img
                        src={event?.imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png'}
                        className="w-full h-full object-cover"
                        alt={event?.title || 'Event image'}
                    />
                </div>

                {/* Right Side: Info */}
                <div className="flex flex-col justify-center">
                    <div className="flex gap-2 mb-4">
                        {event.tags?.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold rounded-full uppercase">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-5xl font-black tracking-tighter mb-6 uppercase">{event.title}</h1>

                    <div className="space-y-4 mb-8 text-gray-300">
                        <div className="flex items-center gap-3">
                            <Calendar className="text-purple-500" size={20} />
                            <span className="font-medium">{new Date(event.eventDate).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="text-purple-500" size={20} />
                            <span className="font-medium">{event.location || "Urban Venue"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <User className="text-purple-500" size={20} />
                            <span className="font-medium">Hosted by - {event.organizer.fullName}</span>
                        </div>
                    </div>

                    <p className="text-gray-400 leading-relaxed text-lg p-4 mb-8">
                        {event.description}
                    </p>

                    <button
                        onClick={!isPast ? handleToggleAttend : null} // Disable click logic if past
                        disabled={isPast} // Standard HTML disabled attribute
                        className={`w-full py-5 rounded-2xl font-black text-xl tracking-tighter transition-all duration-300 transform shadow-2xl ${isPast
                                ? "bg-gray-800 text-gray-500 border border-white/5 cursor-not-allowed opacity-50" // Expired style
                                : isAttending
                                    ? "bg-emerald-500/10 border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white cursor-pointer active:scale-95"
                                    : "bg-white text-black hover:bg-purple-600 hover:text-white shadow-purple-500/20 cursor-pointer active:scale-95"
                            }`}
                    >
                        {isPast ? "EVENT HAS ENDED" : isAttending ? "✓ YOU ARE ON THE LIST" : "ATTEND THIS EVENT"}
                    </button>

                    {isPast && (
                        <p className="text-center mt-4 p-4 text-gray-500 text-sm font-bold uppercase tracking-widest">
                            Registration for this experience is closed.
                        </p>
                    )}

                    {isAttending && (
                        <p className="text-center mt-4 p-3 text-emerald-500 text-sm font-bold animate-pulse">
                            You're all set! See you at the event.
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}