import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import LineGraph from './LineGraph';
import PieChartDraggable from './Piechart'; 
import { motion } from 'framer-motion';

type Event = {
  id: string;
  name: string;
};

const MyEvents: React.FC = () => {
  const { token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await axios.get<Event[]>('http://localhost:5297/api/Event/my-events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(response.data);
        if (response.data.length > 0) {
          setSelectedEventId(response.data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    if (token) {
      fetchMyEvents();
    }
  }, [token]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-md space-y-6"
    >
      <h2 className="text-3xl font-bold text-purple-700">My Events</h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <label htmlFor="event-select" className="block text-sm font-medium text-gray-700">
          Select an Event:
        </label>
        <select
          id="event-select"
          className="w-full p-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
        >
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>
      </motion.div>

      {selectedEventId && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <LineGraph eventId={selectedEventId} />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <PieChartDraggable eventId={selectedEventId} />
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default MyEvents;
