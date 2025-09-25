import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { expenseAPI } from '../services/api';

const ExpenseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [expense, setExpense] = useState(location.state?.expense || null);
  const [loading, setLoading] = useState(!location.state?.expense);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!expense) {
      fetchExpense();
    }
  }, [id, expense]);

  const fetchExpense = async () => {
    try {
      setLoading(true);
      const response = await expenseAPI.getExpense(id);
      setExpense(response.data.expense);
      setError(null);
    } catch (err) {
      setError('Failed to fetch expense details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate('/dashboard', { 
      state: { 
        editExpense: expense,
        showForm: true 
      } 
    });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseAPI.deleteExpense(expense._id);
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to delete expense:', err);
        alert('Failed to delete expense');
      }
    }
  };

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="text-center" style={{ marginTop: '100px' }}>
            <div className="spinner" style={{ margin: '0 auto' }}></div>
            <p className="text-secondary mt-md">Loading expense details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="card text-center">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😞</div>
            <h2 className="text-secondary mb-sm">Expense Not Found</h2>
            <p className="text-muted mb-lg">
              {error || 'The expense you\'re looking for doesn\'t exist or has been deleted.'}
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container slide-up">
        {/* Header */}
        <div className="flex justify-between items-center mb-lg">
          <button 
            className="btn btn-ghost"
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Dashboard
          </button>
          <div className="flex gap-md">
            <button 
              className="btn btn-outline"
              onClick={handleEdit}
            >
              ✏️ Edit
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleDelete}
            >
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="card">
          {/* Expense Header */}
          <div className="card-header">
            <div className="flex items-center gap-md">
              <div 
                className={`expense-card-category category-${expense.category.toLowerCase()}`}
                style={{ 
                  fontSize: '2rem', 
                  padding: '1rem', 
                  borderRadius: '50%',
                  minWidth: '64px',
                  minHeight: '64px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {getCategoryEmoji(expense.category)}
              </div>
              <div>
                <h1 className="card-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                  {expense.title}
                </h1>
                <p className="card-subtitle">
                  {expense.category} • {formatDate(expense.date)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="expense-card-amount" style={{ fontSize: '3rem', fontWeight: '800' }}>
                {formatCurrency(expense.amount)}
              </div>
            </div>
          </div>

          {/* Expense Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Basic Information */}
            <div className="card" style={{ margin: 0 }}>
              <h3 className="card-title mb-lg">Basic Information</h3>
              <div className="flex flex-col gap-md">
                <div>
                  <label className="form-label">Title</label>
                  <div className="text-primary font-semibold">{expense.title}</div>
                </div>
                <div>
                  <label className="form-label">Amount</label>
                  <div className="text-primary font-semibold">{formatCurrency(expense.amount)}</div>
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <div className="flex items-center gap-sm">
                    <span>{getCategoryEmoji(expense.category)}</span>
                    <span className="text-primary font-semibold">{expense.category}</span>
                  </div>
                </div>
                <div>
                  <label className="form-label">Date</label>
                  <div className="text-primary font-semibold">{formatDate(expense.date)}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card" style={{ margin: 0 }}>
              <h3 className="card-title mb-lg">Description</h3>
              {expense.description ? (
                <div className="text-secondary" style={{ lineHeight: '1.6' }}>
                  {expense.description}
                </div>
              ) : (
                <div className="text-muted font-style-italic">
                  No description provided for this expense.
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="card" style={{ margin: '2rem 0 0 0' }}>
            <h3 className="card-title mb-lg">Metadata</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Created</label>
                <div className="text-secondary">
                  {new Date(expense.createdAt).toLocaleString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div>
                <label className="form-label">Last Updated</label>
                <div className="text-secondary">
                  {new Date(expense.updatedAt).toLocaleString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div>
                <label className="form-label">Expense ID</label>
                <div className="text-muted font-mono" style={{ fontSize: '0.875rem' }}>
                  {expense._id}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-md mt-xl">
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleEdit}
            >
              ✏️ Edit Expense
            </button>
            <button 
              className="btn btn-outline btn-lg"
              onClick={() => navigate('/dashboard')}
            >
              📊 Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetail;