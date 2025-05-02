import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Event } from '../../data/eventsData';

interface EventCardProps {
  event: Event;
  index: number;
}

const EventCard = ({ event, index }: EventCardProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }),
    hover: {
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <motion.div
      className="h-full"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      custom={index}
    >
      <Link to={`/event/${event.id}`} className="block h-full">
        <div className="bg-white rounded-xl overflow-hidden shadow-card h-full flex flex-col transition-all duration-300">
          <div className="relative h-48 overflow-hidden">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-3 right-3 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {event.category}
            </div>
          </div>
          
          <div className="p-5 flex-grow flex flex-col">
            <div className="flex-grow">
              <h3 className="text-xl font-semibold mb-2 line-clamp-2">{event.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.shortDescription}</p>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mt-auto">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Calendar className="h-4 w-4 mr-2 text-primary-500" />
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card h-full flex flex-col transition-all duration-300">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2 text-gray-900 dark:text-white">
                  {event.title}
                  </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {event.shortDescription}
                    </p>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                {event.location.split(',')[0]}
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2 text-primary-500" />
                  {event.attendees} attending
                </div>
                <div className="text-primary-600 font-semibold">
                  {event.price === 0 ? 'Free' : `Frw ${event.price}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;