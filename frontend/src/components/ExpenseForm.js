import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const ExpenseForm = ({ expense, onSubmit, onCancel }) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Populate form with expense data when editing
  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title,
        amount: expense.amount.toString(),
        category: expense.category,
        description: expense.description || '',
        date: new Date(expense.date).toISOString().split('T')[0]
      });
    }
  }, [expense]);

  const { title, amount, category, description, date } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear field error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!title.trim()) {
      errors.title = 'Title is required';
    }

    if (!amount) {
      errors.amount = 'Amount is required';
    } else if (isNaN(amount) || parseFloat(amount) <= 0) {
      errors.amount = 'Amount must be a positive number';
    }

    if (!category) {
      errors.category = 'Category is required';
    }

    if (!date) {
      errors.date = 'Date is required';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        title: title.trim(),
        amount: parseFloat(amount),
        category,
        description: description.trim(),
        date
      });
    } catch (error) {
      console.error('Error submitting expense:', error);
      alert('Failed to save expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
          {expense ? '✏️ Edit Expense' : '➕ Add New Expense'}
        </h2>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          {expense ? 'Update your expense details below' : 'Fill in the details for your new expense'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>💼 Expense Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className={`w-full px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
              value={title}
              onChange={onChange}
              placeholder="Enter expense title (e.g., Lunch at restaurant)"
            />
            {formErrors.title && (
              <div className={`mt-2 flex items-center gap-2 ${isDarkMode ? 'text-red-400' : 'text-red-600'} text-sm`}>
                <span>⚠️</span>
                {formErrors.title}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="amount" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>💰 Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              className={`w-full px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
              value={amount}
              onChange={onChange}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {formErrors.amount && (
              <div className={`mt-2 flex items-center gap-2 ${isDarkMode ? 'text-red-400' : 'text-red-600'} text-sm`}>
                <span>⚠️</span>
                {formErrors.amount}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>📂 Category</label>
            <select
              id="category"
              name="category"
              className={`w-full px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
              value={category}
              onChange={onChange}
            >
              <option value="Food">🍔 Food</option>
              <option value="Transportation">🚗 Transportation</option>
              <option value="Entertainment">🎬 Entertainment</option>
              <option value="Healthcare">🏥 Healthcare</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Bills">💡 Bills</option>
              <option value="Education">📚 Education</option>
              <option value="Travel">✈️ Travel</option>
              <option value="Other">📝 Other</option>
            </select>
            {formErrors.category && (
              <div className={`mt-2 flex items-center gap-2 ${isDarkMode ? 'text-red-400' : 'text-red-600'} text-sm`}>
                <span>⚠️</span>
                {formErrors.category}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="date" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>📅 Date</label>
            <input
              type="date"
              id="date"
              name="date"
              className={`w-full px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
              value={date}
              onChange={onChange}
            />
            {formErrors.date && (
              <div className={`mt-2 flex items-center gap-2 ${isDarkMode ? 'text-red-400' : 'text-red-600'} text-sm`}>
                <span>⚠️</span>
                {formErrors.date}
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>📝 Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            className={`w-full px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
            value={description}
            onChange={onChange}
            placeholder="Add any additional details about this expense..."
            rows="4"
          />
        </div>

        <div className={`flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button 
            type="button" 
            className={`px-4 py-2 rounded-lg font-medium transition-colors order-2 sm:order-1 ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            onClick={onCancel}
            disabled={loading}
          >
            ❌ Cancel
          </button>
          <button 
            type="submit" 
            className={`px-6 py-2 rounded-lg font-medium transition-colors order-1 sm:order-2 ${isDarkMode ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-primary-600 text-white hover:bg-primary-700'} disabled:opacity-50`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </span>
            ) : (
              `${expense ? '💾 Update' : '✅ Add'} Expense`
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;