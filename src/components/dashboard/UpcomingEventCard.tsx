import { Calendar, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Event } from '../../data/eventsData';

interface UpcomingEventCardProps {
  event: Event;
}

const UpcomingEventCard = ({ event }: UpcomingEventCardProps) => {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="relative h-32">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 m-3 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {event.category}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{event.title}</h3>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-primary-500" />
            {new Date(event.date).toLocaleDateString('en-US', { 
              month: 'short',
              day: 'numeric', 
              year: 'numeric' 
            })}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-primary-500" />
            {event.location.split(',')[0]}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-1 text-primary-500" />
            {event.attendees}
          </div>
          <span className="text-primary-600 font-semibold">
            {event.price === 0 ? 'Free' : `$${event.price}`}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default UpcomingEventCard;