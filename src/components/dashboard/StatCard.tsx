import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  bgColor: string;
  textColor: string;
  darkBgColor?: string;  // Added dark mode background color
  darkTextColor?: string; // Added dark mode text color
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  bgColor, 
  textColor,
  darkBgColor = "bg-gray-800", // Default dark background
  darkTextColor = "text-white" // Default dark text color
}: StatCardProps) => {
  return (
    <motion.div 
      className={`${bgColor} dark:${darkBgColor} ${textColor} dark:${darkTextColor} rounded-xl p-6 shadow-sm dark:shadow-gray-900/30 transition-colors`}
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm opacity-80 mb-1 dark:opacity-70">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium ${
                change.isPositive 
                  ? 'text-green-500 dark:text-green-400' 
                  : 'text-red-500 dark:text-red-400'
              }`}>
                {change.isPositive ? '+' : ''}{change.value}%
              </span>
              <span className="text-xs opacity-70 ml-1 dark:opacity-60">vs last month</span>
            </div>
          )}
        </div>
        
        <div className="bg-white/20 dark:bg-white/10 p-3 rounded-lg transition-colors">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;