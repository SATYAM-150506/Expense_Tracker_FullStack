import React, { useState, useEffect } from 'react';

const ExpenseForm = ({ expense, onSubmit, onCancel }) => {
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
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {expense ? '✏️ Edit Expense' : '➕ Add New Expense'}
        </h2>
        <p className="text-gray-600">
          {expense ? 'Update your expense details below' : 'Fill in the details for your new expense'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title" className="form-label">💼 Expense Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              value={title}
              onChange={onChange}
              placeholder="Enter expense title (e.g., Lunch at restaurant)"
            />
            {formErrors.title && (
              <div className="error-message">
                <span>⚠️</span>
                {formErrors.title}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="amount" className="form-label">💰 Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              className="form-input"
              value={amount}
              onChange={onChange}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {formErrors.amount && (
              <div className="error-message">
                <span>⚠️</span>
                {formErrors.amount}
              </div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category" className="form-label">📂 Category</label>
            <select
              id="category"
              name="category"
              className="form-select"
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
              <div className="error-message">
                <span>⚠️</span>
                {formErrors.category}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="date" className="form-label">� Date</label>
            <input
              type="date"
              id="date"
              name="date"
              className="form-input"
              value={date}
              onChange={onChange}
            />
            {formErrors.date && (
              <div className="error-message">
                <span>⚠️</span>
                {formErrors.date}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">� Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            className="form-textarea"
            value={description}
            onChange={onChange}
            placeholder="Add any additional details about this expense..."
            rows="4"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
          <button 
            type="button" 
            className="btn btn-secondary order-2 sm:order-1"
            onClick={onCancel}
            disabled={loading}
          >
            ❌ Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary btn-lg order-1 sm:order-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="loading-spinner"></div>
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