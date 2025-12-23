import React from 'react';
import { useTheme } from '../context/ThemeContext';

const BudgetTrendChart = ({ data, budgets }) => {
  const { isDarkMode } = useTheme();

  if (!data || data.length === 0) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No data available</p>
      </div>
    );
  }

  // Calculate budget vs actual for each month
  const budgetData = data.map((month) => {
    const monthBudgets = budgets.filter(b => b.month === month.month);
    const totalBudget = monthBudgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = month.total;
    const remaining = Math.max(0, totalBudget - totalSpent);

    return {
      month: month.month,
      budget: totalBudget,
      spent: totalSpent,
      remaining,
      percentageUsed: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
    };
  });

  const maxBudget = Math.max(...budgetData.map(d => Math.max(d.budget, d.spent)));
  const range = maxBudget || 1;

  // Get current month
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
      <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
        💰 12-Month Budget vs Actual
      </h3>

      <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
        <div className="overflow-x-auto">
          <div className="flex gap-1 pb-4 items-flex-end justify-between" style={{ minHeight: '300px' }}>
            {budgetData.map((item, index) => {
              const isCurrentMonth = item.month === currentMonth;
              const budgetHeight = (item.budget / range) * 250 + 10;
              const spentHeight = (item.spent / range) * 250 + 10;
              const isOverBudget = item.spent > item.budget;

              return (
                <div key={index} className="flex-1 flex flex-col items-center h-80">
                  {/* Value labels at top */}
                  <div className={`text-xs font-bold mb-2 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div>${item.spent.toFixed(0)}</div>
                    <div className={`text-xs ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
                      of ${item.budget.toFixed(0)}
                    </div>
                  </div>

                  {/* Stacked bars - Budget (background) and Spent (foreground) */}
                  <div className="flex-1 w-full flex items-flex-end justify-center mb-2 relative">
                    {/* Budget bar (background) */}
                    <div
                      className={`w-full rounded-t-md opacity-30 ${
                        isDarkMode ? 'bg-blue-500' : 'bg-blue-400'
                      }`}
                      style={{
                        height: `${budgetHeight}px`,
                        minHeight: '10px',
                        position: 'absolute',
                        bottom: 0,
                      }}
                      title={`Budget: $${item.budget.toFixed(2)}`}
                    />

                    {/* Spent bar (foreground) */}
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 hover:shadow-lg ${
                        isCurrentMonth
                          ? isDarkMode
                            ? 'bg-gradient-to-t from-primary-500 to-primary-300'
                            : 'bg-gradient-to-t from-primary-600 to-primary-400'
                          : isOverBudget
                          ? isDarkMode
                            ? 'bg-gradient-to-t from-red-600 to-red-400'
                            : 'bg-gradient-to-t from-red-500 to-red-300'
                          : isDarkMode
                          ? 'bg-gradient-to-t from-green-600 to-green-400'
                          : 'bg-gradient-to-t from-green-500 to-green-300'
                      }`}
                      style={{
                        height: `${spentHeight}px`,
                        minHeight: '10px',
                        opacity: isCurrentMonth ? 1 : 0.85,
                        cursor: 'pointer',
                        position: 'absolute',
                        bottom: 0,
                      }}
                      title={`${item.month}: Spent $${item.spent.toFixed(2)} / Budget $${item.budget.toFixed(2)}`}
                    />
                  </div>

                  {/* Month label */}
                  <div className={`text-xs font-semibold ${isCurrentMonth ? (isDarkMode ? 'text-primary-400' : 'text-primary-600') : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}>
                    {item.month.split('-')[1]}/{item.month.split('-')[0].slice(-2)}
                  </div>

                  {/* Usage percentage */}
                  <div className={`text-xs ${isOverBudget ? 'text-red-500' : 'text-green-500'} font-bold`}>
                    {item.percentageUsed.toFixed(0)}%
                  </div>

                  {/* Current month indicator */}
                  {isCurrentMonth && (
                    <div className="text-xs font-bold text-primary-500 mt-1">
                      ← Now
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend and summary */}
        <div className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} space-y-3`}>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className={`h-4 w-4 rounded-sm bg-gradient-to-r from-primary-600 to-primary-400`} />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Amount Spent</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`h-4 w-4 rounded-sm opacity-30 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-400'}`} />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Budget Limit</span>
            </div>
          </div>

          {/* Status summary */}
          <div className={`grid grid-cols-2 gap-4 mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Total Budget</div>
              <div className={`text-lg font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                ${budgetData.reduce((sum, d) => sum + d.budget, 0).toFixed(2)}
              </div>
            </div>
            <div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Total Spent</div>
              <div className={`text-lg font-bold ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                ${budgetData.reduce((sum, d) => sum + d.spent, 0).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Over budget warning */}
          {budgetData.some(d => d.spent > d.budget) && (
            <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'} border ${isDarkMode ? 'border-red-700/50' : 'border-red-200'}`}>
              <div className="flex gap-2">
                <span className="text-red-500">⚠️</span>
                <span className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                  {budgetData.filter(d => d.spent > d.budget).length} month(s) exceeded budget
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetTrendChart;
