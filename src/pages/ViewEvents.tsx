import { useEffect, useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext'; // Adjust the import path to your useAuth hook

interface TicketTypeDto {
  name: string;
  price: number;
}

interface EventResponseDto {
  id: number;
  name: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  imageUrl: string;
  organizer: string;
  ticketTypes: TicketTypeDto[];
}

const ViewEvents = () => {
  const { token } = useAuth(); // Get token from useAuth
  const [events, setEvents] = useState<EventResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (!token) {
          setError('Please log in to view your events');
          // Optionally redirect to login
          window.location.href = '/login';
          return;
        }

        const response = await fetch('http://localhost:5297/api/Event/my-events', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.status === 401) {
          setError('Session expired. Please log in again.');
          // Optionally clear auth state or redirect
          window.location.href = '/login';
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eventsWithImageUrl = data.map((event: any) => ({
          ...event,
          imageUrl: event.imagePath,
        }));

        setEvents(eventsWithImageUrl);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]); // Add token as a dependency to re-fetch if token changes

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

  if (loading) return <p>Loading events...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          className="h-full"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          custom={index}
        >
          <div className="bg-white rounded-xl overflow-hidden shadow-card h-full flex flex-col transition-all duration-300 group">
            <div className="relative h-48 overflow-hidden">
              <img
                src={event.imageUrl}
                alt={event.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {event.category}
              </div>
            </div>

            <div className="p-5 flex-grow flex flex-col">
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{event.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Organizer: <span className="font-medium">{event.organizer}</span>
                </p>

                <div className="mt-4">
                  <p className="text-sm font-semibold mb-1">Ticket Types:</p>
                  <ul className="space-y-1">
                    {event.ticketTypes.map((ticket, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-600 flex justify-between"
                      >
                        <span>{ticket.name}</span>
                        <span>
                          {ticket.price === 0 ? 'Free' : `Frw ${ticket.price}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-auto">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4 mr-2 text-primary-500" />
                  {new Date(event.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  @ {event.time}
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                  {event.venue}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ViewEvents;