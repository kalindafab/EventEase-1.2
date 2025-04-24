import { useState } from 'react';
import { Search, Calendar, MapPin, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string, location: string, date: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, location, date);
  };

  const clearSearch = () => {
    setQuery('');
    setLocation('');
    setDate('');
  };

  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-lg p-1 transition-all duration-300 ${
        isFocused ? 'ring-2 ring-primary-300' : ''
      }`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row">
        <div className="flex-1 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-gray-100">
          <Search className="h-5 w-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        
        <div className="flex-1 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-gray-100">
          <MapPin className="h-5 w-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Location"
            className="w-full focus:outline-none"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        
        <div className="flex-1 flex items-center px-4 py-3 md:border-r border-gray-100">
          <Calendar className="h-5 w-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Date"
            className="w-full focus:outline-none"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        
        <div className="p-2 flex">
          {(query || location || date) && (
            <button 
              type="button" 
              className="mr-2 p-2 text-gray-500 hover:text-gray-700 rounded-md transition-colors"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <motion.button
            type="submit"
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Search
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default SearchBar;