import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added navigate
import api from '../api/axios';
import { Trash2, Edit3, ShieldAlert, Users, ExternalLink } from 'lucide-react';
import AttendeesModal from './AtendeesModal';

export default function AdminDashboard() {
    const [allEvents, setAllEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        api.get('/admin/events')
            .then(res => setAllEvents(res.data))
            .catch(err => console.error("Admin access denied", err));
    }, []);

    const handleAdminDelete = async (id) => {
        if (!window.confirm("ADMIN ACTION: Delete this event permanently?")) return;
        try {
            await api.delete(`/admin/events/${id}`);
            setAllEvents(allEvents.filter(e => e.id !== id));
        } catch (err) {
            alert("Admin delete failed.");
        }
    };

    // Handler for clicking the row to see event details
    const handleRowClick = (id) => {
        navigate(`/event/${id}`);
    };

    return (
        <main className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
                <div className="p-3 bg-red-500/20 text-red-500 rounded-2xl">
                    <ShieldAlert size={32} />
                </div>
                <div>
                    <h1 className="text-5xl font-black uppercase tracking-tighter text-white">Admin <span className="text-red-500">Dashboard</span></h1>
                    <p className="text-gray-500">View, Edit, or Remove any event.</p>
                </div>
            </div>

            <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-gray-400 text-xs uppercase font-black">
                        <tr>
                            <th className="p-6">Event / Organizer</th>
                            <th className="p-6">Date</th>
                            <th className="p-6">Attendees</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {allEvents.map(event => (
                            <tr 
                                key={event.id} 
                                onClick={() => handleRowClick(event.id)} // View Event on row click
                                className="cursor-pointer hover:bg-white/[0.04] transition group"
                            >
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <img 
                                            src={event.imageUrl || 'https://via.placeholder.com/150'} 
                                            className="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition" 
                                        />
                                        <div>
                                            <p className="font-bold text-white group-hover:text-purple-400 transition">{event.title}</p>
                                            <p className="text-xs text-gray-500 font-mono">By: {event.organizer?.fullName || 'Unknown'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6 text-sm text-gray-400 font-mono uppercase">
                                    {new Date(event.eventDate).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </td>
                                <td className="p-6">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevents navigating to event page
                                            setSelectedEventId(event.id);
                                        }}
                                        className="flex items-center gap-2 text-emerald-500 font-bold text-sm bg-emerald-500/10 px-3 py-1 rounded-full hover:bg-emerald-500/20 transition"
                                    >
                                        <Users size={14} /> {event.bookingCount || 0}
                                    </button>
                                </td>
                                <td className="p-6 text-right space-x-2">
                                    {/* Edit Button */}
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/edit-event/${event.id}`);
                                        }}
                                        className="p-2 text-gray-400 hover:text-purple-500 hover:bg-purple-500/10 rounded-lg transition"
                                    >
                                        <Edit3 size={18}/>
                                    </button>
                                    {/* Delete Button */}
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAdminDelete(event.id);
                                        }}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                                    >
                                        <Trash2 size={18}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {allEvents.length === 0 && (
                    <p className="text-center py-20 text-gray-600 uppercase text-xs font-black tracking-widest">No global events found</p>
                )}
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