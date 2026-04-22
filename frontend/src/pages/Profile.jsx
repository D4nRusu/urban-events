import { useEffect, useState } from 'react';
import api from '../api/axios';
import { User, Mail, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [userRes, bookingsRes] = await Promise.all([
          api.get('/users/myaccount'),     
          api.get('/bookings/my-bookings') 
        ]);
        setProfile(userRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error("Error loading profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  if (loading) return <div className="p-20 text-center animate-pulse text-gray-500">Loading profile...</div>;

  return (
    <main className="max-w-4xl mx-auto p-8">
      {/* User Header Card */}
      <section className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-8 mb-12 flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-3xl font-black text-white">
          {profile?.fullName?.charAt(0).toUpperCase()}
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-black tracking-tighter uppercase">{profile?.fullName}</h1>
          <div className="flex flex-col md:flex-row gap-4 mt-2 text-gray-400">
            <span className="flex items-center gap-2"><Mail size={16}/> {profile?.email}</span>
            <span className="flex items-center gap-2"><User size={16}/> Role: {profile?.role}</span>
          </div>
        </div>
      </section>

      {/* Bookings Section */}
      <section>
        <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">Your Urban Experiences</h2>
        <div className="grid gap-4">
          {bookings.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl text-gray-600">
              You haven't joined any events yet.
            </div>
          ) : (
            bookings.map(booking => (
              <Link 
                key={booking.id} 
                to={`/event/${booking.event.id}`}
                className="group bg-[#1a1a1a] border border-white/5 p-5 rounded-2xl flex items-center justify-between hover:border-purple-500/50 transition"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white/5 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold uppercase">
                    <span className="text-purple-400">
                      {new Date(booking.event.eventDate).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span>
                      {new Date(booking.event.eventDate).getDate()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-purple-400 transition">{booking.event.title}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin size={12}/> {booking.event.location}
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition" />
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}