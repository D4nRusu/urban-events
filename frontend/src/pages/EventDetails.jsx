import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Calendar, MapPin, User, ArrowLeft } from 'lucide-react';

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/events/${id}`)
            .then(res => {
                setEvent(res.data);
                setLoading(false);
            })
            .catch(() => navigate('/')); // Redirect home if event doesn't exist
    }, [id, navigate]);

    if (loading) return <div className="p-20 text-center animate-pulse text-gray-500">Loading event...</div>;

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
                        src={event.imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png?_=20200912122019'}
                        className="w-full h-full object-cover"
                        alt={event.title}
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
                            <span className="font-medium">{new Date(event.dateTime).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="text-purple-500" size={20} />
                            <span className="font-medium">{event.location || "Urban Venue"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <User className="text-purple-500" size={20} />
                            <span className="font-medium">Hosted by Organizer #{event.organizerId}</span>
                        </div>
                    </div>

                    <p className="text-gray-400 leading-relaxed text-lg mb-8">
                        {event.description}
                    </p>

                    <button
                        onClick={() => handleAttend(event.id)}
                        className={`w-full py-3 rounded-xl font-bold transition-all duration-200 ${event.isAttending
                            ? "bg-gray-800 text-gray-400 border border-gray-700 hover:border-red-500 hover:text-red-500"
                            : "bg-white text-black hover:bg-purple-600 hover:text-white shadow-lg"
                            }`}
                    >
                        {event.isAttending ? "✓ Attending" : "Attend Event"}
                    </button>
                </div>
            </div>
        </main>
    );
}