import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTheme } from '../context/ThemeContext';

const ExpensePieChart = ({ stats }) => {
  const { isDarkMode } = useTheme();

  if (!stats || !stats.categoryStats || stats.categoryStats.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No category data available</p>
      </div>
    );
  }

  const COLORS = {
    Food: '#ff6b6b',
    Transportation: '#4ecdc4',
    Entertainment: '#45b7d1',
    Healthcare: '#f39c12',
    Shopping: '#e74c3c',
    Bills: '#9b59b6',
    Education: '#2ecc71',
    Travel: '#1abc9c',
    Other: '#95a5a6'
  };

  const chartData = stats.categoryStats.map((item) => ({
    name: item._id,
    value: parseFloat(item.totalAmount.toFixed(2)),
    count: item.count
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
          <p className="font-semibold text-gray-800 dark:text-white">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            ${data.value.toFixed(2)} ({data.count} {data.count === 1 ? 'expense' : 'expenses'})
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
        <span className="mr-2">📊</span>
        Spending Distribution by Category
      </h3>
      
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Pie Chart */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: $${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#95a5a6'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Details */}
        <div className="w-full lg:w-1/2">
          <div className="space-y-3">
            {chartData.map((item, index) => {
              const percentage = ((item.value / stats.totalAmount) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[item.name] }}
                    ></div>
                    <span className="font-medium text-gray-700 dark:text-gray-200">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 dark:text-white">${item.value.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{percentage}% ({item.count} expenses)</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensePieChart;
