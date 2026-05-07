import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function CreateEvent() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventDate: '',
        location: '',
        imageUrl: '',
        tags: '' // We'll split this string into an array before sending
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        let formattedDate = formData.eventDate;
        if (formattedDate && formattedDate.length === 16) {
            formattedDate += ":00";
        }

        const formattedData = {
            ...formData,
            eventDate: formattedDate,
            tags: formData.tags.split(',')
                .map(tag => tag.trim())
                .filter(tag => tag !== "")
        };

        try {
            await api.post('/events', formattedData);
            navigate('/dashboard');
        } catch (err) {
            console.error("Validation Error Details:", err.response?.data);
            alert("Creation failed. Check console for field errors.");
        }
    };

    return (
        <main className="max-w-2xl mx-auto p-8">
            <h2 className="text-4xl font-black mb-8 uppercase tracking-tighter">Post Event</h2>
            <form onSubmit={handleSubmit} className="grid gap-6">
                <input
                    type="text" placeholder="Event Title" required
                    className="bg-black border border-white/10 p-4 rounded-xl focus:border-purple-500 outline-none"
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                />

                <div className="flex justify-between items-end mb-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                    <span className="text-[10px] text-purple-400 font-mono">Use # for H1, ## for H2, **bold**</span>
                </div>

                <textarea
                    placeholder="# Big Title&#10;## Smaller Title&#10;Regular text here..." 
                    rows="6"
                    className="bg-black border border-white/10 p-4 rounded-xl focus:border-purple-500 outline-none font-mono text-sm"
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="datetime-local" required
                        className="bg-black border border-white/10 p-4 rounded-xl focus:border-purple-500 outline-none text-gray-400"
                        onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                    />
                    <input
                        type="text" placeholder="Location"
                        className="bg-black border border-white/10 p-4 rounded-xl focus:border-purple-500 outline-none"
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                    />
                </div>

                <input
                    type="url" placeholder="Image URL"
                    className="bg-black border border-white/10 p-4 rounded-xl focus:border-purple-500 outline-none"
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                />

                <input
                    type="text" placeholder="Tags (comma separated: techno, rooftop, night)"
                    className="bg-black border border-white/10 p-4 rounded-xl focus:border-purple-500 outline-none"
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                />

                <button className="bg-white text-black font-black py-4 rounded-xl hover:bg-purple-600 hover:text-white transition uppercase">
                    Launch Event
                </button>
            </form>
        </main>
    );
}