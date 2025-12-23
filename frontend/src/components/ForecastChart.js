import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ForecastChart = ({ forecastData, historicalData }) => {
  const { isDarkMode } = useTheme();

  if (!forecastData || forecastData.length === 0) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No forecast data available</p>
      </div>
    );
  }

  // Combine historical and forecast data for visualization
  const chartData = [
    ...(historicalData || []).slice(-6), // Last 6 months of history
    ...forecastData
  ];

  const maxAmount = Math.max(...chartData.map(d => d.projected || d.total || 0));
  const minAmount = Math.min(...chartData.map(d => d.projected || d.total || 0));
  const range = maxAmount - minAmount || 1;

  // Get current month
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Parse forecast data for categories
  const categoryProjections = forecastData[0]?.categoryProjection || {};
  const topCategories = Object.entries(categoryProjections)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
      <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
        🔮 Spending Forecast
      </h3>

      {/* Main forecast chart */}
      <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6 mb-6`}>
        <div className="overflow-x-auto">
          <div className="flex gap-1 pb-4 items-flex-end justify-between" style={{ minHeight: '300px' }}>
            {chartData.map((item, index) => {
              const isCurrentMonth = item.month === currentMonth;
              const isHistorical = historicalData && historicalData.some(h => h.month === item.month);
              const isUpcoming = !isHistorical;
              const amount = item.projected || item.total || 0;
              const height = ((amount - minAmount) / range) * 250 + 10;

              return (
                <div key={index} className="flex-1 flex flex-col items-center h-80">
                  {/* Value label */}
                  <div className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    ${amount.toFixed(0)}
                  </div>

                  {/* Bar with dashed style for forecast */}
                  <div className="flex-1 w-full flex items-flex-end justify-center mb-2">
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 hover:shadow-lg ${
                        isHistorical
                          ? isCurrentMonth
                            ? isDarkMode
                              ? 'bg-gradient-to-t from-primary-500 to-primary-300 shadow-lg'
                              : 'bg-gradient-to-t from-primary-600 to-primary-400 shadow-lg'
                            : isDarkMode
                            ? 'bg-gradient-to-t from-blue-600 to-blue-400'
                            : 'bg-gradient-to-t from-blue-500 to-blue-300'
                          : isDarkMode
                          ? 'bg-gradient-to-t from-purple-600 to-purple-400'
                          : 'bg-gradient-to-t from-purple-500 to-purple-300'
                      }`}
                      style={{
                        height: `${height}px`,
                        minHeight: '10px',
                        opacity: isHistorical ? (isCurrentMonth ? 1 : 0.8) : 0.7,
                        cursor: 'pointer',
                        borderStyle: isUpcoming ? 'dashed' : 'solid',
                        borderWidth: isUpcoming ? '2px' : '0px',
                        borderTop: 'none',
                        borderLeft: isUpcoming ? `2px dashed ${isDarkMode ? '#c084fc' : '#d8b4fe'}` : 'none',
                        borderRight: isUpcoming ? `2px dashed ${isDarkMode ? '#c084fc' : '#d8b4fe'}` : 'none',
                        borderBottom: 'none',
                      }}
                      title={`${item.month}: ${isHistorical ? 'Actual' : 'Projected'} $${amount.toFixed(2)}`}
                    />
                  </div>

                  {/* Month label */}
                  <div className={`text-xs font-semibold ${
                    isCurrentMonth 
                      ? isDarkMode ? 'text-primary-400' : 'text-primary-600'
                      : isUpcoming
                      ? isDarkMode ? 'text-purple-400' : 'text-purple-600'
                      : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {item.month.split('-')[1]}/{item.month.split('-')[0].slice(-2)}
                  </div>

                  {/* Data type label */}
                  <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {isHistorical ? 'Actual' : 'Forecast'}
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

        {/* Legend */}
        <div className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} space-y-3`}>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className={`h-4 w-4 rounded-sm bg-gradient-to-t from-blue-600 to-blue-400`} />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Historical Data</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`h-4 w-4 rounded-sm border-2 ${isDarkMode ? 'border-purple-400 bg-gradient-to-t from-purple-600 to-purple-400' : 'border-purple-300 bg-gradient-to-t from-purple-500 to-purple-300'}`} />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Forecasted Spending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
        <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
          📈 Projected Spending by Category
        </h4>

        <div className="space-y-3">
          {topCategories.length > 0 ? (
            topCategories.map(([category, amount]) => {
              const totalForecast = forecastData[0]?.projectedTotal || 0;
              const percentage = totalForecast > 0 ? (amount / totalForecast) * 100 : 0;

              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {category}
                    </div>
                    <div className={`text-sm font-bold ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                      ${amount.toFixed(2)}
                    </div>
                  </div>
                  <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} overflow-hidden`}>
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        percentage > 80
                          ? isDarkMode
                            ? 'bg-gradient-to-r from-red-600 to-red-500'
                            : 'bg-gradient-to-r from-red-500 to-red-400'
                          : percentage > 60
                          ? isDarkMode
                            ? 'bg-gradient-to-r from-yellow-600 to-yellow-500'
                            : 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                          : isDarkMode
                          ? 'bg-gradient-to-r from-green-600 to-green-500'
                          : 'bg-gradient-to-r from-green-500 to-green-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className={`text-xs text-right ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              );
            })
          ) : (
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No category projections available</p>
          )}
        </div>

        {/* Summary stats */}
        <div className={`grid grid-cols-3 gap-4 mt-6 pt-6 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Projected Total</div>
            <div className={`text-lg font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              ${(forecastData[0]?.projectedTotal || 0).toFixed(2)}
            </div>
          </div>
          <div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Trend</div>
            <div className={`text-lg font-bold ${
              (forecastData[0]?.projectedTotal || 0) > (historicalData?.[historicalData.length - 1]?.total || 0)
                ? isDarkMode ? 'text-red-400' : 'text-red-600'
                : isDarkMode ? 'text-green-400' : 'text-green-600'
            }`}>
              {(forecastData[0]?.projectedTotal || 0) > (historicalData?.[historicalData.length - 1]?.total || 0)
                ? '📈 Up'
                : '📉 Down'}
            </div>
          </div>
          <div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Change</div>
            <div className={`text-lg font-bold ${
              ((forecastData[0]?.projectedTotal || 0) - (historicalData?.[historicalData.length - 1]?.total || 0)) > 0
                ? isDarkMode ? 'text-red-400' : 'text-red-600'
                : isDarkMode ? 'text-green-400' : 'text-green-600'
            }`}>
              {((forecastData[0]?.projectedTotal || 0) - (historicalData?.[historicalData.length - 1]?.total || 0)).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastChart;
