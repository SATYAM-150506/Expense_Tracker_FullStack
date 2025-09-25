import React from 'react';

const ExpenseList = ({ expenses, loading, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCategoryColor = (category) => {
    const colors = {
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
    return colors[category] || '#95a5a6';
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      Food: '🍔',
      Transportation: '🚗',
      Entertainment: '🎬',
      Healthcare: '🏥',
      Shopping: '🛍️',
      Bills: '💡',
      Education: '📚',
      Travel: '✈️',
      Other: '📝'
    };
    return emojis[category] || '📝';
  };

  if (loading) {
    return (
      <div className="card">
        <div className="text-center">Loading expenses...</div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px 30px' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>💸</div>
        <h3 style={{ color: '#666', marginBottom: '15px', fontSize: '24px' }}>No expenses found</h3>
        <p style={{ color: '#888', fontSize: '16px', marginBottom: '25px' }}>
          Start tracking your expenses by adding your first one!
        </p>
        <div style={{ fontSize: '48px', opacity: 0.3 }}>📊💰✨</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: '25px', color: '#333', fontWeight: '700', fontSize: '20px' }}>
        📋 Your Expenses ({expenses.length})
      </h3>
      <div className="expense-list">
        {expenses.map((expense) => (
          <div key={expense._id} className="expense-item">
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '8px' }}>
                <div style={{ fontSize: '24px' }}>
                  {getCategoryEmoji(expense.category)}
                </div>
                <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#333' }}>
                  {expense.title}
                </h4>
                <span 
                  className="category-badge"
                  style={{
                    backgroundColor: getCategoryColor(expense.category),
                    color: 'white'
                  }}
                >
                  {expense.category}
                </span>
              </div>
              
              <div style={{ color: '#666', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>
                📅 {formatDate(expense.date)}
              </div>
              
              {expense.description && (
                <div style={{ 
                  color: '#888', 
                  fontSize: '14px', 
                  fontStyle: 'italic',
                  background: 'rgba(0,0,0,0.02)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  borderLeft: `3px solid ${getCategoryColor(expense.category)}`
                }}>
                  💬 {expense.description}
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' }}>
              <div style={{ 
                fontSize: '22px', 
                fontWeight: '700', 
                color: '#e74c3c',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}>
                {formatAmount(expense.amount)}
              </div>
              
              <div className="expense-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => onEdit(expense)}
                  style={{ fontSize: '14px', padding: '8px 16px' }}
                  title="Edit expense"
                >
                  ✏️ Edit
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => onDelete(expense._id)}
                  style={{ fontSize: '14px', padding: '8px 16px' }}
                  title="Delete expense"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;