import { useEffect, useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Event, TicketType, getMyEvents, getTicketTypesByEventId } from '../services/api';

const ViewEvents = () => {
  const { token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [ticketTypes, setTicketTypes] = useState<{ [key: string]: TicketType[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTicketTypes = async (eventId: string) => {
    if (ticketTypes[eventId]) return; // Avoid refetching
    try {
      const tickets = await getTicketTypesByEventId(token, eventId);
      setTicketTypes((prev) => ({ ...prev, [eventId]: tickets }));
    } catch (err) {
      console.error('Fetch ticket types error:', err);
      setTicketTypes((prev) => ({ ...prev, [eventId]: [] }));
      setError('Failed to load ticket types');
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (!token) {
          setError('Please log in to view your events');
          window.location.href = '/login';
          return;
        }

        const data = await getMyEvents(token);
        setEvents(data);
        console.log('Fetched Events:', data); // Debug log
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    }),
    hover: {
      y: -10,
      boxShadow:
        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
  };

  if (loading) return <p className="dark:text-gray-300">Loading events...</p>;
  if (error) return <p className="text-red-500 dark:text-red-400">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No events found.</p>
      ) : (
        events.map((event, index) => (
          <motion.div
            key={event.id}
            className="h-full"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            custom={index}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-card h-full flex flex-col transition-all duration-300 group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.imagePath}
                  alt={event.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-primary-500 dark:bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {event.category}
                </div>
              </div>

              <div className="p-5 flex-grow flex flex-col">
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2 dark:text-white">{event.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-1 dark:text-gray-200">Ticket Types:</p>
                    <button
                      onClick={() => fetchTicketTypes(event.id)}
                      className="text-primary-500 dark:text-primary-400 text-sm underline mb-2"
                    >
                      Show Ticket Types
                    </button>
                    {ticketTypes[event.id] ? (
                      ticketTypes[event.id].length === 0 ? (
                        <p className="text-sm text-gray-600 dark:text-gray-400">No ticket types available.</p>
                      ) : (
                        <ul className="space-y-1">
                          {ticketTypes[event.id].map((ticket) => (
                            <li
                              key={ticket.id}
                              className="text-sm text-gray-600 dark:text-gray-300 flex justify-between"
                            >
                              <span>{ticket.name}</span>
                              <span>
                                {ticket.price === 0 ? 'Free' : `Frw ${ticket.price.toFixed(2)}`} (Qty: {ticket.quantity})
                              </span>
                            </li>
                          ))}
                        </ul>
                      )
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400">Click to load ticket types.</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-auto">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-primary-500 dark:text-primary-400" />
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}{' '}
                    @ {new Date(event.date).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </div>

                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-2 text-primary-500 dark:text-primary-400" />
                    {event.location}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default ViewEvents;