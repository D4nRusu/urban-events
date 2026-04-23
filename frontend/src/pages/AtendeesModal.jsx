import { useState, useEffect } from 'react'; // Missing this!
import api from '../api/axios';             // Missing this!
import { Users, X, Mail } from 'lucide-react';

export default function AttendeesModal({ eventId, onClose }) {
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/bookings/event/${eventId}/attendees`)
            .then(res => {
                setAttendees(res.data); // Expecting list of User objects
                setLoading(false);
            });
    }, [eventId]);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#121212] border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                        <Users className="text-purple-500" size={20} />
                        <h2 className="font-black uppercase tracking-tighter">Guest List</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white"><X /></button>
                </div>

                <div className="max-h-[400px] overflow-y-auto p-4 space-y-2">
                    {loading ? (
                        <p className="text-center py-10 text-gray-500 animate-pulse uppercase text-xs font-bold">Fetching Guest List...</p>
                    ) : attendees.length === 0 ? (
                        <p className="text-center py-10 text-gray-600 uppercase text-xs font-bold">No Attendees yet</p>
                    ) : (
                        attendees.map(user => (
                            <div key={user.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-black text-sm">
                                    {user.fullName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{user.fullName}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={10}/> {user.email}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                
                <div className="p-4 bg-white/[0.02] border-t border-white/5">
                    <button onClick={onClose} className="w-full py-3 bg-white text-black font-black uppercase text-xs rounded-xl hover:bg-purple-500 hover:text-white transition">
                        Close List
                    </button>
                </div>
            </div>
        </div>
    );
}