import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Plus, Trash2, Edit3, ExternalLink } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { Users, X, Mail } from 'lucide-react';
import AttendeesModal from './AtendeesModal';

export default function Dashboard() {
    const [myEvents, setMyEvents] = useState([]);
    const navigate = useNavigate();
    const [selectedEventId, setSelectedEventId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            if (decoded.role !== 'ORGANIZER') {
                navigate('/');
                return;
            }

            api.get('/events/my-events')
                .then(res => {
                    console.log("Fetched events:", res.data);
                    setMyEvents(res.data);
                })
                .catch(err => {
                    console.error("Dashboard fetch failed", err);
                });

        } catch (err) {
            navigate('/login');
        }
    }, [navigate]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await api.delete(`/events/${id}`);
            setMyEvents(myEvents.filter(e => e.id !== id));
        } catch (err) {
            alert("Delete failed.");
        }
    };

    const handleRowClick = (id) => {
        navigate(`/event/${id}`);
    };

    return (
        <main className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter uppercase">Dashboard</h1>
                    <p className="text-gray-500 mt-2">Manage your hosted urban experiences.</p>
                </div>
                <Link to="/create-event" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold transition">
                    <Plus size={20} /> Create New Event
                </Link>
            </div>

            <div className="grid gap-4">
                {myEvents.length === 0 && <p className="text-gray-600 py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">No events hosted yet.</p>}

                {myEvents.map(event => (
                    <div
                        key={event.id}
                        onClick={() => handleRowClick(event.id)}
                        className="cursor-pointer bg-[#1a1a1a] border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:border-purple-500/50 transition transform active:scale-[0.99]"
                    >
                        <div className="flex items-center gap-6">
                            <img
                                src={event.imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png'}
                                className="w-16 h-16 rounded-lg object-cover grayscale group-hover:grayscale-0 transition"
                            />
                            <div className="flex flex-col items-start justify-start text-left">
                                <h3 className="text-xl font-bold leading-none mb-1">
                                    {event.title}
                                </h3>
                                <p className="text-gray-500 text-sm font-mono uppercase tracking-widest leading-none">
                                    {new Date(event.eventDate).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/edit-event/${event.id}`); // Use navigate for edit
                                }}
                                className="p-3 hover:bg-purple-500/10 rounded-xl text-gray-400 hover:text-purple-400 transition"
                            >
                                <Edit3 size={20} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(event.id);
                                }}
                                className="p-3 hover:bg-red-500/10 rounded-xl text-gray-400 hover:text-red-500 transition"
                            >
                                <Trash2 size={20} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedEventId(event.id);
                                }}
                                className="p-3 hover:bg-emerald-500/10 rounded-xl text-gray-400 hover:text-emerald-500 transition"
                            >
                                <Users size={20} />
                            </button>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-xl font-bold leading-none mb-1">{event.title}</h3>
                            <div className="flex items-center gap-3 mt-1">
                                <p className="text-gray-500 text-sm font-mono uppercase tracking-widest leading-none">
                                    {new Date(event.eventDate).toLocaleDateString()}
                                </p>
                                <span className="h-1 w-1 bg-gray-700 rounded-full"></span>
                                <p className="text-purple-400 text-xs font-black uppercase tracking-tighter">
                                    {event.bookingCount || 0} Attendees
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {selectedEventId && (
                <AttendeesModal
                    eventId={selectedEventId}
                    onClose={() => setSelectedEventId(null)}
                />
            )}
        </main>
    );
}

