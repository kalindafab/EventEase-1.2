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
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-card dark:shadow-gray-700/50 h-full flex flex-col transition-all duration-300 border border-gray-100 dark:border-gray-700">
          <div className="relative h-48 overflow-hidden">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-3 right-3 bg-primary-500 dark:bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              {event.category}
            </div>
          </div>
          
          <div className="p-5 flex-grow flex flex-col">
            <div className="flex-grow">
              <h3 className="text-xl font-semibold mb-2 line-clamp-2 dark:text-white">{event.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{event.shortDescription}</p>
            </div>
            
            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-auto">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <Calendar className="h-4 w-4 mr-2 text-primary-500 dark:text-primary-400" />
                {new Date(event.date).toLocaleDateString('en-US', { 
                  month: 'short',
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>
              
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <MapPin className="h-4 w-4 mr-2 text-primary-500 dark:text-primary-400" />
                {event.location.split(',')[0]}
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Users className="h-4 w-4 mr-2 text-primary-500 dark:text-primary-400" />
                  {event.attendees} attending
                </div>
                <div className="text-primary-600 dark:text-primary-400 font-semibold">
                  {event.price === 0 ? 'Free' : ` ${event.price} Frw`}
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