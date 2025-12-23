import React from 'react';
import { useTheme } from '../context/ThemeContext';

const BudgetChart = ({ budgets = [] }) => {
  const { isDarkMode } = useTheme();

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

  const getStatusColor = (percentage, isExceeded) => {
    if (isExceeded) {
      return isDarkMode ? 'from-red-600 to-red-500' : 'from-red-500 to-red-400';
    }
    if (percentage >= 80) {
      return isDarkMode ? 'from-yellow-600 to-yellow-500' : 'from-yellow-500 to-yellow-400';
    }
    return isDarkMode ? 'from-green-600 to-green-500' : 'from-green-500 to-green-400';
  };

  if (!budgets || budgets.length === 0) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
        <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
          💰 Budget Status
        </h3>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          No budgets set for this month. Create one to track your spending!
        </p>
      </div>
    );
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
      <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
        💰 Budget Status
      </h3>

      <div className="space-y-4">
        {budgets.map((budget) => (
          <div key={budget._id} className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getCategoryEmoji(budget.category)}</span>
                <div>
                  <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {budget.category}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Limit: ${budget.limit.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  ${budget.spent.toFixed(2)}
                </div>
                <div className={`text-sm font-medium ${
                  budget.isExceeded
                    ? 'text-red-500'
                    : budget.alertTriggered
                    ? 'text-yellow-500'
                    : 'text-green-500'
                }`}>
                  {budget.percentageUsed}%
                </div>
              </div>
            </div>

            {/* Budget bar */}
            <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} overflow-hidden`}>
              <div
                className={`h-full bg-gradient-to-r ${getStatusColor(budget.percentageUsed, budget.isExceeded)} transition-all duration-300`}
                style={{
                  width: `${Math.min(budget.percentageUsed, 100)}%`
                }}
              />
            </div>

            {/* Status message */}
            <div className="flex justify-between items-center mt-3">
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Remaining: ${Math.max(0, budget.remaining).toFixed(2)}
              </div>
              {budget.isExceeded && (
                <div className="text-xs font-semibold text-red-500">⚠️ Budget Exceeded</div>
              )}
              {budget.alertTriggered && !budget.isExceeded && (
                <div className="text-xs font-semibold text-yellow-500">⚠️ Alert: {budget.percentageUsed}%</div>
              )}
              {!budget.isExceeded && !budget.alertTriggered && (
                <div className="text-xs font-semibold text-green-500">✓ On Track</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Overall budget summary */}
      <div className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex justify-between items-center mb-3">
          <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Overall Budget
          </span>
          <span className={`text-lg font-bold ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>
            ${totalSpent.toFixed(2)} / ${totalBudget.toFixed(2)}
          </span>
        </div>
        <div className={`w-full h-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
          <div
            className={`h-full bg-gradient-to-r ${getStatusColor(overallPercentage, totalSpent > totalBudget)}`}
            style={{ width: `${Math.min(overallPercentage, 100)}%` }}
          />
        </div>
        <div className={`text-sm text-center mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {Math.round(overallPercentage)}% of monthly budget used
        </div>
      </div>
    </div>
  );
};

export default BudgetChart;
