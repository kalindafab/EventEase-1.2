import { useState, useEffect, createContext } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Zap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { eventsData, Event } from '../data/eventsData';
import EventCard from '../components/events/EventCard';
import SearchBar from '../components/ui/SearchBar';
import CategoryFilter from '../components/ui/CategoryFilter';

// Translation context and types
type Language = 'en' | 'zh' | 'ar';
type Translations = Record<string, Record<Language, string>>;

export const TranslationContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

const translations: Translations = {
  'discoverEvents': {
    en: 'Discover Amazing Events Near You',
    zh: '发现您附近的精彩活动',
    ar: 'اكتشف الفعاليات المدهشة القريبة منك'
  },
  'findEventsDescription': {
    en: 'Find and attend events that match your interests, connect with like-minded people, and create lasting memories.',
    zh: '寻找并参加符合您兴趣的活动，结识志同道合的人，创造持久的回忆。',
    ar: 'ابحث عن الفعاليات التي تتناسب مع اهتماماتك واحضرها، تواصل مع الأشخاص المتشابهين في التفكير واصنع ذكريات تدوم.'
  },
  'exploreEvents': {
    en: 'Explore Events',
    zh: '探索活动',
    ar: 'استكشف الفعاليات'
  },
  'featuredEvent': {
    en: 'Featured Event',
    zh: '精选活动',
    ar: 'الفعالية المميزة'
  },
  'peopleAttending': {
    en: 'people attending',
    zh: '人参加',
    ar: 'شخص سيحضر'
  },
  'viewDetails': {
    en: 'View Details',
    zh: '查看详情',
    ar: 'عرض التفاصيل'
  },
  'upcomingEvents': {
    en: 'Upcoming Events',
    zh: '即将举行的活动',
    ar: 'الفعاليات القادمة'
  },
  'discoverBook': {
    en: 'Discover and book your next experience',
    zh: '发现并预订您的下一个体验',
    ar: 'اكتشف واحجز تجربتك القادمة'
  },
  'viewAllEvents': {
    en: 'View All Events',
    zh: '查看所有活动',
    ar: 'عرض جميع الفعاليات'
  },
  'noEventsFound': {
    en: 'No events found matching your criteria.',
    zh: '没有找到符合您条件的活动。',
    ar: 'لم يتم العثور على فعاليات تطابق معاييرك.'
  },
  'createEventTitle': {
    en: 'Ready to Create Your Own Event?',
    zh: '准备好创建您自己的活动了吗？',
    ar: 'هل أنت مستعد لإنشاء فعاليتك الخاصة؟'
  },
  'createEventDescription': {
    en: 'Share your passion, build a community, and create unforgettable experiences.',
    zh: '分享您的热情，建立社区，创造难忘的体验。',
    ar: 'شارك شغفك، ابني مجتمعًا واصنع تجارب لا تنسى.'
  },
  'getStarted': {
    en: 'Get Started',
    zh: '开始',
    ar: 'ابدأ الآن'
  },
  'all': {
    en: 'All',
    zh: '全部',
    ar: 'الكل'
  }
};

const HomePage = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [events, setEvents] = useState<Event[]>(eventsData);
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = ['All', ...Array.from(new Set(eventsData.map(event => event.category)))];
  
  const t = (key: string) => translations[key]?.[language] || key;

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
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Language Selector */}
        <div className="fixed top-4 right-4 z-50 bg-white p-2 rounded-md shadow-md">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="p-1 border border-gray-300 rounded"
          >
            <option value="en">English</option>
            <option value="zh">中文</option>
            <option value="ar">العربية</option>
          </select>
        </div>
        
        {/* Hero Section */}
        <section className="relative bg-primary-900 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary-900/80 to-primary-900/95"></div>
          </div>
          
          <div className="container-custom relative z-10 py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mb-12"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {t('discoverEvents')}
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8">
                {t('findEventsDescription')}
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/dashboard" 
                  className="btn-primary text-lg"
                >
                  {t('exploreEvents')}
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
          <section className="py-12 md:py-16 bg-gray-50">
            <div className="container-custom">
              <div className="flex flex-col md:flex-row gap-8 overflow-hidden rounded-2xl bg-white shadow-lg">
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
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Zap className="h-4 w-4 mr-1" />
                      {t('featuredEvent')}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">{featuredEvent.title}</h2>
                  
                  <p className="text-gray-600 mb-6">{featuredEvent.shortDescription}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-3 text-primary-500" />
                      {new Date(featuredEvent.date).toLocaleDateString(language, { 
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-3 text-primary-500" />
                      {featuredEvent.location}
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Users className="h-5 w-5 mr-3 text-primary-500" />
                      {featuredEvent.attendees} {t('peopleAttending')}
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
                        {t('viewDetails')}
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}
        
        {/* Events Section */}
        <section className="py-12 md:py-16">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">{t('upcomingEvents')}</h2>
                <p className="text-gray-600">{t('discoverBook')}</p>
              </div>
              
              <Link to="/dashboard" className="text-primary-600 font-medium hover:text-primary-700 transition-colors mt-4 md:mt-0">
                {t('viewAllEvents')}
              </Link>
            </div>
            
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              t={t}
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
                <p className="text-gray-500 text-lg">{t('noEventsFound')}</p>
              </div>
            )}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12 md:py-20 bg-primary-50">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('createEventTitle')}</h2>
              <p className="text-lg text-gray-600 mb-8">
                {t('createEventDescription')}
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/dashboard" 
                  className="btn-primary text-lg"
                >
                  {t('getStarted')}
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </TranslationContext.Provider>
  );
};

export default HomePage;