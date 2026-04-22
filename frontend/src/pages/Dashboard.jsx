import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Plus, Trash2, Edit3, ExternalLink } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

export default function Dashboard() {
    const [myEvents, setMyEvents] = useState([]);
    const navigate = useNavigate();

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
                    <div key={event.id} className="bg-[#1a1a1a] border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:border-purple-500/50 transition">
                        <div className="flex items-center gap-6">
                            <img src={event.imageUrl || 'placeholder'} className="w-16 h-16 rounded-lg object-cover grayscale group-hover:grayscale-0 transition" />
                            <div>
                                <h3 className="text-xl font-bold">{event.title}</h3>
                                <p className="text-gray-500 text-sm">{new Date(event.eventDate).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Link to={`/event/${event.id}`} className="p-3 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition"><ExternalLink size={20} /></Link>
                            <button onClick={() => handleDelete(event.id)} className="p-3 hover:bg-red-500/10 rounded-xl text-gray-400 hover:text-red-500 transition"><Trash2 size={20} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}