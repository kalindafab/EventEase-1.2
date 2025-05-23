import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import LineGraph from './LineGraph';
import PieChartDraggable from './Piechart';
import { motion } from 'framer-motion';

type Event = {
  id: string;
  name: string;
  imageUrl?: string;
};

const MyEvents: React.FC = () => {
  const { token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await axios.get<Event[]>('http://localhost:5297/api/Event/my-events', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const withImages = await Promise.all(
          response.data.map(async (event) => {
            try {
              const imgRes = await axios.get(
                `http://localhost:5297/api/Event/get-image/${event.id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                  responseType: 'blob',
                }
              );
              const imageUrl = URL.createObjectURL(imgRes.data);
              return { ...event, imageUrl };
            } catch {
              return event;
            }
          })
        );

        setEvents(withImages);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    if (token) fetchMyEvents();
  }, [token]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-7xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-purple-700 mb-6">My Events</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <motion.div
            key={event.id}
            className="bg-white rounded-xl shadow-md p-4 space-y-4"
            whileHover={{ scale: 1.02 }}
          >
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt={event.name}
                className="h-40 w-full object-cover rounded-md"
              />
            )}

            <h3 className="text-lg font-semibold text-purple-700 text-center">{event.name}</h3>

            <div className="space-y-4">
              <LineGraph eventId={event.id} />
              <PieChartDraggable eventId={event.id} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MyEvents;
