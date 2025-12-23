import React from 'react';
import { useTheme } from '../context/ThemeContext';

const TrendChart = ({ data }) => {
  const { isDarkMode } = useTheme();

  if (!data || data.length === 0) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No data available</p>
      </div>
    );
  }

  const maxAmount = Math.max(...data.map(d => d.total));
  const minAmount = Math.min(...data.map(d => d.total));
  const range = maxAmount - minAmount || 1;

  // Get current month for highlighting
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
      <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
        📊 12-Month Spending Trend (Oldest → Newest)
      </h3>
      
      <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
        <div className="overflow-x-auto">
          <div className="flex gap-1 items-flex-start justify-between" style={{ minHeight: '350px', alignItems: 'flex-end' }}>
            {data.map((item, index) => {
              const isCurrentMonth = item.month === currentMonth;
              const height = ((item.total - minAmount) / range) * 280 + 10;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center" style={{ height: '100%', justifyContent: 'flex-end' }}>
                  {/* Bar grows upward */}
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 hover:shadow-lg ${
                      isCurrentMonth
                        ? isDarkMode
                          ? 'bg-gradient-to-t from-primary-500 to-primary-300 shadow-lg'
                          : 'bg-gradient-to-t from-primary-600 to-primary-400 shadow-lg'
                        : isDarkMode
                        ? 'bg-gradient-to-t from-blue-600 to-blue-400'
                        : 'bg-gradient-to-t from-blue-500 to-blue-300'
                    }`}
                    style={{
                      height: `${height}px`,
                      minHeight: '10px',
                      opacity: isCurrentMonth ? 1 : 0.8,
                      cursor: 'pointer',
                      width: '100%'
                    }}
                    title={`${item.month}: $${item.total.toFixed(2)} (${item.count} expenses)`}
                  />

                  {/* Value label above bar */}
                  <div className={`text-xs font-bold mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    ${item.total.toFixed(0)}
                  </div>

                  {/* Month label below value */}
                  <div className={`text-xs font-semibold ${isCurrentMonth ? (isDarkMode ? 'text-primary-400' : 'text-primary-600') : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}>
                    {item.month.split('-')[1]}/{item.month.split('-')[0].slice(-2)}
                  </div>

                  {/* Count label */}
                  <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {item.count} expenses
                  </div>

                  {/* Current month indicator */}
                  {isCurrentMonth && (
                    <div className="text-xs font-bold text-primary-500 mt-1">
                      ← Current
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend and summary */}
        <div className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} space-y-3`}>
          <div className="flex items-center gap-3">
            <div className={`h-4 w-4 rounded-sm bg-gradient-to-t from-primary-600 to-primary-400`} />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Current Month</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`h-4 w-4 rounded-sm bg-gradient-to-t from-blue-600 to-blue-400`} />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Previous Months</span>
          </div>
          
          {/* Summary stats */}
          <div className={`grid grid-cols-3 gap-4 mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Highest</div>
              <div className={`text-lg font-bold ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                ${maxAmount.toFixed(2)}
              </div>
            </div>
            <div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Lowest</div>
              <div className={`text-lg font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                ${minAmount.toFixed(2)}
              </div>
            </div>
            <div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Average</div>
              <div className={`text-lg font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                ${(data.reduce((sum, d) => sum + d.total, 0) / data.length).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendChart;
