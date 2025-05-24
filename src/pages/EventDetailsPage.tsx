import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Share, 
  Heart, 
  Ticket, 
  CalendarPlus,
  ArrowLeft 
} from 'lucide-react';

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  organizerName: string;
  imageUrl?: string;
  isFeatured?: boolean;
  attendees?: number;
  price?: number;
}

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [eventRes, imageRes] = await Promise.all([
          axios.get<Event>(`http://localhost:5297/api/Event/${id}`),
          axios.get(`http://localhost:5297/api/Event/get-image/${id}`, {
            responseType: 'blob'
          })
        ]);
        
        const imageUrl = URL.createObjectURL(imageRes.data);
        setEvent({ ...eventRes.data, imageUrl });
      } catch (err) {
        setError('Failed to fetch event details');
        console.error('Failed to fetch event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);
  
  const handleBuyTicket = () => {
    navigate(`/event/${id}/tickets`);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors">
        <div className="container-custom py-16 text-center">
          <div className="w-12 h-12 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading event details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors">
        <div className="container-custom py-16 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Event Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{error}</p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  if (!event) {
    return null;
  }
  
  const toggleLike = () => {
    setIsLiked(!isLiked);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: event.description.length > 100 
          ? event.description.substring(0, 100) + '...' 
          : event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-primary-900 dark:bg-gray-800 h-64 md:h-80 lg:h-96 overflow-hidden">
        <div className="absolute inset-0">
          {event.imageUrl && (
            <img 
              src={event.imageUrl} 
              alt={event.name} 
              className="w-full h-full object-cover opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-primary-900/50 dark:from-gray-900/90 dark:to-gray-800/70"></div>
        </div>
        
        <div className="container-custom relative z-10 h-full flex flex-col justify-end pb-8">
          <button 
            onClick={() => navigate(-1)}
            className="text-white/80 hover:text-white flex items-center mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to events
          </button>
          
          <div className="bg-primary-500 dark:bg-primary-600 text-white inline-block px-3 py-1 rounded-full text-sm font-medium mb-4">
            {event.category}
          </div>
          
          <motion.h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {event.name}
          </motion.h1>
          
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center text-white/90">
              <Calendar className="h-5 w-5 mr-2" />
              {formatDate(event.date)}
            </div>
            
            <div className="flex items-center text-white/90">
              <Clock className="h-5 w-5 mr-2" />
              {event.time}
            </div>
            
            <div className="flex items-center text-white/90">
              <MapPin className="h-5 w-5 mr-2" />
              {event.venue}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container-custom py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Event Details */}
          <motion.div 
            className="lg:w-2/3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <motion.button
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isLiked 
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={toggleLike}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className={`h-5 w-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Saved' : 'Save'}
              </motion.button>
              
              <motion.button
                className="flex items-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                onClick={shareEvent}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share className="h-5 w-5 mr-2" />
                Share
              </motion.button>
              
              <motion.button
                className="flex items-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CalendarPlus className="h-5 w-5 mr-2" />
                Add to Calendar
              </motion.button>
            </div>
            
            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/20 p-6 mb-8 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">About This Event</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{event.description}</p>
            </div>
            
            {/* Organizer Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/20 p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Organizer</h2>
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-4">
                  <Users className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{event.organizerName}</h3>
                  <p className="text-gray-600 dark:text-gray-400">Event Organizer</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Ticket Info */}
          <motion.div 
            className="lg:w-1/3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/30 p-6 sticky top-24 border border-gray-100 dark:border-gray-700">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  {event.price === 0 ? 'Free' : `${event.price} Frw`}
                </h3>
                
                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
                  <Users className="h-5 w-5 mr-2 text-primary-500 dark:text-primary-400" />
                  {event.attendees || 0} people attending
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 text-primary-500 dark:text-primary-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Date and Time</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {formatDate(event.date)}
                        <br />
                        {event.time}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-primary-500 dark:text-primary-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Location</p>
                      <p className="text-gray-600 dark:text-gray-400">{event.venue}</p>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  className="btn-primary w-full flex items-center justify-center"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleBuyTicket}
                >
                  <Ticket className="h-5 w-5 mr-2" />
                  Get Tickets
                </motion.button>
              </div>
              
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Share with friends</h4>
                <div className="flex space-x-2">
                  <button className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  <button className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </button>
                  <button className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;