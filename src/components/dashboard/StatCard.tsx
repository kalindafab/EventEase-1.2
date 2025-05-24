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
}

const StatCard = ({ title, value, icon, change, bgColor, textColor }: StatCardProps) => {
  return (
    <motion.div 
      className={`${bgColor} ${textColor} dark:bg-gray-800 dark:text-gray-100 rounded-xl p-6 shadow-sm dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 transition-colors`}
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm opacity-80 dark:opacity-70 mb-1">{title}</p>
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
              <span className="text-xs opacity-70 dark:opacity-60 ml-1">vs last month</span>
            </div>
          )}
        </div>
        
        <div className="bg-white/20 dark:bg-gray-700/50 p-3 rounded-lg transition-colors">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;