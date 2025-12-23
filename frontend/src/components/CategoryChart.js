import React from 'react';
import { useTheme } from '../context/ThemeContext';

const CategoryChart = ({ data, totalSpent }) => {
  const { isDarkMode } = useTheme();

  if (!data || data.length === 0) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No data available</p>
      </div>
    );
  }

  const getCategoryEmoji = (category) => {
    const emojis = {
      'Food': '🍔',
      'Transportation': '🚗',
      'Entertainment': '🎬',
      'Healthcare': '🏥',
      'Shopping': '🛍️',
      'Bills': '💡',
      'Education': '📚',
      'Travel': '✈️',
      'Other': '📝'
    };
    return emojis[category] || '📝';
  };

  const colors = [
    'from-blue-500 to-blue-400',
    'from-purple-500 to-purple-400',
    'from-pink-500 to-pink-400',
    'from-green-500 to-green-400',
    'from-yellow-500 to-yellow-400',
    'from-red-500 to-red-400',
    'from-indigo-500 to-indigo-400',
    'from-teal-500 to-teal-400'
  ];

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
      <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
        🎯 Category Breakdown
      </h3>

      <div className="space-y-4">
        {data.map((category, index) => (
          <div key={category.category} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getCategoryEmoji(category.category)}</span>
                <div>
                  <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {category.category}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {category.count} expense{category.count !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                  ${category.total.toFixed(2)}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {category.percentage}%
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div
                className={`h-full rounded-full bg-gradient-to-r ${colors[index % colors.length]}`}
                style={{ width: `${category.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex justify-between items-center">
          <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Total Spent
          </span>
          <span className={`text-2xl font-bold ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>
            ${totalSpent ? totalSpent.toFixed(2) : '0.00'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;
