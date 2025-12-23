import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { analyticsAPI } from '../services/api';

const Insights = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch main insights
      const insightsRes = await analyticsAPI.getInsights();
      setInsights(insightsRes.data.insights);
      setRawData(insightsRes.data.rawData);

      // Fetch anomalies
      if (insightsRes.data.rawData) {
        const anomaliesRes = await analyticsAPI.getAnomalies();
        setAnomalies(anomaliesRes.data.anomalies || []);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load insights');
      console.error('Insights error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryDetails = async (category) => {
    try {
      const res = await analyticsAPI.getCategoryInsights(category);
      setCategoryDetails(res.data);
      setSelectedCategory(category);
    } catch (err) {
      console.error('Category details error:', err);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-block animate-spin">
              <div className={`h-12 w-12 border-4 ${isDarkMode ? 'border-gray-700 border-t-primary-500' : 'border-gray-300 border-t-primary-600'} rounded-full`}></div>
            </div>
            <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Analyzing your spending...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            💡 AI Insights
          </h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Personalized spending analysis and recommendations
          </p>
        </div>

        {error && (
          <div className={`${isDarkMode ? 'bg-red-900/30 border-red-700 text-red-300' : 'bg-red-50 border-red-200 text-red-700'} border px-4 py-3 rounded-lg mb-6`}>
            ⚠️ {error}
          </div>
        )}

        {!insights ? (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 text-center`}>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              No expense data available. Start logging expenses to get insights.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
              <div className="flex flex-wrap">
                {['overview', 'anomalies', 'categories'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-6 py-4 font-medium transition-colors text-center ${
                      activeTab === tab
                        ? isDarkMode
                          ? 'bg-primary-600 text-white'
                          : 'bg-primary-600 text-white'
                        : isDarkMode
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {tab === 'overview' && '📊 Overview'}
                    {tab === 'anomalies' && '🚨 Anomalies'}
                    {tab === 'categories' && '🏷️ Categories'}
                  </button>
                ))}
              </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Insights Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Anomalies */}
                  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3 flex items-center gap-2`}>
                      🚨 Unusual Spending
                    </h3>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {insights.anomalies}
                    </p>
                  </div>

                  {/* Trends */}
                  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3 flex items-center gap-2`}>
                      📈 Spending Trends
                    </h3>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {insights.trends}
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 md:col-span-2`}>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3 flex items-center gap-2`}>
                      💰 Recommendations
                    </h3>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {insights.recommendations}
                    </p>
                  </div>

                  {/* Potential Savings */}
                  <div className={`${isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'} border rounded-lg p-6 md:col-span-2`}>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-800'} mb-2 flex items-center gap-2`}>
                      ✅ Potential Savings
                    </h3>
                    <p className={isDarkMode ? 'text-green-200' : 'text-green-700'}>
                      {insights.savings}
                    </p>
                  </div>
                </div>

                {/* Spending Summary */}
                {rawData && (
                  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
                      📊 Spending Summary
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                          6-Month Total
                        </div>
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                          ${rawData.totalSpending}
                        </div>
                      </div>
                      <div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                          Monthly Average
                        </div>
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          ${rawData.avgMonthlySpending}
                        </div>
                      </div>
                      <div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                          Current Month
                        </div>
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                          ${rawData.currentMonthSpending}
                        </div>
                      </div>
                      <div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                          Monthly Trend
                        </div>
                        <div className={`text-2xl font-bold ${
                          parseFloat(rawData.monthlyTrend) > 0
                            ? isDarkMode ? 'text-red-400' : 'text-red-600'
                            : isDarkMode ? 'text-green-400' : 'text-green-600'
                        }`}>
                          {parseFloat(rawData.monthlyTrend) > 0 ? '📈' : '📉'} {rawData.monthlyTrend}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top Categories */}
                {rawData && Object.keys(rawData.topCategories).length > 0 && (
                  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
                      🏆 Top Spending Categories
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(rawData.topCategories).map(([category, amount], idx) => {
                        const percentage = (amount / parseFloat(rawData.totalSpending)) * 100;
                        return (
                          <div key={idx}>
                            <div className="flex justify-between items-center mb-2">
                              <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {idx + 1}. {category}
                              </span>
                              <span className={`text-lg font-bold ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                                ${amount.toFixed(2)}
                              </span>
                            </div>
                            <div className={`w-full rounded-full h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  isDarkMode
                                    ? 'bg-gradient-to-r from-primary-600 to-primary-400'
                                    : 'bg-gradient-to-r from-primary-500 to-primary-400'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className={`text-xs text-right mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                              {percentage.toFixed(1)}% of total
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Anomalies Tab */}
            {activeTab === 'anomalies' && (
              <div className="animate-fadeIn">
                {anomalies.length > 0 ? (
                  <div className="space-y-4">
                    {anomalies.map((anomaly, idx) => (
                      <div
                        key={idx}
                        className={`${
                          isDarkMode ? 'bg-gray-800' : 'bg-white'
                        } rounded-lg shadow-md p-6 border-l-4 ${
                          anomaly.severity === 'high'
                            ? 'border-l-red-500'
                            : 'border-l-yellow-500'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                              {anomaly.category}
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {anomaly.description}
                            </p>
                          </div>
                          <div className={`text-2xl font-bold ${
                            anomaly.severity === 'high'
                              ? isDarkMode ? 'text-red-400' : 'text-red-600'
                              : isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                          }`}>
                            ${anomaly.amount.toFixed(2)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Date</span>
                            <p className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                              {new Date(anomaly.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Category Avg</span>
                            <p className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                              ${anomaly.avgForCategory}
                            </p>
                          </div>
                          <div>
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Excess</span>
                            <p className={`font-semibold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                              +${anomaly.excessAmount}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 text-center`}>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      ✅ No unusual spending detected
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div className="animate-fadeIn">
                {!selectedCategory ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rawData && Object.entries(rawData.topCategories).map(([category, amount]) => (
                      <button
                        key={category}
                        onClick={() => fetchCategoryDetails(category)}
                        className={`${
                          isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                        } rounded-lg shadow-md p-6 text-left transition-colors`}
                      >
                        <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                          {category}
                        </h4>
                        <p className={`text-2xl font-bold ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                          ${amount.toFixed(2)}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                          Click for details →
                        </p>
                      </button>
                    ))}
                  </div>
                ) : categoryDetails ? (
                  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`mb-4 px-4 py-2 rounded-lg ${
                        isDarkMode
                          ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      ← Back
                    </button>

                    <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
                      {categoryDetails.category}
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Total
                        </div>
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                          ${categoryDetails.total}
                        </div>
                      </div>
                      <div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Average
                        </div>
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          ${categoryDetails.average}
                        </div>
                      </div>
                      <div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Max
                        </div>
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                          ${categoryDetails.max}
                        </div>
                      </div>
                      <div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Count
                        </div>
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                          {categoryDetails.count}
                        </div>
                      </div>
                    </div>

                    {categoryDetails.budget && (
                      <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 mb-6`}>
                        <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3`}>
                          Budget Status
                        </h4>
                        <div className={`w-full rounded-full h-4 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} overflow-hidden mb-2`}>
                          <div
                            className={`h-full transition-all duration-300 ${
                              parseFloat(categoryDetails.budget.percentage) > 100
                                ? isDarkMode
                                  ? 'bg-gradient-to-r from-red-600 to-red-400'
                                  : 'bg-gradient-to-r from-red-500 to-red-400'
                                : isDarkMode
                                ? 'bg-gradient-to-r from-green-600 to-green-400'
                                : 'bg-gradient-to-r from-green-500 to-green-400'
                            }`}
                            style={{ width: `${Math.min(parseFloat(categoryDetails.budget.percentage), 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                            ${categoryDetails.budget.spent} of ${categoryDetails.budget.limit}
                          </span>
                          <span className={`font-bold ${
                            parseFloat(categoryDetails.budget.percentage) > 100
                              ? isDarkMode ? 'text-red-400' : 'text-red-600'
                              : isDarkMode ? 'text-green-400' : 'text-green-600'
                          }`}>
                            {categoryDetails.budget.percentage}%
                          </span>
                        </div>
                      </div>
                    )}

                    {categoryDetails.recentExpenses && (
                      <div>
                        <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                          Recent Expenses
                        </h4>
                        <div className="space-y-2">
                          {categoryDetails.recentExpenses.map((exp, idx) => (
                            <div
                              key={idx}
                              className={`flex justify-between items-center p-3 rounded-lg ${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                              }`}
                            >
                              <div>
                                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>
                                  {exp.description}
                                </p>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                  {new Date(exp.date).toLocaleDateString()}
                                </p>
                              </div>
                              <p className={`font-bold ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                                ${exp.amount.toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Loading category details...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;
