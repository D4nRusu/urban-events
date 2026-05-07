import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    imageUrl: '',
    tags: ''
  });

  useEffect(() => {
    // Fetch existing data
    api.get(`/events/${id}`)
      .then(res => {
        const event = res.data;
        // Convert the tags array back into a comma-separated string for the input
        setFormData({
          ...event,
          tags: event.tags ? event.tags.join(', ') : '',
          // Ensure date matches the datetime-local format (yyyy-MM-ddThh:mm)
          eventDate: event.eventDate ? event.eventDate.substring(0, 16) : ''
        });
      })
      .catch(err => console.error("Could not fetch event", err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Formatting for the Backend DTO
    let formattedDate = formData.eventDate;
    if (formattedDate && formattedDate.length === 16) formattedDate += ":00";

    const updatedData = {
      ...formData,
      eventDate: formattedDate,
      tags: typeof formData.tags === 'string' 
        ? formData.tags.split(',').map(t => t.trim()).filter(t => t !== "")
        : formData.tags
    };

    try {
      await api.put(`/events/${id}`, updatedData);
      navigate('/dashboard');
    } catch (err) {
      alert("Update failed.");
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h2 className="text-4xl font-black mb-8 uppercase tracking-tighter text-purple-500">Edit Event</h2>
      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Event Title</label>
          <input 
            type="text" value={formData.title} required
            className="bg-black border border-white/10 p-4 rounded-xl focus:border-purple-500 outline-none text-white"
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>
        
        <textarea
          placeholder="# Big Title&#10;## Smaller Title&#10;Regular text here..." 
          rows="6"
          className="bg-black border border-white/10 p-4 rounded-xl focus:border-purple-500 outline-none font-mono text-sm"
          onChange={e => setFormData({ ...formData, description: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <input 
            type="datetime-local" required value={formData.eventDate}
            className="bg-black border border-white/10 p-4 rounded-xl focus:border-purple-500 outline-none text-gray-400"
            onChange={e => setFormData({...formData, eventDate: e.target.value})}
          />
          <input 
            type="text" placeholder="Location" value={formData.location}
            className="bg-black border border-white/10 p-4 rounded-xl focus:border-purple-500 outline-none text-white"
            onChange={e => setFormData({...formData, location: e.target.value})}
          />
        </div>

        <input 
          type="url" placeholder="Image URL" value={formData.imageUrl}
          className="bg-black border border-white/10 p-4 rounded-xl focus:border-purple-500 outline-none text-white"
          onChange={e => setFormData({...formData, imageUrl: e.target.value})}
        />

        <input 
          type="text" placeholder="Tags (comma separated)" value={formData.tags}
          className="bg-black border border-white/10 p-4 rounded-xl focus:border-purple-500 outline-none text-white"
          onChange={e => setFormData({...formData, tags: e.target.value})}
        />

        <div className="flex gap-4">
            <button type="button" onClick={() => navigate('/dashboard')} className="flex-1 bg-white/5 text-white font-bold py-4 rounded-xl hover:bg-white/10 transition">
              Cancel
            </button>
            <button type="submit" className="flex-[2] bg-purple-600 text-white font-black py-4 rounded-xl hover:bg-purple-500 transition uppercase">
              Save Changes
            </button>
        </div>
      </form>
    </main>
  );
}