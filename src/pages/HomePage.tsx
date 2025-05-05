import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../components/events/EventCard';
import { useTranslation } from '../components/layout/transaction';
import CategoryFilter from '../components/ui/CategoryFilter';
import SearchBar from '../components/ui/SearchBar';
import { useLanguage } from '../Context/LanguageContext';
import { Event, eventsData } from '../data/eventsData';

const HomePage = () => {
  const [events, setEvents] = useState<Event[]>(eventsData);
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const { language } = useLanguage();
  const { t } = useTranslation();

  const categories = Array.from(new Set(eventsData.map(event => event.category)));

  useEffect(() => {
    // Find a featured event
    const featured = eventsData.find(event => event.isFeatured);
    if (featured) {
      setFeaturedEvent(featured);
    }

    // Filter events based on category
    if (activeCategory === 'All') {
      setEvents(eventsData);
    } else {
      setEvents(eventsData.filter(event => event.category === activeCategory));
    }
  }, [activeCategory]);

  const handleSearch = (query: string, location: string, date: string) => {
    let filtered = [...eventsData];

    if (query) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (location) {
      filtered = filtered.filter(event =>
        event.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (date) {
      filtered = filtered.filter(event =>
        event.date.includes(date)
      );
    }

    setEvents(filtered);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Hero Section */}
      <section className="relative bg-primary-900 dark:bg-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900/80 to-primary-900/95 dark:from-gray-900/90 dark:to-gray-900"></div>
        </div>

        <div className="container-custom relative z-10 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              {t('hero.description')}
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/dashboard"
                className="btn-primary text-lg"
              >
                {t('hero.exploreButton')}
              </Link>
            </motion.div>
          </motion.div>

          <div className="w-full max-w-4xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Featured Event */}
      {featuredEvent && (
        <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row gap-8 overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-lg">
              <motion.div
                className="md:w-1/2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <img
                  src={featuredEvent.image}
                  alt={featuredEvent.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </motion.div>

              <motion.div
                className="md:w-1/2 p-6 md:p-8 flex flex-col"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex items-center mb-4">
                  <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Zap className="h-4 w-4 mr-1" />
                    {t('featured.badge')}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mb-4 dark:text-white">{featuredEvent.title}</h2>

                <p className="text-gray-600 dark:text-gray-300 mb-6">{featuredEvent.shortDescription}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Calendar className="h-5 w-5 mr-3 text-primary-500 dark:text-primary-400" />
                    {new Date(featuredEvent.date).toLocaleDateString(language, {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>

                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPin className="h-5 w-5 mr-3 text-primary-500 dark:text-primary-400" />
                    {featuredEvent.location}
                  </div>

                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Users className="h-5 w-5 mr-3 text-primary-500 dark:text-primary-400" />
                    {t('featured.attendees', { count: featuredEvent.attendees })}
                  </div>
                </div>

                <div className="mt-auto">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={`/event/${featuredEvent.id}`}
                      className="btn-primary w-full md:w-auto flex justify-center"
                    >
                      {t('featured.viewDetails')}
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Events Section */}
      <section className="py-12 md:py-16 dark:bg-gray-900">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 dark:text-white">{t('events.title')}</h2>
              <p className="text-gray-600 dark:text-gray-400">{t('events.subtitle')}</p>
            </div>

            <Link to="/dashboard" className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors mt-4 md:mt-0">
              {t('events.viewAll')}
            </Link>
          </div>

          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </motion.div>

          {events.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">{t('events.noResults')}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-primary-50 dark:bg-gray-800">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">{t('cta.title')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              {t('cta.description')}
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/dashboard"
                className="btn-primary text-lg"
              >
                {t('cta.button')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;