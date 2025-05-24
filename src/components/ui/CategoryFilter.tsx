import { useState } from 'react';
import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: CategoryFilterProps) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          activeCategory === 'All' 
            ? 'text-white dark:text-gray-100' 
            : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
        }`}
        onClick={() => onCategoryChange('All')}
        onMouseEnter={() => setHoveredCategory('All')}
        onMouseLeave={() => setHoveredCategory(null)}
      >
        {activeCategory === 'All' && (
          <motion.div
            layoutId="activeCategoryBg"
            className="absolute inset-0 bg-primary-500 dark:bg-primary-600 rounded-full"
            initial={false}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        {hoveredCategory === 'All' && activeCategory !== 'All' && (
          <motion.div
            className="absolute inset-0 bg-gray-100 dark:bg-gray-700 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
        <span className="relative z-10">All</span>
      </button>
      
      {categories.map((category) => (
        <button
          key={category}
          className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === category 
              ? 'text-white dark:text-gray-100' 
              : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
          }`}
          onClick={() => onCategoryChange(category)}
          onMouseEnter={() => setHoveredCategory(category)}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          {activeCategory === category && (
            <motion.div
              layoutId="activeCategoryBg"
              className="absolute inset-0 bg-primary-500 dark:bg-primary-600 rounded-full"
              initial={false}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          {hoveredCategory === category && activeCategory !== category && (
            <motion.div
              className="absolute inset-0 bg-gray-100 dark:bg-gray-700 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
          <span className="relative z-10">{category}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;