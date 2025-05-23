import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Heart,
  CalendarPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Event = {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  organizerName: string;
  imageUrl?: string;
};

const AllEvent: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const response = await axios.get<Event[]>('http://localhost:5297/api/Event/allEvents');
        const withImages = await Promise.all(response.data.map(async (event) => {
          try {
            const imgRes = await axios.get(`http://localhost:5297/api/Event/get-image/${event.id}`, {
              responseType: 'blob'
            });
            const imageUrl = URL.createObjectURL(imgRes.data);
            return { ...event, imageUrl };
          } catch {
            return event;
          }
        }));
        setEvents(withImages);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchAllEvents();
  }, []);

  const toggleLike = (eventId: string) => {
    setLikedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) newSet.delete(eventId);
      else newSet.add(eventId);
      return newSet;
    });
  };

  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-purple-700 mb-6">All Events</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <motion.div
            key={event.id}
            className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt={event.name}
                className="h-40 w-full object-cover"
              />
            )}
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold text-purple-700">{event.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>

              <div className="text-xs text-gray-500 space-y-1 mt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {new Date(event.date).toDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {event.time}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {event.venue}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {event.organizerName}
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={() => toggleLike(event.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Heart className={`w-5 h-5 ${likedEvents.has(event.id) ? 'fill-current' : ''}`} />
                </button>
               <button
  onClick={() => navigate(`/buy-ticket/${event.id}`)}
  className="flex items-center text-sm px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
>
  <CalendarPlus className="w-4 h-4 mr-1" />
  Buy Ticket
</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AllEvent;
